import React from "react";

export default function ParamCard({ type, id, idList, color, side, param = {}, onParamChange, onIdxChange, radiusOptions, speedOptions }) {
  const typeMap = {
    recon: "侦察机",
    cannon: "战斗机",
    defense: "防空系统"
  };
  
  // 机型编号下拉
  const handleIdxChange = (e) => {
    // 不使用preventDefault，让浏览器自然处理select的变化
    const newId = e.target.value;
    console.log(`切换${side} ${type}编号: ${id} -> ${newId}`);
    onIdxChange(side, type, newId);
  };
  
  // 参数下拉
  const handleRadiusChange = (e) => {
    const value = e.target.value;
    console.log(`修改${side} ${type} ${id}的radius: ${value}`);
    onParamChange(side, type, id, "radius", value);
  };
  
  const handleSpeedChange = (e) => {
    const value = e.target.value;
    console.log(`修改${side} ${type} ${id}的speed: ${value}`);
    onParamChange(side, type, id, "speed", value);
  };
  
  // 确保param有默认值
  const safeParam = param || { radius: "medium", speed: "medium" };
  
  return (
    <div
      style={{
        width: "320px",
        borderRadius: "18px",
        boxShadow: "0 4px 16px 0 rgba(31, 38, 135, 0.10)",
        background: "#fff",
        color,
        fontSize: "20px",
        padding: "16px 10px 18px 10px",
        marginBottom: "10px",
        textAlign: "center"
      }}
    >
      {/* 机型编号选择 */}
      <div style={{ marginBottom: "10px" }}>
        <span>{typeMap[type]} </span>
        <select 
          value={id} 
          onChange={handleIdxChange} 
          style={{ fontSize: "18px", marginLeft: 8 }}
        >
          {idList && idList.map(num => (
            <option key={num} value={num}>{num}</option>
          ))}
        </select>
        <span> 号参数配置</span>
      </div>
      
      {/* 参数下拉框 */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
        <div>
          <span>半径：</span>
          <select
            value={safeParam.radius || "medium"}
            onChange={handleRadiusChange}
            style={{ fontSize: "16px", marginLeft: 8 }}
          >
            {radiusOptions && radiusOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        
        {/* 速度只在侦察机/战斗机显示 */}
        {(type === "recon" || type === "cannon") && speedOptions && (
          <div>
            <span>速度：</span>
            <select
              value={safeParam.speed || "medium"}
              onChange={handleSpeedChange}
              style={{ fontSize: "16px", marginLeft: 8 }}
            >
              {speedOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  );
} 