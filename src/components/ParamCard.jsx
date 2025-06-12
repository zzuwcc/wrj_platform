import React from "react";
import { motion } from "framer-motion";
import { FaCircle, FaTachometerAlt, FaPlane, FaFighterJet, FaSatelliteDish } from "react-icons/fa";

export default function ParamCard({ type, id, idList, color, side, param = {}, onParamChange, onIdxChange, radiusOptions, speedOptions }) {
  const typeMap = {
    recons: "侦察机",
    cannons: "战斗机",
    defenses: "防空系统"
  };
  
  const typeIcons = {
    recons: FaPlane,
    cannons: FaFighterJet,
    defenses: FaSatelliteDish
  };
  
  const TypeIcon = typeIcons[type];
  
  // 机型编号下拉
  const handleIdxChange = (e) => {
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      style={{
        width: "320px",
        borderRadius: "18px",
        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)",
        background: "#fff",
        color: "#334155",
        fontSize: "18px",
        padding: "20px",
        marginBottom: "16px",
        border: `2px solid ${color}`,
        position: "relative",
        overflow: "hidden"
      }}
    >
      {/* Background Pattern */}
      <div 
        style={{ 
          position: "absolute", 
          top: 0, 
          right: 0, 
          width: "120px", 
          height: "120px", 
          opacity: 0.1, 
          zIndex: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <TypeIcon style={{ color, fontSize: "80px" }} />
      </div>
      
      {/* Card Header */}
      <div style={{ 
        display: "flex", 
        alignItems: "center", 
        marginBottom: "16px", 
        position: "relative", 
        zIndex: 1 
      }}>
        <div style={{ 
          width: "40px", 
          height: "40px", 
          borderRadius: "12px", 
          backgroundColor: color, 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center", 
          marginRight: "12px",
          flexShrink: 0
        }}>
          <TypeIcon style={{ color: "white", fontSize: "20px" }} />
        </div>
        <div>
          <div style={{ fontWeight: "bold", fontSize: "20px", color: "#1e293b" }}>
            {typeMap[type]}
          </div>
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            marginTop: "4px" 
          }}>
            <span style={{ marginRight: "8px" }}>编号:</span>
            <select 
              value={id} 
              onChange={handleIdxChange} 
              style={{ 
                fontSize: "16px",
                padding: "4px 8px",
                borderRadius: "6px",
                border: "1px solid #e2e8f0",
                backgroundColor: "#f8fafc",
                color: "#334155",
                fontWeight: "500"
              }}
            >
              {idList && idList.map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {/* Parameter Controls */}
      <div style={{ 
        display: "flex", 
        flexDirection: "column", 
        gap: "16px",
        position: "relative",
        zIndex: 1,
        backgroundColor: "#f8fafc",
        padding: "16px",
        borderRadius: "12px"
      }}>
        {/* Radius Control */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ 
            width: "32px", 
            height: "32px", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            marginRight: "12px",
            color
          }}>
            <FaCircle size={16} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "16px", marginBottom: "4px", color: "#64748b" }}>半径</div>
            <select
              value={safeParam.radius || "medium"}
              onChange={handleRadiusChange}
              style={{ 
                width: "100%",
                fontSize: "16px",
                padding: "8px 12px",
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
                backgroundColor: "#ffffff",
                color: "#334155"
              }}
            >
              {radiusOptions && radiusOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Speed Control - Only for recons and cannons */}
        {(type === "recons" || type === "cannons") && speedOptions && (
          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ 
              width: "32px", 
              height: "32px", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center", 
              marginRight: "12px",
              color
            }}>
              <FaTachometerAlt size={16} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "16px", marginBottom: "4px", color: "#64748b" }}>速度</div>
              <select
                value={safeParam.speed || "medium"}
                onChange={handleSpeedChange}
                style={{ 
                  width: "100%",
                  fontSize: "16px",
                  padding: "8px 12px",
                  borderRadius: "8px",
                  border: "1px solid #e2e8f0",
                  backgroundColor: "#ffffff",
                  color: "#334155"
                }}
              >
                {speedOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
} 