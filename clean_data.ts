// Post-processing script to clean döner price data
// Filters out non-standard items, removes outliers via IQR, deduplicates cross-city chains

const raw: any[] = JSON.parse(await Bun.file("data.json").text());

// --- 1. Filter out non-standard döner items ---
// We only want a basic "Döner Kebab" - not premium/specialty variants
const PREMIUM_KEYWORDS = [
  "big", "jumbo", "xxl", "xl", "large", "gross", "groß", "doppel", "double",
  "iskender", "hawaii", "hawaiian", "baguette", "pfanne", "pan", "gratin",
  "auflauf", "casserole", "rollo", "beyti", "portion", "porsiyon", "tabagi",
  "al forno", "maxx", "superior", "spezial", "special", "steak", "seele",
  "babos", "kapsalon", "lasagne", "maccheroni", "maccaroni", "penne",
  "croques", "tacos", "calzone", "pilav", "reis", "rice", "nudel", "noodle",
  "maytako", "atom", "sultan", "maestro", "dude", "texas", "mexican",
  "gorgonzola", "hollandaise", "oriental", "topf", "gefüllte", "gebratener",
  "angebot", "2x", "2 döner", "wikinger", "viking", "chili cheese",
  "feta", "calamari", "röstzwiebel", "halloumi", "seitan", "vegan",
  "veggie", "vegetarisch", "vegetable", "gemüse", "falafel", "hähnchen",
  "chicken", "puten", "turkey", "kalb", "beef", "rindfleisch",
  "pomm", "pommdöner", "pomm-döner", "pomm döner", "yufka",
  "baked", "überbacken", "käse", "cheese",
  "dönerli", "dönerfleisch", "dönerspieß", "dönergratin", "dönerpfanne",
  "döner kebab portion", "doner only", "fitness", "rhein",
  "cökertme", "yaprak", "satsch",
];

function isStandardDoener(name: string): boolean {
  const lower = name.toLowerCase();
  return !PREMIUM_KEYWORDS.some(kw => lower.includes(kw));
}

// --- 2. Deduplicate restaurants appearing in multiple cities ---
// If the same restaurantId appears in multiple cities, keep only the one
// where it's closest to the city center (i.e., first occurrence by the scraper)
function deduplicateRestaurants(items: any[]): any[] {
  const seen = new Set<string>();
  return items.filter(item => {
    const key = item.restaurantId;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

// --- 3. IQR-based outlier removal per city ---
function removeOutliers(prices: number[]): number[] {
  if (prices.length < 4) return prices;
  const sorted = [...prices].sort((a, b) => a - b);
  const q1 = sorted[Math.floor(sorted.length * 0.25)];
  const q3 = sorted[Math.floor(sorted.length * 0.75)];
  const iqr = q3 - q1;
  const lower = q1 - 1.5 * iqr;
  const upper = q3 + 1.5 * iqr;
  return prices.filter(p => p >= lower && p <= upper);
}

// --- Process ---
let totalBefore = 0;
let totalAfter = 0;

const cleaned = raw.map(city => {
  totalBefore += city.items.length;

  // Step 1: Filter to standard döner only
  let items = city.items.filter((item: any) => isStandardDoener(item.itemName));

  // Step 2: Deduplicate restaurants
  items = deduplicateRestaurants(items);

  // Step 3: IQR outlier removal
  const prices = items.map((i: any) => i.price);
  if (prices.length >= 4) {
    const sorted = [...prices].sort((a, b) => a - b);
    const q1 = sorted[Math.floor(sorted.length * 0.25)];
    const q3 = sorted[Math.floor(sorted.length * 0.75)];
    const iqr = q3 - q1;
    const lower = q1 - 1.5 * iqr;
    const upper = q3 + 1.5 * iqr;
    items = items.filter((i: any) => i.price >= lower && i.price <= upper);
  }

  totalAfter += items.length;

  const cleanPrices = items.map((i: any) => i.price);
  const sorted = [...cleanPrices].sort((a, b) => a - b);

  return {
    ...city,
    doenerCount: items.length,
    avgPrice: cleanPrices.length
      ? +(cleanPrices.reduce((a: number, b: number) => a + b, 0) / cleanPrices.length).toFixed(2)
      : 0,
    medianPrice: sorted.length
      ? sorted[Math.floor(sorted.length / 2)]
      : 0,
    minPrice: sorted.length ? sorted[0] : 0,
    maxPrice: sorted.length ? sorted[sorted.length - 1] : 0,
    items,
  };
});

await Bun.write("data_cleaned.json", JSON.stringify(cleaned, null, 2));

// --- Stats ---
console.log("=== DATA CLEANUP RESULTS ===\n");
console.log(`Items before: ${totalBefore}`);
console.log(`Items after:  ${totalAfter} (removed ${totalBefore - totalAfter})`);

const citiesWithData = cleaned.filter(c => c.doenerCount > 0);
const allPrices = cleaned.flatMap(c => c.items.map((i: any) => i.price));

console.log(`\nCities with data: ${citiesWithData.length}/${cleaned.length}`);
console.log(`Total items: ${allPrices.length}`);

if (allPrices.length) {
  const mean = allPrices.reduce((a: number, b: number) => a + b, 0) / allPrices.length;
  const sortedAll = [...allPrices].sort((a: number, b: number) => a - b);
  const median = sortedAll[Math.floor(sortedAll.length / 2)];
  const stdDev = Math.sqrt(allPrices.reduce((s: number, v: number) => s + (v - mean) ** 2, 0) / allPrices.length);

  console.log(`National mean:   ${mean.toFixed(2)}`);
  console.log(`National median: ${median.toFixed(2)}`);
  console.log(`Range: ${sortedAll[0].toFixed(2)} - ${sortedAll[sortedAll.length - 1].toFixed(2)}`);

  const cityMedians = citiesWithData.map(c => c.medianPrice).sort((a, b) => a - b);
  const cityMeanOfMedians = cityMedians.reduce((a, b) => a + b, 0) / cityMedians.length;
  const cityStdDev = Math.sqrt(cityMedians.reduce((s, v) => s + (v - cityMeanOfMedians) ** 2, 0) / cityMedians.length);

  console.log(`\nCity median prices:`);
  console.log(`  Mean of medians: ${cityMeanOfMedians.toFixed(2)}`);
  console.log(`  Std dev:         ${cityStdDev.toFixed(2)}`);
  console.log(`  Range:           ${cityMedians[0].toFixed(2)} - ${cityMedians[cityMedians.length - 1].toFixed(2)}`);

  console.log(`\nTop 5 cheapest cities (by median):`);
  citiesWithData.sort((a, b) => a.medianPrice - b.medianPrice);
  citiesWithData.slice(0, 5).forEach(c =>
    console.log(`  ${c.city.padEnd(25)} median ${c.medianPrice.toFixed(2)} (${c.doenerCount} items)`)
  );

  console.log(`\nTop 5 most expensive cities (by median):`);
  citiesWithData.slice(-5).reverse().forEach(c =>
    console.log(`  ${c.city.padEnd(25)} median ${c.medianPrice.toFixed(2)} (${c.doenerCount} items)`)
  );
}

console.log(`\nSaved to data_cleaned.json`);
