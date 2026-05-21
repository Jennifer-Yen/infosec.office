/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { GameProvider, useGame } from './store/GameContext';
import { HomePage } from './pages/HomePage';
import { MapPage } from './pages/MapPage';
import { ScenePage } from './pages/ScenePage';
import { SummaryPage } from './pages/SummaryPage';
import { AnimatePresence, motion } from 'motion/react';

type Page = 'home' | 'map' | 'scene' | 'summary';

function GameRouter() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const { currentSceneId, setCurrentScene, resetGame } = useGame();

  const handleStart = () => setCurrentPage('map');
  const handleSelectScene = (id: string) => {
    setCurrentScene(id);
    setCurrentPage('scene');
  };
  const handleBackToMap = () => {
    setCurrentScene(null);
    setCurrentPage('map');
  };
  const handleComplete = () => setCurrentPage('summary');
  const handleRestart = () => {
    resetGame();
    setCurrentPage('home');
  };

  return (
    // 💡 暫時拿掉可能造成卡死死結的 AnimatePresence，改用 100% 穩健的全狀態物理隔離
    <div className="w-full min-h-screen relative">
      
      {/* 🎯 1. 首頁防線：如果不是 home 頁面，強行 hidden 隱藏且完全關閉點擊事件 */}
      <div 
        className={`w-full min-h-screen absolute inset-0 z-10 transition-opacity duration-300 ${
          currentPage === 'home' 
            ? 'opacity-100 pointer-events-auto visible' 
            : 'opacity-0 pointer-events-none hidden'
        }`}
      >
        <HomePage onStart={handleStart} />
      </div>

      {/* 🎯 2. 地圖頁防線：如果是 map 頁面，強行推到 z-50 頂層，並確保開啟點擊 */}
      <div 
        className={`w-full min-h-screen absolute inset-0 z-50 transition-opacity duration-300 ${
          currentPage === 'map' 
            ? 'opacity-100 pointer-events-auto visible' 
            : 'opacity-0 pointer-events-none hidden'
        }`}
      >
        <MapPage 
          onSelectScene={handleSelectScene} 
          onBack={() => setCurrentPage('home')}
          onComplete={handleComplete}
        />
      </div>

      {/* 🎯 3. 關卡頁防線 */}
      <div 
        className={`w-full min-h-screen absolute inset-0 z-40 transition-opacity duration-300 ${
          currentPage === 'scene' && currentSceneId
            ? 'opacity-100 pointer-events-auto visible' 
            : 'opacity-0 pointer-events-none hidden'
        }`}
      >
        {currentSceneId && (
          <ScenePage 
            sceneId={currentSceneId} 
            onBack={handleBackToMap}
          />
        )}
      </div>

      {/* 🎯 4. 結算頁防線 */}
      <div 
        className={`w-full min-h-screen absolute inset-0 z-40 transition-opacity duration-300 ${
          currentPage === 'summary' 
            ? 'opacity-100 pointer-events-auto visible' 
            : 'opacity-0 pointer-events-none hidden'
        }`}
      >
        <SummaryPage onRestart={handleRestart} />
      </div>

    </div>
  );
}

export default function App() {
  return (
    <GameProvider>
      <div className="w-full min-h-screen overflow-x-hidden font-sans selection:bg-indigo-100 selection:text-indigo-900 bg-[#F8FAFC]">
        <GameRouter />
      </div>
    </GameProvider>
  );
}