"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";

export default function AdminLoginPage() {
  const [setupRequired, setSetupRequired] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    checkSetupState();
  }, []);

  const checkSetupState = async () => {
    const timeout = setTimeout(() => {
      setLoading(false);
      setError("Connection timed out. Showing login screen.");
    }, 4000);

    try {
      const res = await fetch("/api/auth");
      const data = await res.json();
      clearTimeout(timeout);
      if (res.ok) {
        if (data.setupRequired) {
          setSetupRequired(true);
        } else if (data.authenticated) {
          router.push("/admin/dashboard");
        }
      }
    } catch (err) {
      clearTimeout(timeout);
      setError("Unable to connect to authentication server.");
    } finally {
      setLoading(false);
    }
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setError("");
    setActionLoading(true);

    if (setupRequired && password !== confirmPassword) {
      setError("Passwords do not match.");
      setActionLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password,
          setup: setupRequired,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        router.push("/admin/dashboard");
      } else {
        setError(data.message || "Authentication failed.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-amber-50 min-h-[70vh] flex items-center justify-center font-sans">
        <div className="text-emerald-950 font-semibold tracking-widest text-sm animate-pulse uppercase">
          Initializing portal...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-amber-50 min-h-[70vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 glass-card p-8 rounded-3xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
        
        <div className="text-center">
          <div className="inline-flex justify-center mb-4">
            <Logo className="w-12 h-12 text-emerald-800" showText={false} />
          </div>
          <h2 className="font-serif text-3xl text-emerald-950 font-bold tracking-wide">
            {setupRequired ? "Register Admin Portal" : "Admin Portal"}
          </h2>
          <p className="mt-2 text-sm text-emerald-950/60 font-sans">
            {setupRequired 
              ? "Create a secure administrative password to manage the catalog"
              : "Please enter your password to access the dashboard"}
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleAuth}>
          <div className="space-y-4">
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={6}
                className="appearance-none rounded-xl relative block w-full px-4 py-3 border border-emerald-900/10 placeholder-emerald-950/40 text-emerald-950 bg-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-800 focus:border-transparent text-sm font-sans"
                placeholder={setupRequired ? "Create Password (min 6 chars)" : "Admin Password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            
            {setupRequired && (
              <div>
                <label htmlFor="confirmPassword" className="sr-only">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  className="appearance-none rounded-xl relative block w-full px-4 py-3 border border-emerald-900/10 placeholder-emerald-950/40 text-emerald-950 bg-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-800 focus:border-transparent text-sm font-sans"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            )}
          </div>

          {error && (
            <div className="text-red-700 text-xs font-semibold bg-red-50 p-3 rounded-lg border border-red-100 font-sans animate-shake">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={actionLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-emerald-800 hover:bg-emerald-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-800 tracking-wider uppercase transition-all duration-300 disabled:opacity-50 font-sans cursor-pointer"
            >
              {actionLoading 
                ? "Processing..." 
                : (setupRequired ? "Register & Sign In" : "Sign In")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
