"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";

const SECURITY_QUESTIONS = [
  "What was the name of your first pet?",
  "What is your mother's maiden name?",
  "What city were you born in?",
  "What is your favorite book?"
];

export default function AdminLoginPage() {
  const [setupRequired, setSetupRequired] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [serverQuestion, setServerQuestion] = useState("");
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [securityQuestion, setSecurityQuestion] = useState(SECURITY_QUESTIONS[0]);
  const [securityAnswer, setSecurityAnswer] = useState("");
  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  
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
        } else {
          setServerQuestion(data.securityQuestion || "");
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

    if ((setupRequired || isForgotPassword) && password !== confirmPassword) {
      setError("Passwords do not match.");
      setActionLoading(false);
      return;
    }

    try {
      let bodyData = {};
      
      if (isForgotPassword) {
        bodyData = {
          action: "reset",
          securityAnswer,
          newPassword: password
        };
      } else {
        bodyData = {
          password,
          setup: setupRequired,
          securityQuestion: setupRequired ? securityQuestion : undefined,
          securityAnswer: setupRequired ? securityAnswer : undefined,
        };
      }

      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        if (isForgotPassword) {
          setResetSuccess(true);
          setTimeout(() => {
            setIsForgotPassword(false);
            setResetSuccess(false);
            setPassword("");
            setConfirmPassword("");
            setSecurityAnswer("");
          }, 2000);
        } else {
          router.push("/admin/dashboard");
        }
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

  let title = "Admin Portal";
  let subtitle = "Please enter your password to access the dashboard";
  let submitText = "Sign In";

  if (setupRequired) {
    title = "Register Admin Portal";
    subtitle = "Create a secure password and security question";
    submitText = "Register & Sign In";
  } else if (isForgotPassword) {
    title = "Reset Password";
    subtitle = "Answer your security question to reset password";
    submitText = "Reset Password";
  }

  return (
    <div className="bg-amber-50 min-h-[70vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 glass-card p-8 rounded-3xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
        
        <div className="text-center">
          <div className="inline-flex justify-center mb-4">
            <Logo className="w-12 h-12 text-emerald-800" showText={false} />
          </div>
          <h2 className="font-serif text-3xl text-emerald-950 font-bold tracking-wide">
            {title}
          </h2>
          <p className="mt-2 text-sm text-emerald-950/60 font-sans">
            {subtitle}
          </p>
        </div>

        {resetSuccess ? (
          <div className="text-center py-8">
            <div className="text-emerald-700 font-bold text-lg mb-2">Password Reset Successful!</div>
            <p className="text-sm text-emerald-950/70">Returning to login screen...</p>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleAuth}>
            <div className="space-y-4">
              
              {/* Setup Flow: Security Question Select */}
              {setupRequired && (
                <div>
                  <label htmlFor="securityQuestion" className="block text-xs font-semibold text-emerald-950/70 uppercase tracking-wider mb-2">
                    Security Question
                  </label>
                  <select
                    id="securityQuestion"
                    required
                    className="appearance-none rounded-xl relative block w-full px-4 py-3 border border-emerald-900/10 text-emerald-950 bg-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-800 focus:border-transparent text-sm font-sans"
                    value={securityQuestion}
                    onChange={(e) => setSecurityQuestion(e.target.value)}
                  >
                    {SECURITY_QUESTIONS.map(q => (
                      <option key={q} value={q}>{q}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Forgot Password Flow: Show their Question */}
              {isForgotPassword && (
                <div className="bg-white/40 p-4 rounded-xl border border-emerald-900/10">
                  <div className="text-xs font-semibold text-emerald-950/70 uppercase tracking-wider mb-1">Your Question:</div>
                  <div className="text-sm font-medium text-emerald-950">{serverQuestion || "No security question configured."}</div>
                </div>
              )}

              {/* Security Answer Input (Setup & Forgot) */}
              {(setupRequired || (isForgotPassword && serverQuestion)) && (
                <div>
                  <label htmlFor="securityAnswer" className="sr-only">Secret Answer</label>
                  <input
                    id="securityAnswer"
                    type="text"
                    required
                    className="appearance-none rounded-xl relative block w-full px-4 py-3 border border-emerald-900/10 placeholder-emerald-950/40 text-emerald-950 bg-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-800 focus:border-transparent text-sm font-sans"
                    placeholder="Your Secret Answer"
                    value={securityAnswer}
                    onChange={(e) => setSecurityAnswer(e.target.value)}
                  />
                </div>
              )}

              {/* Password Input */}
              {(!isForgotPassword || serverQuestion) && (
                <div>
                  <label htmlFor="password" className="sr-only">Password</label>
                  <input
                    id="password"
                    type="password"
                    required
                    minLength={6}
                    className="appearance-none rounded-xl relative block w-full px-4 py-3 border border-emerald-900/10 placeholder-emerald-950/40 text-emerald-950 bg-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-800 focus:border-transparent text-sm font-sans"
                    placeholder={(setupRequired || isForgotPassword) ? "Create Password (min 6 chars)" : "Admin Password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              )}
              
              {/* Confirm Password Input (Setup & Forgot) */}
              {(setupRequired || (isForgotPassword && serverQuestion)) && (
                <div>
                  <label htmlFor="confirmPassword" className="sr-only">Confirm Password</label>
                  <input
                    id="confirmPassword"
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
                disabled={actionLoading || (isForgotPassword && !serverQuestion)}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-emerald-800 hover:bg-emerald-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-800 tracking-wider uppercase transition-all duration-300 disabled:opacity-50 font-sans cursor-pointer"
              >
                {actionLoading ? "Processing..." : submitText}
              </button>
            </div>
            
            {/* Toggle Forgot Password Mode */}
            {!setupRequired && serverQuestion && (
              <div className="text-center mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsForgotPassword(!isForgotPassword);
                    setError("");
                    setPassword("");
                    setSecurityAnswer("");
                    setConfirmPassword("");
                  }}
                  className="text-xs text-emerald-800 hover:text-emerald-950 font-medium transition-colors"
                >
                  {isForgotPassword ? "Back to Login" : "Forgot Password?"}
                </button>
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
