"use client";

import { useState } from "react";
import {
  Lock, ShieldCheck, Users, CheckCircle, AlertCircle, Loader2, LogOut,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { updateRole } from "@/app/actions/profile";

const ROLES = [
  { value: "tenant", label: "Lokatè",   desc: "M ap chèche yon kay pou lwaye"      },
  { value: "owner",  label: "Mèt Kay",  desc: "M gen pwopriyete pou loye oswa vann" },
  { value: "agent",  label: "Ajan",     desc: "M se yon ajan imobilye pwofesyonèl"  },
] as const;

interface Props {
  currentRole: string;
  email: string;
}

export default function SettingsClient({ currentRole, email }: Props) {
  // ── Password ────────────────────────────────────────────────────────────────
  const [pw, setPw]           = useState({ newPw: "", confirm: "" });
  const [pwLoading, setPwLoading] = useState(false);
  const [pwMsg, setPwMsg]     = useState<{ ok: boolean; text: string } | null>(null);

  async function handlePasswordChange() {
    if (pw.newPw.length < 6) {
      setPwMsg({ ok: false, text: "Modpas dwe gen omwen 6 karaktè." });
      return;
    }
    if (pw.newPw !== pw.confirm) {
      setPwMsg({ ok: false, text: "Modpas yo pa matche." });
      return;
    }
    setPwLoading(true);
    setPwMsg(null);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password: pw.newPw });
    setPwLoading(false);
    if (error) {
      setPwMsg({ ok: false, text: error.message });
    } else {
      setPwMsg({ ok: true, text: "Modpas chanje avèk siksè!" });
      setPw({ newPw: "", confirm: "" });
    }
  }

  // ── Role ────────────────────────────────────────────────────────────────────
  const [role, setRole]           = useState(currentRole);
  const [roleLoading, setRoleLoading] = useState(false);
  const [roleMsg, setRoleMsg]     = useState<{ ok: boolean; text: string } | null>(null);

  async function handleRoleChange() {
    if (role === currentRole) {
      setRoleMsg({ ok: false, text: "Wòl la pa chanje." });
      return;
    }
    setRoleLoading(true);
    setRoleMsg(null);
    const result = await updateRole(role);
    setRoleLoading(false);
    if (result.error) {
      setRoleMsg({ ok: false, text: result.error });
    } else {
      setRoleMsg({ ok: true, text: "Wòl ou ajou avèk siksè!" });
    }
  }

  // ── Sign out all ─────────────────────────────────────────────────────────────
  const [signOutLoading, setSignOutLoading] = useState(false);

  async function handleSignOutAll() {
    setSignOutLoading(true);
    const supabase = createClient();
    await supabase.auth.signOut({ scope: "global" });
    window.location.href = "/login";
  }

  return (
    <div className="space-y-5">

      {/* ── Chanje Modpas ─────────────────────────────────────────────────── */}
      <section className="card p-6 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <Lock className="w-5 h-5 text-caribbean-600" />
          <h2 className="font-semibold text-slate-900">Chanje Modpas</h2>
        </div>
        <p className="text-xs text-slate-400 -mt-2">Kont: {email}</p>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Nouvo Modpas
          </label>
          <input
            type="password"
            value={pw.newPw}
            onChange={(e) => { setPw((p) => ({ ...p, newPw: e.target.value })); setPwMsg(null); }}
            placeholder="Omwen 6 karaktè"
            className="input-field"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Konfime Nouvo Modpas
          </label>
          <input
            type="password"
            value={pw.confirm}
            onChange={(e) => { setPw((p) => ({ ...p, confirm: e.target.value })); setPwMsg(null); }}
            placeholder="Retape menm modpas la"
            className="input-field"
          />
        </div>

        {pwMsg && (
          <div className={`flex items-center gap-2 p-3 rounded-xl text-sm ${
            pwMsg.ok
              ? "bg-green-50 border border-green-200 text-green-700"
              : "bg-red-50 border border-red-200 text-red-700"
          }`}>
            {pwMsg.ok
              ? <CheckCircle className="w-4 h-4 shrink-0" />
              : <AlertCircle className="w-4 h-4 shrink-0" />}
            {pwMsg.text}
          </div>
        )}

        <button
          onClick={handlePasswordChange}
          disabled={pwLoading || !pw.newPw}
          className="btn-primary disabled:opacity-50"
        >
          {pwLoading
            ? <><Loader2 className="w-4 h-4 animate-spin" /> Kap sove...</>
            : <><ShieldCheck className="w-4 h-4" /> Chanje Modpas</>}
        </button>
      </section>

      {/* ── Tip Kont ──────────────────────────────────────────────────────── */}
      <section className="card p-6 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <Users className="w-5 h-5 text-caribbean-600" />
          <h2 className="font-semibold text-slate-900">Tip Kont</h2>
        </div>

        <div className="space-y-2">
          {ROLES.map(({ value, label, desc }) => (
            <button
              key={value}
              type="button"
              onClick={() => { setRole(value); setRoleMsg(null); }}
              className={`w-full flex items-start gap-3 p-3.5 rounded-xl border-2 text-left transition-all ${
                role === value
                  ? "border-caribbean-600 bg-caribbean-50"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <span className={`w-4 h-4 rounded-full border-2 mt-0.5 shrink-0 flex items-center justify-center ${
                role === value ? "border-caribbean-600 bg-caribbean-600" : "border-slate-300"
              }`}>
                {role === value && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
              </span>
              <span>
                <span className="block text-sm font-semibold text-slate-800">{label}</span>
                <span className="block text-xs text-slate-500 mt-0.5">{desc}</span>
              </span>
            </button>
          ))}
        </div>

        {roleMsg && (
          <div className={`flex items-center gap-2 p-3 rounded-xl text-sm ${
            roleMsg.ok
              ? "bg-green-50 border border-green-200 text-green-700"
              : "bg-red-50 border border-red-200 text-red-700"
          }`}>
            {roleMsg.ok
              ? <CheckCircle className="w-4 h-4 shrink-0" />
              : <AlertCircle className="w-4 h-4 shrink-0" />}
            {roleMsg.text}
          </div>
        )}

        <button
          onClick={handleRoleChange}
          disabled={roleLoading || role === currentRole}
          className="btn-primary disabled:opacity-50"
        >
          {roleLoading
            ? <><Loader2 className="w-4 h-4 animate-spin" /> Kap sove...</>
            : <><CheckCircle className="w-4 h-4" /> Sove Wòl</>}
        </button>
      </section>

      {/* ── Sekirite Sesyon ───────────────────────────────────────────────── */}
      <section className="card p-6 space-y-3">
        <div className="flex items-center gap-2 mb-1">
          <LogOut className="w-5 h-5 text-red-500" />
          <h2 className="font-semibold text-slate-900">Sekirite Sesyon</h2>
        </div>
        <p className="text-sm text-slate-500">
          Dekonekte sou tout aparèy (telefòn, òdinatè, tablèt) an menm tan.
          Itilize sa si ou panse kont ou konpwomèt.
        </p>
        <button
          onClick={handleSignOutAll}
          disabled={signOutLoading}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-red-200 text-red-600 text-sm font-medium hover:bg-red-50 transition-all disabled:opacity-50"
        >
          {signOutLoading
            ? <Loader2 className="w-4 h-4 animate-spin" />
            : <LogOut className="w-4 h-4" />}
          Dekonekte Toupatou
        </button>
      </section>

    </div>
  );
}
