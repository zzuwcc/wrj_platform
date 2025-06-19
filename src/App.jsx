import React, { useState } from "react";
import { motion } from "framer-motion";
import ScenarioSelector from "./components/ScenarioSelector";
import ParamCard from "./components/ParamCard";
import StartButton from "./components/StartButton";
import ImagePlayer from "./components/ImagePlayer";
import logoSvg from "./assets/logo.svg";
import backgroundSvg from "./assets/background.svg";
import "./App.css";

const mapConfigs = {
  map1: {
    red: { recons: [1, 2], cannons: [1, 2, 3, 4, 5] },
    blue: { recons: [1, 2], cannons: [1, 2, 3, 4, 5] }
  },
  map2: {
    red: { recons: [1, 2], cannons: [1, 2, 3, 4] },
    blue: { recons: [1, 2], cannons: [1, 2, 3, 4, 5] }
  },
  map3: {
    red: { recons: [1], cannons: [1, 2, 3] },
    blue: { recons: [1, 2], cannons: [1, 2, 3, 4, 5] }
  },
  map4: {
    red: { recons: [1, 2, 3, 4] },
    blue: { defenses: [1, 2, 3, 4, 5] }
  },
  map5: {
    red: { recons: [1, 2, 3, 4] },
    blue: { defenses: [1, 2, 3, 4, 5] }
  },
  map6: {
    red: { recons: [1, 2, 3, 4] },
    blue: { defenses: [1, 2, 3, 4, 5] }
  }
};

// 参数选项映射
const radiusOptions = [
  { label: "大", value: "large" },
  { label: "中", value: "medium" },
  { label: "小", value: "small" }
];
const speedOptions = [
  { label: "快", value: "fast" },
  { label: "中", value: "medium" },
  { label: "慢", value: "slow" }
];

function getDefaultParams(config) {
  // 生成所有机型的默认参数
  const obj = { red: {}, blue: {} };
  if (config.red.recons) {
    obj.red.recons = {};
    config.red.recons.forEach(id => {
      obj.red.recons[String(id)] = { radius: "medium", speed: "medium" };
    });
  }
  if (config.red.cannons) {
    obj.red.cannons = {};
    config.red.cannons.forEach(id => {
      obj.red.cannons[String(id)] = { radius: "medium", speed: "medium" };
    });
  }
  if (config.blue.recons) {
    obj.blue.recons = {};
    config.blue.recons.forEach(id => {
      obj.blue.recons[String(id)] = { radius: "medium", speed: "medium" };
    });
  }
  if (config.blue.cannons) {
    obj.blue.cannons = {};
    config.blue.cannons.forEach(id => {
      obj.blue.cannons[String(id)] = { radius: "medium", speed: "medium" };
    });
  }
  if (config.blue.defenses) {
    obj.blue.defenses = {};
    config.blue.defenses.forEach(id => {
      obj.blue.defenses[String(id)] = { radius: "medium" };
    });
  }
  return obj;
}

