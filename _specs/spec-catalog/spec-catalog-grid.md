# Spec — Catalog Landing & Browse Pages

## Routes

```
/catalog                         → CatalogLandingComponent (main entry: hero + search + category tiles + carousels)
/catalog/products                → ProductsLandingComponent (category cards + featured carousel)
/catalog/parts                   → PartsLandingComponent (category cards + featured carousel)
/catalog/products/browse         → ProductsBrowseComponent (all products grid)
/catalog/parts/browse            → PartsBrowseComponent (all parts grid)
/catalog/products/:categorySlug  → ProductsBrowseComponent (pre-filtered)
/catalog/parts/:categorySlug     → PartsBrowseComponent (pre-filtered)
```

## Key Concepts

- **Products** = machines/equipment → Request a Quote (no cart)
- **Parts** = replacement parts → Add to Cart
- Every part has a laser-engraved number — part name/number search is the primary discovery method
- Categories are shared between Products and Parts; Parts also have **tags**

## Products vs. Parts Grid

| Aspect               | Products                             | Parts                                 |
|----------------------|--------------------------------------|---------------------------------------|
| Layout               | Single-column wide cards (1 per row) | Multi-column grid (4 cols at xl)      |
| Card style           | Horizontal: image left + info right  | Vertical: image top + info below      |
| Items per page       | 12                                   | 20                                    |
| Part number shown    | No                                   | Yes (mono font)                       |
| Price shown          | No                                   | Yes (auth-gated: approved + verified) |
| Badge type           | "Featured"                           | "In Stock"                            |
| Availability filter  | No                                   | Yes                                   |
| Search fields        | name, descPreview                    | name, partNumber, description         |
| Sort options         | Name, Newest                         | Name, SKU                             |
| Primary CTA (detail) | Request a Quote                      | Add to Cart                           |

## Browse Page Filters

- Sidebar: accordion-based (`ui-accordion type="multiple"`), all items expanded by default
- Parts: Categories (checkbox) + Availability (In Stock toggle)
- Products: Categories only
- Category slug routes pre-select the matching checkbox on load
- Sidebar hidden on mobile (`hidden lg:block`) — filter drawer via button (planned)

## Landing Page Pattern

Each landing page (main
`/catalog`, products, parts) follows: breadcrumb → hero/header → category card grid (tint-cycling icons, priority-sorted) → featured/popular carousel → CTA. The main catalog landing adds a search bar in the hero with client-side autocomplete (300ms debounce, ≥2 chars, grouped results).

## Planned Improvements

- Search by `abbr`, highlight matches, URL sync (`?q=...`)
- Filter state in URL query params (search, categories, sort, page, view mode)
- Mobile filter drawer with active filter count badge
- Category counts in sidebar: `☐ Chuck Capper (38)`
- Active filter pills above grid: `[Chuck Capper ×] [In Stock ×] Clear all`
- Price sort (parts only, auth-gated)
- Recently viewed (localStorage, `ui-carousel` section)
