import React from "react";
import { motion } from "framer-motion";
import { FaMapMarkedAlt } from "react-icons/fa";

export default function ScenarioSelector({ value, onChange }) {
  return (
    <div className="select-container" style={{ position: "relative" }}>
      <FaMapMarkedAlt style={{ 
        position: "absolute", 
        left: "16px", 
        top: "50%", 
        transform: "translateY(-50%)", 
        color: "#64748b",
        pointerEvents: "none",
        zIndex: 2
      }} />
      <select 
        value={value} 
        onChange={onChange} 
        style={{ 
          width: "100%", 
          height: "48px", 
          fontSize: "16px",
          paddingLeft: "44px",
          appearance: "none",
          WebkitAppearance: "none",
          MozAppearance: "none",
          backgroundImage: "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"%2364748b\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polyline points=\"6 9 12 15 18 9\"></polyline></svg>')",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 16px center",
          backgroundSize: "16px"
        }}
      >
        <option value="">在此处选择场景地图</option>
        <option value="map1">对战场景-简单</option>
        <option value="map2">对战场景-中等</option>
        <option value="map3">对战场景-困难</option>
        <option value="map4">侦察场景-简单</option>
        <option value="map5">侦察场景-中等</option>
        <option value="map6">侦察场景-困难</option>
      </select>
    </div>
  );
} 