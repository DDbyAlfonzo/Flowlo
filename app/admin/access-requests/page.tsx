"use client";

import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { EmptyState } from "@/components/empty-state";
import { ProtectedPage } from "@/components/protected-page";
import { StatusBadge } from "@/components/status-badge";
import { useAuth } from "@/hooks/use-auth";
import { formatDate, formatDateTime } from "@/lib/format";
import {
  deleteAccessRequestRecord,
  listAccessRequests,
  reviewAccessRequest,
} from "@/lib/firestore";
import { AccessRequest, AccessRequestStatus } from "@/types";

const ACCESS_TABS: Array<{
  key: AccessRequestStatus;
  label: string;
  description: string;
}> = [
  {
    key: "pending",
    label: "Pending",
    description: "New requests waiting for review.",
  },
  {
    key: "approved",
    label: "Approved",
    description: "Businesses that can now access FlowLo.",
  },
  {
    key: "rejected",
    label: "Rejected",
    description: "Requests that were not approved this time.",
  },
  {
    key: "disabled",
    label: "Disabled",
    description: "Businesses whose FlowLo access has been switched off.",
  },
];

function getStatusTone(status: AccessRequestStatus) {
  if (status === "approved") {
    return "success" as const;
  }

  if (status === "rejected" || status === "disabled") {
    return "danger" as const;
  }

  return "warning" as const;
}

