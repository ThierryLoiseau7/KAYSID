"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Home, User, Mail, Lock, Phone, Eye, EyeOff, ArrowRight, AlertCircle, BadgeCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { UserRole } from "@/types";

const ROLES: { value: UserRole; label: string; desc: string; icon: string }[] = [
  {
    value: "tenant",
    label: "Lokatè",
    desc: "Mwen chèche kay pou lwaye",
    icon: "🏠",
  },
  {
    value: "owner",
    label: "Mèt Kay",
    desc: "Mwen gen pwopriyete pou poste",
    icon: "🔑",
  },
  {
    value: "agent",
    label: "Ajan Demachaj",
    desc: "Mwen jere anpil pwopriyete",
    icon: "💼",
  },
];

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<UserRole>("tenant");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) {
      setError("Modpas dwe gen omwen 8 karaktè.");
      return;
    }
    setLoading(true);
    setError("");

    let supabase;
    try {
      supabase = createClient();
    } catch {
      setError("Sèvis otantifikasyon pa disponib. Eseye ankò.");
      setLoading(false);
      return;
    }
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, role },
        emailRedirectTo: `${window.location.origin}/dashboard`,
      },
    });

    if (error) {
      console.error("signUp error:", error.message);
      setError(error.message === "User already registered"
        ? "Email sa a deja itilize. Eseye konekte."
        : error.message);
      setLoading(false);
      return;
    }

    if (!data.user) {
      setError("Kont kreye men li oblije konfime email — tcheke inbox ou.");
      setLoading(false);
      return;
    }

    // Mete jou profil ak phone/whatsapp (trigger kreye profil la deja)
    if (data.user && phone) {
      await supabase
        .from("profiles")
        .update({ phone, whatsapp: phone.replace(/\D/g, "") })
        .eq("id", data.user.id);
    }

    setSuccess(true);
    setLoading(false);
  }

  if (success) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-gradient-to-b from-caribbean-950 to-caribbean-800">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <BadgeCheck className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Bienveni nan PouPiyay!</h2>
            <p className="text-slate-500 text-sm mb-2">
              Kont ou kreye pou <strong className="text-slate-700">{fullName}</strong>.
            </p>
            <p className="text-slate-500 text-sm mb-8">
              Tcheke email ou pou konfime kont ou epi kòmanse itilize platfòm nan.
            </p>
            <div className="flex flex-col gap-3">
              <Link href="/dashboard" className="btn-primary justify-center">
                Ale nan Tableau de Bò
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/listings" className="btn-secondary justify-center text-sm">
                Chèche Kay Kounye a
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
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
          <p className="text-caribbean-200 text-sm mt-1">Konto gratis — toujou</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Progress */}
          <div className="flex items-center gap-2 mb-6">
            {[1, 2].map((s) => (
              <div
                key={s}
                className={`flex-1 h-1.5 rounded-full transition-all ${
                  s <= step ? "bg-caribbean-600" : "bg-slate-200"
                }`}
              />
            ))}
            <span className="text-xs text-slate-400 ml-1">{step}/2</span>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 mb-5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          {/* STEP 1 — Choose role */}
          {step === 1 && (
            <div>
              <h2 className="font-bold text-slate-900 text-xl mb-1">Kiyès ou ye?</h2>
              <p className="text-slate-500 text-sm mb-6">Chwazi kalite kont ou vle kreye</p>

              <div className="space-y-3">
                {ROLES.map(({ value, label, desc, icon }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setRole(value)}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all ${
                      role === value
                        ? "border-caribbean-600 bg-caribbean-50"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <span className="text-2xl">{icon}</span>
                    <div>
                      <p className={`font-semibold text-sm ${role === value ? "text-caribbean-700" : "text-slate-800"}`}>
                        {label}
                      </p>
                      <p className="text-xs text-slate-500">{desc}</p>
                    </div>
                    {role === value && (
                      <div className="ml-auto w-5 h-5 bg-caribbean-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setStep(2)}
                className="btn-primary w-full py-3 mt-6"
              >
                Kontinye
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* STEP 2 — Fill details */}
          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="font-bold text-slate-900 text-xl mb-4">Enfòmasyon Ou</h2>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Non Konplè
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Jean-Pierre Baptiste"
                    required
                    className="input-field pl-10"
                  />
                </div>
              </div>

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
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Nimewo WhatsApp{" "}
                  <span className="text-slate-400 text-xs">(pou kontakt)</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="509 3600-0000"
                    className="input-field pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Modpas
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Omwen 8 karaktè"
                    required
                    minLength={8}
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
                {/* Password strength */}
                <div className="flex gap-1 mt-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={`flex-1 h-1 rounded-full transition-all ${
                        password.length >= i * 2
                          ? password.length >= 10
                            ? "bg-green-500"
                            : "bg-yellow-400"
                          : "bg-slate-200"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <p className="text-xs text-slate-400">
                Lè ou enskri, ou aksepte{" "}
                <Link href="/terms" className="text-caribbean-600 hover:underline">
                  Kondisyon Itilizasyon
                </Link>{" "}
                ak{" "}
                <Link href="/privacy" className="text-caribbean-600 hover:underline">
                  Konfidansyalite
                </Link>{" "}
                PouPiyay.
              </p>

              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="btn-secondary flex-1 py-3 text-sm"
                >
                  Retounen
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary flex-1 py-3 disabled:opacity-60"
                >
                  {loading ? (
                    <span className="flex items-center gap-2 justify-center">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Kap kreye...
                    </span>
                  ) : (
                    <>
                      Kreye Kont
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          <p className="text-center text-sm text-slate-500 mt-6">
            Genyen kont deja?{" "}
            <Link href="/login" className="text-caribbean-600 font-semibold hover:text-caribbean-800 transition-colors">
              Konekte
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
