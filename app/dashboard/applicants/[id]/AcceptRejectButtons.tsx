"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AcceptRejectButtons({ applicantId, currentStatus }: { applicantId: string; currentStatus: string }) {
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
    return <p className="text-sm text-gray-400 text-center">Status: {currentStatus}</p>;
  }

  return (
    <div className="flex gap-3">
      <button onClick={() => update("ACCEPTED")} disabled={!!loading} className="flex-1 bg-foundry-green text-white py-2 rounded-xl text-sm font-medium hover:bg-foundry-green-light disabled:opacity-50 flex items-center justify-center gap-1.5">
        {loading === "ACCEPTED" && <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
        Accept
      </button>
      <button onClick={() => update("REJECTED")} disabled={!!loading} className="flex-1 border border-red-300 text-red-500 py-2 rounded-xl text-sm font-medium hover:bg-red-50 disabled:opacity-50 flex items-center justify-center gap-1.5">
        {loading === "REJECTED" && <span className="w-3.5 h-3.5 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />}
        Reject
      </button>
    </div>
  );
}
