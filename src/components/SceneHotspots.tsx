import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Hotspot } from '../types/game';
import { cn } from '../utils/cn';

interface SceneHotspotsProps {
  imageSrc: string;
  hotspots: Hotspot[];
  completedIds: string[];
  onHotspotClick: (id: string) => void;
  debug?: boolean;
  currentHintId: string | null; // 🎯 1. 核心修正：使用這個來接收當前隨機抽中的單一提示 ID
}

export const SceneHotspots: React.FC<SceneHotspotsProps> = ({
  imageSrc,
  hotspots,
  completedIds,
  onHotspotClick,
  debug = false,
  currentHintId, // 🎯 2. 核心修正：在這裡成功解構出來
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [imgSize, setImgSize] = useState({ width: 0, height: 0 });

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
      className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl bg-slate-900 border-4 border-slate-800"
    >
      <img
        src={imageSrc}
        alt="Scene"
        className="w-full h-full object-cover"
        onLoad={updateSize}
        referrerPolicy="no-referrer"
      />

      {/* Overlay for hotspots */}
      <div className="absolute inset-0 pointer-events-none">
        {hotspots.map((h) => {
          const isCompleted = completedIds.includes(h.id);
          
          // 🎯 3. 核心修改：定義這題是不是當前「唯一的發光提示題」
          const isThisItemHinted = h.id === currentHintId; 
          
          return (
            <motion.button
              key={h.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileHover={{ scale: 1.05 }}
              onClick={() => onHotspotClick(h.id)}
              className={cn(
                "absolute pointer-events-auto cursor-pointer group flex items-center justify-center transition-all rounded-xl border-2",
                // 🎯 4. 核心修改：只有被抽中的那一題且未完成，才亮起黃色虛線外框與呼吸燈
                isThisItemHinted && !isCompleted
                  ? "border-amber-400 bg-amber-400/10 animate-pulse" 
                  : "border-transparent bg-transparent",
                // 除錯模式維持原樣
                debug && "border-2 border-dashed border-red-500 bg-red-500/20",
                // 已完成的項目直接變完全透明（且禁止點擊防止重複挑戰）
                isCompleted ? "opacity-0 pointer-events-none" : "opacity-100"
              )}
              style={{
                left: `${h.x * 100}%`,
                top: `${h.y * 100}%`,
                width: `${h.width * 100}%`,
                height: `${h.height * 100}%`,
                transform: 'translate(-50%, -50%)', // 精準鎖定中心點，修正錯位
              }}
            >
              {/* Pulse effect for uncompleted items */}
              {/* 🎯 5. 核心修改：內部的驚嘆號與脈衝光圈，同樣改為「只有被抽中的唯一提示」才顯示 */}
              {isThisItemHinted && !isCompleted && (
                <div className="relative">
                  <div className="absolute inset-0 w-10 h-10 -left-5 -top-5 rounded-full bg-amber-400/50 hotspot-pulse" />
                  <div className="relative w-6 h-6 rounded-full bg-amber-500 shadow-lg border-2 border-white flex items-center justify-center text-white text-[10px] font-black">
                    !
                  </div>
                </div>
              )}
              
              {/* Tooltip on hover */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800/90 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10 font-bold shadow-md">
                {isCompleted ? '已處理' : (h.label || '查看細節')}
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};