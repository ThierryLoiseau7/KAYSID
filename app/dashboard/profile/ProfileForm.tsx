"use client";

import { useState } from "react";
import { Phone, MessageCircle, User, CheckCircle, AlertCircle } from "lucide-react";
import { updateProfile } from "@/app/actions/profile";

interface Props {
  defaultValues: { full_name: string; phone: string; whatsapp: string };
}

export default function ProfileForm({ defaultValues }: Props) {
  const [form, setForm] = useState(defaultValues);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  function set(key: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setSuccess(false);
    setError("");
  }

  async function handleSave() {
    setSaving(true);
    setError("");
    const result = await updateProfile(form);
    setSaving(false);
    if (result.error) {
      setError(result.error);
    } else {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }
  }

  return (
    <div className="card p-6 space-y-5">
      <h2 className="font-semibold text-slate-900">Modifye Enfòmasyon</h2>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          <span className="flex items-center gap-1.5"><User className="w-4 h-4" /> Non Konplè</span>
        </label>
        <input
          type="text"
          value={form.full_name}
          onChange={(e) => set("full_name", e.target.value)}
          placeholder="Ex: Jean-Pierre Dupont"
          className="input-field"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          <span className="flex items-center gap-1.5"><Phone className="w-4 h-4" /> Nimewo Telefòn</span>
        </label>
        <input
          type="tel"
          value={form.phone}
          onChange={(e) => set("phone", e.target.value)}
          placeholder="Ex: +509 3456-7890"
          className="input-field"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          <span className="flex items-center gap-1.5"><MessageCircle className="w-4 h-4" /> Nimewo WhatsApp</span>
        </label>
        <input
          type="tel"
          value={form.whatsapp}
          onChange={(e) => set("whatsapp", e.target.value)}
          placeholder="Ex: +509 3456-7890"
          className="input-field"
        />
        <p className="text-xs text-slate-400 mt-1">
          Nimewo sa a ap itilize pou lokatè kontakte ou dirèkteman.
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700">
          <CheckCircle className="w-4 h-4 shrink-0" />
          Pwofil ou ajou avèk siksè!
        </div>
      )}

      <button
        onClick={handleSave}
        disabled={saving}
        className="btn-primary w-full disabled:opacity-60"
      >
        {saving ? (
          <span className="flex items-center gap-2 justify-center">
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Kap sove...
          </span>
        ) : "Sove Chanjman"}
      </button>
    </div>
  );
}
