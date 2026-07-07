# FlowLo Phase 5 — Orders integration

Two finished files:

```
components/orders/orders.module.css
components/orders/OrderList.tsx
```

Final designs — agents mount and wire, never edit.

## What OrderList owns

- Filter chips (All / Pending / Completed / Cancelled) with live
  counts, filtering client-side
- Order rows: "#number · customer", items + time meta, ZAR total,
  status chip (gold pending / mint completed / red cancelled)
- Rows are tap targets — via an `orderHref` route builder or an
  `onOpenOrder` handler, whichever fits the repo
- Empty states: no orders at all (with CTA) and no orders matching
  the current filter (quiet hint)

## What it replaces on the Orders page

- The SALES eyebrow + page description
- The "No orders yet" mega-card with its duplicate Create Order
  button

## Prompt for the coding agent

> components/orders/ contains two finished files: orders.module.css
> and OrderList.tsx. Do NOT modify them.
> 1. Replace the Orders page content with <OrderList />, keeping the
>    page inside AppShell.
> 2. Wire props: orders mapped from our order data to { id, number,
>    customer, itemsSummary, total (rands as number), status
>    ("pending" | "completed" | "cancelled"), when (short formatted
>    time like "Today, 14:32") } — if our data has more statuses,
>    map them to the closest of the three and flag the mapping;
>    createOrderHref to the real create-order route; if we have an
>    order detail page, pass orderHref building its route, otherwise
>    pass onOpenOrder opening the existing order view/flow.
> 3. Remove the old order-card implementation
>    (components/order-card.tsx and anything only it used) if
>    nothing else imports it — list what you removed.
> 4. Do not touch any other page or anything in components/auth/,
>    components/shell/, components/dashboard/, components/stock/,
>    components/orders/.
> Run build + typecheck. List changed files and anything you guessed.

## Check after it runs

- "No orders yet" empty state with one CTA (filters hidden while
  there are zero orders)
- After creating a test order: it appears as a row, the Pending
  chip is gold, filter counts update, and the dashboard checklist
  flips to 2 of 3 on its own
