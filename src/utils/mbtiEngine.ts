import { DetectiveReport, RadarScores, AlertLevel } from '../types';
import { MBTI_PROFILES } from '../data/defaultScenarios';

interface AnalyzeInput {
  candidateName: string;
  jobTitle: string;
  q1: string;
  q2: string;
  q3: string;
  q4: string;
  followup1?: string;
  followup2?: string;
}

export function generateDossierId(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let rand = '';
  for (let i = 0; i < 4; i++) {
    rand += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `DET-${new Date().getFullYear()}-${rand}`;
}

export function analyzeMBTIResponse(input: AnalyzeInput): DetectiveReport {
  const { candidateName, jobTitle, q1, q2, q3, q4, followup1 = '', followup2 = '' } = input;
  const allText = `${q1} ${q2} ${q3} ${q4} ${followup1} ${followup2}`;
  const baseText = `${q1} ${q2} ${q3} ${q4}`;
  const stressText = `${followup1} ${followup2}`;

  // Analyze E vs I
  // E cues: 聚會, 慶功, 聊天, 熱鬧, 社交, 大家, 跨部門, 互動, 喝一杯, 發起
  // I cues: 安靜, 獨處, 梳理, 休息, 充電, 消耗, 一個人, 沉澱, 婉拒, 空間
  const eBaseCues = (q1.match(/聚會|慶功|熱鬧|社交|喝一杯|發起|聊天|一起|大家|狂歡/g) || []).length;
  const iBaseCues = (q1.match(/安靜|獨處|梳理|回家|休息|充電|消耗|一個人|沉澱|婉拒|專注/g) || []).length;
  
  // Analyze S vs N
  // S cues: 數據, 實證, 小規模, 試點, 樣本, 落地, 客觀, 細節, 經驗, 事實
  // N cues: 宏觀, 願景, 典範, 趨勢, 搶佔, 直覺, 想像, 突破, 故事, 長遠
  const sBaseCues = (q2.match(/數據|實證|試點|小規模|樣本|客觀|數字|驗證|事實|落地/g) || []).length;
  const nBaseCues = (q2.match(/願景|宏觀|典範|趨勢|搶佔|直覺|未來|可能性|概念|佈局/g) || []).length;

  // Analyze T vs F
  // T cues: KPI, 制度, 客觀, 績效, 考核, 規則, 標準, 替換, 責任, 交付
  // F cues: 同理, 感受, 關懷, 家庭, 人情, 溫度, 傾聽, 心情, 陪伴, 體諒
  const tBaseCues = (q3.match(/KPI|制度|客觀|績效|考核|規則|標準|替換|交接|風險|底線/g) || []).length;
  const fBaseCues = (q3.match(/同理|感受|關懷|家庭|人情|溫度|傾聽|心情|慰勞|體諒|支持/g) || []).length;

  // Analyze J vs P
  // J cues: 甘特圖, SOP, 流程, 規劃, 嚴格, 控管, 簽核, 里程碑, 排程, 按部就班
  // P cues: 靈活, 彈性, 擁抱變化, 應變, 打破, 調整, 試試看, 隨機, 探索, 邊做邊改
  const jBaseCues = (q4.match(/甘特圖|SOP|流程|規劃|嚴格|控管|簽核|里程碑|排程|規範|框架/g) || []).length;
  const pBaseCues = (q4.match(/靈活|彈性|變化|應變|打散|邊做邊改|嘗試|調整|探索|敏捷/g) || []).length;

  // Stress-test shift detection:
  // Did candidate express a sharp contradiction in stressText?
  const pStressCues = (stressText.match(/邊做邊改|跳過流程|緩不濟急|先做再說|計畫趕不上變化|事後補|王道|靈活/g) || []).length;
  const iStressCues = (stressText.match(/窒息|被榨乾|枯竭|關機|躲在|不跟任何人說話|演出來的|獨處/g) || []).length;
  const tStressCues = (stressText.match(/堅持流程|風險|客觀|宕機|堅持|數據|報告/g) || []).length;
  const fStressCues = (stressText.match(/心軟|無法割捨|保護|情緒/g) || []).length;

  // Default baseline radar scores (initial face presented by candidate)
  let baseE = Math.min(95, Math.max(25, 50 + (eBaseCues - iBaseCues) * 18));
  let baseI = 100 - baseE;

  let baseS = Math.min(95, Math.max(25, 50 + (sBaseCues - nBaseCues) * 18));
  let baseN = 100 - baseS;

  let baseT = Math.min(95, Math.max(25, 50 + (tBaseCues - fBaseCues) * 18));
  let baseF = 100 - baseT;

  let baseJ = Math.min(95, Math.max(25, 50 + (jBaseCues - pBaseCues) * 18));
  let baseP = 100 - baseJ;

  // Convergent real scores under stress
  let convE = baseE;
  let convI = baseI;
  let convS = baseS;
  let convN = baseN;
  let convT = baseT;
  let convF = baseF;
  let convJ = baseJ;
  let convP = baseP;

  let suspectDimension = '無顯著可疑包裝';
  let discrepancyDetail = '';
  let psychologicalMotive = '';
  let workplaceRisk = '';
  let sharpQuestion = '';
  let observationPoints: string[] = [];
  let verificationTech = '';
  let honestyScore = 88;
  let alertLevel: AlertLevel = 'green';

  // Scenario 1 Check: J to P packaging (Classic PM packaging)
  if (pStressCues >= 1 || (baseJ > 65 && /先做再說|跳過流程|事後補|邊做邊改/.test(stressText))) {
    convJ = 28;
    convP = 72;
    honestyScore = 48;
    alertLevel = 'red';
    suspectDimension = 'J（判斷 / 嚴謹計畫） vs P（感知 / 彈性應變）';
    discrepancyDetail =
      '受測者在第 4 題刻意強調其具備高條理性的變更控制流程（J 型特徵），試圖展現對進度控管的極致專業；但在壓力反問下，承認緊急時會「直接跳過流程、邊做邊改、事後補文件」，思維本能實際上屬於高彈性應變的 P 型。';
    psychologicalMotive = `為了迎合「${jobTitle || '專案經理'}」對時程紀律與控制 SOP 的職位刻板印象，刻意隱藏天性中對於僵化流程的不耐煩。`;
    workplaceRisk =
      '入職後若主導中大型複雜跨團隊專案，可能在混亂期放棄紀律監控，導致專案範疇（Scope Creep）失控與文檔斷層。';
    sharpQuestion =
      '「請具體分享一個你曾經因為跳過既定流程『邊做邊改』，最後導致其他部門無法接手或嚴重回溯失誤的真實案例，當時你如何向上級交待？」';
    observationPoints = [
      '觀察其是否敢於承認失誤，還是繼續將責任推給「不可抗力的需求變更」',
      '注意其是否有實質建立過流程，抑或是僅具備單打獨鬥的救火本領',
    ];
    verificationTech = 'BEI 行為事件面試法（STAR 負向經驗深挖）+ 即時繪製關鍵流程圖測試';
  } 
  // Scenario 2 Check: E to I packaging (PR / Sales packaging)
  else if (iStressCues >= 1 || (baseE > 65 && /被榨乾|窒息|演出來的|關機|躲在/.test(stressText))) {
    convE = 32;
    convI = 68;
    honestyScore = 62;
    alertLevel = 'yellow';
    suspectDimension = 'E（外向社交充電） vs I（內向獨處回血）';
    discrepancyDetail =
      '受測者在第 1 題自稱是「派對發起人、社交即充電」，表現出外向 E 型人格特質；但在追問連續社交壓力的真實心態時，坦承「上班熱情都是職業本能演出來的，真實心態感到被榨乾與窒息，需要絕對獨處」。';
    psychologicalMotive = `為爭取「${jobTitle || '公關業務主管'}」等需要高頻人際連結的職缺，過度神話自身的人際續航力。`;
    workplaceRisk =
      '長期暴露於高頻率外部應酬與密集跨部門溝通時，容易產生嚴重的「職業倦怠（Burnout）」與情緒內耗，影響關鍵時刻的決策穩定度。';
    sharpQuestion =
      '「如果這份工作要求你連續兩週在下班後代表公司出席高強度商業飯局，你如何確保白天策略規劃的專注力不會因社交耗竭而崩潰？」';
    observationPoints = [
      '注意其是否能客觀規劃「精力管理機制」，而非再度以「我天生熱愛社交」等官腔帶過',
      '觀察其眼神與肢體放鬆程度，真實 I 型在談及大量無效社交時常有防衛或微表情緊繃',
    ];
    verificationTech = '極限情境模擬（High-Frequency Social Load Stress Test）';
  }
  // Scenario 3 Check: High consistency (e.g. Honest INTJ / Realistic Candidate)
  else if (stressText.length > 20 && (/堅持|客觀|風險|標準|代價|底線/.test(stressText) || /婉拒|梳理|實驗|試點/.test(baseText))) {
    honestyScore = 94;
    alertLevel = 'green';
    suspectDimension = '無顯著偽裝，前後邏輯高度一致';
    discrepancyDetail =
      '受測者在初測 4 題中展現出清晰的個人決策主線，面對 AI 偵探的權威壓力反問時，並未隨機迎合或倒向討好答案，而是本著理性依據提供風險折衷方案，表裡落差極低。';
    psychologicalMotive = '受測者傾向於以真實專業風格尋求文化契合，而非透過話術迎合考官。';
    workplaceRisk = '原則性極強，在需要高度靈活妥協或政治斡旋的情境中，可能顯得過於直白堅持。';
    sharpQuestion =
      '「當你的專業客觀分析與公司最高管理階層的直覺願景產生正面衝突，且高層不願意看更多數據時，你最後會如何推動專案？」';
    observationPoints = [
      '評估其在堅持專業底線之餘，是否具備建設性的向上溝通說服手腕',
      '觀察其團隊協商的成熟度',
    ];
    verificationTech = '架構衝突情境推演面試法';
  } else {
    // General dynamic balance calculation
    const wordCount = allText.length;
    const buzzwords = (allText.match(/平衡|兼顧|兩派都能|折衷|看情況|雙贏|各打五十大板/g) || []).length;
    if (buzzwords >= 3) {
      honestyScore = 65;
      alertLevel = 'yellow';
      convJ = Math.max(30, baseJ - 20);
      convP = 100 - convJ;
      suspectDimension = '決策果斷性模糊（過度提供平衡型標準答案）';
      discrepancyDetail =
        '受測者在多題中大量使用「兼顧、平衡、折衷」等無風險的中立回答，刻意隱藏真實性格端點，有較高程度的「面試標準答案包裝」傾向。';
      psychologicalMotive = '避免在面試時顯露極端偏好，試圖維持全能完美的虛假形象。';
      workplaceRisk = '在真實重大危機決策時刻可能猶豫不決，或試圖討好各方而延誤戰機。';
      sharpQuestion = '「如果只能二選一，完全不允許折衷方案，你個人本能會捨棄同理心還是捨棄進度？」';
      observationPoints = ['強迫其做出取捨，觀察其真實優先級'];
      verificationTech = '極端二選一強制決策壓力測試';
    } else {
      honestyScore = 85;
      alertLevel = 'green';
      suspectDimension = '整體一致性良好';
      discrepancyDetail = '各維度表現平穩自然，未見顯著言語矛盾或過度包裝跡象。';
      psychologicalMotive = '自信展現個人工作模式，具備誠信溝通基底。';
      workplaceRisk = '正常職能磨合，無異常性格隱患。';
      sharpQuestion = '「在過去經驗中，你最享受哪種類型的團隊氛圍與主管領導風格？」';
      observationPoints = ['確認其與現有團隊文化的適配度'];
      verificationTech = '價值觀契合度對話';
    }
  }

  // Determine Convergent MBTI 4-letter type
  const pole1 = convE >= convI ? 'E' : 'I';
  const pole2 = convS >= convN ? 'S' : 'N';
  const pole3 = convT >= convF ? 'T' : 'F';
  const pole4 = convJ >= convP ? 'J' : 'P';
  const predictedMBTI = `${pole1}${pole2}${pole3}${pole4}`;

  const profile = MBTI_PROFILES[predictedMBTI] || MBTI_PROFILES['INTJ'];
  const discrepancyGap = Math.round(100 - honestyScore);

  const baselineScores: RadarScores = {
    E: Math.round(baseE),
    I: Math.round(baseI),
    S: Math.round(baseS),
    N: Math.round(baseN),
    T: Math.round(baseT),
    F: Math.round(baseF),
    J: Math.round(baseJ),
    P: Math.round(baseP),
  };

  const convergentScores: RadarScores = {
    E: Math.round(convE),
    I: Math.round(convI),
    S: Math.round(convS),
    N: Math.round(convN),
    T: Math.round(convT),
    F: Math.round(convF),
    J: Math.round(convJ),
    P: Math.round(convP),
  };

  const dimensionDeltas = [
    {
      dimension: 'E/I',
      label: '外向社交 (E) vs 內向沉靜 (I)',
      baseline: baselineScores.E,
      convergent: convergentScores.E,
      gap: Math.abs(baselineScores.E - convergentScores.E),
      isSuspect: Math.abs(baselineScores.E - convergentScores.E) >= 25,
    },
    {
      dimension: 'S/N',
      label: '具體實證 (S) vs 宏觀願景 (N)',
      baseline: baselineScores.S,
      convergent: convergentScores.S,
      gap: Math.abs(baselineScores.S - convergentScores.S),
      isSuspect: Math.abs(baselineScores.S - convergentScores.S) >= 25,
    },
    {
      dimension: 'T/F',
      label: '客觀理性 (T) vs 同理價值 (F)',
      baseline: baselineScores.T,
      convergent: convergentScores.T,
      gap: Math.abs(baselineScores.T - convergentScores.T),
      isSuspect: Math.abs(baselineScores.T - convergentScores.T) >= 25,
    },
    {
      dimension: 'J/P',
      label: '條理計畫 (J) vs 彈性隨機 (P)',
      baseline: baselineScores.J,
      convergent: convergentScores.J,
      gap: Math.abs(baselineScores.J - convergentScores.J),
      isSuspect: Math.abs(baselineScores.J - convergentScores.J) >= 25,
    },
  ];

  // Distinct behavioral traits
  const dominantTraits = [
    {
      title: `真實工作風格：${pole4 === 'J' ? '目標掌控與收斂定案' : '高機動探索與敏捷應變'} (${pole4} 型)`,
      tag: pole4 === 'J' ? '高條理性 (J)' : '高敏捷性 (P)',
      behaviorDesc:
        pole4 === 'J'
          ? '偏好在行動前將邊界、截止日與產出標準定稿；對混亂未知狀態會迅速施加結構化控制。'
          : '在規則鬆散、動態變化的環境中能展現驚人的即興處置能量，不喜過多被僵化死板的日程表拘束。',
      teamRoleStyle:
        pole4 === 'J'
          ? '專案的推進器與驗收節點守門員，能確保交期準時兌現。'
          : '破局突破手與靈活轉舵者，擅長在突發危機中找尋非常規解決路徑。',
      managementAdvice:
        pole4 === 'J'
          ? '給予明確的權責範圍與里程碑驗收標準，避免臨時反覆變動其規劃好的時程。'
          : '以「最終交付成果」而非「每日打卡與繁瑣流程」來衡量績效，保留適度自主排程彈性。',
    },
    {
      title: `決策價值中樞：${pole3 === 'T' ? '客觀原則與數據底線' : '深層同理與團隊和睦'} (${pole3} 型)`,
      tag: pole3 === 'T' ? '客觀理性 (T)' : '人際關懷 (F)',
      behaviorDesc:
        pole3 === 'T'
          ? '評估問題時優先抽離情緒，以因果邏輯、資源投入產出比（ROI）與事實為依據。'
          : '極具人際敏銳度，優先顧及團隊成員的情緒安全感與長遠信任，致力於化解潛在衝突。',
      teamRoleStyle:
        pole3 === 'T'
          ? '冷靜的分析者與客觀裁判，能在情緒熱度中給予冰冷而必要的邏輯檢視。'
          : '團隊文化的黏著劑與溝通橋樑，能有效預防成員士氣崩盤。',
      managementAdvice:
        pole3 === 'T'
          ? '溝通時直奔主題與事實論據，勿用含糊的人情勒索；重視客觀功過。'
          : '在給予批評反饋時注意私下進行與語氣包裝，先肯定其付出再討論改善點。',
    },
  ];

  const detectiveVerdict =
    alertLevel === 'red'
      ? `偵探警示：受測者在【${suspectDimension}】出現顯著行為斷層。初測刻意營造符合職缺期待的標準姿態，但在壓力追問下暴露真實本能。建議 HR 實體面試務必啟動深偽驗證。`
      : alertLevel === 'yellow'
      ? `偵探觀察：受測者具備一定的職場包裝習慣，在【${suspectDimension}】有修飾跡象，存在部分官腔平衡話術。建議面試官就疑點進行針對性抽驗。`
      : `偵探認證：受測者言行高度表裡一致，面對權威質詢能堅守邏輯準繩，未見刻意討好迎合或刷題偽裝，心理誠實指數優秀。`;

  return {
    dossierId: generateDossierId(),
    evaluatedAt: new Date().toLocaleString('zh-TW', { hour12: false }),
    candidateName: candidateName || '求職者 (未指定)',
    jobTitle: jobTitle || '關鍵職缺候選人',
    predictedMBTI,
    mbtiTitle: `${profile.name} · ${profile.archetype}`,
    mbtiSummary: profile.summary,
    alertLevel,
    honestyScore,
    discrepancyGap,
    detectiveVerdict,
    baselineScores,
    convergentScores,
    dimensionDeltas,
    dominantTraits,
    camouflageAnalysis: {
      suspectDimension,
      discrepancyDetail,
      psychologicalMotive,
      workplaceRisk,
    },
    hrInterviewGuide: {
      sharpQuestion,
      observationPoints,
      recommendedVerificationTech: verificationTech,
    },
  };
}
