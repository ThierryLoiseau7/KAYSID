"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet default icon issue with Next.js
const icon = L.icon({
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

export default function MapInner({ coords, label }: Props) {
  return (
    <MapContainer
      center={coords}
      zoom={13}
      style={{ height: "192px", width: "100%", borderRadius: "12px" }}
      scrollWheelZoom={false}
      zoomControl={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={coords} icon={icon}>
        <Popup>{label}</Popup>
      </Marker>
      <Circle
        center={coords}
        radius={500}
        pathOptions={{ color: "#0e7490", fillColor: "#0e7490", fillOpacity: 0.1 }}
      />
    </MapContainer>
  );
}
