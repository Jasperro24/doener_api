import puppeteer from "puppeteer";

const GERMAN_CITIES = [
  { name: "Berlin", slug: "berlin", lat: 52.5169, lon: 13.3900 },
  { name: "Hamburg", slug: "hamburg", lat: 53.5494, lon: 9.9936 },
  { name: "Munich", slug: "munich", lat: 48.1454, lon: 11.5790 },
  { name: "Cologne", slug: "cologne", lat: 50.9385, lon: 6.9599 },
  { name: "Frankfurt", slug: "frankfurt", lat: 50.1109, lon: 8.6820 },
  { name: "Stuttgart", slug: "stuttgart", lat: 48.7803, lon: 9.1793 },
  { name: "Düsseldorf", slug: "dusseldorf", lat: 51.2258, lon: 6.7775 },
  { name: "Dortmund", slug: "dortmund", lat: 51.5139, lon: 7.4647 },
  { name: "Essen", slug: "essen", lat: 51.4558, lon: 7.0115 },
  { name: "Leipzig", slug: "leipzig", lat: 51.3400, lon: 12.3761 },
  { name: "Bremen", slug: "bremen", lat: 53.0776, lon: 8.8073 },
  { name: "Dresden", slug: "dresden", lat: 51.0517, lon: 13.7387 },
  { name: "Hanover", slug: "hanover", lat: 52.3731, lon: 9.7351 },
  { name: "Nuremberg", slug: "nuremberg", lat: 49.4511, lon: 11.0762 },
  { name: "Duisburg", slug: "duisburg", lat: 51.4349, lon: 6.7620 },
  { name: "Bochum", slug: "bochum", lat: 51.4836, lon: 7.2217 },
  { name: "Wuppertal", slug: "wuppertal", lat: 51.2547, lon: 7.1508 },
  { name: "Bielefeld", slug: "bielefeld", lat: 52.0304, lon: 8.5327 },
  { name: "Bonn", slug: "bonn", lat: 50.7365, lon: 7.1007 },
  { name: "Münster", slug: "munster", lat: 51.9625, lon: 7.6256 },
  { name: "Mannheim", slug: "mannheim", lat: 49.4897, lon: 8.4674 },
  { name: "Karlsruhe", slug: "karlsruhe", lat: 48.9944, lon: 8.4002 },
  { name: "Augsburg", slug: "augsburg", lat: 48.3635, lon: 10.8864 },
  { name: "Aachen", slug: "aachen", lat: 50.7748, lon: 6.0833 },
  { name: "Freiburg", slug: "freiburg-im-breisgau", lat: 47.9971, lon: 7.8409 },
  { name: "Kiel", slug: "kiel", lat: 54.3256, lon: 10.1318 },
  { name: "Lübeck", slug: "lubeck", lat: 53.8669, lon: 10.6846 },
  { name: "Erfurt", slug: "erfurt", lat: 50.9779, lon: 11.0298 },
  { name: "Rostock", slug: "rostock", lat: 54.0872, lon: 12.1212 },
  { name: "Magdeburg", slug: "magdeburg", lat: 52.1306, lon: 11.6274 },
  { name: "Mainz", slug: "mainz", lat: 49.9995, lon: 8.2737 },
  { name: "Kassel", slug: "kassel", lat: 51.3181, lon: 9.4899 },
  { name: "Saarbrücken", slug: "saarbrucken", lat: 49.2400, lon: 6.9893 },
  { name: "Potsdam", slug: "potsdam", lat: 52.3981, lon: 13.0630 },
  { name: "Heidelberg", slug: "heidelberg", lat: 49.4045, lon: 8.6766 },
  { name: "Darmstadt", slug: "darmstadt", lat: 49.8718, lon: 8.6530 },
  { name: "Regensburg", slug: "regensburg", lat: 49.0198, lon: 12.0943 },
  { name: "Würzburg", slug: "wurzburg", lat: 49.7949, lon: 9.9306 },
  { name: "Wolfsburg", slug: "wolfsburg", lat: 52.4239, lon: 10.7788 },
  { name: "Göttingen", slug: "gottingen", lat: 51.5326, lon: 9.9354 },
  { name: "Heilbronn", slug: "heilbronn", lat: 49.1433, lon: 9.2086 },
  { name: "Ulm", slug: "ulm", lat: 48.3991, lon: 9.9936 },
  { name: "Ingolstadt", slug: "ingolstadt", lat: 48.7645, lon: 11.4248 },
  { name: "Osnabrück", slug: "osnabruck", lat: 52.2764, lon: 8.0441 },
  { name: "Paderborn", slug: "paderborn", lat: 51.7189, lon: 8.7530 },
  { name: "Chemnitz", slug: "chemnitz", lat: 50.8326, lon: 12.9193 },
  { name: "Wiesbaden", slug: "wiesbaden", lat: 50.0818, lon: 8.2422 },
  { name: "Offenbach", slug: "offenbach", lat: 50.1026, lon: 8.7595 },
  { name: "Krefeld", slug: "krefeld", lat: 51.3262, lon: 6.5696 },
  { name: "Gelsenkirchen", slug: "gelsenkirchen", lat: 51.5057, lon: 7.1021 },
  { name: "Oberhausen", slug: "oberhausen", lat: 51.4741, lon: 6.8535 },
  { name: "Siegen", slug: "siegen", lat: 50.8765, lon: 8.0257 },
  { name: "Leverkusen", slug: "leverkusen", lat: 51.0349, lon: 6.9862 },
  { name: "Erlangen", slug: "erlangen", lat: 49.5973, lon: 11.0027 },
  { name: "Fürth", slug: "furth", lat: 49.4705, lon: 10.9904 },
  { name: "Koblenz", slug: "koblenz", lat: 50.3537, lon: 7.5932 },
  { name: "Ludwigsburg", slug: "ludwigsburg", lat: 48.8989, lon: 9.1902 },
  { name: "Ludwigshafen", slug: "ludwigshafen", lat: 49.4831, lon: 8.4444 },
  { name: "Mönchengladbach", slug: "monchengladbach", lat: 51.1968, lon: 6.4462 },
  { name: "Hamm", slug: "hamm", lat: 51.6804, lon: 7.8154 },
  { name: "Brunswick", slug: "brunswick", lat: 52.2651, lon: 10.5255 },
  { name: "Hanau", slug: "hanau", lat: 50.1338, lon: 8.9166 },
  { name: "Dessau-Roßlau", slug: "dessau-rosslau", lat: 51.8353, lon: 12.2428 },
  { name: "Troisdorf/Siegburg", slug: "troisdorf-siegburg", lat: 50.8064, lon: 7.1763 },
  { name: "Kempten", slug: "kempten-allgau", lat: 47.7257, lon: 10.3157 },
  { name: "Königs Wusterhausen", slug: "konigs-wusterhausen", lat: 52.2975, lon: 13.6315 },
];

