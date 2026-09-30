import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ChatInterface } from './components/ChatInterface';
import { ReportView } from './components/ReportView';
import { HelpModal } from './components/HelpModal';
import { ChatMessage, DetectiveReport, PresetCase } from './types';
import { BASE_QUESTIONS, PRESET_CASES } from './data/defaultScenarios';
import { analyzeMBTIResponse } from './utils/mbtiEngine';

export default function App() {
  // Candidate Profile State
  const [candidateName, setCandidateName] = useState('陳冠宇 (David Chen)');
  const [jobTitle, setJobTitle] = useState('資深專案經理 (Technical PM)');
  const [dossierId, setDossierId] = useState<string>('');

  // Navigation & View State
  const [view, setView] = useState<'chat' | 'report'>('chat');
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // Chat & Stepper State
  // 0: Q1, 1: Q2, 2: Q3, 3: Q4, 4: Stress Followup, 5: Ready for Report
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [answers, setAnswers] = useState<{
    q1: string;
    q2: string;
    q3: string;
    q4: string;
    followup1?: string;
    followup2?: string;
  }>({
    q1: '',
    q2: '',
    q3: '',
    q4: '',
  });

  const [followupCount, setFollowupCount] = useState(0);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [aiThinkingText, setAiThinkingText] = useState('AI 偵探正在比對語意特徵與心理維度...');

  // Final Report State
  const [report, setReport] = useState<DetectiveReport | null>(null);

  // Initialize opening message on mount
  useEffect(() => {
    initChat(candidateName, jobTitle);
  }, []);

  const initChat = (name: string, title: string) => {
    const openingMsg: ChatMessage = {
      id: 'msg-welcome',
      sender: 'ai',
      stage: 'setup',
      timestamp: new Date().toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' }),
      text: `你好，我是【AI 情境測試偵探】。\n本次測驗針對「${title}」關鍵職缺進行適性與工作風格鑑識。不同於傳統是非題或透明的評量，接下來系統將拋出 4 個具備真實張力的職場情境，沒有標準答案，請依照你過往在極限或高壓工作時的「真實直覺與第一反應」進行文字作答。\n\n答題完畢後，AI 偵探將進行即時語意掃描與動態追問。請放鬆心態，坦誠作答。`,
    };

    const firstQuestionMsg: ChatMessage = {
      id: 'msg-q1',
      sender: 'ai',
      stage: 'base_question',
      questionId: 1,
      dimension: 'EI',
      timestamp: new Date().toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' }),
      text: `【情境一：高壓衝刺後的精力恢復與人際互動】\n\n${BASE_QUESTIONS[0].scenarioText}`,
    };

    setMessages([openingMsg, firstQuestionMsg]);
    setCurrentStepIndex(0);
    setAnswers({ q1: '', q2: '', q3: '', q4: '' });
    setReport(null);
    setView('chat');
  };

  const handleUpdateCandidateInfo = (name: string, title: string) => {
    setCandidateName(name);
    setJobTitle(title);
  };

  const handleSendMessage = async (text: string) => {
    const timestamp = new Date().toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessage = {
      id: `msg-user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp,
      stage: currentStepIndex < 4 ? 'base_question' : 'stress_followup',
    };

    setMessages((prev) => [...prev, userMsg]);

    // Handle base questions 1 to 4
    if (currentStepIndex === 0) {
      setAnswers((prev) => ({ ...prev, q1: text }));
      proceedToNextBaseQuestion(1, text);
    } else if (currentStepIndex === 1) {
      setAnswers((prev) => ({ ...prev, q2: text }));
      proceedToNextBaseQuestion(2, text);
    } else if (currentStepIndex === 2) {
      setAnswers((prev) => ({ ...prev, q3: text }));
      proceedToNextBaseQuestion(3, text);
    } else if (currentStepIndex === 3) {
      const updatedAnswers = { ...answers, q4: text };
      setAnswers(updatedAnswers);
      // All 4 base questions answered! Now trigger AI Stress Follow-up
      triggerStressFollowup(updatedAnswers);
    } else if (currentStepIndex === 4) {
      // User responded to the Stress Follow-up!
      setAnswers((prev) => ({ ...prev, followup2: text }));
      setCurrentStepIndex(5); // Ready for report!

      const readyMsg: ChatMessage = {
        id: `msg-ai-ready-${Date.now()}`,
        sender: 'ai',
        stage: 'ready_for_report',
        timestamp: new Date().toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' }),
        text: `【鑑識資料庫收斂完成】\n受測者的 4 題情境基線反應與壓力追問回答已全部蒐集完畢。系統已鎖定八維認知端點的「包裝落差比（Gap）」與「抗壓收斂值」。\n\n請點擊下方按鈕，即刻生成兼具防偽裝雷達圖與 HR 面試追問指南的偵探分析報告。`,
      };
      setMessages((prev) => [...prev, readyMsg]);
    }
  };

  const proceedToNextBaseQuestion = (nextIndex: number, previousUserAnswer: string) => {
    setIsAiThinking(true);
    setAiThinkingText(`AI 偵探已擷取回答特徵，準備第 ${nextIndex + 1}/4 題職場情境...`);

    setTimeout(() => {
      setIsAiThinking(false);
      const nextQ = BASE_QUESTIONS[nextIndex];
      const aiNextMsg: ChatMessage = {
        id: `msg-q${nextIndex + 1}`,
        sender: 'ai',
        stage: 'base_question',
        questionId: nextIndex + 1,
        dimension: nextQ.dimension,
        timestamp: new Date().toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' }),
        text: `【${nextQ.scenarioTitle}】\n\n${nextQ.scenarioText}`,
      };

      setMessages((prev) => [...prev, aiNextMsg]);
      setCurrentStepIndex(nextIndex);
    }, 700);
  };

  const triggerStressFollowup = async (allBaseAnswers: typeof answers) => {
    setIsAiThinking(true);
    setAiThinkingText('正在進行語意特徵深度掃描，鎖定潛在包裝或模糊維度...');
    setCurrentStepIndex(4); // stress test phase

    try {
      // Call server backend route `/api/chat/followup`
      const res = await fetch('/api/chat/followup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidateName,
          jobTitle,
          q1: allBaseAnswers.q1,
          q2: allBaseAnswers.q2,
          q3: allBaseAnswers.q3,
          q4: allBaseAnswers.q4,
        }),
      });

      let data;
      if (res.ok) {
        data = await res.json();
      } else {
        throw new Error('Server followup request failed');
      }

      setIsAiThinking(false);
      setFollowupCount(1);
      setAnswers((prev) => ({ ...prev, followup1: data.question }));

      const followupMsg: ChatMessage = {
        id: `msg-ai-stress-${Date.now()}`,
        sender: 'ai',
        stage: 'stress_followup',
        isStressTest: true,
        stressTargetDimension: data.targetDimension || 'J/P 組織條理 vs 應變',
        timestamp: new Date().toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' }),
        text: `【AI 偵探深度壓力反問】\n${data.reason ? `偵探觀察：${data.reason}\n\n` : ''}${data.question}`,
      };

      setMessages((prev) => [...prev, followupMsg]);
    } catch (err) {
      console.warn('API error, falling back locally:', err);
      // Fallback local question
      setIsAiThinking(false);
      setFollowupCount(1);
      const fallbackQ =
        '你在前述回答中展現了周全的折衷思維。但在真實職場極限衝突下，如果時間與資源只允許你滿足「既定流程」或「客戶緊急要求」其中一項，你的本能第一取捨會是什麼？請坦率分享你真實的底線。';
      setAnswers((prev) => ({ ...prev, followup1: fallbackQ }));

      const followupMsg: ChatMessage = {
        id: `msg-ai-stress-${Date.now()}`,
        sender: 'ai',
        stage: 'stress_followup',
        isStressTest: true,
        stressTargetDimension: '決策權衡壓力測試',
        timestamp: new Date().toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' }),
        text: `【AI 偵探深度壓力反問】\n${fallbackQ}`,
      };

      setMessages((prev) => [...prev, followupMsg]);
    }
  };

  const handleGenerateReport = async () => {
    setIsAiThinking(true);
    setAiThinkingText('正在交叉比對初始基線與壓力收斂真值，產出八維雷達圖與偵探案卷...');

    try {
      const res = await fetch('/api/chat/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidateName,
          jobTitle,
          q1: answers.q1,
          q2: answers.q2,
          q3: answers.q3,
          q4: answers.q4,
          followup1: answers.followup1 || '',
          followup2: answers.followup2 || '',
        }),
      });

      let finalReport: DetectiveReport;
      if (res.ok) {
        finalReport = await res.json();
      } else {
        throw new Error('Report endpoint failed');
      }

      setReport(finalReport);
      setDossierId(finalReport.dossierId);
      setView('report');
      setIsAiThinking(false);
    } catch (err) {
      console.warn('Using client fallback analyzer:', err);
      const fallbackReport = analyzeMBTIResponse({
        candidateName,
        jobTitle,
        q1: answers.q1,
        q2: answers.q2,
        q3: answers.q3,
        q4: answers.q4,
        followup1: answers.followup1,
        followup2: answers.followup2,
      });
      setReport(fallbackReport);
      setDossierId(fallbackReport.dossierId);
      setView('report');
      setIsAiThinking(false);
    }
  };

  // Quick preset case selection
  const handleSelectPreset = (preset: PresetCase) => {
    setCandidateName(preset.candidateName);
    setJobTitle(preset.jobTitle);

    const time = new Date().toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' });

    // Build the full completed chat sequence for this preset
    const presetMessages: ChatMessage[] = [
      {
        id: 'msg-welcome',
        sender: 'ai',
        stage: 'setup',
        timestamp: time,
        text: `你好，我是【AI 情境測試偵探】。\n本次測驗針對「${preset.jobTitle}」進行適性與工作風格鑑識。\n載入測試範本：${preset.title}`,
      },
      {
        id: 'msg-q1',
        sender: 'ai',
        stage: 'base_question',
        questionId: 1,
        dimension: 'EI',
        timestamp: time,
        text: `【情境一：高壓衝刺後的精力恢復與人際互動】\n\n${BASE_QUESTIONS[0].scenarioText}`,
      },
      {
        id: 'msg-ans-1',
        sender: 'user',
        stage: 'base_question',
        timestamp: time,
        text: preset.answers.q1,
      },
      {
        id: 'msg-q2',
        sender: 'ai',
        stage: 'base_question',
        questionId: 2,
        dimension: 'SN',
        timestamp: time,
        text: `【情境二：未知新市場策略評估與決策立足點】\n\n${BASE_QUESTIONS[1].scenarioText}`,
      },
      {
        id: 'msg-ans-2',
        sender: 'user',
        stage: 'base_question',
        timestamp: time,
        text: preset.answers.q2,
      },
      {
        id: 'msg-q3',
        sender: 'ai',
        stage: 'base_question',
        questionId: 3,
        dimension: 'TF',
        timestamp: time,
        text: `【情境三：關鍵骨幹成員家庭變故與團隊重大目標危機】\n\n${BASE_QUESTIONS[2].scenarioText}`,
      },
      {
        id: 'msg-ans-3',
        sender: 'user',
        stage: 'base_question',
        timestamp: time,
        text: preset.answers.q3,
      },
      {
        id: 'msg-q4',
        sender: 'ai',
        stage: 'base_question',
        questionId: 4,
        dimension: 'JP',
        timestamp: time,
        text: `【情境四：詳盡專案規劃遭遇突發高價值變更需求】\n\n${BASE_QUESTIONS[3].scenarioText}`,
      },
      {
        id: 'msg-ans-4',
        sender: 'user',
        stage: 'base_question',
        timestamp: time,
        text: preset.answers.q4,
      },
      {
        id: 'msg-stress-q',
        sender: 'ai',
        stage: 'stress_followup',
        isStressTest: true,
        stressTargetDimension: preset.id === 'pm-fake-j' ? 'J/P (條理 vs 彈性)' : preset.id === 'pr-fake-e' ? 'E/I (外向 vs 獨處)' : '邏輯一致性檢驗',
        timestamp: time,
        text: `【AI 偵探深度壓力反問】\n${preset.answers.followup1 || '在極限狀況下，你的真實取捨是什麼？'}`,
      },
      {
        id: 'msg-stress-ans',
        sender: 'user',
        stage: 'stress_followup',
        timestamp: time,
        text: preset.answers.followup2 || '',
      },
    ];

    setMessages(presetMessages);
    setAnswers(preset.answers);
    setCurrentStepIndex(5);

    // Compute report immediately for this preset
    const computedReport = analyzeMBTIResponse({
      candidateName: preset.candidateName,
      jobTitle: preset.jobTitle,
      q1: preset.answers.q1,
      q2: preset.answers.q2,
      q3: preset.answers.q3,
      q4: preset.answers.q4,
      followup1: preset.answers.followup1,
      followup2: preset.answers.followup2,
    });

    setReport(computedReport);
    setDossierId(computedReport.dossierId);
    setView('report');
  };

  const handleReset = () => {
    initChat(candidateName, jobTitle);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Navigation */}
      <Header
        currentView={view}
        onReset={handleReset}
        onSelectPreset={handleSelectPreset}
        onPrint={handlePrint}
        candidateName={candidateName}
        jobTitle={jobTitle}
        dossierId={dossierId || (report?.dossierId)}
        onOpenHelp={() => setIsHelpOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        {view === 'chat' ? (
          <ChatInterface
            messages={messages}
            currentStepIndex={currentStepIndex}
            candidateName={candidateName}
            jobTitle={jobTitle}
            onUpdateCandidateInfo={handleUpdateCandidateInfo}
            onSendMessage={handleSendMessage}
            onGenerateReport={handleGenerateReport}
            isAiThinking={isAiThinking}
            aiThinkingStatusText={aiThinkingText}
            followupCount={followupCount}
          />
        ) : (
          report && (
            <ReportView
              report={report}
              onRetest={() => {
                setView('chat');
              }}
              onPrint={handlePrint}
            />
          )
        )}
      </main>

      {/* Help & Concept Explanation Modal */}
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </div>
  );
}
