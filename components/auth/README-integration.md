# FlowLo auth screens — integration guide

Three files, built for your exact stack (Next 15 + TypeScript +
Tailwind 3 + Firebase):

```
components/auth/auth.module.css     ← all styles (CSS Module: cannot
components/auth/SignInScreen.tsx       conflict with Tailwind or any
components/auth/LandingScreen.tsx      existing global CSS)
```

The components are the design, ported 1:1. The ONLY thing left to do
is mount them on your routes and pass your Firebase functions in.
No agent should rewrite, restyle, or "adapt" anything inside them.

---

## 1. Copy the folder

Place `components/auth/` into your repo (next to your existing
`components/` content, or create the folder).

## 2. Mount on your routes

### If you have an `app/` directory (App Router)

`app/login/page.tsx`:

```tsx
"use client";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import SignInScreen from "@/components/auth/SignInScreen";
import { auth } from "@/lib/firebase"; // ← your existing firebase init

export default function LoginPage() {
  const router = useRouter();
  return (
    <SignInScreen
      onSignIn={async (email, password) => {
        await signInWithEmailAndPassword(auth, email, password);
        router.push("/dashboard"); // ← your post-login route
      }}
    />
  );
}
```

`app/page.tsx` (public landing):

```tsx
"use client";
import LandingScreen from "@/components/auth/LandingScreen";

export default function Home() {
  return (
    <LandingScreen
      onRequestAccess={async (email) => {
        // store the email — e.g. Firestore:
        // await addDoc(collection(db, "waitlist"), { email, at: serverTimestamp() });
      }}
    />
  );
}
```

### If you have a `pages/` directory (Pages Router)

Same components, same props — mount in `pages/login.tsx` and
`pages/index.tsx`, using `useRouter` from `next/router` instead.

## 3. Delete the old versions

Remove the old login and landing page markup/styles once the new
routes render, so the old MANAGED ACCESS design can't leak back in.

## 4. Adjust two routes if yours differ

- `SignInScreen` links to `/forgot-password` and `/` (request access)
  by default — override via `forgotPasswordHref` / `requestAccessHref`.
- `LandingScreen` links to `/login` — override via `signInHref`.

---

## Prompt for your coding agent (Codex / Claude Code)

> The folder components/auth/ contains three finished files:
> auth.module.css, SignInScreen.tsx, LandingScreen.tsx. These are
> final designs — do NOT modify their JSX or CSS in any way.
> Your job is only to:
> 1. Mount SignInScreen on the login route and LandingScreen on the
>    public landing route, following README-integration.md exactly.
> 2. Wire onSignIn to our existing Firebase signInWithEmailAndPassword
>    flow, including the post-login redirect we already use.
> 3. Wire onRequestAccess to store the email in Firestore in a
>    "waitlist" collection (create it if needed).
> 4. Delete the old login and landing page components and any styles
>    only they used.
> 5. Fix import paths ("@/components", "@/lib/firebase") to match
>    this repo's aliases.
> Run the build and typecheck. List changed files. If anything forces
> you to touch the three auth files themselves, STOP and ask me first.

---

## Why this will match the preview this time

Last attempt, the agent translated a reference into its own code —
every translation drifted. This time the code is already written;
the agent only mounts it. CSS Modules scope every class, so your
existing Tailwind/global styles can't override them, and
`next/font` loads Space Grotesk + Inter without any CSS @import.
