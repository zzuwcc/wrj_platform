import React from "react";

export default function ParamCard({ type, id, color }) {
  const typeMap = {
    recon: "侦察机",
    cannon: "战斗机",
    defense: "防空系统"
  };
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
      <div style={{ marginBottom: "10px" }}>
        {typeMap[type]} {id} 参数标签框
      </div>
      <input
        type="text"
        placeholder="参数1"
        style={{ width: "90%", marginBottom: "8px", fontSize: "16px" }}
      />
      <input
        type="text"
        placeholder="参数2"
        style={{ width: "90%", fontSize: "16px" }}
      />
    </div>
  );
} 