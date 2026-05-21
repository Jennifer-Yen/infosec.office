import React from 'react';
import { motion } from 'motion/react';
import { Shield, ArrowRight, Play } from 'lucide-react';
import { FlowChart } from '../components/FlowChart';

interface HomePageProps {
  onStart: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 relative overflow-hidden font-ui">
      {/* Background patterns */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
        <div className="absolute top-10 left-10 w-64 h-64 border-8 border-indigo-600 rounded-full" />
        <div className="absolute bottom-20 right-20 w-96 h-96 border-8 border-indigo-600 rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl w-full text-center z-10"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full mb-8 border-2 border-indigo-100">
          <Shield className="w-5 h-5" />
          <span className="font-bold tracking-tight font-ui">資安守護者 | 辦公室互動教學系統</span>
        </div>
        
        <h1 className="text-6xl md:text-8xl font-game text-slate-800 mb-6 tracking-tight">
          InfoSec<span className="text-indigo-600">.</span>Office
        </h1>
        
        <p className="text-xl md:text-2xl text-slate-500 mb-12 max-w-2xl mx-auto leading-relaxed font-ui font-medium">
          辦公室隱藏著許多不為人知的資安陷阱。你有信心能找出所有的漏洞，並成為合格的資安守護者嗎？
        </p>

        <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
          <button
            onClick={onStart}
            className="group px-10 py-5 bg-indigo-600 text-white text-2xl font-game rounded-[32px] shadow-[0_20px_50px_rgba(79,70,229,0.3)] border-b-8 border-indigo-800 hover:bg-indigo-700 transition-all flex items-center gap-3 transform hover:scale-105 active:scale-95"
          >
            <Play className="w-6 h-6 fill-current" />
            開始挑戰
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* System Interaction Flow */}
        <div className="mt-20 w-full max-w-2xl mx-auto">
          <h2 className="text-2xl font-game text-slate-800 mb-8 flex items-center justify-center gap-2">
            <Shield className="w-6 h-6 text-indigo-500" />
            系統互動流程
          </h2>
          <FlowChart />
        </div>
      </motion.div>

      {/* Feature section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full"
      >
        {[
          { title: '場景探索', desc: '在不同辦公區域中觀察細節', icon: '🔍' },
          { title: '風險辨識', desc: '找出潛在的安全威脅點', icon: '⚠️' },
          { title: '即時回饋', desc: '學習正確的資安應對觀念', icon: '💡' }
        ].map((f, i) => (
          <div key={i} className="bg-white p-8 rounded-[32px] shadow-sm border-b-4 border-slate-200 text-center hover:translate-y-[-4px] transition-transform">
            <div className="text-4xl mb-4">{f.icon}</div>
            <h3 className="text-xl font-game text-slate-800 mb-2">{f.title}</h3>
            <p className="text-slate-500 font-ui font-medium">{f.desc}</p>
          </div>
        ))}
      </motion.div>

      <footer className="w-full text-center text-slate-400 text-sm mt-auto pt-8 pb-4 z-10">
        © 2026 互動式資安風險管理團隊 | Designed by 顏均慈、賴又禎、傅紹宸、吳重毅
      </footer>
    </div>
  );
};