type Platform = "wolt" | "ubereats";

interface DoenerPrice {
  restaurant: string;
  restaurantId: string;
  city: string;
  itemName: string;
  price: number;
  platform: Platform;
  rating?: { score: number; volume: number };
}

interface CityResult {
  city: string;
  slug: string;
  doenerCount: number;
  avgPrice: number;
  medianPrice: number;
  minPrice: number;
  maxPrice: number;
  items: DoenerPrice[];
  scrapedAt: string;
}

const DOENER_KEYWORDS = ["döner", "doner", "doener"];
const WOLT_BASE = "https://restaurant-api.wolt.com";
const UE_BASE = "https://www.ubereats.com";
const UE_UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
const MIN_PRICE = 3;
const MAX_PRICE = 12;
const CONCURRENCY = 4;
const DELAY_MS = 150;
const UE_CONCURRENCY = 6;
const UE_SESSION_REFRESH_INTERVAL = 10;
const UE_PARALLEL_SESSIONS = 3;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// ─── Shared helpers ───

const EXCLUDE_KEYWORDS = [
  // Non-döner food items
  "menu", "menü", "box", "plate", "teller", "pommes", "sauce", "brot", "bread",
  "stick", "ayran", "dip", "gewürz", "spice", "pulver", "powder", "pizza",
  "lahmacun", "burger", "salat", "salad", "fries", "nudel", "pasta", "wrap",
  "tasche", "calzone", "auflauf", "makkaroni", "schnitzel", "dönerfleisch",
  "bowl", "plaet", "pide", "tabak", "sandwich", "large portion", "überbacken",
  "dürüm", "rolle", "überbackener", "penne", "dönerfliesch", "babos",
  "croques", "tacos", "lasagne", "maccheroni", "maccaroni", "reis", "rice",
  "gefüllte", "gebratener", "topf",
  // Premium/specialty variants
  "big", "jumbo", "xxl", "xl", "doppel", "double", "iskender", "hawaii",
  "hawaiian", "baguette", "pfanne", "pan", "gratin", "casserole", "rollo",
  "beyti", "portion", "porsiyon", "tabagi", "al forno", "maxx", "superior",
  "spezial", "special", "steak", "seele", "kapsalon", "pilav", "maytako",
  "atom", "sultan", "maestro", "dude", "texas", "mexican", "gorgonzola",
  "hollandaise", "oriental", "angebot", "2x", "wikinger", "viking",
  "cökertme", "yaprak", "satsch", "fitness", "rhein",
  // Non-standard meat/protein
  "falafel", "hähnchen", "chicken", "puten", "turkey", "kalb", "beef",
  "rindfleisch", "halloumi", "seitan", "vegan", "veggie", "vegetarisch",
  "vegetable", "gemüse",
  // Side-loaded variants
  "pomm", "pommdöner", "pomm-döner", "yufka", "baked", "käse", "cheese",
  "chili", "feta", "calamari", "röstzwiebel",
  "dönerli", "dönerspieß", "dönergratin", "dönerpfanne", "doner only",
];

