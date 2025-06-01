import React, { useState } from "react";
import ScenarioSelector from "./components/ScenarioSelector";
import ParamCard from "./components/ParamCard";
import StartButton from "./components/StartButton";
import "./App.css";

const mapConfigs = {
  map1: {
    red: { recons: [1, 2], cannons: [1, 2] },
    blue: { recons: [1], cannons: [1, 2, 3] }
  },
  map2: {
    red: { recons: [1], cannons: [1, 2] },
    blue: { recons: [1, 2], cannons: [1] }
  },
  map3: {
    red: { recons: [1, 2, 3], cannons: [1] },
    blue: { recons: [1], cannons: [1, 2] }
  },
  map4: {
    red: { recons: [1, 2, 3, 4] },
    blue: { defenses: [1, 2, 3] }
  },
  map5: {
    red: { recons: [1, 2, 3, 4] },
    blue: { defenses: [1, 2, 3] }
  },
  map6: {
    red: { recons: [1, 2, 3, 4] },
    blue: { defenses: [1, 2, 3] }
  }
};

export default function App() {
  const [selectedMap, setSelectedMap] = useState("");
  const config = selectedMap && mapConfigs[selectedMap] ? mapConfigs[selectedMap] : { red: {}, blue: {} };

  return (
    <div className="container">
      <div className="scenario-selector">
        <ScenarioSelector value={selectedMap} onChange={e => setSelectedMap(e.target.value)} />
      </div>
      {!selectedMap && (
        <div className="center-title">无人机对战、侦察任务</div>
      )}
      {selectedMap && (
        <>
          <div className="red-side">
            {/* 红方 */}
            {config.red.recons && config.red.recons.map((id) => (
              <ParamCard key={`red-recon-${id}`} type="recon" id={id} color="#ef4444" />
            ))}
            {config.red.cannons && config.red.cannons.map((id) => (
              <ParamCard key={`red-cannon-${id}`} type="cannon" id={id} color="#b91c1c" />
            ))}
          </div>
          <div className="blue-side">
            {/* 蓝方 */}
            {config.blue.recons && config.blue.recons.map((id) => (
              <ParamCard key={`blue-recon-${id}`} type="recon" id={id} color="#3b82f6" />
            ))}
            {config.blue.cannons && config.blue.cannons.map((id) => (
              <ParamCard key={`blue-cannon-${id}`} type="cannon" id={id} color="#1e40af" />
            ))}
            {config.blue.defenses && config.blue.defenses.map((id) => (
              <ParamCard key={`blue-defense-${id}`} type="defense" id={id} color="#0ea5e9" />
            ))}
          </div>
          <div className="start-btn">
            <StartButton />
          </div>
        </>
      )}
    </div>
  );
}
