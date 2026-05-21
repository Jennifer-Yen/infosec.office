import React from 'react';
import { motion } from 'motion/react';
import { useGame } from '../store/GameContext'; 
import { Trophy, RotateCcw, ShieldCheck, Star, Sparkles, Clock } from 'lucide-react';
import { FlowChart } from '../components/FlowChart';

interface SummaryPageProps {
  onRestart: () => void;
}

export const SummaryPage: React.FC<SummaryPageProps> = ({ onRestart }) => {
  // 🎯 從全域解構引入 sceneTimes
  const { score, completedRiskIds, questions, sceneTimes } = useGame();
  
  const completionRate = questions.length > 0 ? Math.round((completedRiskIds.length / questions.length) * 100) : 0;
  
  // 🎯 核心計算：將全關卡的花費秒數加總起來
  const totalSecondsUsed = Object.values(sceneTimes).reduce((sum, t) => sum + t, 0);

  // 格式化總時間顯示 (分 與 秒)
  const formatTotalTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    if (mins === 0) return `${secs} 秒`;
    return `${mins} 分 ${secs} 秒`;
  };

  const getRank = () => {
    if (score == 1000) return { title: '資安守護大師', icon: '🏆', color: 'text-amber-500', desc: '完美達成任務！你對辦公室資安有著極高的敏銳度。' };
    if (score >= 800) return { title: '資安專業家', icon: '🌟', color: 'text-indigo-500', desc: '表現優秀！你已經具備處理日常資安風險的能力。' };
    return { title: '資安見習生', icon: '🌱', color: 'text-slate-500', desc: '還有一些細節可以改進，多練習幾次會更熟練。' };
  };

  const rank = getRank();

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-6 font-ui overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        
        {/* Summary Card Header */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-[40px] shadow-2xl p-8 md:p-12 text-center border-b-8 border-slate-200 mb-12 relative overflow-hidden"
        >
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-indigo-50 rounded-full opacity-50 blur-xl" />
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-amber-50 rounded-full opacity-50 blur-xl" />

          <div className="w-28 h-28 bg-indigo-50 rounded-[32px] flex items-center justify-center text-5xl mx-auto mb-6 shadow-md relative group">
            <span className="group-hover:scale-110 transition-transform duration-300">{rank.icon}</span>
            <Sparkles className="w-6 h-6 text-amber-400 absolute -top-2 -right-2 animate-bounce" />
          </div>

          <h2 className="text-sm font-bold text-indigo-600 tracking-widest uppercase mb-2">訓練評估報告</h2>
          <h1 className="text-4xl font-game text-slate-900 mb-4 tracking-tight">資安防護成效判定</h1>
          <p className="text-slate-500 font-medium max-w-md mx-auto leading-relaxed mb-10">{rank.desc}</p>

          {/* 🎯 修改後的數據面板網格 (3格：分數、完成率、總計時) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
            <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 text-center">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">最終得分</span>
              <span className="text-4xl font-game text-indigo-600">{score}</span>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 text-center">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">風險排查率</span>
              <span className="text-4xl font-game text-emerald-600">{completionRate}%</span>
            </div>

            {/* 🎯 新增：總計時時間區塊 */}
            <div className="bg-amber-50/50 border border-amber-100 rounded-3xl p-6 text-center flex flex-col justify-center items-center">
              <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> 總訓練耗時
              </span>
              <span className="text-2xl font-game text-amber-600 leading-none mt-1">
                {formatTotalTime(totalSecondsUsed)}
              </span>
            </div>
          </div>
        </motion.div>

        {/* 課程核心目標與重新開始按鈕 */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 pt-6">
          <button
            onClick={onRestart}
            className="w-full md:w-auto px-16 py-6 bg-white text-slate-700 rounded-[32px] font-game text-2xl shadow-xl hover:bg-slate-50 transition-all border-b-8 border-slate-200 active:border-b-0 active:translate-y-1 cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <RotateCcw className="w-6 h-6" /> 重新開始訓練
            </div>
          </button>
        </div>

      </div>
    </div>
  );
};