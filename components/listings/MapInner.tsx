"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const ICON = L.icon({
  iconUrl:       "/leaflet/marker-icon.png",
  iconRetinaUrl: "/leaflet/marker-icon-2x.png",
  shadowUrl:     "/leaflet/marker-shadow.png",
  iconSize:      [25, 41],
  iconAnchor:    [12, 41],
  popupAnchor:   [1, -34],
  shadowSize:    [41, 41],
});

interface Props {
  coords: [number, number];
  label: string;
}

/**
 * Leaflet imperatif — evite "Map container is already initialized"
 * ki rive ak react-leaflet + React 18 StrictMode (double mount).
 * Cleanup sou unmount garanti yon konteyné pwòp pou pwochen mont.
 */
export default function MapInner({ coords, label }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef       = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Netwaye map egzistan (StrictMode monte 2 fwa nan dev)
    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }

    const map = L.map(containerRef.current, {
      center:          coords,
      zoom:            13,
      scrollWheelZoom: false,
      zoomControl:     true,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    L.marker(coords, { icon: ICON }).addTo(map).bindPopup(label);

    L.circle(coords, {
      radius:      500,
      color:       "#0e7490",
      fillColor:   "#0e7490",
      fillOpacity: 0.1,
    }).addTo(map);

    mapRef.current = map;

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [coords, label]);

  return (
    <div
      ref={containerRef}
      style={{ height: "192px", width: "100%", borderRadius: "12px" }}
    />
  );
}
