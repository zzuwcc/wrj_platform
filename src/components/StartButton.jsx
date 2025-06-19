import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaPlay, FaSpinner } from "react-icons/fa";

export default function StartButton({ selectedMap, onStarted }) {
  const [loading, setLoading] = useState(false);
  
  const handleClick = async () => {
    let url = '';
    if (["map1", "map2", "map3"].includes(selectedMap)) {
      url = "http://localhost:5001/run_policy";
    } else if (["map4", "map5", "map6"].includes(selectedMap)) {
      url = "http://localhost:5001/run_policy_detect";
    }
    
    if (url) {
      setLoading(true);
      try {
        await fetch(url, { 
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ map: selectedMap })
        });
        // 使用更现代的通知方式
        showNotification("已启动后端任务！", "success");
        if (onStarted) onStarted();
      } catch (error) {
        showNotification("启动任务失败，请重试", "error");
      } finally {
        setLoading(false);
      }
    }
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
    <motion.button 
      className="btn-main btn-start"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      disabled={loading}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        minWidth: "160px",
        background: "linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)",
        color: "white",
        fontWeight: "bold"
      }}
    >
      {loading ? (
        <FaSpinner className="icon-spin" style={{ animation: "spin 1s linear infinite" }} />
      ) : (
        <FaPlay />
      )}
      开始任务
    </motion.button>
  );
} 