function isDoenerItem(name: string): boolean {
  const lower = name.toLowerCase();
  return DOENER_KEYWORDS.some((kw) => lower.includes(kw)) && !EXCLUDE_KEYWORDS.some((kw) => lower.includes(kw));
}

function pickMedianItem(candidates: DoenerPrice[]): DoenerPrice[] {
  if (candidates.length === 0) return [];
  candidates.sort((a, b) => a.price - b.price);
  return [candidates[Math.floor(candidates.length / 2)]];
}

// ─── Wolt ───

async function woltFetch(url: string, retries = 2): Promise<any> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)" },
    });
    if (res.status === 429 && attempt < retries) {
      await sleep(3000 * (attempt + 1));
      continue;
    }
    if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
    return res.json();
  }
}

function woltExtractDoener(data: any): Array<{ id: string; name: string; rating?: any }> {
  const items = data?.sections?.find((s: any) => s.template === "venue-vertical-list")?.items || [];
  return items
    .filter((it: any) => {
      const v = it.venue;
      if (!v) return false;
      const text = [v.name, ...(v.tags || []), ...(v.categories || [])].join(" ").toLowerCase();
      return DOENER_KEYWORDS.some((kw) => text.includes(kw)) || text.includes("kebab") || text.includes("kebap");
    })
    .map((it: any) => ({ id: it.venue.id, name: it.venue.name, rating: it.venue.rating }));
}

async function woltGetRestaurants(lat: number, lon: number): Promise<Array<{ id: string; name: string; rating?: any }>> {
  const [mainData, kebabData] = await Promise.all([
    woltFetch(`${WOLT_BASE}/v1/pages/restaurants?lat=${lat}&lon=${lon}`),
    woltFetch(`${WOLT_BASE}/v1/pages/restaurants?lat=${lat}&lon=${lon}&category=kebab`).catch(() => null),
  ]);

  const mainResults = woltExtractDoener(mainData);
  const kebabResults = kebabData ? woltExtractDoener(kebabData) : [];

  // Deduplicate by id
  const seen = new Set<string>();
  const combined: Array<{ id: string; name: string; rating?: any }> = [];
  for (const r of [...mainResults, ...kebabResults]) {
    if (!seen.has(r.id)) {
      seen.add(r.id);
      combined.push(r);
    }
  }
  return combined;
}

async function woltGetPrices(restaurantId: string, restaurantName: string, city: string, rating?: any): Promise<DoenerPrice[]> {
  const data = await woltFetch(`${WOLT_BASE}/v4/venues/${restaurantId}/menu`);
  const items = data?.items || [];
  const candidates = items
    .filter((item: any) => isDoenerItem(typeof item.name === "string" ? item.name : ""))
    .map((item: any) => ({
      restaurant: restaurantName,
      restaurantId,
      city,
      itemName: item.name,
      price: item.baseprice / 100,
      platform: "wolt" as Platform,
      rating: rating ? { score: rating.score, volume: rating.volume } : undefined,
    }))
    .filter((item: DoenerPrice) => item.price >= MIN_PRICE && item.price <= MAX_PRICE);
  return pickMedianItem(candidates);
}

