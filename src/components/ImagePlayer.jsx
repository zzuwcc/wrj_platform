import React, { useEffect, useState, useRef } from "react";

export default function ImagePlayer({ onClose, fetching, setFetching }) {
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

  if (images.length === 0) return <div style={{textAlign:'center',marginTop:40}}>等待任务执行...</div>;

  return (
    <div style={{ textAlign: "center", marginTop: 40 }}>
      <img
        src={`http://localhost:5001/images/${images[current]}`}
        alt="render"
        style={{ maxWidth: "80vw", maxHeight: "80vh", borderRadius: 12, boxShadow: "0 4px 24px #0002" }}
      />
      <div style={{ marginTop: 10, color: "#555" }}>
        {current + 1} / {images.length}
      </div>
      {!fetching && <div style={{color:'#888',marginTop:8}}>任务数据已全部加载，已停止刷新</div>}
      <div style={{ marginTop: 18, display: 'flex', justifyContent: 'center', gap: '16px' }}>
        <button className="btn-main btn-blue" onClick={handleReplay}>重新播放</button>
        <button className="btn-main btn-red" onClick={handleClose}>关闭</button>
      </div>
    </div>
  );
} 