# Spec — Catalog Slug System

## Field Architecture

Both Product and Part share: `slug` (auto from name, manually overridable), `slugUrl` (derived: `{category.slugUrl}/{slug}`), `category` (ObjectId ref to shared `categories` collection).

- `slug` uniqueness: per-collection with `-2`, `-3` collision suffix
- Manual override detection: `slug !== slugify(name)` — no extra boolean field
- `slugify()` canonical source: `packages/utils/src/string.utils.ts` (also inlined in backend services)

## Backend Slug Logic

**On create:** auto-generate `slug` from name if not provided, compose `slugUrl`.

**On update:** if slug manually provided → use it; elif name changed AND slug was auto-generated → re-derive; then recompose `slugUrl` if slug or category changed.

**Category rename cascade:** when a Category's name changes → re-derive its `slugUrl` → re-derive `slugUrl` on all Products and Parts in that category (`cascadeSlugUrl()` in categories service).

## Guest URL Structure

```
/catalog/products/:categorySlug/:productSlug  → Product detail
/catalog/parts/:categorySlug/:partSlug        → Part detail
```

Link construction: `slugUrl || slug || id`. Detail pages resolved via `/v1/{products|parts}/public/by-slug-url/:categorySlug/:itemSlug`.

## Admin Slug Editor

WordPress-style: disabled read-only state (mono text + Edit button) → edit mode (input + Reset/Done). Auto-updates on name change unless manually pinned. Reset clears the pin. slugUrl preview shown below.

## Backfill

`scripts/backfill-slug-urls.ts` — dry-run by default, `--save` to write. Re-run safe.