async function woltScrapeCity(city: (typeof GERMAN_CITIES)[0]): Promise<DoenerPrice[]> {
  const restaurants = await woltGetRestaurants(city.lat, city.lon);
  const allPrices: DoenerPrice[] = [];
  const CHUNK_SIZE = 8;
  for (let i = 0; i < restaurants.length; i += CHUNK_SIZE) {
    const chunk = restaurants.slice(i, i + CHUNK_SIZE);
    const results = await Promise.all(
      chunk.map((r) =>
        woltGetPrices(r.id, r.name, city.name, r.rating).catch(() => [] as DoenerPrice[])
      )
    );
    allPrices.push(...results.flat());
    if (i + CHUNK_SIZE < restaurants.length) await sleep(DELAY_MS);
  }
  return allPrices;
}

// ─── Uber Eats ───

let ueSessions: string[] = [];
let ueSessionIndex = 0;

function getUeSession(): string {
  if (ueSessions.length === 0) return "";
  const session = ueSessions[ueSessionIndex % ueSessions.length];
  ueSessionIndex++;
  return session;
}

async function ueCreateOneSession(): Promise<string> {
  const browser = await puppeteer.launch({ headless: true });
  try {
    const page = await browser.newPage();
    await page.setUserAgent(UE_UA);
    await page.setExtraHTTPHeaders({ "Accept-Language": "de-DE,de;q=0.9" });
    await page.goto("https://www.ubereats.com/de", { waitUntil: "networkidle2", timeout: 30000 });
    await sleep(2000);
    const cookies = await page.cookies();
    const hasSession = cookies.some((c) => c.name === "jwt-session");
    if (!hasSession) throw new Error("No jwt-session cookie");
    return cookies.map((c) => `${c.name}=${c.value}`).join("; ");
  } finally {
    await browser.close();
  }
}

async function ueInitSessions(): Promise<void> {
  console.log(`  Creating ${UE_PARALLEL_SESSIONS} parallel sessions...`);
  const results = await Promise.all(
    Array.from({ length: UE_PARALLEL_SESSIONS }, (_, i) =>
      ueCreateOneSession()
        .then((s) => { console.log(`  Session ${i + 1} ready`); return s; })
        .catch((e) => { console.log(`  Session ${i + 1} failed: ${e.message}`); return ""; })
    )
  );
  ueSessions = results.filter((s) => s.length > 0);
  console.log(`  ${ueSessions.length}/${UE_PARALLEL_SESSIONS} sessions active`);
}

async function ueRefreshSessions(): Promise<void> {
  console.log("  Refreshing Uber Eats sessions...");
  const results = await Promise.all(
    Array.from({ length: UE_PARALLEL_SESSIONS }, () =>
      ueCreateOneSession().catch(() => "")
    )
  );
  const fresh = results.filter((s) => s.length > 0);
  if (fresh.length > 0) {
    ueSessions = fresh;
    console.log(`  ${fresh.length} sessions refreshed`);
  } else {
    console.log("  Refresh failed, keeping existing sessions");
  }
}

function ueLocationCookie(lat: number, lon: number, city: string): string {
  const loc = JSON.stringify({ address: { address1: city, city, country: "DE" }, latitude: lat, longitude: lon });
  return `uev2.loc=${encodeURIComponent(loc)}`;
}

async function ueApiFetch(endpoint: string, body: any, lat: number, lon: number, city: string): Promise<any> {
  const locCookie = ueLocationCookie(lat, lon, city);
  const session = getUeSession();
  const allCookies = session ? `${session}; ${locCookie}` : locCookie;
  const res = await fetch(`${UE_BASE}/_p/api/${endpoint}?localeCode=de`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "User-Agent": UE_UA,
      "x-csrf-token": "x",
      "Cookie": allCookies,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`UE HTTP ${res.status} for ${endpoint}`);
  const data = await res.json();
  if (data.status !== "success") throw new Error(`UE API error: ${data.data?.message || "unknown"}`);
  return data.data;
}

async function ueSearchQuery(query: string, lat: number, lon: number, city: string): Promise<Array<{ uuid: string; name: string }>> {
  const data = await ueApiFetch("getFeedV1", {
    userQuery: query,
    date: "",
    startTime: 0,
    endTime: 0,
    carouselId: "",
    sortAndFilters: [],
    marketingFeedType: "",
    billboardUuid: "",
    promotionUuid: "",
    targetingStoreTag: "",
    venueActionLink: { text: "", link: { type: "DEEPLINK", uri: "" } },
    vertical: "ALL",
    searchSource: "SEARCH_SUGGESTION",
    keyName: "",
    tagAffinities: [],
  }, lat, lon, city);

  const items = data?.feedItems || [];
  return items
    .filter((it: any) => it.type === "REGULAR_STORE" && it.store?.storeUuid)
    .map((it: any) => ({
      uuid: it.store.storeUuid,
      name: typeof it.store.title === "object" ? it.store.title.text : it.store.title,
    }));
}

