import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { analyzeMBTIResponse } from './src/utils/mbtiEngine';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Initialize GoogleGenAI server-side with User-Agent header
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;
if (apiKey) {
  aiClient = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// API: Generate AI Stress-Test Followup Question
app.post('/api/chat/followup', async (req, res) => {
  try {
    const { candidateName = '求職者', jobTitle = '關鍵職缺', q1 = '', q2 = '', q3 = '', q4 = '' } = req.body;

    if (!aiClient) {
      // Heuristic fallback if no GEMINI_API_KEY
      const heuristicReport = analyzeMBTIResponse({
        candidateName,
        jobTitle,
        q1,
        q2,
        q3,
        q4,
      });

      let fallbackQuestion = '在真實重大壓力下，如果既定流程與客戶需求產生不可調和的正面衝突，且高層限期今天下班前拿出解法，你當下會放棄哪一個堅持？為什麼？';
      let targetDim = 'JP';

      if (/甘特圖|SOP|流程|嚴格/.test(q4)) {
        fallbackQuestion = `你在第四題特別強調會嚴格依據標準變更流程（SOP）來控管風險。但在真實高壓環境下：如果客戶是掌控公司 40% 營收的關鍵客戶，他堅持不延長截止日、且要求本週五前必須上線，而研發團隊已經連續加班 3 天並揚言抗議。在這種極限狀況下，你『當下第一個會妥協或跳過』的具體是什麼？請具體說明你過去一次真實的妥協經驗。`;
        targetDim = 'JP (判斷 vs 感知)';
      } else if (/聚會|慶功|熱鬧|發起|社交/.test(q1)) {
        fallbackQuestion = `你在第一題提到慶功聚會是很好的士氣激勵與充電方式。但若這份「${jobTitle}」工作需要你連續兩週、每天下班後都必須代表團隊出席各類商務晚宴或內部斡旋，你在第二個週末獨自一人時，內心真實的精力狀態是感到充實興奮，還是會產生強烈的倦怠甚至想關機拒絕任何人聯絡？請坦率分享你真實的耐受極限。`;
        targetDim = 'EI (外向 vs 內向)';
      } else if (/平衡|兼顧|兩派/.test(q2) || /兩邊/.test(q3)) {
        fallbackQuestion = `你的回答非常周全平衡，兼顧了兩造觀點。然而在真實商業決策中資源是殘酷的二選一：如果你手中只有 100 萬預算與 3 週時間，必須在『數據驗證』與『搶佔先機願景』中只挑一個全力下注，你個人直覺會壓哪一邊？請給出一個不能折衷的選擇。`;
        targetDim = '決策果斷性驗證';
      }

      return res.json({
        question: fallbackQuestion,
        targetDimension: targetDim,
        reason: '系統偵測到受測者在此維度可能使用了平衡或防禦型包裝，啟動壓力測試。',
      });
    }

    const prompt = `你是一位專精於「求職者面試人格防偽裝」的心理學鑑識專家與資深 HR 偵探。
目前求職者正在進行 4 題中立職場情境測驗（分別誘發 E/I、S/N、T/F、J/P 四大維度）。

求職者基本資料：
- 姓名/代號：${candidateName}
- 應徵職位：${jobTitle}

求職者的前 4 題原始回答如下：
1. 【E/I 情境一（週五高壓衝刺後慶功社交 vs 獨處梳理）】：
${q1}

2. 【S/N 情境二（未知新市場評估：小規模數據試點 vs 宏觀產業願景先機）】：
${q2}

3. 【T/F 情境三（骨幹成員家庭變故導致關鍵指標交付危機：客觀績效與換人 vs 人道關懷同理）】：
${q3}

4. 【J/P 情境四（詳盡甘特圖剛定稿，客戶突發高價值大需求：嚴格流程管控 vs 靈活打散重來）】：
${q4}

任務：
1. 快速診斷上述 4 個回答中，哪一個維度最具有「面試標準答案包裝感」、「太過官腔或兩面討好」，或者「刻意迎合該職缺（${jobTitle}）的特定刻板印象」。
2. 針對該模糊或可疑的維度，生成 1 題具有「強烈情境代入感、極限逼供、不給模糊折衷空間」的犀利反問追問（Pressure Stress-Test Question）。
3. 語氣保持專業、冷靜、敏銳，直接切入核心矛盾，逼出候選人無可偽裝的真實思維本能。

請以純 JSON 格式回傳，格式如下：
{
  "targetDimension": "被鎖定的維度（如 J/P 條理 vs 彈性）",
  "reason": "為什麼鎖定這個維度（指出其回答中過度包裝或矛盾的蛛絲馬跡，約 30-50 字）",
  "question": "向求職者提出的犀利追問（約 80-150 字）"
}`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '';
    const parsed = JSON.parse(text);
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error generating followup:', error);
    // Graceful fallback
    const { jobTitle = '關鍵職缺', q4 = '' } = req.body;
    return res.json({
      question: `你在回答中展現了周延的規劃能力。但在高壓極限狀態下，如果時間和資源只允許你滿足團隊穩定或客戶急迫需求其中一項，你的本能第一選擇是什麼？請舉出過往真實經歷佐證。`,
      targetDimension: 'J/P (流程與應變權衡)',
      reason: '啟動標準壓力情境反問。',
    });
  }
});

// API: Generate Forensic MBTI Detective Report
app.post('/api/chat/report', async (req, res) => {
  try {
    const {
      candidateName = '求職者',
      jobTitle = '關鍵職缺',
      q1 = '',
      q2 = '',
      q3 = '',
      q4 = '',
      followup1 = '',
      followup2 = '',
    } = req.body;

    // Start with our deterministic baseline calculations
    const baseReport = analyzeMBTIResponse({
      candidateName,
      jobTitle,
      q1,
      q2,
      q3,
      q4,
      followup1,
      followup2,
    });

    if (!aiClient) {
      return res.json(baseReport);
    }

    // Enhance with Gemini insights
    const prompt = `你是一位專業心理鑑識專家與資深人資長（CHRO）。請為求職者產出最終的「偵探分析報告」。
求職者：${candidateName}
應徵職缺：${jobTitle}

4 題基礎情境回答：
Q1 (E/I): ${q1}
Q2 (S/N): ${q2}
Q3 (T/F): ${q3}
Q4 (J/P): ${q4}

AI 壓力追問與回答：
追問問題 1: ${followup1}
受測者追加回答 1: ${followup2}

目前演算法初判結果：
預測真實 MBTI: ${baseReport.predictedMBTI}
誠實度警示燈: ${baseReport.alertLevel} (green/yellow/red)
誠實度指數: ${baseReport.honestyScore}%

請以專業犯罪心理學與組織行為學的精準筆觸，補強並輸出完整的偵探報告 JSON：
1. detectiveVerdict: 50-80 字精闢犀利的偵探鑑識結論。
2. suspectDimension: 可疑維度名稱。
3. discrepancyDetail: 詳述受測者在基礎題包裝了什麼，而在追問中暴露了何種本能衝突（80-120 字）。
4. psychologicalMotive: 其包裝動機（例如為迎合 ${jobTitle} 的要求）。
5. workplaceRisk: 入職後該性格矛盾可能引發的團隊摩擦或專案風險。
6. hrInterviewGuide: 
   - sharpQuestion: 1 題給 HR 在實體面試時親自驗證其偽裝的犀利問題。
   - observationPoints: [2-3 個面試官需留意的微表情或回答線索]
   - recommendedVerificationTech: 推薦的具體面試驗證技巧名稱。

請回傳 JSON：
{
  "detectiveVerdict": "...",
  "suspectDimension": "...",
  "discrepancyDetail": "...",
  "psychologicalMotive": "...",
  "workplaceRisk": "...",
  "hrInterviewGuide": {
    "sharpQuestion": "...",
    "observationPoints": ["...", "..."],
    "recommendedVerificationTech": "..."
  }
}`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '';
    const parsed = JSON.parse(text);

    // Merge Gemini nuanced text into our verified report structure
    const finalReport = {
      ...baseReport,
      detectiveVerdict: parsed.detectiveVerdict || baseReport.detectiveVerdict,
      camouflageAnalysis: {
        suspectDimension: parsed.suspectDimension || baseReport.camouflageAnalysis.suspectDimension,
        discrepancyDetail: parsed.discrepancyDetail || baseReport.camouflageAnalysis.discrepancyDetail,
        psychologicalMotive: parsed.psychologicalMotive || baseReport.camouflageAnalysis.psychologicalMotive,
        workplaceRisk: parsed.workplaceRisk || baseReport.camouflageAnalysis.workplaceRisk,
      },
      hrInterviewGuide: {
        sharpQuestion: parsed.hrInterviewGuide?.sharpQuestion || baseReport.hrInterviewGuide.sharpQuestion,
        observationPoints: parsed.hrInterviewGuide?.observationPoints || baseReport.hrInterviewGuide.observationPoints,
        recommendedVerificationTech: parsed.hrInterviewGuide?.recommendedVerificationTech || baseReport.hrInterviewGuide.recommendedVerificationTech,
      },
    };

    return res.json(finalReport);
  } catch (error: any) {
    console.error('Error generating report:', error);
    const fallback = analyzeMBTIResponse(req.body);
    return res.json(fallback);
  }
});

// Vite or Static Serving
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`[AI Stress-Test Detective] Server listening on port ${PORT}`);
  });
}

startServer();
