# FlowLo Phase 3 — Dashboard integration

Two finished files:

```
components/dashboard/dashboard.module.css
components/dashboard/DashboardHome.tsx
```

Final designs — agents mount and wire data, never edit them.

## What DashboardHome does with your data

- **Setup checklist** ("Get your flow going") computes itself:
  step 1 done when `productCount > 0`, step 2 when
  `totalOrderCount > 0`, step 3 from `hasDeliveryDetails`.
  The whole card disappears once all three are done.
- **Today stats** — pass `todayRevenue` as a plain rand number
  (e.g. `1250.5`); the component formats it as ZAR.
- **Needs attention** — pass an array of strings; empty array
  renders the quiet "All clear" row, any items turn the dot gold.
- **Recent activity** — pass items newest-first; empty renders the
  quiet empty row.
- **One CTA** — Create order, as a link to your route.

## What it replaces on the dashboard page

- The Today's revenue / Orders today hero cards
- The Add product / Create order / View deliveries button stack
- The ACTION CENTER label + giant "All clear" card
- The Recent activity section with its "No orders yet" mega-card and
  duplicate Create order button
- The PERFORMANCE section (Total revenue / Total products /
  Best sellers) — total revenue and product count now live in the
  checklist + stats; Best sellers returns in a later phase once
  there's sales data to show

## Prompt for the coding agent

> components/dashboard/ contains two finished files:
> dashboard.module.css and DashboardHome.tsx. Do NOT modify them.
> 1. Replace the dashboard page's content with <DashboardHome />,
>    keeping the page inside AppShell as it is now.
> 2. Wire every prop to real data we already have or can query
>    cheaply: firstName (from the user profile if we store one,
>    otherwise omit), productCount, totalOrderCount,
>    hasDeliveryDetails (true if the business has any delivery
>    record/details; if we have no such concept yet, pass
>    totalOrderCount > 0 as a stand-in and flag it), todayRevenue
>    (rands as a number, paid/completed orders today), ordersToday,
>    ordersPending, ordersCompleted, attentionItems (empty array for
>    now), activity (map our most recent 5 orders/stock changes to
>    { id, title, meta }; empty array if none), and the three hrefs
>    mapped to this repo's real routes.
> 3. Remove the dashboard-only components this replaces (the old
>    onboarding/stat/action-center/performance sections) if nothing
>    else imports them — list what you removed.
> 4. Do not touch any other page, components/auth/,
>    components/shell/, or components/dashboard/.
> Run build + typecheck. List changed files and anything you guessed.

## Check after it runs

- Checklist shows "1 of 3" with "Add your first product" crossed out
  (you have 1 product, 0 orders)
- Stats show live zeros; attention row is one quiet line
- One gradient CTA at the bottom, capped width on desktop
- Create an order later → checklist updates to 2 of 3 by itself
