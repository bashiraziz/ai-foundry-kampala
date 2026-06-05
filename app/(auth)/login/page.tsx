"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/sign-in/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) throw new Error("Invalid credentials");
      router.push("/dashboard");
    } catch {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-8 w-full max-w-sm space-y-4">
      <div className="text-center">
        <img src="/brand/lockup-horizontal.svg" alt="The AI Foundry Kampala" className="h-10 mx-auto mb-2" />
        <h1 className="text-xl font-bold text-gray-800 mt-2">Facilitator Login</h1>
        <p className="text-sm text-gray-500">AI Foundry Kampala Dashboard</p>
      </div>
      {error && <p className="text-red-500 text-sm text-center">{error}</p>}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-foundry-green"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && login()}
        className="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-foundry-green"
      />
      <button
        onClick={login}
        disabled={loading}
        className="w-full bg-foundry-green text-white py-2 rounded-xl font-medium text-sm hover:bg-foundry-green-light disabled:opacity-50"
      >
        {loading ? "Signing in…" : "Sign in"}
      </button>
    </div>
  );
}
