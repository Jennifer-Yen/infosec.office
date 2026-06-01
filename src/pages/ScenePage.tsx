import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SCENES } from '../data/gameData'; 
import { useGame } from '../store/GameContext';
import { SceneHotspots } from '../components/SceneHotspots';
import { RiskModal } from '../components/RiskModal';
import { ArrowLeft, Info, Trophy, CheckCircle, Shield, Play, HelpCircle, Clock, ShieldCheck, ListCheck } from 'lucide-react';
import { cn } from '../utils/cn';
import { Hotspot } from '../types/game';

interface ScenePageProps {
  sceneId: string;
  onBack: () => void;
}

export const ScenePage: React.FC<ScenePageProps> = ({ sceneId, onBack }) => {
  // 從 useGame 解構出當前場景的時間紀錄、題目列表、已完成的風險點 ID，以及相關操作函式
  const { completedRiskIds, hintedRiskIds, completeRisk, addHintedRisk, score, questions, updateSceneTime, sceneTimes } = useGame();
  const [selectedRiskId, setSelectedRiskId] = useState<string | null>(null);
  const [showFinishedAlert, setShowFinishedAlert] = useState(false);
  const [currentHintId, setCurrentHintId] = useState<string | null>(null); 
  const [showStartGuide, setShowStartGuide] = useState(true);

  // 歷史紀錄繼承
  const [localSeconds, setLocalSeconds] = useState(() => {
    return sceneTimes[sceneId] || 0;
  });

  const scene = SCENES.find(s => s.id === sceneId);
  const sceneRisks = questions.filter(r => r.sceneId === sceneId);
  const completedInScene = sceneRisks.filter(r => completedRiskIds.includes(r.id));
  const isSceneFinished = sceneRisks.length > 0 && sceneRisks.length === completedInScene.length;

  // 🎯 1. 取得當前場景中「已經被解決」的風險題目清單
  const solvedRisksInScene = sceneRisks.filter(r => completedRiskIds.includes(r.id));

  if (!scene) return <div>Scene not found</div>;

  // 不間斷計時器
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (!showStartGuide && !isSceneFinished) {
      interval = setInterval(() => {
        setLocalSeconds((prev) => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [showStartGuide, isSceneFinished]); 

  // 中途退出機制
  const handleExitScene = () => {
    if (localSeconds > 0) {
      updateSceneTime(sceneId, localSeconds);
    }
    onBack();
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const dynamicHotspots: Hotspot[] = sceneRisks.map((q) => ({
    id: q?.id || String(Math.random()),
    x: q?.x !== undefined ? Number(q.x) : 0.5,
    y: q?.y !== undefined ? Number(q.y) : 0.5,
    width: q?.width !== undefined ? Number(q.width) : 0.1,
    height: q?.height !== undefined ? Number(q.height) : 0.1,
    label: q?.label || '未命名風險點'
  }));

  const currentQuestion = questions.find(q => q.id === selectedRiskId);

  const handleGetHint = () => {
    const uncompletedRisks = sceneRisks.filter(r => !completedRiskIds.includes(r.id));
    if (uncompletedRisks.length === 0) return;

    let pool = uncompletedRisks.filter(r => !hintedRiskIds.includes(r.id));
    if (pool.length === 0) {
      pool = uncompletedRisks;
    }

    const randomIndex = Math.floor(Math.random() * pool.length);
    const chosenRisk = pool[randomIndex];

    setCurrentHintId(chosenRisk.id);
    addHintedRisk(chosenRisk.id);
  };

  const handleAnswer = (isCorrect: boolean) => {
    if (selectedRiskId) {
      completeRisk(selectedRiskId, isCorrect);
      
      if (isCorrect) {
        if (selectedRiskId === currentHintId) {
          setCurrentHintId(null);
        }

        const updatedCompletedCount = completedInScene.length + (completedRiskIds.includes(selectedRiskId) ? 0 : 1);
        if (updatedCompletedCount === sceneRisks.length && !isSceneFinished) {
          updateSceneTime(sceneId, localSeconds);
          setTimeout(() => setShowFinishedAlert(true), 1500);
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#E2E8F0] text-slate-800 flex flex-col font-ui relative">
      {/* Header */}
      <header className="h-20 bg-white border-b-4 border-slate-200 px-8 flex items-center justify-between z-10 shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            onClick={handleExitScene}
            className="w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center text-white shadow-lg hover:bg-indigo-600 transition-all cursor-pointer"
          >
            <Shield className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-xl font-game text-slate-800 leading-tight">{scene.name}</h1>
            <p className="text-[10px] font-ui font-bold text-slate-400 tracking-widest uppercase">
              冒險學習：風險排查中
            </p>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2 bg-amber-50 px-4 py-2 rounded-2xl border-2 border-amber-100 text-amber-700 font-bold text-sm">
            <Clock className="w-4 h-4 animate-pulse" />
            <span>本關用時: {formatTime(localSeconds)}</span>
          </div>

          <div className="flex flex-col items-end">
            <div className="flex gap-1 mb-1">
              {Array.from({ length: sceneRisks.length }).map((_, i) => (
                <div 
                  key={i} 
                  className={cn(
                    "w-4 h-4 rounded-full",
                    i < completedInScene.length ? "bg-emerald-500" : "bg-slate-200"
                  )} 
                />
              ))}
            </div>
            <span className="text-[10px] font-ui font-bold text-slate-500 uppercase tracking-tighter">
              進度: {completedInScene.length} / {sceneRisks.length} 已完成
            </span>
          </div>
          
          <div className="bg-indigo-50 px-6 py-2 rounded-2xl border-2 border-indigo-100 shadow-sm">
            <span className="text-sm font-ui font-bold text-indigo-600">積分: {score}</span>
          </div>
        </div>
      </header>

      {/* Main Exploration Area */}
      {/* 🎯 2. 排版核心修正：將主容器改為橫向 Grid 佈局，納入右側排查追蹤面板 */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto p-6 grid grid-cols-1 lg:grid-cols-4 gap-6 items-start overflow-hidden">
        
        {/* 左側：辦公室大圖 (佔 3 欄) */}
        <div className="lg:col-span-3 bg-white p-2 rounded-[40px] shadow-2xl border-8 border-white relative overflow-hidden flex items-center justify-center">
          <SceneHotspots
            imageSrc={scene.image}
            hotspots={dynamicHotspots}
            completedIds={completedRiskIds}
            onHotspotClick={(id) => setSelectedRiskId(id)}
            currentHintId={currentHintId} 
          />
        </div>

        {/* 🎯 右側：新增「已排除資安風險日誌」常駐面板 (佔 1 欄) */}
        <div className="bg-white rounded-[32px] p-6 shadow-xl border-b-8 border-slate-200 h-full flex flex-col min-h-[400px] lg:h-[calc(100vh-220px)] overflow-hidden">
          <div className="flex items-center gap-2 pb-4 border-b-2 border-slate-100 shrink-0">
            <ListCheck className="w-5 h-5 text-indigo-500" />
            <h3 className="text-lg font-game text-slate-800">安全防禦日誌</h3>
          </div>

          {/* 清單滾動區 */}
          <div className="flex-1 overflow-y-auto pt-4 space-y-3 pr-1">
            {solvedRisksInScene.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 border-2 border-dashed border-slate-100 rounded-2xl bg-slate-50/50">
                <Shield className="w-8 h-8 mb-2 text-slate-300 opacity-60" />
                <p className="text-xs font-bold leading-relaxed">目前尚未發現風險<br/>請點擊畫面上的可疑物件</p>
              </div>
            ) : (
              <AnimatePresence>
                {solvedRisksInScene.map((risk) => (
                  <motion.div
                    key={risk.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-3.5 bg-emerald-50/70 rounded-2xl border border-emerald-100/80 flex items-start gap-3 shadow-sm hover:bg-emerald-50 transition-colors"
                  >
                    <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-game text-emerald-800">{risk.title}</h4>
                      <p className="text-[11px] font-ui text-emerald-600 font-bold mt-0.5 uppercase tracking-wide">
                        ✓威脅已完全清除
                      </p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
          
          {/* 下方計數回饋 */}
          <div className="mt-4 pt-3 border-t border-slate-100 text-right shrink-0">
            <span className="text-xs font-bold text-slate-400">
              防線修補進度: <span className="text-emerald-600 font-game text-sm">{solvedRisksInScene.length}</span> / {sceneRisks.length}
            </span>
          </div>
        </div>

        {/* 任務簡報 */}
        <AnimatePresence>
          {showStartGuide && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-white p-8 rounded-[40px] shadow-2xl text-center max-w-lg w-full border-8 border-indigo-50"
              >
                <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-5 text-3xl">👋</div>
                <h3 className="text-3xl font-black text-slate-800 mb-4">任務說明</h3>
                
                <p className="text-sm font-ui text-slate-600 leading-relaxed mb-6 text-left bg-slate-50 p-4 rounded-2xl border">
                  觀察辦公室環境，點擊畫面上可能存在的<span className="text-amber-600 font-bold">資安風險點</span>，找出潛在漏洞！按下方按鈕後將<span className="text-indigo-600 font-bold">開始/繼續計時</span>。
                </p>

                <div className="mb-8 border-2 border-indigo-50 bg-indigo-50/30 rounded-2xl p-5 text-left">
                  <h4 className="text-sm font-bold text-indigo-700 mb-3 flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4" /> 關卡評分規則說明
                  </h4>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li className="flex justify-between items-center bg-white px-4 py-2 rounded-xl border border-slate-100">
                      <span>🎯 自行觀察並回答正確</span>
                      <span className="font-bold text-emerald-600">+100 分</span>
                    </li>
                    <li className="flex justify-between items-center bg-white px-4 py-2 rounded-xl border border-slate-100">
                      <span>💡 「取得提示」並回答正確</span>
                      <span className="font-bold text-amber-600">+50 分</span>
                    </li>
                    <li className="flex justify-between items-center bg-white px-4 py-2 rounded-xl border border-slate-100">
                      <span>❌ 回答錯誤扣分</span>
                      <span className="font-bold text-rose-600">-20 分</span>
                    </li>
                  </ul>
                </div>

                <button
                  onClick={() => setShowStartGuide(false)}
                  className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg shadow-lg active:translate-y-0.5 cursor-pointer"
                >
                  {localSeconds > 0 ? "繼續進行排查 (接續計時)" : "開始進行排查 (啟動計時)"}
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {isSceneFinished && (
          <div className="absolute bottom-8 right-8">
            <motion.div className="flex items-center gap-3 bg-emerald-50 text-emerald-600 px-6 py-3 rounded-2xl border-2 border-emerald-100 shadow-lg">
              <CheckCircle className="w-6 h-6" />
              <span className="font-bold text-sm uppercase">此場景已掃描完畢</span>
            </motion.div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="h-20 bg-white border-t-4 border-slate-200 px-8 flex items-center justify-between shrink-0">
        <div className="flex gap-4">
          <button 
            onClick={handleExitScene}
            className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-bold border-b-2 border-slate-300 cursor-pointer"
          >
            返回地圖
          </button>
          
          <button 
            onClick={handleGetHint}
            disabled={isSceneFinished}
            className={cn(
              "px-6 py-2.5 rounded-xl font-bold transition-all border-b-2 flex items-center gap-2 cursor-pointer",
              isSceneFinished ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed" : "bg-amber-100 text-amber-700 border-amber-300"
            )}
          >
            <Info className="w-4 h-4" /> 取得提示 
          </button>
        </div>
      </footer>

      {/* Modals */}
      <AnimatePresence>
        {selectedRiskId && currentQuestion && (
          <RiskModal
            question={currentQuestion}
            isCompleted={completedRiskIds.includes(selectedRiskId)}
            onClose={() => setSelectedRiskId(null)} 
            onAnswer={(correct) => handleAnswer(correct)}
          />
        )}

        {showFinishedAlert && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-indigo-900/40 backdrop-blur-md">
            <motion.div className="bg-white p-8 rounded-[40px] shadow-2xl text-center max-w-sm w-full border-8 border-indigo-100">
              <div className="w-24 h-24 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                <Trophy className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-3xl font-black text-slate-900 mb-2">場景完成！</h3>
              <p className="text-slate-500 mb-8">已成功排查此區域的所有資安威脅。</p>
              <button
                onClick={handleExitScene}
                className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg cursor-pointer"
              >
                返回地圖
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};