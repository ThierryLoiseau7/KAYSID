"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  MapPin, Home, DollarSign, Info,
  CheckCircle, ChevronRight, ChevronLeft, AlertCircle, Loader2
} from "lucide-react";
import { COMMUNES, LOCATIONS, PROPERTY_TYPE_LABELS } from "@/lib/constants";
import type { PropertyType, ListingType, Currency, Property } from "@/types";
import { updateProperty } from "@/app/actions/properties";

const STEPS = [
  { id: 1, label: "Tip",      icon: Home      },
  { id: 2, label: "Lokasyon", icon: MapPin     },
  { id: 3, label: "Detay",    icon: Info       },
  { id: 4, label: "Pri",      icon: DollarSign },
];

interface FormData {
  property_type: PropertyType;
  listing_type: ListingType;
  commune: string;
  neighborhood: string;
  address_text: string;
  title: string;
  description: string;
  bedrooms: number;
  bathrooms: number;
  area_sqm: string;
  is_furnished: boolean;
  has_water: boolean;
  has_electricity: boolean;
  has_generator: boolean;
  has_parking: boolean;
  has_internet: boolean;
  currency: Currency;
  price_monthly: string;
  price_sale: string;
}

export default function EditListingPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/properties/${id}`)
      .then((r) => r.json())
      .then((property: Property) => {
        if (!property?.id) { router.push("/dashboard/properties"); return; }
        setForm({
          property_type: property.property_type,
          listing_type: property.listing_type,
          commune: property.location?.commune ?? "",
          neighborhood: property.location?.neighborhood ?? "",
          address_text: property.address_text ?? "",
          title: property.title,
          description: property.description ?? "",
          bedrooms: property.bedrooms,
          bathrooms: property.bathrooms,
          area_sqm: property.area_sqm?.toString() ?? "",
          is_furnished: property.is_furnished,
          has_water: property.has_water,
          has_electricity: property.has_electricity,
          has_generator: property.has_generator,
          has_parking: property.has_parking,
          has_internet: property.has_internet,
          currency: property.currency,
          price_monthly: property.price_monthly?.toString() ?? "",
          price_sale: property.price_sale?.toString() ?? "",
        });
      })
      .catch(() => router.push("/dashboard/properties"))
      .finally(() => setFetching(false));
  }, [id, router]);

  function set<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((prev) => prev ? { ...prev, [key]: value } : prev);
  }

  const neighborhoods = LOCATIONS.filter(
    (l) => l.commune === form?.commune && l.neighborhood
  ).map((l) => l.neighborhood as string);

  function validateStep(): string {
    if (!form) return "";
    if (step === 2 && !form.commune) return "Chwazi yon komin.";
    if (step === 3 && !form.title) return "Mete yon tit pou anons ou.";
    if (step === 3 && form.description.length < 30) return "Deskripsyon dwe gen omwen 30 karaktè.";
    if (step === 4) {
      if (form.listing_type !== "sale" && !form.price_monthly) return "Mete pri lwaye a.";
      if (form.listing_type !== "rent" && !form.price_sale) return "Mete pri vant lan.";
    }
    return "";
  }

  function next() {
    const err = validateStep();
    if (err) { setError(err); return; }
    setError("");
    setStep((s) => Math.min(s + 1, 4));
  }

  function prev() {
    setError("");
    setStep((s) => Math.max(s - 1, 1));
  }

  async function handleSubmit() {
    if (!form) return;
    const err = validateStep();
    if (err) { setError(err); return; }

    setLoading(true);
    setError("");

    const result = await updateProperty(id, form);

    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    router.push("/dashboard/properties?success=updated");
  }

  const toggle = (key: keyof FormData) =>
    set(key, !form![key] as FormData[typeof key]);

  if (fetching) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-caribbean-600" />
      </div>
    );
  }

  if (!form) return null;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Modifye Anons</h1>
        <p className="text-slate-500 text-sm mt-1">
          Chanje enfòmasyon anons ou — ap pase revizyon ankò
        </p>
      </div>

      {/* Progress stepper */}
      <div className="flex items-center gap-0 mb-8">
        {STEPS.map(({ id: sid, label, icon: Icon }, i) => (
          <div key={sid} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all text-sm font-bold ${
                  sid < step
                    ? "bg-green-600 text-white"
                    : sid === step
                    ? "bg-caribbean-700 text-white shadow-md"
                    : "bg-slate-100 text-slate-400"
                }`}
              >
                {sid < step ? "✓" : <Icon className="w-4 h-4" />}
              </div>
              <span className={`text-xs font-medium hidden sm:block ${sid === step ? "text-caribbean-700" : "text-slate-400"}`}>
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-0.5 mx-1 mb-4 transition-all ${step > sid ? "bg-green-400" : "bg-slate-200"}`} />
            )}
          </div>
        ))}
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 mb-5">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      <div className="card p-6 sm:p-8">
        {/* STEP 1 — Type */}
        {step === 1 && (
          <div>
            <h2 className="font-bold text-slate-900 text-lg mb-1">Kalite Pwopriyete</h2>
            <p className="text-slate-500 text-sm mb-6">Ki tip kay oswa terin ou ap poste?</p>

            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">Tip Kay</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(Object.entries(PROPERTY_TYPE_LABELS) as [PropertyType, string][]).map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => set("property_type", value)}
                    className={`py-2.5 px-3 rounded-xl border-2 text-sm font-medium transition-all text-center ${
                      form.property_type === value
                        ? "border-caribbean-600 bg-caribbean-50 text-caribbean-700"
                        : "border-slate-200 text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Tip Anonse</label>
              <div className="grid grid-cols-3 gap-2">
                {([["rent", "Pou Lwaye"], ["sale", "Pou Vann"], ["both", "Tou De"]] as [ListingType, string][]).map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => set("listing_type", value)}
                    className={`py-2.5 rounded-xl border-2 text-sm font-medium transition-all ${
                      form.listing_type === value
                        ? "border-caribbean-600 bg-caribbean-50 text-caribbean-700"
                        : "border-slate-200 text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 2 — Location */}
        {step === 2 && (
          <div>
            <h2 className="font-bold text-slate-900 text-lg mb-1">Lokalizasyon</h2>
            <p className="text-slate-500 text-sm mb-6">Kote pwopriyete a ye?</p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Komin <span className="text-red-500">*</span>
                </label>
                <select
                  value={form.commune}
                  onChange={(e) => { set("commune", e.target.value); set("neighborhood", ""); }}
                  className="input-field"
                >
                  <option value="">Chwazi yon komin...</option>
                  {COMMUNES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {neighborhoods.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Katye / Seksyon Komin</label>
                  <select
                    value={form.neighborhood}
                    onChange={(e) => set("neighborhood", e.target.value)}
                    className="input-field"
                  >
                    <option value="">Chwazi yon katye...</option>
                    {neighborhoods.map((n) => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Adres (Opsyonèl)</label>
                <input
                  type="text"
                  value={form.address_text}
                  onChange={(e) => set("address_text", e.target.value)}
                  placeholder="Ex: Ri Geffrard, Nan Fonfrè #23"
                  className="input-field"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 3 — Details */}
        {step === 3 && (
          <div>
            <h2 className="font-bold text-slate-900 text-lg mb-1">Detay Pwopriyete</h2>
            <p className="text-slate-500 text-sm mb-6">Dekri kay ou pou atire lokatè</p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Tit Anons <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => set("title", e.target.value)}
                  maxLength={100}
                  className="input-field"
                />
                <p className="text-xs text-slate-400 mt-1 text-right">{form.title.length}/100</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Deskripsyon <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                  rows={5}
                  maxLength={1000}
                  className="input-field resize-none"
                />
                <p className="text-xs text-slate-400 mt-1 text-right">{form.description.length}/1000 (min 30)</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {form.property_type !== "te" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Chanm</label>
                      <select value={form.bedrooms} onChange={(e) => set("bedrooms", Number(e.target.value))} className="input-field">
                        {[0,1,2,3,4,5,6].map((n) => (
                          <option key={n} value={n}>{n === 0 ? "Okenn" : `${n} chanm`}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Saldeben</label>
                      <select value={form.bathrooms} onChange={(e) => set("bathrooms", Number(e.target.value))} className="input-field">
                        {[0,1,2,3,4].map((n) => (
                          <option key={n} value={n}>{n === 0 ? "Okenn" : `${n} sdb`}</option>
                        ))}
                      </select>
                    </div>
                  </>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Sipèfisi (m²) <span className="text-slate-400 text-xs">Opsyonèl</span>
                </label>
                <input
                  type="number"
                  value={form.area_sqm}
                  onChange={(e) => set("area_sqm", e.target.value)}
                  min={0}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">Sèvis Disponib</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { key: "has_water", label: "Dlo Kouran" },
                    { key: "has_electricity", label: "Elektrisite" },
                    { key: "has_generator", label: "Jenerate" },
                    { key: "has_internet", label: "Wi-Fi" },
                    { key: "has_parking", label: "Garaj" },
                    { key: "is_furnished", label: "Mèble" },
                  ].map(({ key, label }) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => toggle(key as keyof FormData)}
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 text-sm font-medium transition-all text-left ${
                        form[key as keyof FormData]
                          ? "border-caribbean-600 bg-caribbean-50 text-caribbean-700"
                          : "border-slate-200 text-slate-500 hover:border-slate-300"
                      }`}
                    >
                      <span className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 ${
                        form[key as keyof FormData] ? "bg-caribbean-600 border-caribbean-600" : "border-slate-300"
                      }`}>
                        {form[key as keyof FormData] && <span className="text-white text-xs">✓</span>}
                      </span>
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4 — Price */}
        {step === 4 && (
          <div>
            <h2 className="font-bold text-slate-900 text-lg mb-1">Pri</h2>
            <p className="text-slate-500 text-sm mb-6">Mete pri pwopriyete ou</p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Monè</label>
                <div className="grid grid-cols-2 gap-2">
                  {(["USD", "HTG"] as Currency[]).map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => set("currency", c)}
                      className={`py-2.5 rounded-xl border-2 text-sm font-medium transition-all ${
                        form.currency === c
                          ? "border-caribbean-600 bg-caribbean-50 text-caribbean-700"
                          : "border-slate-200 text-slate-600 hover:border-slate-300"
                      }`}
                    >
                      {c === "USD" ? "🇺🇸 USD (Dola)" : "🇭🇹 HTG (Goud)"}
                    </button>
                  ))}
                </div>
              </div>

              {(form.listing_type === "rent" || form.listing_type === "both") && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Pri Lwaye / Mwa <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">
                      {form.currency === "USD" ? "$" : "G"}
                    </span>
                    <input
                      type="number"
                      value={form.price_monthly}
                      onChange={(e) => set("price_monthly", e.target.value)}
                      min={0}
                      className="input-field pl-8"
                    />
                  </div>
                </div>
              )}

              {(form.listing_type === "sale" || form.listing_type === "both") && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Pri Vant <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">
                      {form.currency === "USD" ? "$" : "G"}
                    </span>
                    <input
                      type="number"
                      value={form.price_sale}
                      onChange={(e) => set("price_sale", e.target.value)}
                      min={0}
                      className="input-field pl-8"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-6">
        <button
          onClick={prev}
          disabled={step === 1}
          className="btn-secondary text-sm disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" />
          Anvan
        </button>

        {step < 4 ? (
          <button onClick={next} className="btn-primary text-sm">
            Swivan
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="btn-primary text-sm disabled:opacity-60"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Kap voye...
              </span>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                Anrejistre Chanjman
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
