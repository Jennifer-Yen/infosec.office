import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RiskQuestion } from '../types/game';
import { X, CheckCircle2, AlertCircle, Lightbulb } from 'lucide-react';
import { cn } from '../utils/cn';

interface RiskModalProps {
  question: RiskQuestion;
  onClose: () => void;
  onAnswer: (isCorrect: boolean) => void;
  isCompleted: boolean;
}

export const RiskModal: React.FC<RiskModalProps> = ({
  question,
  onClose,
  onAnswer,
  isCompleted
}) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(isCompleted);
  const [resultCorrect, setResultCorrect] = useState(isCompleted);

  const handleSubmit = () => {
    if (!selectedId) return;
    const choice = question.choices.find(c => c.id === selectedId);
    const correct = !!choice?.isCorrect;
    
    setResultCorrect(correct);
    setShowResult(true);
    onAnswer(correct);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white rounded-[32px] shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] border-b-8 border-slate-200"
        >
          {/* Header */}
          <div className="p-6 bg-amber-50 flex items-center gap-4 border-b border-amber-100">
            <div className="w-14 h-14 bg-amber-500 rounded-2xl flex items-center justify-center text-white text-3xl shadow-lg shadow-amber-200">
              {resultCorrect && showResult ? '✅' : '⚠️'}
            </div>
            <div>
              <h2 className="text-2xl font-game text-amber-800">偵測到資安風險：{question.title}</h2>
              <p className="text-sm font-ui text-amber-600 font-bold uppercase tracking-wider text-xs">
                風險等級：高度 (High Risk)
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 overflow-y-auto">
            {!showResult ? (
              <div className="space-y-6">
                <p className="text-lg font-ui text-slate-700 leading-relaxed font-semibold">
                  {question.description}
                </p>
                
                <div className="space-y-3">
                  {question.choices.map((choice) => (
                    <button
                      key={choice.id}
                      onClick={() => setSelectedId(choice.id)}
                      className={cn(
                        "w-full p-5 text-left rounded-2xl border-2 transition-all duration-200 flex items-center group cursor-pointer",
                        selectedId === choice.id 
                          ? "border-indigo-400 bg-indigo-50 shadow-md transform -translate-y-1" 
                          : "border-slate-100 bg-slate-50 hover:border-indigo-300 hover:bg-slate-100 shadow-sm"
                      )}
                    >
                      {/* 🎯 核心修改：已完全移除帶有 A B C 的 div 圈圈 */}
                      <span className={cn(
                        "font-ui font-bold text-lg px-2", // 加上適當內距
                        selectedId === choice.id ? "text-indigo-800" : "text-slate-600"
                      )}>
                        {choice.text}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div className={cn(
                  "p-8 rounded-[24px] flex items-start gap-4 border-2",
                  resultCorrect ? "bg-emerald-50 border-emerald-100 text-emerald-900" : "bg-rose-50 border-rose-100 text-rose-900"
                )}>
                  {resultCorrect ? (
                    <CheckCircle2 className="w-10 h-10 text-emerald-500 shrink-0 mt-1" />
                  ) : (
                    <AlertCircle className="w-10 h-10 text-rose-500 shrink-0 mt-1" />
                  )}
                  <div>
                    <h4 className="text-2xl font-game mb-2">
                      {resultCorrect ? '解決成功 / CORRECT' : '再接再厲 / INCORRECT'}
                    </h4>
                    <p className="text-lg font-ui leading-relaxed font-semibold">
                      {resultCorrect ? question.correctExplanation : question.incorrectExplanation}
                    </p>
                  </div>
                </div>

                <div className="bg-amber-50 rounded-[24px] p-8 border border-amber-100 flex gap-4 shadow-inner shadow-amber-100/50">
                  <Lightbulb className="w-8 h-8 text-amber-500 shrink-0 mt-1" />
                  <div>
                    <p className="text-amber-900 font-ui font-medium">
                      <span className="font-game block mb-2 text-xl text-amber-600">資安小撇步：</span>
                      {question.knowledgeTip}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Footer */}
          <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
            {!showResult ? (
              <button
                disabled={!selectedId}
                onClick={handleSubmit}
                className={cn(
                  "flex-1 px-8 py-5 rounded-2xl font-game text-xl transition-all shadow-lg shadow-indigo-100 border-b-4 cursor-pointer",
                  selectedId 
                    ? "bg-indigo-600 text-white border-indigo-800 hover:bg-indigo-700 hover:-translate-y-1 active:translate-y-0 active:border-b-4" 
                    : "bg-slate-300 text-slate-500 border-slate-400 cursor-not-allowed"
                )}
              >
                送出作答
              </button>
            ) : (
              <button
                onClick={onClose}
                className="flex-1 px-8 py-5 bg-slate-800 border-b-4 border-slate-950 text-white rounded-2xl font-game text-xl hover:bg-slate-900 transition-all shadow-lg active:translate-y-0 active:border-b-4 cursor-pointer"
              >
                {resultCorrect ? '清除風險並繼續' : '重新檢視'}
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};