import React from "react";
export default function ScenarioSelector({ value, onChange }) {
  return (
    <select value={value} onChange={onChange} style={{ width: "100%", height: "50px", fontSize: "18px" }}>
      <option value="">在此处选择场景地图</option>
      <option value="map1">对战场景-简单</option>
      <option value="map2">对战场景-中等</option>
      <option value="map3">对战场景-困难</option>
      <option value="map4">侦察场景-简单</option>
      <option value="map5">侦察场景-中等</option>
      <option value="map6">侦察场景-困难</option>
    </select>
  );
} 