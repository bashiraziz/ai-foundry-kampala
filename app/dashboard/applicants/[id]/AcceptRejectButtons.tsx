"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AcceptRejectButtons({ applicantId, currentStatus }: { applicantId: string; currentStatus: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const update = async (status: string) => {
    setLoading(true);
    await fetch("/api/applicants", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ applicantId, status }),
    });
    setLoading(false);
    router.refresh();
  };

  if (currentStatus === "ACCEPTED" || currentStatus === "REJECTED") {
    return <p className="text-sm text-gray-400 text-center">Status: {currentStatus}</p>;
  }

  return (
    <div className="flex gap-3">
      <button onClick={() => update("ACCEPTED")} disabled={loading} className="flex-1 bg-foundry-green text-white py-2 rounded-xl text-sm font-medium hover:bg-foundry-green-light disabled:opacity-50">
        Accept
      </button>
      <button onClick={() => update("REJECTED")} disabled={loading} className="flex-1 border border-red-300 text-red-500 py-2 rounded-xl text-sm font-medium hover:bg-red-50 disabled:opacity-50">
        Reject
      </button>
    </div>
  );
}
