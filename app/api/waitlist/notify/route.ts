import { NextResponse } from "next/server";

type WaitlistNotificationBody = {
  entryId?: string;
  name?: string;
  email?: string;
  businessType?: string;
  whatsappNumber?: string;
  createdAt?: string;
  source?: string;
};

const MAX_BODY_BYTES = 4_000;
const LIMITS = {
  name: 80,
  email: 120,
  businessType: 80,
  whatsappNumber: 30,
  createdAt: 40,
  source: 40,
  entryId: 64,
} as const;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Best-effort, per-instance limiter. Serverless instances do not share memory,
// so pair this with Vercel WAF / a shared store (e.g. Upstash) for a hard cap.
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX_REQUESTS = 5;
const hits = new Map<string, number[]>();
const seenEntries = new Map<string, number>();

function isRateLimited(key: string, now = Date.now()) {
  const recent = (hits.get(key) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  recent.push(now);
  hits.set(key, recent);

  if (hits.size > 5_000) {
    for (const [k, times] of hits) {
      if (times.every((t) => now - t >= RATE_WINDOW_MS)) hits.delete(k);
    }
  }

  return recent.length > RATE_MAX_REQUESTS;
}

function clientKey(request: Request) {
  return (
    request.headers.get("x-real-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown"
  );
}

function isSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return false;

  try {
    return new URL(origin).host === new URL(request.url).host;
  } catch {
    return false;
  }
}

function normalizeText(value: unknown, maxLength = 200) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function formatCreatedDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return new Intl.DateTimeFormat("en-ZA", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date());
  }

  return new Intl.DateTimeFormat("en-ZA", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function buildWaitlistEmail(input: {
  name: string;
  email: string;
  businessType: string;
  whatsappNumber: string;
  createdAt: string;
  source: string;
}) {
  const whatsappLine = input.whatsappNumber || "Not provided";
  const createdLabel = formatCreatedDate(input.createdAt);

  const html = `
    <div style="font-family: Inter, Arial, sans-serif; background: #070b0f; color: #f8fafc; padding: 24px;">
      <div style="max-width: 640px; margin: 0 auto; border-radius: 24px; border: 1px solid rgba(255,255,255,0.12); background: linear-gradient(180deg, rgba(17,24,32,0.96), rgba(10,14,19,0.98)); padding: 28px;">
        <p style="margin: 0; font-size: 11px; letter-spacing: 0.28em; text-transform: uppercase; color: #ffd45a;">FlowLo waitlist</p>
        <h1 style="margin: 16px 0 0; font-size: 28px; line-height: 1.1;">New FlowLo waitlist signup</h1>
        <p style="margin: 12px 0 0; font-size: 15px; line-height: 1.8; color: #a8b3c2;">
          A new person joined the FlowLo coming soon waitlist.
        </p>
        <div style="margin-top: 24px; display: grid; gap: 12px;">
          <div style="border-radius: 18px; border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.03); padding: 16px;">
            <strong style="display: block; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #a8b3c2;">Name</strong>
            <span style="display: block; margin-top: 10px; font-size: 15px; color: #f8fafc;">${escapeHtml(input.name)}</span>
          </div>
          <div style="border-radius: 18px; border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.03); padding: 16px;">
            <strong style="display: block; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #a8b3c2;">Email</strong>
            <span style="display: block; margin-top: 10px; font-size: 15px; color: #f8fafc;">${escapeHtml(input.email)}</span>
          </div>
          <div style="border-radius: 18px; border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.03); padding: 16px;">
            <strong style="display: block; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #a8b3c2;">Business type</strong>
            <span style="display: block; margin-top: 10px; font-size: 15px; color: #f8fafc;">${escapeHtml(input.businessType)}</span>
          </div>
          <div style="border-radius: 18px; border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.03); padding: 16px;">
            <strong style="display: block; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #a8b3c2;">WhatsApp number</strong>
            <span style="display: block; margin-top: 10px; font-size: 15px; color: #f8fafc;">${escapeHtml(whatsappLine)}</span>
          </div>
          <div style="border-radius: 18px; border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.03); padding: 16px;">
            <strong style="display: block; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #a8b3c2;">Created date</strong>
            <span style="display: block; margin-top: 10px; font-size: 15px; color: #f8fafc;">${escapeHtml(createdLabel)}</span>
          </div>
          <div style="border-radius: 18px; border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.03); padding: 16px;">
            <strong style="display: block; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #a8b3c2;">Source</strong>
            <span style="display: block; margin-top: 10px; font-size: 15px; color: #f8fafc;">${escapeHtml(input.source)}</span>
          </div>
        </div>
      </div>
    </div>
  `.trim();

  const text = [
    "New FlowLo waitlist signup",
    "",
    `Name: ${input.name}`,
    `Email: ${input.email}`,
    `Business type: ${input.businessType}`,
    `WhatsApp number: ${whatsappLine}`,
    `Created date: ${createdLabel}`,
    `Source: ${input.source}`,
  ].join("\n");

  return { html, text };
}

export async function POST(request: Request) {
  try {
    if (!isSameOrigin(request)) {
      return NextResponse.json({ message: "Forbidden." }, { status: 403 });
    }

    if (isRateLimited(clientKey(request))) {
      return NextResponse.json(
        { message: "Too many requests. Please try again later." },
        { status: 429, headers: { "Retry-After": "600" } },
      );
    }

    const raw = await request.text();

    if (raw.length > MAX_BODY_BYTES) {
      return NextResponse.json({ message: "Payload too large." }, { status: 413 });
    }

    const body = JSON.parse(raw) as WaitlistNotificationBody;
    const name = normalizeText(body.name, LIMITS.name);
    const email = normalizeText(body.email, LIMITS.email).toLowerCase();
    const businessType = normalizeText(body.businessType, LIMITS.businessType);
    const whatsappNumber = normalizeText(body.whatsappNumber, LIMITS.whatsappNumber);
    const createdAt =
      normalizeText(body.createdAt, LIMITS.createdAt) || new Date().toISOString();
    const source = normalizeText(body.source, LIMITS.source) || "coming-soon";
    const entryId = normalizeText(body.entryId, LIMITS.entryId);

    if (!name || !email || !businessType || !EMAIL_PATTERN.test(email)) {
      return NextResponse.json(
        { message: "Missing waitlist signup details." },
        { status: 400 },
      );
    }

    // Ignore replays of the same entry so one signup sends one email.
    if (entryId) {
      const now = Date.now();
      if (seenEntries.has(entryId)) {
        return NextResponse.json({ ok: true });
      }
      seenEntries.set(entryId, now);
      if (seenEntries.size > 2_000) {
        for (const [id, t] of seenEntries) {
          if (now - t > RATE_WINDOW_MS) seenEntries.delete(id);
        }
      }
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    const notifyEmail =
      process.env.WAITLIST_NOTIFY_EMAIL?.trim() || "ddbyalfonzo@gmail.com";

    if (!resendApiKey) {
      console.error("FlowLo waitlist notify route missing RESEND_API_KEY.");
      return NextResponse.json(
        { message: "Notification email is not configured yet." },
        { status: 500 },
      );
    }

    const { html, text } = buildWaitlistEmail({
      name,
      email,
      businessType,
      whatsappNumber,
      createdAt,
      source,
    });

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "FlowLo <onboarding@resend.dev>",
        to: [notifyEmail],
        subject: "New FlowLo waitlist signup",
        html,
        text,
      }),
    });

    const resendPayload = (await resendResponse.json().catch(() => null)) as
      | Record<string, unknown>
      | null;

    if (!resendResponse.ok) {
      console.error("FlowLo waitlist notification email failed.", {
        entryId,
        status: resendResponse.status,
        response: resendPayload,
      });

      return NextResponse.json(
        { message: "We could not send the notification email." },
        { status: 500 },
      );
    }

    console.info("FlowLo waitlist notification email sent.", {
      entryId,
      resendId:
        resendPayload && typeof resendPayload.id === "string"
          ? resendPayload.id
          : null,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Unexpected FlowLo waitlist notification error.", error);

    return NextResponse.json(
      { message: "We could not process the waitlist notification." },
      { status: 500 },
    );
  }
}
