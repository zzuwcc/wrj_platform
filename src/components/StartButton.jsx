import React from "react";
export default function StartButton({ onStart }) {
  const handleClick = async () => {
    if (onStart) onStart();
    await fetch("http://localhost:5001/run_policy", { method: "POST" });
    alert("已启动后端任务！");
  };
  return (
    <button style={{
      width: "200px", height: "80px", fontSize: "22px"
    }} onClick={handleClick}>
      开始
    </button>
  );
} 