export default function App() {
  const [selectedMap, setSelectedMap] = useState("");
  const [showPlayer, setShowPlayer] = useState(false);
  const [fetching, setFetching] = useState(true);
  const config = selectedMap && mapConfigs[selectedMap] ? mapConfigs[selectedMap] : { red: {}, blue: {} };

  // 机型编号选择状态
  const [selectedIdx, setSelectedIdx] = useState({
    red: { recons: "1", cannons: "1" },
    blue: { recons: "1", cannons: "1", defenses: "1" }
  });
  // 参数状态
  const [params, setParams] = useState(() => getDefaultParams(config));

  // 切换地图时重置参数
  React.useEffect(() => {
    setParams(getDefaultParams(config));
    setSelectedIdx({
      red: {
        recons: config.red.recons ? String(config.red.recons[0]) : "1",
        cannons: config.red.cannons ? String(config.red.cannons[0]) : "1"
      },
      blue: {
        recons: config.blue.recons ? String(config.blue.recons[0]) : "1",
        cannons: config.blue.cannons ? String(config.blue.cannons[0]) : "1",
        defenses: config.blue.defenses ? String(config.blue.defenses[0]) : "1"
      }
    });
  }, [selectedMap]);

  // 参数变更回调
  const handleParamChange = (side, type, id, key, value) => {
    console.log(`App收到参数变更: ${side} ${type} ${id} ${key}=${value}`);
    console.log('更新前params:', JSON.stringify(params));
    
    // 简化状态更新逻辑
    setParams(prev => {
      // 深拷贝当前状态
      const newParams = JSON.parse(JSON.stringify(prev));
      
      // 确保路径存在
      if (!newParams[side]) newParams[side] = {};
      if (!newParams[side][type]) newParams[side][type] = {};
      if (!newParams[side][type][id]) {
        newParams[side][type][id] = type === 'defense' 
          ? { radius: "medium" } 
          : { radius: "medium", speed: "medium" };
      }
      
      // 更新指定参数
      newParams[side][type][id][key] = value;
      
      console.log('更新后params:', JSON.stringify(newParams));
      return newParams;
    });
  };

  // 机型编号切换
  const handleIdxChange = (side, type, id) => {
    console.log(`App收到编号切换: ${side} ${type} ${id}`);
    console.log('更新前selectedIdx:', JSON.stringify(selectedIdx));
    
    // 简化状态更新逻辑
    setSelectedIdx(prev => {
      const newSelectedIdx = { ...prev };
      if (!newSelectedIdx[side]) newSelectedIdx[side] = {};
      newSelectedIdx[side][type] = String(id);
      
      console.log('更新后selectedIdx:', JSON.stringify(newSelectedIdx));
      return newSelectedIdx;
    });
  };

  // 简单的通知函数
  const showNotification = (message, type = "info") => {
    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // 动画效果
    setTimeout(() => {
      notification.classList.add("show");
    }, 10);
    
    // 自动消失
    setTimeout(() => {
      notification.classList.remove("show");
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  };

  return (
    <div className="container">
      {/* Background Pattern */}
      <div className="background-pattern">
        <img src={backgroundSvg} alt="Background Pattern" />
      </div>
      
      {/* Header with Logo */}
      <header className="app-header">
        <div className="logo-container">
          <img src={logoSvg} alt="Logo" />
        </div>
      </header>
      
      {/* Main Content */}
      <main className="app-main">
        {/* 顶部选择区：下拉框、开始、重新播放、关闭 */}
        <div className="top-bar">
          <div className="scenario-selector-container">
            <ScenarioSelector value={selectedMap} onChange={e => { setSelectedMap(e.target.value); setShowPlayer(false); }} />
          </div>
          {/* 只在选定场景后显示按钮 */}
          {selectedMap && (
            <div className="action-buttons">
              <StartButton
                selectedMap={selectedMap}
                params={params}
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
          <motion.div 
            className="center-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1>无人机对战、侦察任务</h1>
            <p>选择地图开始配置任务参数</p>
          </motion.div>
        )}
        
        {/* 参数卡片和图片播放器区域 */}
        {selectedMap && (
          <div className={`main-content${showPlayer ? ' show-player' : ''}`}>
            <div className="side-cards">
              <h2 className="team-title red">红方</h2>
              <div className="red-side">
                {/* 红方侦察机 */}
                {config.red.recons && (
                  <ParamCard
                    key={`red-recon-${selectedIdx.red.recons}`}
                    type="recons"
                    id={selectedIdx.red.recons}
                    idList={config.red.recons.map(String)}
                    color="#ef4444"
                    side="red"
                    param={params.red?.recons?.[selectedIdx.red.recons] || { radius: "medium", speed: "medium" }}
                    onParamChange={handleParamChange}
                    onIdxChange={handleIdxChange}
                    radiusOptions={radiusOptions}
                    speedOptions={speedOptions}
                  />
                )}
                {/* 红方战斗机 */}
                {config.red.cannons && (
                  <ParamCard
                    key={`red-cannon-${selectedIdx.red.cannons}`}
                    type="cannons"
                    id={selectedIdx.red.cannons}
                    idList={config.red.cannons.map(String)}
                    color="#b91c1c"
                    side="red"
                    param={params.red?.cannons?.[selectedIdx.red.cannons] || { radius: "medium", speed: "medium" }}
                    onParamChange={handleParamChange}
                    onIdxChange={handleIdxChange}
                    radiusOptions={radiusOptions}
                    speedOptions={speedOptions}
                  />
                )}
              </div>
            </div>
            <div className="center-player">
              {showPlayer && <ImagePlayer 
                onClose={() => setShowPlayer(false)} 
                fetching={fetching} 
                setFetching={setFetching}
                selectedMap={selectedMap}
              />}
            </div>
            <div className="side-cards">
              <h2 className="team-title blue">蓝方</h2>
              <div className="blue-side">
                {/* 蓝方侦察机 */}
                {config.blue.recons && (
                  <ParamCard
                    key={`blue-recon-${selectedIdx.blue.recons}`}
                    type="recons"
                    id={selectedIdx.blue.recons}
                    idList={config.blue.recons.map(String)}
                    color="#3b82f6"
                    side="blue"
                    param={params.blue?.recons?.[selectedIdx.blue.recons] || { radius: "medium", speed: "medium" }}
                    onParamChange={handleParamChange}
                    onIdxChange={handleIdxChange}
                    radiusOptions={radiusOptions}
                    speedOptions={speedOptions}
                  />
                )}
                {/* 蓝方战斗机 */}
                {config.blue.cannons && (
                  <ParamCard
                    key={`blue-cannon-${selectedIdx.blue.cannons}`}
                    type="cannons"
                    id={selectedIdx.blue.cannons}
                    idList={config.blue.cannons.map(String)}
                    color="#1e40af"
                    side="blue"
                    param={params.blue?.cannons?.[selectedIdx.blue.cannons] || { radius: "medium", speed: "medium" }}
                    onParamChange={handleParamChange}
                    onIdxChange={handleIdxChange}
                    radiusOptions={radiusOptions}
                    speedOptions={speedOptions}
                  />
                )}
                {/* 蓝方防空系统 */}
                {config.blue.defenses && (
                  <ParamCard
                    key={`blue-defense-${selectedIdx.blue.defenses}`}
                    type="defenses"
                    id={selectedIdx.blue.defenses}
                    idList={config.blue.defenses.map(String)}
                    color="#0ea5e9"
                    side="blue"
                    param={params.blue?.defenses?.[selectedIdx.blue.defenses] || { radius: "medium" }}
                    onParamChange={handleParamChange}
                    onIdxChange={handleIdxChange}
                    radiusOptions={radiusOptions}
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