async function ueSearchDoener(lat: number, lon: number, city: string): Promise<Array<{ uuid: string; name: string }>> {
  const [doenerResults, kebabResults] = await Promise.all([
    ueSearchQuery("döner", lat, lon, city).catch(() => []),
    ueSearchQuery("kebab", lat, lon, city).catch(() => []),
  ]);
  // Deduplicate by uuid
  const seen = new Set<string>();
  const combined: Array<{ uuid: string; name: string }> = [];
  for (const store of [...doenerResults, ...kebabResults]) {
    if (!seen.has(store.uuid)) {
      seen.add(store.uuid);
      combined.push(store);
    }
  }
  return combined;
}

async function ueGetStorePrices(storeUuid: string, storeName: string, city: string, lat: number, lon: number): Promise<DoenerPrice[]> {
  const data = await ueApiFetch("getStoreV1", {
    storeUuid,
    sfNuggetCount: 1,
  }, lat, lon, city);

  if (!data || data.location?.country !== "DE") return []; // skip non-DE stores

  const currency = data.currencyCode || "EUR";
  if (currency !== "EUR") return [];

  const sections = data.catalogSectionsMap || {};
  const candidates: DoenerPrice[] = [];

  for (const groups of Object.values(sections) as any[][]) {
    for (const group of groups) {
      const payload = group?.payload?.standardItemsPayload;
      if (!payload) continue;
      for (const item of payload.catalogItems || []) {
        const name = item.title || "";
        if (!isDoenerItem(name)) continue;
        const price = (item.price || 0) / 100;
        if (price < MIN_PRICE || price > MAX_PRICE) continue;
        candidates.push({
          restaurant: storeName,
          restaurantId: storeUuid,
          city,
          itemName: name,
          price,
          platform: "ubereats",
        });
      }
    }
  }
  return pickMedianItem(candidates);
}

async function ueScrapeCity(city: (typeof GERMAN_CITIES)[0]): Promise<DoenerPrice[]> {
  const stores = await ueSearchDoener(city.lat, city.lon, city.name);
  const allPrices: DoenerPrice[] = [];
  // Fetch stores in parallel chunks
  for (let i = 0; i < stores.length; i += UE_CONCURRENCY) {
    const chunk = stores.slice(i, i + UE_CONCURRENCY);
    const results = await Promise.all(
      chunk.map((store) =>
        ueGetStorePrices(store.uuid, store.name, city.name, city.lat, city.lon).catch(() => [] as DoenerPrice[])
      )
    );
    allPrices.push(...results.flat());
    if (i + UE_CONCURRENCY < stores.length) await sleep(DELAY_MS);
  }
  return allPrices;
}

// ─── Combined scraper ───

function deduplicateByRestaurant(items: DoenerPrice[]): DoenerPrice[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (seen.has(item.restaurantId)) return false;
    seen.add(item.restaurantId);
    return true;
  });
}

function removeIqrOutliers(items: DoenerPrice[]): DoenerPrice[] {
  if (items.length < 4) return items;
  const sorted = [...items].sort((a, b) => a.price - b.price);
  const q1 = sorted[Math.floor(sorted.length * 0.25)].price;
  const q3 = sorted[Math.floor(sorted.length * 0.75)].price;
  const iqr = q3 - q1;
  return items.filter((i) => i.price >= q1 - 1.5 * iqr && i.price <= q3 + 1.5 * iqr);
}

async function scrapeCity(city: (typeof GERMAN_CITIES)[0]): Promise<CityResult> {
  try {
    const [woltPrices, uePrices] = await Promise.all([
      woltScrapeCity(city).catch(() => [] as DoenerPrice[]),
      ueScrapeCity(city).catch(() => [] as DoenerPrice[]),
    ]);
    let allItems = deduplicateByRestaurant([...woltPrices, ...uePrices]);
    allItems = removeIqrOutliers(allItems);
    const prices = allItems.map((p) => p.price).sort((a, b) => a - b);
    return {
      city: city.name,
      slug: city.slug,
      doenerCount: prices.length,
      avgPrice: prices.length ? +(prices.reduce((a, b) => a + b, 0) / prices.length).toFixed(2) : 0,
      medianPrice: prices.length ? prices[Math.floor(prices.length / 2)] : 0,
      minPrice: prices.length ? prices[0] : 0,
      maxPrice: prices.length ? prices[prices.length - 1] : 0,
      items: allItems,
      scrapedAt: new Date().toISOString(),
    };
  } catch {
    return { city: city.name, slug: city.slug, doenerCount: 0, avgPrice: 0, medianPrice: 0, minPrice: 0, maxPrice: 0, items: [], scrapedAt: new Date().toISOString() };
  }
}

