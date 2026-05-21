export interface ChoiceOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface RiskQuestion {
  id: string;
  sceneId: string;
  title: string;
  type: 'Password' | 'Social Engineering' | 'Physical Security' | 'Data Protection';
  description: string;
  choices: ChoiceOption[];
  correctExplanation: string;
  incorrectExplanation: string;
  knowledgeTip: string;
  completedText: string;

  // 🎯 核心修改：讓每一題從 Excel 讀出來時，都能直接帶有自己的熱點座標與標籤
  x: number;      // 0 ~ 1 的純數值
  y: number;      // 0 ~ 1 的純數值
  width: number;  // 0 ~ 1 的純數值
  height: number; // 0 ~ 1 的純數值
  label: string;  // 熱點懸停時顯示的文字
}

export interface Hotspot {
  id: string; // matches RiskQuestion.id
  x: number; // 0 to 1
  y: number; // 0 to 1
  width: number; // 0 to 1
  height: number; // 0 to 1
  label?: string;
}

export interface Scene {
  id: string;
  name: string;
  description: string;
  image: string;
  hotspots: Hotspot[];
  thumbnail: string;
}

export interface GameState {
  completedRiskIds: string[];
  score: number;
  currentSceneId: string | null;
}