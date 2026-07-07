# FlowLo Phase 2 — App shell integration

Two finished files:

```
components/shell/shell.module.css
components/shell/AppShell.tsx
```

Same rules as the auth screens: these are final. Agents mount them and
wire props — they never edit them.

## What AppShell provides

- Compact 56px frosted header: logo, business name + subline,
  notification button, avatar initials
- Bottom tab bar on mobile → left sidebar at >=900px (same DOM,
  CSS-only switch)
- Active nav state from the current route (usePathname)
- Safe-area padding, focus rings, press feedback

## What it replaces

- The large greeting card header on every tab
- The old bottom nav ("Dash / Stock / Orders / Delivery / Biz")
- The left-edge drawer handle that overlapped page titles

## Mounting (App Router)

In the layout that wraps authenticated routes (e.g.
`app/(app)/layout.tsx` — whatever wraps dashboard/stock/orders/etc.):

```tsx
import AppShell from "@/components/shell/AppShell";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell
      businessName={/* real business name from your user/business context */}
      initials={/* e.g. first letters of the business name */}
      navItems={[
        { label: "Home",     href: "/dashboard", icon: "home" },
        { label: "Stock",    href: "/stock",     icon: "stock" },     // ← use REAL routes
        { label: "Orders",   href: "/orders",    icon: "orders" },
        { label: "Delivery", href: "/delivery",  icon: "delivery" },
        { label: "Business", href: "/business",  icon: "business" },
      ]}
    >
      {children}
    </AppShell>
  );
}
```

If the business name comes from a client-side context/hook, make a tiny
client wrapper component that reads the context and renders AppShell —
don't restructure data fetching.

## Prompt for the coding agent

> components/shell/ contains two finished files: shell.module.css and
> AppShell.tsx. Do NOT modify them.
> 1. Mount AppShell in the layout that wraps all authenticated routes,
>    per components/shell/README-phase2.md. Pass the real business
>    name and initials from our existing user/business data, and map
>    navItems to this repo's actual route paths (keep our route names;
>    change the hrefs in the prop, not the routes).
> 2. Remove the old per-page greeting/header card (logo + "Good
>    afternoon" + business name + bell + avatar) from every
>    authenticated page — AppShell now provides all of it. Page
>    content should start directly with its own title/content.
> 3. Remove the old bottom navigation and the left-edge drawer handle
>    component wherever they are rendered.
> 4. Keep every page's actual content, data and logic untouched. This
>    phase is chrome only — do not restyle page content yet.
> 5. Auth pages (login, landing) must NOT be wrapped by AppShell.
> Run build + typecheck. List changed files, list what you deleted,
> flag anything you guessed. If you need to modify anything inside
> components/shell/, STOP and ask first.

## Check after it runs

- Every tab shows the slim header; no greeting card anywhere
- Nav highlights the current tab; all five routes work
- Desktop (>900px wide): nav becomes the left sidebar with the
  FlowLo wordmark
- Login and landing pages unchanged (no shell around them)
- Nothing overlaps page titles on the left edge
