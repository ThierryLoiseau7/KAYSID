"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Home, Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [magicSent, setMagicSent] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    // TODO: konekte ak Supabase auth
    // const { error } = await supabase.auth.signInWithPassword({ email, password })
    // if (error) { setError(error.message); setLoading(false); return; }

    // Mock login pou demo
    await new Promise((r) => setTimeout(r, 800));
    router.push("/dashboard");
  }

  async function handleMagicLink() {
    if (!email) {
      setError("Mete adrès email ou dabò.");
      return;
    }
    setLoading(true);
    setError("");

    // TODO: const { error } = await supabase.auth.signInWithOtp({ email })
    await new Promise((r) => setTimeout(r, 800));
    setMagicSent(true);
    setLoading(false);
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-gradient-to-b from-caribbean-950 to-caribbean-800">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Home className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">
            Kay<span className="text-caribbean-300">Sid</span>
          </h1>
          <p className="text-caribbean-200 text-sm mt-1">Konekte nan kont ou</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {magicSent ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="font-bold text-slate-900 text-lg mb-2">Tcheke Email Ou!</h2>
              <p className="text-slate-500 text-sm mb-6">
                Nou voye yon lyen koneksyon nan{" "}
                <strong className="text-slate-700">{email}</strong>. Klike lyen an pou konekte.
              </p>
              <button
                onClick={() => { setMagicSent(false); setEmail(""); }}
                className="btn-secondary text-sm"
              >
                Retounen
              </button>
            </div>
          ) : (
            <>
              <h2 className="font-bold text-slate-900 text-xl mb-6">Bon Tounen!</h2>

              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 mb-5">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {error}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Adrès Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ou@gmail.com"
                      required
                      className="input-field pl-10"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-sm font-medium text-slate-700">Modpas</label>
                    <Link
                      href="/forgot-password"
                      className="text-xs text-caribbean-600 hover:text-caribbean-800 transition-colors"
                    >
                      Bliye modpas?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="input-field pl-10 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full py-3 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Koneksyon...
                    </span>
                  ) : (
                    <>
                      Konekte
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-3 my-5">
                <div className="flex-1 h-px bg-slate-200" />
                <span className="text-xs text-slate-400">oswa</span>
                <div className="flex-1 h-px bg-slate-200" />
              </div>

              {/* Magic link */}
              <button
                onClick={handleMagicLink}
                disabled={loading}
                className="btn-secondary w-full py-3 text-sm disabled:opacity-60"
              >
                <Mail className="w-4 h-4" />
                Konekte san modpas (Magic Link)
              </button>

              <p className="text-center text-sm text-slate-500 mt-6">
                Pa gen kont?{" "}
                <Link href="/register" className="text-caribbean-600 font-semibold hover:text-caribbean-800 transition-colors">
                  Enskri gratis
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
