# FlowLo Phase 4 — Stock / Products integration

Two finished files:

```
components/stock/stock.module.css
components/stock/ProductList.tsx
```

Final designs — agents mount and wire, never edit.

## What ProductList owns

- Dense rows: thumbnail (image or initial), name, SKU line,
  right-aligned ZAR price + stock chip
- Low-stock logic: gold chip at/below `lowStockThreshold`
  (default 3), "Out of stock" at 0
- Client-side search across name / SKU / subtitle
- The ⋯ action sheet: Edit product, Adjust stock (optional),
  Delete product — with a built-in two-step delete confirmation
  ("Keep it" / "Delete"). Bottom sheet on mobile, centered dialog
  on desktop.
- Proper empty state when there are no products

## What it replaces on the Products page

- The INVENTORY eyebrow + page description
- The giant per-product card with inset SELLING PRICE / STOCK LEFT /
  SKU boxes and the full-width Edit Product / Delete Product buttons

## Prompt for the coding agent

> components/stock/ contains two finished files: stock.module.css and
> ProductList.tsx. Do NOT modify them.
> 1. Replace the Products page content with <ProductList />, keeping
>    the page inside AppShell.
> 2. Wire props: products mapped from our product data to
>    { id, name, subtitle, price (rands as number), stock, sku,
>    imageUrl }; addProductHref to the real add-product route;
>    onEdit opens our existing edit flow for that product;
>    onAdjustStock opens the existing stock-adjust flow if we have
>    one, otherwise omit the prop; onDelete calls our existing
>    delete function (the component already handles the confirmation
>    UI — do not add another confirm dialog around it).
> 3. Remove the old product-card implementation
>    (components/product-card.tsx and anything only it used) if
>    nothing else imports it — list what you removed.
> 4. Do not touch any other page or anything in components/auth/,
>    components/shell/, components/dashboard/, components/stock/.
> Run build + typecheck. List changed files and anything you guessed.

## Check after it runs

- Your product shows as one compact row: "Design — App 1",
  "SKU not set", R 2 500,00, mint "5 in stock" chip
- ⋯ opens the sheet; Delete asks "Delete 'Design'?" before anything
  happens; "Keep it" backs out safely
- Search filters as you type
- Desktop: the sheet opens as a centered dialog, not a bottom sheet
