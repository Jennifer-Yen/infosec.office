import React from 'react';
import { motion } from 'motion/react';
import { SCENES } from '../data/gameData';
import { useGame } from '../store/GameContext';
import { MapPin, CheckCircle, ArrowLeft, Clock } from 'lucide-react';
import { cn } from '../utils/cn';

interface MapPageProps {
  onSelectScene: (id: string) => void;
  onBack: () => void;
  onComplete: () => void;
}

export const MapPage: React.FC<MapPageProps> = ({ onSelectScene, onBack, onComplete }) => {
  // 🎯 從全域狀態解構引入 sceneTimes
  const { completedRiskIds, isAllCompleted, questions, sceneTimes } = useGame();

  const getSceneProgress = (sceneId: string) => {
    const sceneRisks = questions.filter(r => r.sceneId === sceneId);
    const completedInScene = sceneRisks.filter(r => completedRiskIds.includes(r.id));
    return {
      total: sceneRisks.length,
      completed: completedInScene.length,
      isDone: sceneRisks.length > 0 && sceneRisks.length === completedInScene.length
    };
  };

  // 🎯 輔助函式：轉換格式
  const formatTime = (totalSeconds: number = 0) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 md:p-12 font-ui">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h2 className="text-4xl font-game text-slate-900 mb-2 tracking-tight">訓練地圖</h2>
            <p className="text-slate-500 font-medium">請選擇一個辦公場景進入，排查隱藏的資安風險。</p>
          </div>
          
          <div className="flex gap-4 w-full md:w-auto">
            <button
              onClick={onBack}
              className="flex-1 md:flex-none px-6 py-3 bg-white hover:bg-slate-50 text-slate-600 rounded-2xl font-bold transition-all border-b-4 border-slate-200 active:border-b-0 active:translate-y-1 flex items-center justify-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" /> 返回首頁
            </button>

            {isAllCompleted && (
              <button
                onClick={onComplete}
                className="flex-1 md:flex-none px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-game text-lg shadow-lg shadow-indigo-100 transition-all border-b-4 border-indigo-800 active:border-b-0 active:translate-y-1 flex items-center justify-center gap-2 cursor-pointer animate-bounce"
              >
                生成結案報告 🚀
              </button>
            )}
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {SCENES.map((scene, index) => {
            const { total, completed, isDone } = getSceneProgress(scene.id);
            const progressPercent = total > 0 ? (completed / total) * 100 : 0;
            
            // 🎯 取得本場景目前累積的時間
            const currentTime = sceneTimes[scene.id] || 0;

            return (
              <button
                key={scene.id}
                onClick={() => onSelectScene(scene.id)}
                className="text-left w-full block bg-white rounded-[32px] border-4 border-white shadow-xl hover:shadow-2xl hover:border-indigo-100 transition-all overflow-hidden group cursor-pointer relative"
              >
                <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
                  <div className="h-52 overflow-hidden relative">
                    <img
                      src={scene.image}
                      alt={scene.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 to-transparent" />
                    
                    {isDone && (
                      <div className="absolute top-6 right-6 bg-emerald-500 text-white p-2 rounded-full shadow-lg">
                        <CheckCircle className="w-5 h-5" />
                      </div>
                    )}

                    <div className="absolute bottom-6 left-8 flex items-center gap-3">
                      <span className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-game text-sm shadow-md">
                        {index + 1}
                      </span>
                      
                      {/* 🎯 核心修改：在地圖 Module 卡片圖片左下角加上時鐘與計時結果 */}
                      <div className="bg-slate-900/70 backdrop-blur-sm px-3 py-1.5 rounded-xl text-white text-xs font-bold flex items-center gap-1.5 border border-white/20 shadow-md">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        <span>耗時: {formatTime(currentTime)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-8">
                    <h3 className="text-2xl font-game text-slate-800 mb-2 flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-indigo-500" />
                      {scene.name}
                    </h3>
                    <p className="text-slate-500 text-sm mb-8 font-medium leading-relaxed">
                      {scene.description}
                    </p>

                    <div className="space-y-3素">
                      <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-tighter">
                        <span>探索進度</span>
                        <span>{completed} / {total}</span>
                      </div>
                      <div className="h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                        <div
                          className={cn(
                            "h-full transition-all rounded-full",
                            isDone ? "bg-indigo-600" : "bg-indigo-400"
                          )}
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};