import React from 'react';
import { motion } from 'motion/react';
import { ArrowDown, Monitor, User, CheckCircle, XCircle, Info } from 'lucide-react';

export const FlowChart: React.FC = () => {
  const steps = [
    { from: 'user', text: '進入網頁', icon: <User className="w-4 h-4" /> },
    { from: 'web', text: '顯示開始畫面', icon: <Monitor className="w-4 h-4" /> },
    { from: 'user', text: '點選 "開始挑戰"', icon: <User className="w-4 h-4" /> },
    { from: 'web', text: '進入辦公室場景', icon: <Monitor className="w-4 h-4" /> },
    { from: 'user', text: '點擊可疑位置', icon: <User className="w-4 h-4" />, highlight: true },
    { from: 'web', text: '判斷風險點並顯示題目', icon: <Info className="w-4 h-4" /> },
    { from: 'user', text: '選擇處置選項', icon: <User className="w-4 h-4" /> , highlight: true },
    { from: 'web', text: '顯示正誤回饋與知識', icon: <CheckCircle className="w-4 h-4" /> },
    { from: 'web', text: '更新任務進度與得分', icon: <StarIcon /> },
    { from: 'web', text: '完成所有點則進入總結', icon: <TrophyIcon /> },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
      <div className="flex justify-between mb-8 px-4">
        <div className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-widest">
          <User className="w-4 h-4" /> 使用者操作
        </div>
        <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-widest">
          <Monitor className="w-4 h-4" /> 系統反應
        </div>
      </div>

      <div className="relative space-y-4">
        {/* Connector Line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-slate-100 -translate-x-1/2 z-0" />

        {steps.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: step.from === 'user' ? -20 : 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className={`flex items-center gap-4 relative z-10 ${step.from === 'user' ? 'flex-row' : 'flex-row-reverse'}`}
          >
            <div className={`flex-1 flex ${step.from === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`
                px-4 py-3 rounded-2xl text-sm font-bold shadow-sm border flex items-center gap-3 transition-colors
                ${step.from === 'user' 
                  ? 'bg-white border-slate-200 text-slate-700' 
                  : 'bg-indigo-50 border-indigo-100 text-indigo-700'}
                ${step.highlight ? 'ring-2 ring-indigo-500 ring-offset-2' : ''}
              `}>
                {step.icon}
                {step.text}
              </div>
            </div>
            
            <div className={`w-3 h-3 rounded-full border-2 border-white shadow-sm ring-4 ${step.from === 'user' ? 'bg-slate-300 ring-slate-50' : 'bg-indigo-500 ring-indigo-50'}`} />
            
            <div className="flex-1" />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const StarIcon = () => (
  <svg className="w-4 h-4 text-amber-500 fill-current" viewBox="0 0 24 24">
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
  </svg>
);

const TrophyIcon = () => (
  <svg className="w-4 h-4 text-indigo-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
  </svg>
);
