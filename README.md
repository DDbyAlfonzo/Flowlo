# FlowLo

FlowLo is a clean inventory and order management MVP for small businesses that sell through WhatsApp and need a better way to track stock, orders, and sales.

## Stack

- Next.js 15 with the App Router
- TypeScript
- Tailwind CSS
- Firebase Auth (email/password)
- Cloud Firestore
- Firebase Storage

## Features

- Email/password login with managed access approval
- Public request-access flow backed by Firebase Auth and Firestore
- Admin review console at `/admin/access-requests`
- Coming soon waitlist with server-side email notifications via Resend
- One business per user
- Product create, edit, list, and delete flows
- Order create, list, and detail flows
- Automatic stock deduction inside a Firestore transaction
- Low stock alerts on the dashboard and product list
- WhatsApp-ready confirmation link on each order

## Project structure

```text
project-root/
├── app/
│   ├── api/waitlist/notify/
│   ├── dashboard/
│   ├── login/
│   ├── orders/
│   │   ├── [id]/
│   │   └── new/
│   ├── products/
│   │   ├── [id]/edit/
│   │   └── new/
│   ├── register/
│   ├── settings/business/
│   ├── layout.tsx
│   └── page.tsx
├── components/
├── hooks/
├── lib/
├── scripts/
├── styles/
├── types/
├── .env.local.example
├── firestore.rules
├── middleware.ts
├── storage.rules
└── README.md
```

## Firebase setup

1. Create a Firebase project.
2. Add a Web App inside Firebase.
3. Enable Email/Password under `Authentication > Sign-in method`.
4. Create a Cloud Firestore database in production mode.
5. Create a Cloud Storage bucket.
6. Copy `.env.local.example` to `.env.local`.
7. Paste your Firebase web app values into `.env.local`.
8. Deploy the included security rules:

```bash
firebase deploy --only firestore:rules,storage
```

If you are not using the Firebase CLI yet, install it first with:

```bash
npm install -g firebase-tools
firebase login
firebase init firestore storage
```

Then point the Firebase config to:

- `firestore.rules`
- `storage.rules`

## Environment variables

Create `.env.local` in the project root with:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
RESEND_API_KEY=
WAITLIST_NOTIFY_EMAIL=ddbyalfonzo@gmail.com
```

`RESEND_API_KEY` is used only on the server by the waitlist notification route. It is never exposed to the browser.

`WAITLIST_NOTIFY_EMAIL` is optional and defaults to `ddbyalfonzo@gmail.com`.

## Local development

1. Install dependencies:

```bash
npm install
```

2. Start the app:

```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000).

## How stock updates work

FlowLo uses Firestore transactions in `lib/firestore.ts` for every stock-changing action.

The current order flow is:

1. Creating an order does not deduct stock by default.
2. Stock is deducted only when an order is marked as paid or completed.
3. FlowLo checks stock again before deduction and blocks the action if inventory is short.
4. If a deducted order is cancelled, FlowLo restores the product quantities.
5. `stockDeducted` prevents accidental double-deduction.

## Route protection

- `middleware.ts` blocks private routes unless a user is both authenticated and approved.
- `/admin/access-requests` is reserved for admin reviewers listed in `ADMIN_EMAILS`.
- Firebase Auth remains the source of truth for access to app data.
- Firestore and Storage rules enforce managed-access and owner-level access on the backend.

## Data model

### `betaAccessRequests/{uid}`

- `uid`
- `fullName`
- `email`
- `businessName`
- `businessType`
- `whatsappNumber`
- `status`
- `role`
- `createdAt`
- `reviewedAt`
- `reviewedBy`

### `businesses/{uid}`

- `businessName`
- `category`
- `ownerId`
- `createdAt`

### `products/{productId}`

- `name`
- `category`
- `sku`
- `quantity`
- `lowStockThreshold`
- `costPrice`
- `sellingPrice`
- `imageUrl`
- `ownerId`
- `businessId`
- `createdAt`
- `updatedAt`

### `orders/{orderId}`

- `customerName`
- `customerPhone`
- `items`
- `orderTotal`
- `paymentStatus`
- `orderStatus`
- `source`
- `ownerId`
- `businessId`
- `createdAt`

## Deploying

### App deployment

The simplest production setup is Vercel for the Next.js app and Firebase for Auth, Firestore, and Storage.

1. Push the project to a Git repository.
2. Import the project into Vercel.
3. Set the same `NEXT_PUBLIC_FIREBASE_*` environment variables in Vercel.
4. Add `RESEND_API_KEY` in Vercel for waitlist email notifications.
5. Optionally add `WAITLIST_NOTIFY_EMAIL` if you want notifications to go somewhere other than the default.
6. Redeploy after saving the environment variables.
7. Deploy.

### Firebase backend deployment

Deploy your Firestore and Storage rules whenever they change:

```bash
firebase deploy --only firestore:rules,storage
```

## Notes

- Currency is currently formatted as `ZAR` for a South African storefront feel. If you want multi-currency support later, add a currency field to the business settings and switch the formatter.
- A lightweight auth session cookie is used for fast route gating in middleware. Firestore and Storage rules still protect the actual data.
- FlowLo uses a permanent managed-access model. New users request access first, then an admin approves or rejects them before dashboard access opens.
- The waitlist form saves to Firestore first, then calls a server-side API route that sends a Resend notification email. If the email fails, the waitlist entry still stays saved.
- The `scripts/` folder is included for future seeding or migration utilities, but no seed script is required for this MVP.
