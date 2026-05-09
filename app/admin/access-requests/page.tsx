"use client";

import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { ProtectedPage } from "@/components/protected-page";
import { StatusBadge } from "@/components/status-badge";
import { useAuth } from "@/hooks/use-auth";
import { formatDate, formatDateTime } from "@/lib/format";
import { listAccessRequests, reviewAccessRequest } from "@/lib/firestore";
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
];

function getStatusTone(status: AccessRequestStatus) {
  if (status === "approved") {
    return "success" as const;
  }

  if (status === "rejected") {
    return "danger" as const;
  }

  return "warning" as const;
}

export default function AdminAccessRequestsPage() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<AccessRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<AccessRequestStatus>("pending");
  const [actioningId, setActioningId] = useState("");
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
        },
      ),
    [requests],
  );

  const handleReview = async (
    request: AccessRequest,
    status: Extract<AccessRequestStatus, "approved" | "rejected">,
  ) => {
    if (!user?.email) {
      return;
    }

    const confirmed = window.confirm(
      `${
        status === "approved" ? "Approve" : "Reject"
      } access for ${request.fullName}?`,
    );

    if (!confirmed) {
      return;
    }

    setActioningId(request.id);
    setFeedback(null);

    try {
      await reviewAccessRequest(request.id, status, user.email);
      await loadRequests();
      setFeedback({
        tone: "success",
        message:
          status === "approved"
            ? `${request.fullName} has been approved.`
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
      setActioningId("");
    }
  };

  return (
    <ProtectedPage requireAccess="admin" requireBusiness={false}>
      <AppShell
        showNav={false}
        shellTitle="Managed access"
        shellSubtitle="Review, approve, and reject FlowLo access requests."
      >
        <PageHeader
          eyebrow="Admin"
          title="Access requests"
          description="Review every request before a business gets into the FlowLo dashboard."
        />

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
              before it reaches products, orders, and the dashboard.
            </p>

            <div className="mt-6 grid gap-3">
              {ACCESS_TABS.map((tab) => {
                const active = tab.key === activeTab;

                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveTab(tab.key)}
                    className={`surface-muted flex items-start justify-between gap-4 p-4 text-left transition duration-300 hover:-translate-y-0.5 ${
                      active ? "border-romano-navy/35 bg-[linear-gradient(180deg,rgba(62,242,207,0.08),rgba(255,255,255,0.03))]" : ""
                    }`}
                  >
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.22em] text-romano-amberText">
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
                  {ACCESS_TABS.find((tab) => tab.key === activeTab)?.label} requests
                </h3>
                <p className="mt-2 text-sm leading-7 text-romano-slate">
                  Review request details, then approve or reject with one action.
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
                  title={`No ${activeTab} requests`}
                  description={
                    activeTab === "pending"
                      ? "New access requests will appear here as businesses join FlowLo."
                      : activeTab === "approved"
                        ? "Approved businesses will appear here once you start reviewing requests."
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

                      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                        <button
                          type="button"
                          className="primary-button"
                          disabled={
                            actioningId === request.id || request.status === "approved"
                          }
                          onClick={() => void handleReview(request, "approved")}
                        >
                          {actioningId === request.id && request.status !== "approved"
                            ? "Updating..."
                            : request.status === "approved"
                              ? "Approved"
                              : "Approve"}
                        </button>
                        <button
                          type="button"
                          className="secondary-button"
                          disabled={
                            actioningId === request.id || request.status === "rejected"
                          }
                          onClick={() => void handleReview(request, "rejected")}
                        >
                          {actioningId === request.id && request.status !== "rejected"
                            ? "Updating..."
                            : request.status === "rejected"
                              ? "Rejected"
                              : "Reject"}
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
