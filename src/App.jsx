import React, { useState } from "react";
import ScenarioSelector from "./components/ScenarioSelector";
import ParamCard from "./components/ParamCard";
import StartButton from "./components/StartButton";
import ImagePlayer from "./components/ImagePlayer";
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
  const [showPlayer, setShowPlayer] = useState(false);
  const [fetching, setFetching] = useState(true);
  const config = selectedMap && mapConfigs[selectedMap] ? mapConfigs[selectedMap] : { red: {}, blue: {} };

  return (
    <div className="container">
      {/* 顶部选择区：下拉框、开始、重新播放、关闭 */}
      <div className="top-bar">
        <div className="scenario-selector-inline">
          <ScenarioSelector value={selectedMap} onChange={e => { setSelectedMap(e.target.value); setShowPlayer(false); }} />
        </div>
        {/* 只在选定场景后显示开始按钮 */}
        {selectedMap && (
          <div className="start-btn-inline">
            <StartButton
              selectedMap={selectedMap}
              onStarted={() => {
                setFetching(true);
                setShowPlayer(true);
              }}
            />
          </div>
        )}
      </div>
      {/* 只在未选择地图时显示标题 */}
      {!selectedMap && (
        <div className="center-title">无人机对战、侦察任务</div>
      )}
      {/* 参数卡片和图片播放器区域 */}
      {selectedMap && (
        <div className={`main-content${showPlayer ? ' show-player' : ''}`}>
          <div className="side-cards">
            <div className="red-side">
              {/* 红方 */}
              {config.red.recons && config.red.recons.map((id) => (
                <ParamCard key={`red-recon-${id}`} type="recon" id={id} color="#ef4444" />
              ))}
              {config.red.cannons && config.red.cannons.map((id) => (
                <ParamCard key={`red-cannon-${id}`} type="cannon" id={id} color="#b91c1c" />
              ))}
            </div>
          </div>
          <div className="center-player">
            {showPlayer && <ImagePlayer onClose={() => setShowPlayer(false)} fetching={fetching} setFetching={setFetching} />}
          </div>
          <div className="side-cards">
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
          </div>
        </div>
      )}
    </div>
  );
}
