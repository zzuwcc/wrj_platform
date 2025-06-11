import React from "react";
export default function StartButton({ selectedMap, onStarted }) {
  const handleClick = async () => {
    let url = '';
    if (["map1", "map2", "map3"].includes(selectedMap)) {
      url = "http://localhost:5001/run_policy";
    } else if (["map4", "map5", "map6"].includes(selectedMap)) {
      url = "http://localhost:5001/run_policy_detect";
    }
    if (url) {
      await fetch(url, { method: "POST" });
      alert("已启动后端任务！");
      if (onStarted) onStarted();
    }
  };
  return (
    <button style={{
      width: "120px", height: "40px", fontSize: "20px"
    }} className="btn-main btn-blue" onClick={handleClick}>
      开始
    </button>
  );
} 