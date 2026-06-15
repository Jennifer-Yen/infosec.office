import { Scene, RiskQuestion } from '../types/game';
import * as XLSX from 'xlsx';

// 1. 保留原有場景設定，但將 hotspots 全部清空，完全由 Excel 來決定熱點
export const SCENES: Scene[] = [
  {
    id: 'entrance',
    name: '公司出入口 Entrance',
    description: '這裡是公司的第一道防線，觀察人員進出是否有可疑之處。',
    image: '/pictures/entrance_background.png',
    thumbnail: '/pictures/entrance.png',
    hotspots: [] 
  },
  {
    id: 'public',
    name: '公共區域 Public Area',
    description: '人員頻繁流動的區域，資訊安全風險也相對較高，需特別留意。',
    image: '/pictures/public.png',
    thumbnail: '/pictures/public.png',
    hotspots: [] 
  },
  {
    id: 'personal',
    name: '個人辦公區 Personal Area',
    description: '員工最常待的地方，充滿了日常容易忽略的資安細節。',
    image: '/pictures/personal_background.png',
    thumbnail: '/pictures/personal.png',
    hotspots: []
  }
];

// Fisher-Yates 洗牌演算法
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// 2. 匯出動態讀取 Excel 的非同步函式
export async function fetchRiskQuestions(): Promise<RiskQuestion[]> {
  try {
    const response = await fetch('/data/DataSet.xlsx');
    const arrayBuffer = await response.arrayBuffer();
    const workbook = XLSX.read(new Uint8Array(arrayBuffer), { type: 'array' });
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    
    // 將 Excel 轉換成 JSON 陣列
    const rawData: any[] = XLSX.utils.sheet_to_json(firstSheet);

    // 轉換格式並處理隨機洗牌選項
    return rawData.map((row) => ({
      id: String(row.id),
      sceneId: row.sceneId,
      title: row.title,
      type: row.type,
      description: row.description,
      choices: shuffleArray([
        { id: 'a', text: row.choice_1_text, isCorrect: row.choice_1_isCorrect === 'TRUE' || row.choice_1_isCorrect === true },
        { id: 'b', text: row.choice_2_text, isCorrect: row.choice_2_isCorrect === 'TRUE' || row.choice_2_isCorrect === true },
        { id: 'c', text: row.choice_3_text, isCorrect: row.choice_3_isCorrect === 'TRUE' || row.choice_3_isCorrect === true }
      ]),
      correctExplanation: row.correctExplanation,
      incorrectExplanation: row.incorrectExplanation,
      knowledgeTip: row.knowledgeTip,
      completedText: row.completedText,

      // 🎯 核心修改：直接從 Excel 的行資料中對應 x, y, width, height, label 欄位
      // 若欄位為空則給予安全的預設值，確保系統不會壞掉
      x: row.x !== undefined ? Number(row.x) : 0.5,
      y: row.y !== undefined ? Number(row.y) : 0.5,
      width: row.width !== undefined ? Number(row.width) : 0.1,
      height: row.height !== undefined ? Number(row.height) : 0.1,
      label: row.label ? String(row.label) : String(row.title),
      objectImage: row.objectImage ? String(row.objectImage) : undefined
    }));
  } catch (error) {
    console.error("讀取 DataSet.xlsx 失敗，回傳空陣列：", error);
    return [];
  }
}