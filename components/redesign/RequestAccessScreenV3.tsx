"use client";

/* FlowLo — request access (register), v3.
   Same frame as SignInScreenV3: photo + anchored panel on desktop, photo
   band + glass card on phone. Two short steps (business, then password)
   so the form never feels long. The page owns the actual sign-up. */

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { formatWhatsAppPhone } from "@/lib/whatsapp";
import { fontVars } from "./fonts";
import { Icon, LOGO_SRC } from "./icons";
import s from "./signin.module.css";
import r from "./register.module.css";

export type RequestAccessValues = {
  fullName: string;
  email: string;
  businessName: string;
  businessType: string;
  whatsappNumber: string;
  password: string;
};

type Props = {
  businessTypes: readonly string[];
  onSubmit: (values: RequestAccessValues) => Promise<void>;
  initialEmail?: string;
  signInHref?: string;
  backHref?: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type Errors = Partial<Record<keyof RequestAccessValues | "confirm", string>>;

export default function RequestAccessScreenV3({
  businessTypes,
  onSubmit,
  initialEmail = "",
  signInHref = "/login",
  backHref = "/",
}: Props) {
  const [step, setStep] = useState<1 | 2>(1);
  const [v, setV] = useState<RequestAccessValues>({
    fullName: "",
    email: initialEmail,
    businessName: "",
    businessType: businessTypes[0] ?? "Other",
    whatsappNumber: "",
    password: "",
  });
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const set = (key: keyof RequestAccessValues) => (value: string) => {
    setV((cur) => ({ ...cur, [key]: value }));
    if (errors[key]) setErrors((cur) => ({ ...cur, [key]: undefined }));
  };

  function checkStep1(): Errors {
    const e: Errors = {};
    if (!v.fullName.trim()) e.fullName = "Enter your name.";
    if (!EMAIL_RE.test(v.email.trim())) e.email = "Enter a valid email address.";
    if (!v.businessName.trim()) e.businessName = "Enter your business name.";
    if (!formatWhatsAppPhone(v.whatsappNumber)) e.whatsappNumber = "Enter a South African number, like 082 123 4567.";
    return e;
  }

  function checkStep2(): Errors {
    const e: Errors = {};
    if (v.password.length < 6) e.password = "Use at least 6 characters.";
    if (confirm !== v.password) e.confirm = "The passwords don't match.";
    return e;
  }

  function focusFirst(e: Errors) {
    const first = Object.keys(e)[0];
    if (first) window.setTimeout(() => document.getElementById(`ra-${first}`)?.focus(), 0);
  }

  function next(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const e = checkStep1();
    setErrors(e);
    if (Object.keys(e).length) return focusFirst(e);
    setError(null);
    setStep(2);
    window.setTimeout(() => document.getElementById("ra-password")?.focus(), 0);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;
    const e = checkStep2();
    setErrors(e);
    if (Object.keys(e).length) return focusFirst(e);

    setError(null);
    setLoading(true);
    try {
      await onSubmit({
        ...v,
        fullName: v.fullName.trim(),
        email: v.email.trim(),
        businessName: v.businessName.trim(),
        whatsappNumber: v.whatsappNumber.trim(),
      });
      setDone(true);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "";
      setError(friendlyError(msg));
      if (msg.includes("email-already-in-use") || msg.includes("invalid-email")) setStep(1);
    } finally {
      setLoading(false);
    }
  }

  const first = v.fullName.trim().split(/\s+/)[0];

  return (
    <div className={`${s.root} ${fontVars}`}>
      <div className={s.wrap}>
        <div className={`${s.pic} ${r.pic}`}>
          <img src="/images/owner-cafe.webp" alt="A café owner in an apron and beanie at his counter" fetchPriority="high" decoding="async" />
          <div className={s.ptop}>
            <Link className={`${s.back} ${s.glass}`} href={backHref}>
              <Icon name="back" strokeWidth={2} />
              Back
            </Link>
            <Link className={`${s.mlogo} ${s.glass}`} href={backHref} aria-label="FlowLo home">
              <img src={LOGO_SRC} alt="" width={65} height={19} />
            </Link>
          </div>
          <div className={s.hi} aria-hidden="true">
            <p className={s.hiTitle}>Your business, in one flow.</p>
            <p>Stock, orders, deliveries and takings, all in one place. We set up every account personally.</p>
            <ul className={r.perks}>
              <li><Icon name="stock" />Stock that updates itself</li>
              <li><Icon name="orders" />Every order in one list</li>
              <li><Icon name="check" />Today&apos;s takings at a glance</li>
            </ul>
          </div>
        </div>

        <section className={s.side} aria-labelledby="ra-title">
          <div className={s.stop}>
            <img src={LOGO_SRC} alt="FlowLo" width={82} height={24} />
            <Link className={s.inv} href={signInHref}>
              Already approved? <b>Log in</b>
            </Link>
          </div>

          <div className={`${s.box} ${r.box}`}>
            {done ? (
              <div className={r.done} role="status">
                <span className={r.doneIcon} aria-hidden="true">
                  <Icon name="check" strokeWidth={2.2} />
                </span>
                <h1 className={s.h2} id="ra-title">
                  You&apos;re on the list{first ? `, ${first}` : ""}.
                </h1>
                <p className={s.sub}>
                  We&apos;ve got your request for <b>{v.businessName}</b>. We&apos;ll email{" "}
                  <b>{v.email}</b> as soon as your account is ready.
                </p>
                <ol className={r.next}>
                  <li>
                    <b>We review your request</b>
                    <span>Usually within a working day.</span>
                  </li>
                  <li>
                    <b>You get an email</b>
                    <span>Then log in with the password you just chose.</span>
                  </li>
                  <li>
                    <b>Add your first products</b>
                    <span>Takes about five minutes.</span>
                  </li>
                </ol>
                <div className={r.doneActs}>
                  <Link className={s.btn} href={signInHref}>
                    Go to log in
                  </Link>
                  <Link className={r.ghost} href={backHref}>
                    Back to home
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <div className={r.steps} aria-hidden="true">
                  <i className={r.lit} />
                  <i className={step === 2 ? r.lit : ""} />
                </div>
                <p className={r.stepText}>Step {step} of 2</p>
                <h1 className={s.h2} id="ra-title">
                  {step === 1 ? "Request access" : "Create your password"}
                </h1>
                <p className={s.sub}>
                  {step === 1
                    ? "Tell us about you and your business."
                    : "You'll use this to log in once you're approved."}
                </p>

                {error && (
                  <div className={s.alert} role="alert">
                    {error}
                  </div>
                )}

                {step === 1 ? (
                  <form className={s.form} onSubmit={next} noValidate>
                    <div className={r.two}>
                      <Field id="fullName" label="Your name" error={errors.fullName}>
                        <input className={s.inp} id="ra-fullName" autoComplete="name" placeholder="Lebo Nkosi" value={v.fullName} onChange={(e) => set("fullName")(e.target.value)} aria-invalid={!!errors.fullName || undefined} aria-describedby={errors.fullName ? "ra-fullName-err" : undefined} />
                      </Field>
                      <Field id="whatsappNumber" label="WhatsApp number" error={errors.whatsappNumber}>
                        <input className={s.inp} id="ra-whatsappNumber" type="tel" inputMode="tel" autoComplete="tel" placeholder="082 123 4567" value={v.whatsappNumber} onChange={(e) => set("whatsappNumber")(e.target.value)} aria-invalid={!!errors.whatsappNumber || undefined} aria-describedby={errors.whatsappNumber ? "ra-whatsappNumber-err" : undefined} />
                      </Field>
                    </div>
                    <Field id="email" label="Email" error={errors.email}>
                      <input className={s.inp} id="ra-email" type="email" inputMode="email" autoComplete="email" placeholder="you@business.co.za" value={v.email} onChange={(e) => set("email")(e.target.value)} aria-invalid={!!errors.email || undefined} aria-describedby={errors.email ? "ra-email-err" : undefined} />
                    </Field>
                    <Field id="businessName" label="Business name" error={errors.businessName}>
                      <input className={s.inp} id="ra-businessName" autoComplete="organization" placeholder="Thandi's Kitchen" value={v.businessName} onChange={(e) => set("businessName")(e.target.value)} aria-invalid={!!errors.businessName || undefined} aria-describedby={errors.businessName ? "ra-businessName-err" : undefined} />
                    </Field>
                    <fieldset className={r.types}>
                      <legend className={s.lbl}>What kind of business?</legend>
                      <div className={r.chips}>
                        {businessTypes.map((t) => (
                          <label key={t} className={`${r.chip} ${v.businessType === t ? r.on : ""}`}>
                            <input type="radio" name="businessType" value={t} checked={v.businessType === t} onChange={() => set("businessType")(t)} />
                            {t}
                          </label>
                        ))}
                      </div>
                    </fieldset>
                    <button className={s.btn} type="submit">
                      Continue
                    </button>
                  </form>
                ) : (
                  <form className={s.form} onSubmit={submit} noValidate>
                    <Field id="password" label="Password" error={errors.password} hint={errors.password ? undefined : "At least 6 characters."}>
                      <div className={s.pw}>
                        <input className={s.inp} id="ra-password" type={show ? "text" : "password"} autoComplete="new-password" value={v.password} onChange={(e) => set("password")(e.target.value)} aria-invalid={!!errors.password || undefined} aria-describedby={errors.password ? "ra-password-err" : "ra-password-hint"} />
                        <button className={s.eye} type="button" onClick={() => setShow((x) => !x)} aria-pressed={show} aria-label={show ? "Hide password" : "Show password"}>
                          {show ? "Hide" : "Show"}
                        </button>
                      </div>
                    </Field>
                    <Field id="confirm" label="Confirm password" error={errors.confirm}>
                      <input className={s.inp} id="ra-confirm" type={show ? "text" : "password"} autoComplete="new-password" value={confirm} onChange={(e) => { setConfirm(e.target.value); if (errors.confirm) setErrors((c) => ({ ...c, confirm: undefined })); }} aria-invalid={!!errors.confirm || undefined} aria-describedby={errors.confirm ? "ra-confirm-err" : undefined} />
                    </Field>
                    <div className={r.summary}>
                      <span>
                        <b>{v.businessName}</b>
                        {v.businessType} · {v.email}
                      </span>
                      <button type="button" onClick={() => setStep(1)}>
                        Edit
                      </button>
                    </div>
                    <p className={r.legalNote}>
                      By sending this you agree to our <Link href="/terms">Terms</Link> and{" "}
                      <Link href="/privacy">Privacy policy</Link>.
                    </p>
                    <div className={r.row}>
                      <button className={r.ghostBtn} type="button" onClick={() => setStep(1)} disabled={loading}>
                        Back
                      </button>
                      <button className={`${s.btn} ${r.grow}`} type="submit" disabled={loading} aria-busy={loading}>
                        {loading && <span className={s.spin} aria-hidden="true" />}
                        {loading ? "Sending request…" : "Send request"}
                      </button>
                    </div>
                  </form>
                )}

                <p className={`${s.alt} ${s.mOnlyBlock}`}>
                  Already approved? <Link href={signInHref}>Log in</Link>
                </p>
              </>
            )}
          </div>

          <nav className={s.legal} aria-label="Legal">
            <span>© {new Date().getFullYear()} FlowLo</span>
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
          </nav>
        </section>
      </div>
    </div>
  );
}

function Field({
  id,
  label,
  error,
  hint,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={s.field}>
      <label className={s.lbl} htmlFor={`ra-${id}`}>
        {label}
      </label>
      {children}
      {error ? (
        <p className={s.err} id={`ra-${id}-err`}>
          {error}
        </p>
      ) : hint ? (
        <p className={r.hint} id={`ra-${id}-hint`}>
          {hint}
        </p>
      ) : null}
    </div>
  );
}

function friendlyError(raw: string) {
  if (raw.includes("email-already-in-use")) {
    return "There's already an account with this email. Try logging in instead.";
  }
  if (raw.includes("invalid-email")) return "That email address doesn't look right.";
  if (raw.includes("weak-password")) return "Choose a stronger password, at least 6 characters.";
  if (raw.includes("network")) return "Can't reach FlowLo. Check your connection and try again.";
  if (raw.includes("too-many-requests")) return "Too many attempts. Wait a minute, then try again.";
  return "We couldn't send your request. Try again in a moment.";
}
