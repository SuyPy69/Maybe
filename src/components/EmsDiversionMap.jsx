import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const EmsDiversionMap = ({ hospitals, allPredictions, selectedBloodType, activeTransfer }) => {
  const getStatus = (h, analysisMap) => {
    const analysis = analysisMap?.[selectedBloodType];
    if (analysis?.risk === "CRITICAL") return 'node-red';
    const isNeg = selectedBloodType.includes('neg');
    let liq = h[selectedBloodType];
    if (isNeg) liq += (selectedBloodType !== 'O_neg' ? Math.max(0, h['O_neg'] - 10) : 0);
    else liq += Math.max(0, h['O_pos'] - 15) + Math.max(0, h['O_neg'] - 5);
    return liq < 15 ? 'node-red' : 'node-blue';
  };

  const donor = hospitals.find(h => h.name === activeTransfer?.from);
  const recipient = hospitals.find(h => h.name === activeTransfer?.to);
  const path = donor && recipient ? [donor.location.split(',').map(Number), recipient.location.split(',').map(Number)] : null;

  return (
    <MapContainer center={[12.9716, 77.5946]} zoom={11} style={{ height: '100%', width: '100%' }} zoomControl={false} attributionControl={false}>
      <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
      {path && <Polyline positions={path} pathOptions={{ color: '#dc2626', weight: 3, dashArray: '10, 10', className: 'animate-pulse' }} />}
      {hospitals.map((h) => {
        const icon = L.divIcon({ className: `node-precision ${getStatus(h, allPredictions[h.id])}`, iconSize: [14, 14] });
        return (
          <Marker key={h.id} position={h.location.split(',').map(Number)} icon={icon}>
            <Popup className="custom-popup">
              <div className="bg-black text-white p-4 rounded border border-red-600 font-bold uppercase text-[10px]">
                {h.name} <br/> <span className="text-red-500">STOCK: {h[selectedBloodType]}u</span>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
};

export default EmsDiversionMap;