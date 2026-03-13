import React, { useState, useEffect } from "react";
import { Activity, Zap, Globe, Shield, LayoutGrid, Truck } from "lucide-react";
import EmsDiversionMap from "./components/EmsDiversionMap";
import BloodLiquidityTable from "./components/BloodLiquidityTable";
import Login from "./components/Login";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hospitals, setHospitals] = useState([]);
  const [allPredictions, setAllPredictions] = useState({});
  const [selectedBloodType, setSelectedBloodType] = useState('O_neg');
  const [globalData, setGlobalData] = useState({ status: "STABLE", traffic: 0, rain: 0 });
  const [activeTransfers, setActiveTransfers] = useState([]);

  const syncGrid = async () => {
    try {
      const hData = await (await fetch('http://localhost:8000/hospitals')).json();
      setHospitals(hData);
      const result = await (await fetch('http://localhost:8000/predict_all_nodes')).json();
      const pMap = {};
      result.nodes.forEach(node => { pMap[node.id] = node.analysis; });
      setAllPredictions(pMap);
      setGlobalData({ status: result.global_status, traffic: result.telemetry.traffic, rain: result.telemetry.rain });
    } catch (err) { console.error("OFFLINE"); }
  };

  const handleTransfer = (recipient) => {
    const isNeg = selectedBloodType.includes('neg');
    const donor = [...hospitals].filter(h => h.id !== recipient.id).sort((a, b) => {
      const aVal = isNeg ? a[selectedBloodType] + a['O_neg'] : a[selectedBloodType] + a['O_pos'] + a['O_neg'];
      const bVal = isNeg ? b[selectedBloodType] + b['O_neg'] : b[selectedBloodType] + b['O_pos'] + b['O_neg'];
      return bVal - aVal;
    })[0];
    setActiveTransfers(prev => [{ id: Date.now(), from: donor.name, to: recipient.name, progress: 0, type: selectedBloodType }, ...prev].slice(0, 3));
  };

  useEffect(() => {
    const timer = setInterval(() => setActiveTransfers(pts => pts.map(t => ({ ...t, progress: Math.min(100, t.progress + 5) }))), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => { if (isLoggedIn) syncGrid(); }, [isLoggedIn, selectedBloodType]);

  if (!isLoggedIn) return <Login onLogin={() => setIsLoggedIn(true)} />;

  return (
    <div className="h-screen bg-[#030303] text-[#fca5a5] crt-overlay overflow-hidden">
      <div className="dashboard-grid">
        {/* LEFT: THE 3D MAP */}
        <div className="relative glass-panel overflow-hidden border border-red-900/40">
          <EmsDiversionMap hospitals={hospitals} allPredictions={allPredictions} selectedBloodType={selectedBloodType} activeTransfer={activeTransfers[0]} />
          <div className="absolute top-6 left-6 z-[1000] bg-black/80 p-3 rounded-lg border border-red-600">
             <select className="bg-transparent text-white text-[12px] font-black uppercase outline-none" value={selectedBloodType} onChange={(e) => setSelectedBloodType(e.target.value)}>
                {['O_neg', 'O_pos', 'A_neg', 'A_pos', 'B_neg', 'B_pos', 'AB_neg', 'AB_pos'].map(t => <option className="bg-black" key={t} value={t}>{t.replace('_', ' ')}</option>)}
             </select>
          </div>
        </div>

        {/* RIGHT: TELEMETRY */}
        <div className="glass-panel flex flex-col border border-red-900/40">
          <div className="p-4 border-b border-red-900/20 font-black text-[12px] text-white tracking-[4px]">LIVE_NODE_FEED</div>
          <div className="flex-1 overflow-y-auto"><BloodLiquidityTable hospitals={hospitals} allPredictions={allPredictions} selectedBloodType={selectedBloodType} onAlert={handleTransfer} /></div>
        </div>

        {/* BOTTOM: ANALYTICS */}
        <div className="col-span-2 glass-panel p-8 flex gap-16 border border-red-900/40">
           <div className="w-1/4">
              <span className="text-[10px] font-bold text-white/40 block mb-2 uppercase">STABILITY_INDEX</span>
              <div className="text-6xl font-black text-white italic tracking-tighter">98.4%</div>
           </div>
           <div className="w-1/3 border-x border-red-900/20 px-10">
              <span className="text-[10px] font-black text-white/30 block mb-4 uppercase">ACTIVE_LOGISTICS</span>
              {activeTransfers.map(t => (
                <div key={t.id} className="mb-4">
                  <div className="flex justify-between text-[10px] font-data mb-1 text-red-500 font-bold uppercase"><span>{t.from}</span> <Truck size={14}/> <span>{t.to}</span></div>
                  <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden"><div className="bg-red-600 h-full shadow-[0_0_10px_#dc2626]" style={{ width: `${t.progress}%` }} /></div>
                </div>
              ))}
           </div>
           <div className="flex-1 font-data text-[10px] text-red-400/60 space-y-2 uppercase">
              <p className="text-white font-bold tracking-[2px] flex items-center gap-2"><Shield size={14}/> SYSTEM_AUDIT</p>
              {activeTransfers.map(t => <p key={t.id} className="text-white/80 animate-pulse">DISPATCHING {t.type} -> {t.to}</p>)}
              <p className="text-blue-500">GRID_ONLINE: 135 NODES SYNCED</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default App;