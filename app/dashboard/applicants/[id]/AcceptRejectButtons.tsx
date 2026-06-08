"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const BTN_CSS = `
  .decision-row { display: flex; gap: 12px; }
  .decision-btn { flex: 1; display: flex; align-items: center; justify-content: center; gap: 8px; font-family: "Archivo"; font-weight: 700; font-size: 15px; padding: 14px 24px; border-radius: 12px; border: none; cursor: pointer; transition: opacity .15s, transform .15s; }
  .decision-btn:hover { transform: translateY(-1px); }
  .decision-btn:disabled { opacity: 0.45; cursor: default; transform: none; }
  .decision-btn.accept { background: var(--forest); color: var(--cream); }
  .decision-btn.reject { background: transparent; color: var(--clay-deep); border: 2px solid var(--line-lt); }
  .decision-btn.reject:hover { border-color: var(--clay-deep); }
  .decision-status { font-family: "Space Mono"; font-size: 13px; color: var(--muted-lt); text-align: center; padding: 14px; }
  .spin { width: 14px; height: 14px; border: 2px solid currentColor; border-top-color: transparent; border-radius: 50%; animation: spin .6s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
`;

export default function AcceptRejectButtons({
  applicantId,
  currentStatus,
}: {
  applicantId: string;
  currentStatus: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState<"ACCEPTED" | "REJECTED" | null>(null);

  const update = async (status: "ACCEPTED" | "REJECTED") => {
    if (loading) return;
    setLoading(status);
    await fetch("/api/applicants", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ applicantId, status }),
    });
    setLoading(null);
    router.refresh();
  };

  if (currentStatus === "ACCEPTED" || currentStatus === "REJECTED") {
    return (
      <>
        <style>{BTN_CSS}</style>
        <div className="decision-status">
          Status locked: <strong>{currentStatus}</strong>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{BTN_CSS}</style>
      <div className="decision-row">
        <button
          className="decision-btn accept"
          onClick={() => update("ACCEPTED")}
          disabled={!!loading}
        >
          {loading === "ACCEPTED" && <span className="spin" />}
          Accept applicant
        </button>
        <button
          className="decision-btn reject"
          onClick={() => update("REJECTED")}
          disabled={!!loading}
        >
          {loading === "REJECTED" && <span className="spin" />}
          Reject
        </button>
      </div>
    </>
  );
}
