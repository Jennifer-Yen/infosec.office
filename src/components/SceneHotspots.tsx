// 檔案：src/components/SceneHotspots.tsx
import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Hotspot } from '../types/game';
import { cn } from '../utils/cn';

interface SceneHotspotsProps {
  imageSrc: string;              // 乾淨、無違規的背景圖
  hotspots: Hotspot[];
  completedIds: string[];         // 全域已完成的風險 ID 陣列
  onHotspotClick: (id: string) => void;
  debug?: boolean;
  currentHintId: string | null;   // 當前隨機抽中的單一提示 ID
}

export const SceneHotspots: React.FC<SceneHotspotsProps> = ({
  imageSrc,
  hotspots,
  completedIds,
  onHotspotClick,
  debug = false,
  currentHintId,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [, setImgSize] = useState({ width: 0, height: 0 });

  const updateSize = () => {
    if (containerRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect();
      setImgSize({ width, height });
    }
  };

  useEffect(() => {
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return (
    <div 
      ref={containerRef}
      className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl bg-slate-900 border-4 border-slate-800 select-none"
    >
      {/* 1. 乾淨的辦公室背景圖 */}
      <img
        src={imageSrc}
        alt="Scene"
        className="w-full h-full object-cover"
        onLoad={updateSize}
        draggable={false}
        referrerPolicy="no-referrer"
      />

      {/* Overlay for hotspots */}
      <div className="absolute inset-0 pointer-events-none">
        {hotspots.map((h) => {
          const isCompleted = completedIds.includes(h.id);
          const isThisItemHinted = h.id === currentHintId; 
          
          return (
            <motion.button
              key={h.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileHover={isCompleted ? {} : { scale: 1.05 }} // 已完成就不需要懸停縮放
              onClick={() => onHotspotClick(h.id)}
              className={cn(
                "absolute pointer-events-auto cursor-pointer group flex items-center justify-center transition-all rounded-xl border-2",
                // 徹底封印藍色外框
                "focus:outline-none focus-visible:outline-none active:outline-none ring-0 focus:ring-0",
                
                // 提示狀態亮起黃色虛線外框與呼吸燈
                isThisItemHinted && !isCompleted
                  ? "border-amber-400 bg-amber-400/10 animate-pulse" 
                  : "border-transparent bg-transparent",
                
                // 除錯模式維持原樣
                debug && "border-2 border-dashed border-red-500 bg-red-500/20",
                
                // 已完成的項目不阻擋滑鼠點擊，但要讓原本的按鈕外框完全透明
                isCompleted ? "pointer-events-none" : "opacity-100"
              )}
              style={{
                left: `${h.x * 100}%`,
                top: `${h.y * 100}%`,
                width: `${h.width * 100}%`,
                height: `${h.height * 100}%`,
                transform: 'translate(-50%, -50%)', // 精準鎖定中心點

                // 🎯 物理超度雙重保險：寫死 style 徹底消滅藍框
                outline: 'none',
                boxShadow: 'none',
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              {/* 🎯 核心功能：物件圖片渲染層 (未完成顯示，完成後淡出縮小) */}
              {h.objectImage && (
                <img
                  src={h.objectImage}
                  alt={h.label}
                  className="w-full h-full object-contain transition-all duration-500 ease-out pointer-events-none"
                  style={{
                    opacity: isCompleted ? 0 : 1,
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    // 未完成時居中並放大 1.3 倍 (可隨意調整)，完成後縮小到 0 並模糊
                    transform: isCompleted
                      ? 'translate(-50%, -50%) scale(0)' 
                      : 'translate(-50%, -50%) scale(2)', 
                    maxWidth: 'none',
                    maxHeight: 'none',
                    filter: isCompleted ? 'blur(4px)' : 'none'
                  }}
                  draggable={false}
                />
              )}

              {/* Pulse effect for uncompleted items */}
              {/* 只有被抽中的唯一提示才顯示驚嘆號脈衝光圈 */}
              {isThisItemHinted && !isCompleted && (
                <div className="relative z-10 pointer-events-none">
                  <div className="absolute inset-0 w-10 h-10 -left-5 -top-5 rounded-full bg-amber-400/50 hotspot-pulse" />
                  <div className="relative w-6 h-6 rounded-full bg-amber-500 shadow-lg border-2 border-white flex items-center justify-center text-white text-[10px] font-black">
                    !
                  </div>
                </div>
              )}
              
              {/* 🎯 懸停標籤說明 (Hover Label) */}
              {!isCompleted && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-slate-900/90 text-white text-xs px-2.5 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-md z-20 font-bold">
                  {h.label ? `⚠️ ${h.label}` : '⚠️ 檢查該區域'}
                </div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};