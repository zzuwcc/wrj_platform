import React from "react";
export default function DefenseParams({ id }) {
  return (
    <div style={{
      width: "350px", border: "2px solid #444",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      color: "teal", fontSize: "20px", textAlign: "center", padding: "10px", boxSizing: "border-box", height: "auto"
    }}>
      <div style={{ marginBottom: "10px" }}>{`fighter ${id} 参数标签框 / defense system ${id} 参数标签框`}</div>
      <input type="text" placeholder="参数1" style={{ width: "90%", marginBottom: "8px", fontSize: "16px" }} />
      <input type="text" placeholder="参数2" style={{ width: "90%", fontSize: "16px" }} />
    </div>
  );
} 