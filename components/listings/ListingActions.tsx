"use client";

import { useState } from "react";
import { Share2, Flag, X, CheckCircle } from "lucide-react";
import { reportListing, incrementContactCount } from "@/app/actions/listings";

const REPORT_REASONS = [
  { value: "fake_listing",   label: "Anons fo / pa egziste" },
  { value: "wrong_price",    label: "Pri pa kòrèk" },
  { value: "wrong_location", label: "Adrès pa bon" },
  { value: "scam",           label: "Eskwok / fwod" },
  { value: "duplicate",      label: "Anons en double" },
  { value: "other",          label: "Lòt rezon" },
];

interface Props {
  propertyId: string;
  whatsappUrl: string | null;
  whatsappLabel?: string;
}

export default function ListingActions({ propertyId, whatsappUrl, whatsappLabel }: Props) {
  const [showReport, setShowReport] = useState(false);
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [reporting, setReporting] = useState(false);
  const [reported, setReported] = useState(false);
  const [shared, setShared] = useState(false);

  async function handleShare() {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: document.title, url });
    } else {
      await navigator.clipboard.writeText(url);
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    }
  }

  async function handleReport() {
    if (!reason) return;
    setReporting(true);
    const result = await reportListing(propertyId, reason, details);
    setReporting(false);
    if (!result.error) {
      setReported(true);
      setTimeout(() => { setShowReport(false); setReported(false); setReason(""); setDetails(""); }, 2000);
    }
  }

  function handleContact() {
    incrementContactCount(propertyId);
    if (whatsappUrl) window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  }

  return (
    <>
      {/* Action buttons (Share + Report) */}
      <div className="flex gap-2 shrink-0">
        <button
          onClick={handleShare}
          className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-colors"
          title={shared ? "Kopye!" : "Pataje"}
        >
          {shared ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Share2 className="w-4 h-4" />}
        </button>
        <button
          onClick={() => setShowReport(true)}
          className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:text-red-500 hover:bg-red-50 transition-colors"
          title="Rapòte"
        >
          <Flag className="w-4 h-4" />
        </button>
      </div>

      {/* WhatsApp CTA */}
      {whatsappUrl && (
        <button
          onClick={handleContact}
          className="btn-whatsapp w-full text-base py-3.5"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          {whatsappLabel ?? "Kontakte sou WhatsApp"}
        </button>
      )}

      {/* Report modal */}
      {showReport && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-slate-900">Rapòte Anons Sa a</h3>
              <button onClick={() => setShowReport(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {reported ? (
              <div className="flex flex-col items-center gap-3 py-6 text-center">
                <CheckCircle className="w-12 h-12 text-green-500" />
                <p className="font-semibold text-slate-900">Rapò a voye!</p>
                <p className="text-sm text-slate-500">Ekip la ap revize nan 24 è. Mèsi.</p>
              </div>
            ) : (
              <>
                <div className="space-y-2 mb-4">
                  {REPORT_REASONS.map((r) => (
                    <button
                      key={r.value}
                      onClick={() => setReason(r.value)}
                      className={`w-full text-left px-4 py-3 rounded-xl border-2 text-sm transition-colors ${
                        reason === r.value
                          ? "border-red-500 bg-red-50 text-red-700"
                          : "border-slate-200 text-slate-600 hover:border-slate-300"
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>

                <textarea
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Detay adisyonèl (opsyonèl)..."
                  rows={3}
                  className="input-field resize-none mb-4 text-sm"
                />

                <button
                  onClick={handleReport}
                  disabled={!reason || reporting}
                  className="btn-primary w-full disabled:opacity-50"
                >
                  {reporting ? "Kap voye..." : "Voye Rapò"}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
