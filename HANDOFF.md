# True Print Shop — Developer Handoff

This branch is the clean implementation handoff for rebuilding the storefront as a Shopify theme.

## Goal

Preserve the approved desktop and mobile storefront exactly as designed while presenting the implementation in a predictable, maintainable structure.

## Pages

- `index.html` — home page reference
- `collection.html` — collection/category page reference
- `product.html` — product detail page reference
- `info.html` — shared informational page reference (contact/blog/etc.)

These HTML files are visual/interaction references for the Shopify implementation. Product, collection, cart and page data currently used by the static prototype must be replaced by Shopify Liquid objects and theme settings by the Shopify developer.

## Target structure

```text
/
├── index.html
├── collection.html
├── product.html
├── info.html
├── README.md
├── HANDOFF.md
│
├── assets/
│   ├── true-print-shop-logo.svg
│   └── generated/
│
├── css/
│   ├── base.css
│   ├── components.css
│   ├── home.css
│   ├── collection.css
│   ├── product.css
│   └── info.css
│
└── js/
    ├── app.js
    ├── navigation.js
    ├── page-transition.js
    ├── collection.js
    ├── product.js
    └── info.js
```

## CSS responsibilities

### `base.css`
Design tokens, reset, typography, document/body defaults and shared layout primitives only.

### `components.css`
Shared header, desktop navigation, mobile navigation, search, buttons, dropdowns, tabs, cards, footer, shared forms and other reusable storefront UI.

### Page styles
`home.css`, `collection.css`, `product.css` and `info.css` contain only page-specific layout or presentation rules.

## JavaScript responsibilities

### `app.js`
Shared storefront bootstrap and small reusable utilities. No page-specific styling injection.

### `navigation.js`
Desktop and mobile navigation behavior. Navigation hierarchy should have one source of truth wherever practical.

### `page-transition.js`
Shared page transition behavior only.

### Page scripts
`collection.js`, `product.js` and `info.js` contain behavior specific to those page types.

## Handoff rules

1. Approved desktop and mobile appearance must not change during cleanup.
2. No generated CSS `<style>` blocks should be injected from JavaScript in the final handoff unless technically unavoidable.
3. No duplicate legacy overrides should remain.
4. No source-mutating GitHub Actions workflows belong in the handoff.
5. No backup ZIP files, temporary files or unused experiments belong in the handoff.
6. CSS custom properties should be the single source of truth for shared colors, typography, spacing and major layout constants.
7. Shared components should not be restyled independently on individual pages unless the page genuinely requires a variant.
8. Files should remain readable and unminified for the Shopify developer.

## Shopify mapping notes

The Shopify developer can use the four HTML pages as visual references and map reusable pieces into Liquid sections/snippets. This handoff intentionally does not invent Shopify backend logic; Shopify product, collection, cart, customer and theme-editor behavior should be connected during theme development.

## Branch safety

`clean-rewrite` is the cleanup/handoff branch. The live/reference implementation remains on `main` until the cleaned version is reviewed and approved.
