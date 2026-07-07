# FlowLo Phase 6 — Delivery flow rail integration

Two finished files:

```
components/delivery/delivery.module.css
components/delivery/DeliveryBoard.tsx
```

Final designs — agents mount and wire, never edit. This is the
signature screen: one horizontal rail replaces the six stacked
status cards.

## What DeliveryBoard owns

- The flow rail: Pending → Confirmed → Packed → Out for delivery →
  Delivered, each node showing its live count
- Semantics: gold ring on actionable stages with items, mint ring on
  Delivered with items, gradient fill on the selected stage
- Tap a stage → the list below filters to it, with per-stage empty
  copy
- Cancelled lives as a quiet footer toggle ("Cancelled deliveries ·
  n"), never a pipeline stage
- Delivery rows: reference · customer, address/time meta, tappable
  via `deliveryHref` or `onOpenDelivery`
- Full empty state (no deliveries at all) with one CTA

## What it replaces on the Deliveries page

- The DELIVERIES eyebrow, "Delivery portal" title + description
- All six status cards (PENDING / CONFIRMED / PACKED / OUT FOR
  DELIVERY / DELIVERED / CANCELLED) with their duplicate label chips
- The "No deliveries yet" mega-card

## Prompt for the coding agent

> components/delivery/ contains two finished files:
> delivery.module.css and DeliveryBoard.tsx. Do NOT modify them.
> 1. Replace the Deliveries page content with <DeliveryBoard />,
>    keeping the page inside AppShell.
> 2. Wire props: deliveries mapped from our delivery data to
>    { id, reference, customer, address, when (short formatted),
>    stage } where stage is one of "pending" | "confirmed" |
>    "packed" | "out_for_delivery" | "delivered" | "cancelled" —
>    map our existing status values to these keys and flag the
>    mapping; createOrderHref to the real route; pass deliveryHref
>    if we have a delivery/order detail page, otherwise onOpenDelivery
>    opening the existing view (this is likely the same order detail
>    used on the Orders page).
> 3. Remove the old delivery-card implementation
>    (components/delivery-card.tsx and anything only it used) if
>    nothing else imports it — list what you removed.
> 4. Do not touch any other page or anything in components/auth/,
>    components/shell/, components/dashboard/, components/stock/,
>    components/orders/, components/delivery/.
> Run build + typecheck. List changed files and anything you guessed.

## Check after it runs

- Six screens of scrolling → one glance: the rail with live counts
- Your pending test order shows: Pending node reads 1 with a gold
  ring; tap it → the delivery row appears below
- Tap Delivered → per-stage empty copy; Cancelled footer shows 0
- Move the test order through your existing status flow → the counts
  travel along the rail
