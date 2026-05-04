"use client";

import dynamic from "next/dynamic";

// Koordinat prensipal komin Sid Ayiti yo
const COMMUNE_COORDS: Record<string, [number, number]> = {
  "Les Cayes":       [18.1937, -73.7497],
  "Okay":            [18.1937, -73.7497],
  "Cayes":           [18.1937, -73.7497],
  "Jakmèl":          [18.2333, -72.5333],
  "Jacmel":          [18.2333, -72.5333],
  "Port-Salut":      [18.0667, -73.9167],
  "Jeremi":          [18.6500, -74.1167],
  "Jérémie":         [18.6500, -74.1167],
  "Tiburon":         [18.3167, -74.4000],
  "Aquin":           [18.2667, -73.4000],
  "Côteaux":         [18.2000, -74.1667],
  "Coteaux":         [18.2000, -74.1667],
  "Chantal":         [18.1667, -73.9500],
  "Cayes-Jacmel":    [18.2333, -72.6333],
  "Belle-Anse":      [18.2500, -72.0667],
  "Marigot":         [18.2500, -72.3167],
  "Bainet":          [18.2167, -72.7167],
  "Saint-Louis-du-Sud": [18.2667, -73.7167],
  "Torbeck":         [18.1500, -73.8167],
  "Camp-Perrin":     [18.3167, -73.8833],
  "Roseaux":         [18.3833, -74.0167],
  "Corail":          [18.5667, -73.8833],
  "Anse-à-Veau":     [18.4833, -73.3500],
  "Miragoâne":       [18.4500, -73.0833],
};

const DEFAULT_COORDS: [number, number] = [18.2667, -73.5]; // Sid Ayiti santral

// Dynamic import pou evite SSR issues ak Leaflet
const MapComponent = dynamic(() => import("./MapInner"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-48 bg-gradient-to-br from-caribbean-50 to-slate-100 rounded-xl flex items-center justify-center border border-slate-200">
      <p className="text-sm text-slate-400">Kap chaje kat...</p>
    </div>
  ),
});

interface Props {
  commune?: string;
  neighborhood?: string;
}

export default function CommuneMap({ commune, neighborhood }: Props) {
  const coords = (commune && COMMUNE_COORDS[commune]) || DEFAULT_COORDS;
  const label = neighborhood ? `${neighborhood}, ${commune}` : commune || "Sid Ayiti";

  return <MapComponent coords={coords} label={label} />;
}
