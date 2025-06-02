import React, { useEffect, useState, useRef } from "react";

export default function ImagePlayer({ onClose }) {
  const [images, setImages] = useState([]);
  const [current, setCurrent] = useState(0);
  const timer = useRef(null);

  // 定时获取图片列表
  useEffect(() => {
    const fetchImages = async () => {
      const res = await fetch("http://localhost:5001/images_list");
      const files = await res.json();
      setImages(files);
    };
    fetchImages();
    const interval = setInterval(fetchImages, 2000); // 每2秒刷新一次图片列表
    return () => clearInterval(interval);
  }, []);

  // 自动播放
  useEffect(() => {
    if (images.length === 0) return;
    timer.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 50); // 每0.05秒切换一张
    return () => clearInterval(timer.current);
  }, [images]);

  const handleClose = async () => {
    await fetch("http://localhost:5001/clear_images", { method: "POST" });
    if (onClose) onClose();
  };

  if (images.length === 0) return <div style={{textAlign:'center',marginTop:40}}>等待图片生成中...</div>;

  return (
    <div style={{ textAlign: "center", marginTop: 40 }}>
      <button onClick={handleClose} style={{position:'absolute',right:40,top:40,padding:'10px 28px',fontSize:'1.1rem',borderRadius:12,background:'#ef4444',color:'#fff',border:'none',boxShadow:'0 2px 8px #0002',cursor:'pointer'}}>关闭</button>
      <img
        src={`http://localhost:5001/images/${images[current]}`}
        alt="render"
        style={{ maxWidth: "80vw", maxHeight: "80vh", borderRadius: 12, boxShadow: "0 4px 24px #0002" }}
      />
      <div style={{ marginTop: 10, color: "#555" }}>
        {current + 1} / {images.length}
      </div>
    </div>
  );
} 