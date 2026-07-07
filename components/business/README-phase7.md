# FlowLo Phase 7 — Business settings + polish pass

Two finished files:

```
components/business/business.module.css
components/business/BusinessSettings.tsx
```

Final designs — agents mount and wire, never edit. Run this phase as
TWO separate Codex prompts: mount first, polish second.

## What BusinessSettings owns

- Name field + category select in one card
- Save button with real feedback: disabled until something changes,
  "Saving…" while in flight, "Saved ✓" for 2.5s, error state on
  failure
- Account section: initials avatar, name/email, Sign out button
  (quiet by default, reddens on hover)

## Prompt 1 — mount

> components/business/ contains two finished files:
> business.module.css and BusinessSettings.tsx. Do NOT modify them.
> 1. Replace the Business settings page content with
>    <BusinessSettings />, keeping the page inside AppShell.
> 2. Wire props: initialName and initialCategory from our business
>    data; onSave calls our existing save function and must throw on
>    failure so the component can show its error state; accountEmail
>    (and accountName if we store one) from the signed-in user;
>    onSignOut calls our existing Firebase sign-out and redirects to
>    the login page.
> 3. Remove the old business-settings-form implementation if nothing
>    else imports it — list what you removed.
> 4. Do not touch any other page or anything inside components/auth/,
>    components/shell/, components/dashboard/, components/stock/,
>    components/orders/, components/delivery/, components/business/.
> Run build + typecheck. List changed files and anything you guessed.

## Prompt 2 — polish pass (run after Prompt 1 is verified)

> Do a polish pass across the whole app. Rules:
> 1. Dead code: list every component in components/ (root level, not
>    the auth/shell/dashboard/stock/orders/delivery/business folders)
>    that is no longer imported anywhere — e.g. old app-shell,
>    page-header, auth-card, auth-background, landing-page,
>    product-card, order-card, delivery-card, empty-state,
>    dashboard-onboarding, stat-card, status-badge, brand-mark,
>    brand-wordmark, ambient-background, password-field, reveal —
>    and delete the unused ones. Show me the list BEFORE deleting.
> 2. Tokens: replace any remaining raw hex colors in pages/components
>    (outside the finished design folders) with the CSS variables
>    from flowlo-tokens.css.
> 3. One gradient button per screen: scan every page; if any screen
>    renders two or more gradient-primary buttons, demote the
>    non-primary ones to quiet/outline style. List what you changed.
> 4. Uppercase letterspaced text only on section labels — remove any
>    remaining decorative gold eyebrows (INVENTORY, SALES,
>    DELIVERIES, SETTINGS, ACTION CENTER, PERFORMANCE) if any pages
>    still render them.
> 5. Accessibility: every interactive element keyboard-focusable
>    with a visible focus ring; touch targets at least 44px; add
>    aria-labels to icon-only buttons that lack them.
> 6. Do NOT change any file inside the seven finished design folders.
> Run build + typecheck. Summarize everything changed and deleted.

## Check after both

- Business page: Save disabled until you edit; edit name → Save →
  "Saved ✓"; Sign out lands on the new login page
- No page anywhere still shows the old design language
- Tab through the app with the keyboard — focus is always visible
