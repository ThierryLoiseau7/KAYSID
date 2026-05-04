"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  MapPin, Home, DollarSign, Info, Image as ImageIcon,
  CheckCircle, ChevronRight, ChevronLeft, Upload, X, AlertCircle
} from "lucide-react";
import { COMMUNES, LOCATIONS, PROPERTY_TYPE_LABELS } from "@/lib/constants";
import type { PropertyType, ListingType, Currency } from "@/types";
import { createProperty } from "@/app/actions/properties";
import { generateListingContent, estimatePrice } from "@/app/actions/ai";
import { Sparkles } from "lucide-react";

const STEPS = [
  { id: 1, label: "Tip",       icon: Home       },
  { id: 2, label: "Lokasyon", icon: MapPin      },
  { id: 3, label: "Detay",    icon: Info        },
  { id: 4, label: "Pri",      icon: DollarSign  },
  { id: 5, label: "Foto",     icon: ImageIcon   },
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

const INITIAL_FORM: FormData = {
  property_type: "studio",
  listing_type: "rent",
  commune: "",
  neighborhood: "",
  address_text: "",
  title: "",
  description: "",
  bedrooms: 1,
  bathrooms: 1,
  area_sqm: "",
  is_furnished: false,
  has_water: true,
  has_electricity: true,
  has_generator: false,
  has_parking: false,
  has_internet: false,
  currency: "USD",
  price_monthly: "",
  price_sale: "",
};

export default function NewListingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [photos, setPhotos] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [priceLoading, setPriceLoading] = useState(false);
  const [priceHint, setPriceHint] = useState("");
  const [error, setError] = useState("");

  function set<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  const neighborhoods = LOCATIONS.filter(
    (l) => l.commune === form.commune && l.neighborhood
  ).map((l) => l.neighborhood as string);

  function validateStep(): string {
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
    setStep((s) => Math.min(s + 1, 5));
  }

  function prev() {
    setError("");
    setStep((s) => Math.max(s - 1, 1));
  }

  function handlePhotoAdd(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    setPhotos((prev) => [...prev, ...files].slice(0, 8));
  }

  async function handleSubmit() {
    setLoading(true);
    setError("");

    // 1. Kreye pwopriyete a nan Supabase
    const result = await createProperty(form);

    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    // 2. Upload foto sou R2 (si gen foto)
    if (photos.length > 0 && result.id) {
      const fd = new FormData();
      fd.append("property_id", result.id);
      photos.forEach((file) => fd.append("files", file));

      try {
        const uploadRes = await fetch("/api/upload", { method: "POST", body: fd });
        const uploadData = await uploadRes.json();
        if (!uploadRes.ok || uploadData.error) {
          setError(`Anons kreye ✓ — men foto pa chaje: ${uploadData.error ?? uploadRes.status}`);
          setLoading(false);
          return;
        }
      } catch (err) {
        setError(`Anons kreye ✓ — men foto pa chaje: ${String(err)}`);
        setLoading(false);
        return;
      }
    }

    router.push("/dashboard?success=listing_created");
  }

  const toggle = (key: keyof FormData) =>
    set(key, !form[key] as FormData[typeof key]);

  async function handleEstimatePrice() {
    if (!form.commune) { setError("Chwazi yon komin anvan pou AI ka estime pri a."); return; }
    setError("");
    setPriceLoading(true);
    const result = await estimatePrice({
      property_type: form.property_type,
      listing_type: form.listing_type,
      commune: form.commune,
      bedrooms: form.bedrooms,
      bathrooms: form.bathrooms,
      is_furnished: form.is_furnished,
      area_sqm: form.area_sqm,
      currency: form.currency,
    });
    setPriceLoading(false);
    if (result.error) { setError(result.error); return; }
    if (result.price_monthly && !form.price_monthly) set("price_monthly", String(result.price_monthly));
    if (result.price_sale && !form.price_sale) set("price_sale", String(result.price_sale));
    if (result.reasoning) setPriceHint(result.reasoning);
  }

  async function handleGenerateAI() {
    if (!form.commune) { setError("Chwazi yon komin anvan pou AI ka jenere kontni."); return; }
    setError("");
    setAiLoading(true);
    const result = await generateListingContent({
      property_type: form.property_type,
      listing_type: form.listing_type,
      commune: form.commune,
      neighborhood: form.neighborhood,
      bedrooms: form.bedrooms,
      bathrooms: form.bathrooms,
      area_sqm: form.area_sqm,
      is_furnished: form.is_furnished,
      has_water: form.has_water,
      has_electricity: form.has_electricity,
      has_generator: form.has_generator,
      has_parking: form.has_parking,
      has_internet: form.has_internet,
    });
    setAiLoading(false);
    if (result.error) { setError(result.error); return; }
    if (result.title) set("title", result.title);
    if (result.description) set("description", result.description);
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Nouvo Anons</h1>
        <p className="text-slate-500 text-sm mt-1">
          Ranpli fòmilè a — anons ou ap revize nan 24 è
        </p>
      </div>

      {/* Progress stepper */}
      <div className="flex items-center gap-0 mb-8">
        {STEPS.map(({ id, label, icon: Icon }, i) => (
          <div key={id} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all text-sm font-bold ${
                  id < step
                    ? "bg-green-600 text-white"
                    : id === step
                    ? "bg-caribbean-700 text-white shadow-md"
                    : "bg-slate-100 text-slate-400"
                }`}
              >
                {id < step ? "✓" : <Icon className="w-4 h-4" />}
              </div>
              <span
                className={`text-xs font-medium hidden sm:block ${
                  id === step ? "text-caribbean-700" : "text-slate-400"
                }`}
              >
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-1 mb-4 transition-all ${
                  step > id ? "bg-green-400" : "bg-slate-200"
                }`}
              />
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

      {/* Steps */}
      <div className="card p-6 sm:p-8">
        {/* STEP 1 — Type */}
        {step === 1 && (
          <div>
            <h2 className="font-bold text-slate-900 text-lg mb-1">Kalite Pwopriyete</h2>
            <p className="text-slate-500 text-sm mb-6">Ki tip kay oswa terin ou ap poste?</p>

            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">Tip Kay</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(Object.entries(PROPERTY_TYPE_LABELS) as [PropertyType, string][]).map(
                  ([value, label]) => (
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
                  )
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Tip Anonse</label>
              <div className="grid grid-cols-3 gap-2">
                {([
                  ["rent", "Pou Lwaye"],
                  ["sale", "Pou Vann"],
                  ["both", "Tou De"],
                ] as [ListingType, string][]).map(([value, label]) => (
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
                  onChange={(e) => {
                    set("commune", e.target.value);
                    set("neighborhood", "");
                  }}
                  className="input-field"
                >
                  <option value="">Chwazi yon komin...</option>
                  {COMMUNES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {neighborhoods.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Katye / Seksyon Komin
                  </label>
                  <select
                    value={form.neighborhood}
                    onChange={(e) => set("neighborhood", e.target.value)}
                    className="input-field"
                  >
                    <option value="">Chwazi yon katye...</option>
                    {neighborhoods.map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Adres (Opsyonèl)
                </label>
                <input
                  type="text"
                  value={form.address_text}
                  onChange={(e) => set("address_text", e.target.value)}
                  placeholder="Ex: Ri Geffrard, Nan Fonfrè #23"
                  className="input-field"
                />
                <p className="text-xs text-slate-400 mt-1">
                  Adres egzak la pa ap parèt piblikman — sèlman komin ak katye.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3 — Details */}
        {step === 3 && (
          <div>
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="font-bold text-slate-900 text-lg mb-1">Detay Pwopriyete</h2>
                <p className="text-slate-500 text-sm">Dekri kay ou pou atire lokatè</p>
              </div>
              <button
                type="button"
                onClick={handleGenerateAI}
                disabled={aiLoading}
                className="flex items-center gap-1.5 px-3 py-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-60 text-white text-xs font-semibold rounded-xl transition-colors shrink-0"
              >
                {aiLoading ? (
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5" />
                )}
                {aiLoading ? "Kap jenere..." : "Jenere ak AI"}
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Tit Anons <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => set("title", e.target.value)}
                  placeholder="Ex: Bèl Studio Mèble nan Fonfrè, Okay"
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
                  placeholder="Dekri kay la an detay — mèb, sèvis, vwazenaj, règleman..."
                  maxLength={1000}
                  className="input-field resize-none"
                />
                <p className="text-xs text-slate-400 mt-1 text-right">
                  {form.description.length}/1000 (min 30)
                </p>
              </div>

              {/* Rooms */}
              <div className="grid grid-cols-2 gap-4">
                {form.property_type !== "te" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Chanm
                      </label>
                      <select
                        value={form.bedrooms}
                        onChange={(e) => set("bedrooms", Number(e.target.value))}
                        className="input-field"
                      >
                        {[0, 1, 2, 3, 4, 5, 6].map((n) => (
                          <option key={n} value={n}>
                            {n === 0 ? "Okenn" : `${n} chanm`}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Saldeben
                      </label>
                      <select
                        value={form.bathrooms}
                        onChange={(e) => set("bathrooms", Number(e.target.value))}
                        className="input-field"
                      >
                        {[0, 1, 2, 3, 4].map((n) => (
                          <option key={n} value={n}>
                            {n === 0 ? "Okenn" : `${n} sdb`}
                          </option>
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
                  placeholder="Ex: 45"
                  min={0}
                  className="input-field"
                />
              </div>

              {/* Amenities toggles */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  Sèvis Disponib
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { key: "has_water",       label: "Dlo Kouran"  },
                    { key: "has_electricity", label: "Elektrisite" },
                    { key: "has_generator",   label: "Jenerate"    },
                    { key: "has_internet",    label: "Wi-Fi"       },
                    { key: "has_parking",     label: "Garaj"       },
                    { key: "is_furnished",    label: "Mèble"       },
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
                      <span
                        className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 ${
                          form[key as keyof FormData]
                            ? "bg-caribbean-600 border-caribbean-600"
                            : "border-slate-300"
                        }`}
                      >
                        {form[key as keyof FormData] && (
                          <span className="text-white text-xs">✓</span>
                        )}
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
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="font-bold text-slate-900 text-lg mb-1">Pri</h2>
                <p className="text-slate-500 text-sm">Mete pri pwopriyete ou</p>
              </div>
              <button
                type="button"
                onClick={handleEstimatePrice}
                disabled={priceLoading}
                className="flex items-center gap-1.5 px-3 py-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-60 text-white text-xs font-semibold rounded-xl transition-colors shrink-0"
              >
                {priceLoading ? (
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5" />
                )}
                {priceLoading ? "Kap kalkile..." : "Estime ak AI"}
              </button>
            </div>
            {priceHint && (
              <div className="flex items-start gap-2 p-3 bg-violet-50 border border-violet-200 rounded-xl text-xs text-violet-700 mb-4">
                <Sparkles className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                {priceHint}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Monè
                </label>
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
                      placeholder="350"
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
                      placeholder="45000"
                      min={0}
                      className="input-field pl-8"
                    />
                  </div>
                </div>
              )}

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-700">
                <strong>Konsèy:</strong> Mete yon pri ki reyèl ak mache lokal la.
                Anons ak bon pri jwenn <strong>3× plis vizit</strong> ke anons ki twò chè.
              </div>
            </div>
          </div>
        )}

        {/* STEP 5 — Photos */}
        {step === 5 && (
          <div>
            <h2 className="font-bold text-slate-900 text-lg mb-1">Foto</h2>
            <p className="text-slate-500 text-sm mb-6">
              Ajoute 3-8 foto bon kalite. Foto atire 5× plis lokatè.
            </p>

            <div className="space-y-4">
              {/* Upload zone */}
              <label className="block w-full border-2 border-dashed border-slate-300 hover:border-caribbean-400 rounded-2xl p-8 text-center cursor-pointer transition-colors group">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePhotoAdd}
                  className="hidden"
                />
                <Upload className="w-10 h-10 text-slate-300 group-hover:text-caribbean-500 mx-auto mb-3 transition-colors" />
                <p className="font-medium text-slate-600 group-hover:text-slate-800 transition-colors">
                  Klike pou ajoute foto
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  JPG, PNG — Max 5 MB chak. Maks 8 foto.
                </p>
              </label>

              {/* Preview grid */}
              {photos.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {photos.map((file, i) => (
                    <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-slate-100 group">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Foto ${i + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {i === 0 && (
                        <div className="absolute top-1.5 left-1.5 badge bg-caribbean-700 text-white text-[10px]">
                          Kouvertir
                        </div>
                      )}
                      <button
                        onClick={() =>
                          setPhotos((prev) => prev.filter((_, j) => j !== i))
                        }
                        className="absolute top-1.5 right-1.5 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {photos.length === 0 && (
                <p className="text-center text-sm text-slate-400 py-2">
                  Ou ka poste san foto, men anons ak foto jwenn plis lokatè.
                </p>
              )}
            </div>

            {/* Submit */}
            <div className="mt-8 pt-6 border-t border-slate-100">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="btn-primary w-full py-4 text-base disabled:opacity-60"
              >
                {loading ? (
                  <span className="flex items-center gap-2 justify-center">
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Kap voye...
                  </span>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Soumèt Anons pou Revizyon
                  </>
                )}
              </button>
              <p className="text-xs text-slate-400 text-center mt-3">
                Anons ou ap revize nan 24 è. Ou resevwa yon email dèske li apwouve.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Navigation buttons */}
      {step < 5 && (
        <div className="flex items-center justify-between mt-6">
          <button
            onClick={prev}
            disabled={step === 1}
            className="btn-secondary text-sm disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
            Anvan
          </button>
          <button onClick={next} className="btn-primary text-sm">
            Swivan
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
      {step === 5 && (
        <button onClick={prev} className="btn-secondary text-sm mt-6">
          <ChevronLeft className="w-4 h-4" />
          Anvan
        </button>
      )}
    </div>
  );
}