export default function AdminAccessRequestsPage() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<AccessRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<AccessRequestStatus>("pending");
  const [actioningKey, setActioningKey] = useState("");
  const [feedback, setFeedback] = useState<{
    tone: "success" | "danger";
    message: string;
  } | null>(null);

  const loadRequests = async () => {
    setLoading(true);

    try {
      const nextRequests = await listAccessRequests();
      setRequests(nextRequests);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      return;
    }

    void loadRequests();
  }, [user]);

  const filteredRequests = useMemo(
    () => requests.filter((request) => request.status === activeTab),
    [activeTab, requests],
  );

  const counts = useMemo(
    () =>
      requests.reduce<Record<AccessRequestStatus, number>>(
        (totals, request) => {
          totals[request.status] += 1;
          return totals;
        },
        {
          pending: 0,
          approved: 0,
          rejected: 0,
          disabled: 0,
        },
      ),
    [requests],
  );

  const handleStatusChange = async (
    request: AccessRequest,
    status: Extract<AccessRequestStatus, "approved" | "rejected" | "disabled">,
  ) => {
    if (!user?.email) {
      return;
    }

    const actionLabel =
      status === "approved"
        ? request.status === "disabled"
          ? "Re-enable"
          : "Approve"
        : status === "disabled"
          ? "Disable"
          : "Reject";

    const confirmed = window.confirm(`${actionLabel} access for ${request.fullName}?`);

    if (!confirmed) {
      return;
    }

    setActioningKey(`${request.id}:${status}`);
    setFeedback(null);

    try {
      await reviewAccessRequest(request.id, status, user.email);
      await loadRequests();
      setFeedback({
        tone: "success",
        message:
          status === "approved"
            ? `${request.fullName} has been approved.`
            : status === "disabled"
              ? `${request.fullName} has been disabled.`
              : `${request.fullName} has been rejected.`,
      });
    } catch (reviewError) {
      setFeedback({
        tone: "danger",
        message:
          reviewError instanceof Error
            ? reviewError.message
            : "We could not update that access request.",
      });
    } finally {
      setActioningKey("");
    }
  };

  const handleDelete = async (request: AccessRequest) => {
    const confirmed = window.confirm(
      `Delete the access record for ${request.fullName}? This removes the FlowLo app access record only. Their Firebase Auth account will still exist until you remove it separately from Firebase Console or Admin SDK.`,
    );

    if (!confirmed) {
      return;
    }

    setActioningKey(`${request.id}:delete`);
    setFeedback(null);

    try {
      await deleteAccessRequestRecord(request.id);
      await loadRequests();
      setFeedback({
        tone: "success",
        message: `${request.fullName}'s access record has been deleted. Firebase Auth still needs separate removal if you want the account deleted entirely.`,
      });
    } catch (deleteError) {
      setFeedback({
        tone: "danger",
        message:
          deleteError instanceof Error
            ? deleteError.message
            : "We could not delete that access record.",
      });
    } finally {
      setActioningKey("");
    }
  };

  return (
    <ProtectedPage requireAccess="admin" requireBusiness={false}>
      <AppShell
        showNav={false}
        shellTitle="Managed access"
        shellSubtitle="Review requests, manage approved users, and control FlowLo access."
      >
        <div className="mb-6 flex w-full max-w-full min-w-0 flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0 flex-1">
            <p className="eyebrow-label">Admin</p>
            <h2 className="section-title mt-3">Access requests and users</h2>
            <p className="section-copy mt-3 max-w-2xl leading-7 [overflow-wrap:anywhere] sm:leading-8">
              Review new businesses, manage approved users, and disable or remove app access when needed.
            </p>
          </div>
        </div>

        {feedback ? (
          <div
            className={`mb-6 rounded-[1.6rem] border px-5 py-4 text-sm leading-7 backdrop-blur-xl ${
              feedback.tone === "success"
                ? "border-romano-mintText/20 bg-romano-mint text-romano-mintText"
                : "border-romano-roseText/20 bg-romano-rose text-romano-roseText"
            }`}
          >
            {feedback.message}
          </div>
        ) : null}

        <section className="grid gap-4 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="card-surface p-6 sm:p-7">
            <p className="eyebrow-label">Review queue</p>
            <h3 className="mt-4 text-2xl font-semibold tracking-[-0.05em] text-romano-ink">
              Manage access with intention.
            </h3>
            <p className="mt-3 text-sm leading-7 text-romano-slate">
              FlowLo uses managed access permanently, so every business is reviewed
              before it reaches products, orders, deliveries, and the dashboard.
            </p>

            <div className="mt-6 grid gap-3">
              {ACCESS_TABS.map((tab) => {
                const active = tab.key === activeTab;

                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveTab(tab.key)}
                    className={`surface-muted flex items-start justify-between gap-4 p-4 text-left transition duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-romano-navy focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ink)] ${
                      active ? "border-romano-navy/35 bg-[linear-gradient(180deg,rgba(62,242,207,0.08),rgba(255,255,255,0.03))]" : ""
                    }`}
                  >
                    <div>
                      <p className="text-sm font-semibold text-romano-ink">
                        {tab.label}
                      </p>
                      <p className="mt-2 text-sm leading-7 text-romano-slate">
                        {tab.description}
                      </p>
                    </div>
                    <div className="shrink-0 rounded-2xl border border-romano-line bg-white/[0.03] px-3 py-2 text-sm font-semibold text-romano-ink">
                      {counts[tab.key]}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="card-surface p-6 sm:p-7">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="eyebrow-label">{activeTab}</p>
                <h3 className="mt-3 text-2xl font-semibold tracking-[-0.05em] text-romano-ink">
                  {ACCESS_TABS.find((tab) => tab.key === activeTab)?.label} access records
                </h3>
                <p className="mt-2 text-sm leading-7 text-romano-slate">
                  Review details, then approve, reject, disable, re-enable, or remove app access.
                </p>
              </div>
              <button
                type="button"
                className="secondary-button"
                onClick={() => void loadRequests()}
                disabled={loading}
              >
                {loading ? "Refreshing..." : "Refresh"}
              </button>
            </div>

            <div className="mt-6 grid gap-4">
              {!loading && !filteredRequests.length ? (
                <EmptyState
                  title={`No ${activeTab} records`}
                  description={
                    activeTab === "pending"
                      ? "New access requests will appear here as businesses join FlowLo."
                      : activeTab === "approved"
                        ? "Approved businesses will appear here once you start reviewing requests."
                        : activeTab === "disabled"
                          ? "Disabled businesses will appear here once you switch off access."
                        : "Rejected requests will appear here if you decline access."
                  }
                />
              ) : null}

              {loading ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="surface-elevated p-5">
                    <div className="h-5 w-40 rounded-full bg-white/8" />
                    <div className="mt-4 h-4 w-56 rounded-full bg-white/6" />
                    <div className="mt-6 h-24 rounded-[1.35rem] bg-white/5" />
                  </div>
                ))
              ) : null}

              {!loading
                ? filteredRequests.map((request) => (
                    <div key={request.id} className="surface-elevated p-5 sm:p-6">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <p className="text-xl font-semibold tracking-[-0.04em] text-romano-ink">
                            {request.fullName}
                          </p>
                          <p className="mt-2 text-sm text-romano-slate">{request.email}</p>
                        </div>
                        <StatusBadge
                          tone={getStatusTone(request.status)}
                          label={request.status}
                        />
                      </div>

                      <div className="mt-5 grid gap-3 sm:grid-cols-2">
                        <div className="surface-muted p-4">
                          <p className="field-label">Business Name</p>
                          <p className="mt-3 text-sm leading-7 text-romano-ink">
                            {request.businessName}
                          </p>
                        </div>
                        <div className="surface-muted p-4">
                          <p className="field-label">Business Type</p>
                          <p className="mt-3 text-sm leading-7 text-romano-ink">
                            {request.businessType}
                          </p>
                        </div>
                        <div className="surface-muted p-4">
                          <p className="field-label">WhatsApp Number</p>
                          <p className="mt-3 text-sm leading-7 text-romano-ink">
                            {request.whatsappNumber}
                          </p>
                        </div>
                        <div className="surface-muted p-4">
                          <p className="field-label">Requested On</p>
                          <p className="mt-3 text-sm leading-7 text-romano-ink">
                            {formatDate(request.createdAt)}
                          </p>
                        </div>
                      </div>

                      {request.reviewedAt || request.reviewedBy ? (
                        <div className="mt-4 rounded-[1.35rem] border border-romano-line bg-white/[0.03] px-4 py-3 text-sm leading-7 text-romano-slate">
                          Reviewed{" "}
                          {request.reviewedAt ? formatDateTime(request.reviewedAt) : "just now"}
                          {request.reviewedBy ? ` by ${request.reviewedBy}` : ""}
                        </div>
                      ) : null}

                      <div className="mt-5 grid gap-3 sm:flex sm:flex-wrap">
                        {request.status === "pending" || request.status === "rejected" || request.status === "disabled" ? (
                          <button
                            type="button"
                            className="secondary-button"
                            disabled={actioningKey.startsWith(`${request.id}:`)}
                            onClick={() => void handleStatusChange(request, "approved")}
                          >
                            {actioningKey === `${request.id}:approved`
                              ? request.status === "disabled"
                                ? "Re-enabling..."
                                : "Approving..."
                              : request.status === "disabled"
                                ? "Re-enable"
                                : "Approve"}
                          </button>
                        ) : null}

                        {request.status === "pending" || request.status === "approved" ? (
                          <button
                            type="button"
                            className="secondary-button"
                            disabled={actioningKey.startsWith(`${request.id}:`)}
                            onClick={() => void handleStatusChange(request, "rejected")}
                          >
                            {actioningKey === `${request.id}:rejected`
                              ? "Rejecting..."
                              : "Reject"}
                          </button>
                        ) : null}

                        {request.status === "approved" ? (
                          <button
                            type="button"
                            className="secondary-button"
                            disabled={actioningKey.startsWith(`${request.id}:`)}
                            onClick={() => void handleStatusChange(request, "disabled")}
                          >
                            {actioningKey === `${request.id}:disabled`
                              ? "Disabling..."
                              : "Disable"}
                          </button>
                        ) : null}

                        <button
                          type="button"
                          className="inline-flex min-h-[2.9rem] items-center justify-center rounded-2xl border border-romano-roseText/24 bg-romano-rose px-5 py-3 text-sm font-semibold text-romano-roseText transition duration-300 hover:-translate-y-0.5 hover:border-romano-roseText/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-romano-navy focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ink)]"
                          disabled={actioningKey.startsWith(`${request.id}:`)}
                          onClick={() => void handleDelete(request)}
                        >
                          {actioningKey === `${request.id}:delete`
                            ? "Deleting..."
                            : "Delete Access Record"}
                        </button>
                      </div>
                    </div>
                  ))
                : null}
            </div>
          </div>
        </section>
      </AppShell>
    </ProtectedPage>
  );
}