async function scrapeAll(): Promise<CityResult[]> {
  // Init Uber Eats sessions
  console.log("Initializing Uber Eats sessions...");
  try {
    await ueInitSessions();
  } catch (e: any) {
    console.log(`  Uber Eats session failed: ${e.message} (will continue with Wolt only)`);
  }

  const results: CityResult[] = [];
  const queue = [...GERMAN_CITIES];

  console.log(`\nScraping döner prices from ${queue.length} German cities via Wolt + Uber Eats...\n`);

  let citiesScraped = 0;
  while (queue.length > 0) {
    // Refresh UE sessions periodically to prevent cookie expiry
    if (citiesScraped > 0 && citiesScraped % UE_SESSION_REFRESH_INTERVAL === 0) {
      await ueRefreshSessions();
    }

    const batch = queue.splice(0, CONCURRENCY);
    const batchResults = await Promise.all(batch.map(scrapeCity));
    results.push(...batchResults);
    citiesScraped += batch.length;

    for (const r of batchResults) {
      const woltCount = r.items.filter((i) => i.platform === "wolt").length;
      const ueCount = r.items.filter((i) => i.platform === "ubereats").length;
      const status = r.doenerCount > 0
        ? `${r.doenerCount} items (W:${woltCount} UE:${ueCount}), median \u20AC${r.medianPrice.toFixed(2)}, avg \u20AC${r.avgPrice.toFixed(2)}`
        : "no döner found";
      console.log(`  [${results.length}/${GERMAN_CITIES.length}] ${r.city.padEnd(25)} ${status}`);
    }

    await sleep(800);
  }

  // Retry cities with 0 results
  const failed = results.filter((r) => r.doenerCount === 0);
  if (failed.length > 0 && failed.length < results.length) {
    console.log(`\nRetrying ${failed.length} cities that returned no results...`);
    await sleep(5000);
    for (const f of failed) {
      const city = GERMAN_CITIES.find((c) => c.slug === f.slug);
      if (!city) continue;
      await sleep(2000);
      const retry = await scrapeCity(city);
      if (retry.doenerCount > 0) {
        const idx = results.findIndex((r) => r.slug === f.slug);
        results[idx] = retry;
        console.log(`  ${retry.city.padEnd(25)} ${retry.doenerCount} items, avg \u20AC${retry.avgPrice.toFixed(2)}`);
      } else {
        console.log(`  ${f.city.padEnd(25)} still no results`);
      }
    }
  }

  return results;
}

// ─── Main ───

async function main() {
  console.log("=== DOENER PRICE INDEX GERMANY ===");
  console.log(`Started at ${new Date().toLocaleString("de-DE", { timeZone: "Europe/Berlin" })}`);
  console.log("Platforms: Wolt + Uber Eats\n");

  const results = await scrapeAll();

  await Bun.write("data.json", JSON.stringify(results, null, 2));
  console.log("\nSaved raw data to data.json");

  const citiesWithData = results.filter((r) => r.doenerCount > 0);
  const allItems = results.flatMap((r) => r.items);
  const allPrices = allItems.map((i) => i.price).filter((p) => p > 0);
  const woltCount = allItems.filter((i) => i.platform === "wolt").length;
  const ueCount = allItems.filter((i) => i.platform === "ubereats").length;

  console.log(`\n=== SUMMARY ===`);
  console.log(`Cities with doener data: ${citiesWithData.length}/${results.length}`);
  console.log(`Total doener items: ${allPrices.length} (Wolt: ${woltCount}, Uber Eats: ${ueCount})`);
  if (allPrices.length) {
    console.log(`National average: \u20AC${(allPrices.reduce((a, b) => a + b, 0) / allPrices.length).toFixed(2)}`);
    console.log(`Range: \u20AC${Math.min(...allPrices).toFixed(2)} - \u20AC${Math.max(...allPrices).toFixed(2)}`);
  }
}

main().catch(console.error);
