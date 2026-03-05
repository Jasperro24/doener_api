# doener_api

A web scraper that collects Döner Kebab prices across 67 German cities from multiple delivery platforms (Wolt and Uber Eats), producing a **Döner Price Index** for Germany.

## What it does

- Scrapes döner kebab menu prices from **Wolt** and **Uber Eats** across 67 major German cities
- Filters for standard döner items only (excludes wraps, boxes, premium variants, non-standard meats, etc.)
- Deduplicates restaurants across platforms
- Applies IQR-based statistical outlier removal per city
- Outputs per-city statistics: median, average, min/max prices and item counts

## Requirements

- [Bun](https://bun.sh) runtime

## Setup

```bash
bun install
```

## Usage

```bash
bun run index.ts
```

This will scrape all 67 cities and save results to `data.json`.

To run the standalone data cleanup script on existing data:

```bash
bun run clean_data.ts
```

## Output format

`data.json` contains an array of city results:

```json
{
  "city": "Berlin",
  "slug": "berlin",
  "doenerCount": 42,
  "avgPrice": 7.85,
  "medianPrice": 7.90,
  "minPrice": 5.50,
  "maxPrice": 9.99,
  "items": [
    {
      "restaurant": "Example Kebab",
      "restaurantId": "abc123",
      "city": "Berlin",
      "itemName": "Döner Kebab",
      "price": 7.90,
      "platform": "wolt"
    }
  ],
  "scrapedAt": "2026-03-05T18:30:00.000Z"
}
```

## How it works

1. **Wolt**: Queries the restaurant listing API, filters for döner/kebab restaurants, then fetches each menu to find döner items
2. **Uber Eats**: Creates browser sessions via Puppeteer for authentication, searches for döner/kebab stores, then fetches store menus via API
3. **Cleaning**: For each restaurant, picks the median-priced döner item. Deduplicates across platforms. Removes statistical outliers per city using the IQR method
