# FlowLo Phase 8 — Forgot password · Attention engine · WhatsApp notify

Four finished files:

```
components/auth/ForgotPasswordScreen.tsx    (uses existing auth.module.css)
lib/flowlo/attention.ts
components/whatsapp/NotifyCustomerButton.tsx
components/whatsapp/whatsapp.module.css
```

Final code — agents mount and wire, never edit. Run the three prompts
IN ORDER, verifying each before the next.

## Prompt 1 — Forgot password

> components/auth/ForgotPasswordScreen.tsx is a finished component
> (it shares the existing auth.module.css). Do NOT modify it or
> anything in components/auth/.
> 1. Create the /forgot-password route mounting
>    <ForgotPasswordScreen />, wiring onSendReset to Firebase's
>    sendPasswordResetEmail from our existing auth setup.
> 2. Confirm the Sign in page's "Forgot password?" link points to
>    this route.
> Note: the component intentionally shows "Check your inbox" even for
> unknown emails (no account-existence leaking) — do not "fix" that.
> Run build + typecheck. List changed files.

## Prompt 2 — Attention engine

> lib/flowlo/attention.ts exports computeAttentionItems — a pure
> function. Do NOT modify it.
> 1. On the dashboard page, replace the hardcoded empty
>    attentionItems with the result of computeAttentionItems, fed
>    with: products (name, stock), orders (reference, status,
>    createdAt), and deliveries (reference, stage, updatedAt — omit
>    deliveries if we don't track stage-change timestamps, and flag
>    that). Reuse data the page already fetches wherever possible
>    rather than adding new queries.
> 2. Keep lowStockThreshold consistent with the value passed to
>    ProductList on the Stock page.
> Run build + typecheck. List changed files and any new queries.

## Prompt 3 — WhatsApp notify

> components/whatsapp/ contains two finished files:
> NotifyCustomerButton.tsx and whatsapp.module.css. Do NOT modify
> them.
> 1. Add an optional customer phone field to the order creation and
>    edit forms, stored on the order (label: "Customer WhatsApp
>    number (optional)", placeholder "072 123 4567"). Keep the form's
>    existing styling.
> 2. Mount <NotifyCustomerButton /> on the order/delivery detail
>    view, passing phone, customerName, reference, the current
>    delivery stage (map our status to "pending" | "confirmed" |
>    "packed" | "out_for_delivery" | "delivered"), and the business
>    name. The component handles missing numbers by rendering a
>    disabled hint — do not conditionally hide it.
> 3. Do not auto-send anything anywhere: the button only opens
>    WhatsApp with a prefilled message the owner reviews and sends
>    themselves.
> Run build + typecheck. List changed files and where the button was
> mounted.

## Check after all three

- /forgot-password: matches the auth design, sends a real reset
  email to your account, shows "Check your inbox"
- Dashboard: with a product at stock 0–3 or an order pending >24h,
  the attention row turns gold and names it; otherwise "All clear"
- An order with a phone number shows the green WhatsApp button;
  tapping opens WhatsApp with the stage message prefilled to the
  right number (072… becomes +27 72…); an order without a phone
  shows the quiet "No number" hint
