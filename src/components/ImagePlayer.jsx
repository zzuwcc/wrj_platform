import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { FaPlay, FaTimes, FaDownload } from "react-icons/fa";

export default function ImagePlayer({ onClose, fetching, setFetching, selectedMap }) {
  const [images, setImages] = useState([]);
  const [current, setCurrent] = useState(0);
  const noChangeCount = useRef(0);
  const lastImagesLength = useRef(0);
  const timer = useRef(null);

  // 定时获取图片列表
  useEffect(() => {
    if (!fetching) return;
    const fetchImages = async () => {
      const res = await fetch("http://localhost:5001/images_list");
      const files = await res.json();
      setImages(files);

      // 检查图片数量是否有变化
      if (files.length === lastImagesLength.current) {
        noChangeCount.current += 1;
      } else {
        noChangeCount.current = 0;
        lastImagesLength.current = files.length;
      }
      // 如果连续5次（5秒）都没变化，停止轮询
      if (files.length && noChangeCount.current >= 5) {
        setFetching(false);
      }
    };
    fetchImages();
    const interval = setInterval(fetchImages, 1000);
    return () => clearInterval(interval);
  }, [fetching, setFetching]);

  // 自动播放
  useEffect(() => {
    if (images.length === 0) return;
    if (current >= images.length - 1) return; // 到最后一张就不再自动播放
    timer.current = setInterval(() => {
      setCurrent((prev) => {
        if (prev < images.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 40);
    return () => clearInterval(timer.current);
  }, [images, current]);

  const handleClose = async () => {
    await fetch("http://localhost:5001/clear_images", { method: "POST" });
    if (onClose) onClose();
  };

  // 重新播放
  const handleReplay = () => {
    setCurrent(0);
  };

  // 下载回放GIF
  const handleDownloadGif = () => {
    if (!selectedMap) return;
    
    // 创建下载链接
    const downloadUrl = `http://localhost:5001/download_replay_gif/${selectedMap}`;
    
    // 创建临时链接元素并触发下载
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.setAttribute('download', `${selectedMap}_replay.gif`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // 显示通知
    showNotification("开始下载回放GIF", "info");
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

  // 加载中显示
  if (images.length === 0) {
    return (
      <div style={{ 
        textAlign: 'center', 
        marginTop: 40, 
        padding: '40px', 
        background: 'rgba(255, 255, 255, 0.8)',
        borderRadius: '16px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
      }}>
        <div className="loading-spinner"></div>
        <div style={{ marginTop: 20, fontSize: '18px', color: '#334155' }}>等待任务执行...</div>
      </div>
    );
  }

  return (
    <div style={{ 
      display: "flex", 
      flexDirection: "column", 
      alignItems: "center", 
      width: "100%",
      background: "rgba(255, 255, 255, 0.8)",
      borderRadius: "20px",
      padding: "24px",
      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)"
    }}>
      {/* 控制按钮 - 放在上方 */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        width: '100%', 
        marginBottom: '20px',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            className="btn-main btn-replay"
            onClick={handleReplay}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              gap: '8px',
              minWidth: '140px',
              padding: '10px 16px',
              borderRadius: '8px',
              border: 'none',
              background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '16px',
              cursor: 'pointer',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}
          >
            <FaPlay /> 重新播放
          </button>
          
          <button 
            className="btn-main btn-download"
            onClick={handleDownloadGif}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              gap: '8px',
              minWidth: '140px',
              padding: '10px 16px',
              borderRadius: '8px',
              border: 'none',
              background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '16px',
              cursor: 'pointer',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}
          >
            <FaDownload /> 下载回放
          </button>
        </div>
        
        <div style={{ color: '#555', fontSize: '16px', fontWeight: '500' }}>
          {current + 1} / {images.length}
          {!fetching && <span style={{color:'#888', marginLeft: '10px'}}>· 任务数据已全部加载</span>}
        </div>
        
        <div>
          <button 
            className="btn-main btn-close"
            onClick={handleClose}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              gap: '8px',
              minWidth: '140px',
              padding: '10px 16px',
              borderRadius: '8px',
              border: 'none',
              background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '16px',
              cursor: 'pointer',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}
          >
            <FaTimes /> 关闭
          </button>
        </div>
      </div>
      
      {/* 图片显示 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        style={{ width: '100%', textAlign: 'center' }}
      >
        <img
          src={`http://localhost:5001/images/${images[current]}`}
          alt="render"
          style={{ 
            maxWidth: "100%", 
            maxHeight: "70vh", 
            borderRadius: "12px", 
            boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)" 
          }}
        />
      </motion.div>
    </div>
  );
} 