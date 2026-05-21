import React, { createContext, useContext, useState, useEffect } from 'react';
import { SCENES, fetchRiskQuestions } from '../data/gameData';
import { Scene, RiskQuestion } from '../types/game';

interface GameContextType {
  scenes: Scene[];
  questions: RiskQuestion[];
  completedRiskIds: string[];
  hintedRiskIds: string[]; 
  currentSceneId: string | null;  
  score: number;
  loading: boolean;
  
  // 記錄每個場景花費的總秒數，結構如：{ "entrance": 45, "public": 120 }
  sceneTimes: Record<string, number>; 
  updateSceneTime: (sceneId: string, seconds: number) => void; // 更新場景時間的函式

  setCurrentScene: (id: string | null) => void; 
  completeRisk: (id: string, isCorrect: boolean) => void;
  addHintedRisk: (id: string) => void; 
  isAllCompleted: boolean;
  resetGame: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [questions, setQuestions] = useState<RiskQuestion[]>([]);
  const [completedRiskIds, setCompletedRiskIds] = useState<string[]>([]);
  const [hintedRiskIds, setHintedRiskIds] = useState<string[]>([]); 
  const [currentSceneId, setCurrentSceneId] = useState<string | null>(null); 
  const [score, setScore] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  
  // 記錄場景時間的狀態
  const [sceneTimes, setSceneTimes] = useState<Record<string, number>>({}); 

  useEffect(() => {
    fetchRiskQuestions().then((data) => {
      setQuestions(data);
      setLoading(false);
    });
  }, []);

  // 🎯 核心修改：從 (prev[sceneId] || 0) + seconds 改為直接蓋寫最新秒數
  // 這樣 ScenePage 傳回已經包含舊紀錄的總 localSeconds 時，數據才會百分之百精準
  const updateSceneTime = (sceneId: string, seconds: number) => {
    setSceneTimes((prev) => ({
      ...prev,
      [sceneId]: seconds 
    }));
  };

  const addHintedRisk = (id: string) => {
    if (!hintedRiskIds.includes(id)) {
      setHintedRiskIds((prev) => [...prev, id]);
    }
  };

  const completeRisk = (id: string, isCorrect: boolean) => {
    if (isCorrect) {
      if (!completedRiskIds.includes(id)) {
        setCompletedRiskIds((prev) => [...prev, id]);
        const isHinted = hintedRiskIds.includes(id);
        setScore((prev) => prev + (isHinted ? 50 : 100)); 
      }
    } else {
      setScore((prev) => Math.max(0, prev - 20));
    }
  };

  const isAllCompleted = questions.length > 0 && completedRiskIds.length === questions.length;

  const resetGame = () => {
    setCompletedRiskIds([]);
    setHintedRiskIds([]); 
    setCurrentSceneId(null); 
    setScore(0);
    setSceneTimes({}); // 重設遊戲時清空所有時間紀錄
    setLoading(true);
    fetchRiskQuestions().then((data) => {
      setQuestions(data);
      setLoading(false);
    });
  };

  return (
    <GameContext.Provider
      value={{
        scenes: SCENES,
        questions,
        completedRiskIds,
        hintedRiskIds,
        currentSceneId, 
        score,
        loading,
        sceneTimes,        
        updateSceneTime,   
        setCurrentScene: setCurrentSceneId, 
        completeRisk,
        addHintedRisk,
        isAllCompleted,
        resetGame,
      }}
    >
      {loading ? (
        <div className="w-screen h-screen flex flex-col items-center justify-center bg-slate-950 text-white font-ui">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mb-4"></div>
          <p className="text-lg font-bold tracking-widest">資安守護者系統：正在初始化 Excel 數據...</p>
        </div>
      ) : (
        children
      )}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGame must be used within a GameProvider');
  return context;
};