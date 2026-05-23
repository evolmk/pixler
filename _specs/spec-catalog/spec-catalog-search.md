# Spec — Catalog Search Results Page

Route: `/catalog/search?q=term&type=all|products|parts` — URL state synced bidirectionally.

## Search Logic

- **Client-side** — loads products + parts data on init
- Products searched: `name`, `abbr`. Parts searched: `name`, `partNumber`
- Relevance: exact match > starts with > contains. Within each tier, products before parts
- Min query: 2 characters, 300ms debounce

## Result Card Differences

| Element    | Product                | Part                               |
| ---------- | ---------------------- | ---------------------------------- |
| Type badge | "Product" (green tint) | "Part" (brand tint)                |
| Subtitle   | Category name          | Part number (mono) · Category name |
| Price      | —                      | Auth-gated (approved + verified)   |
| CTA        | Request a Quote →      | Add to Cart →                      |

## Layout

- Tab filter: All / Products / Parts (each with count)
- 20 results per page, `ui-pagination` synced to URL
- Empty state: "No results found" with Browse Products / Browse Parts / Contact Us links
