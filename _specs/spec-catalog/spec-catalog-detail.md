# Spec — Catalog Detail Pages

## Image Gallery (both pages)

Both product and part detail pages use `ui-carousel` with horizontal thumbnails below. Click opens `ui-lightbox` at current index. Single image: no carousel chrome, click still opens lightbox. No images: placeholder icon.

## Product Detail vs. Part Detail

| Aspect          | Product Detail                                                 | Part Detail                                                 |
| --------------- | -------------------------------------------------------------- | ----------------------------------------------------------- |
| Layout          | 2-column grid: images left, info right                         | Same                                                        |
| Primary info    | Group name, product name, abbreviation, description            | Category, part number (mono, prominent), name, SKU          |
| Price           | Not shown                                                      | Auth-gated (approved + verified). Sign-in prompt for guests |
| Primary CTA     | "Add to Quote"                                                 | Quantity selector + "Add to Cart" / "Add to Quote"          |
| Action links    | —                                                              | Wishlist (toggle), Inquire About Part, Share                |
| Tabs            | Features, Specifications, Options, Videos, Manuals             | —                                                           |
| Click tracking  | `PATCH /v1/products/public/:id/click` (fire-and-forget)        | `PATCH /v1/parts/public/:id/click`                          |
| Sticky mobile   | Fixed bottom bar when scrolled past CTA (IntersectionObserver) | Same, with part number + price                              |
| Recently viewed | —                                                              | Adds to `RecentlyViewedService`                             |

## Planned: Related / Compatible Items

Deferred — requires backend API. Parts: "Other Parts for [Category]", "Compatible With" (parent machine), "Frequently Bought Together" (order history). Products: "Replacement Parts", "Related Products" (same category).
