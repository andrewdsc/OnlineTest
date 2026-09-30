import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, ShieldAlert, Sparkles, Loader2, ArrowRight, CornerDownLeft, CheckCircle2, AlertTriangle, Fingerprint } from 'lucide-react';
import { ChatMessage, BaseQuestion } from '../types';
import { BASE_QUESTIONS } from '../data/defaultScenarios';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  currentStepIndex: number; // 0 to 3 for base questions, 4 for followup, 5 for ready
  candidateName: string;
  jobTitle: string;
  onUpdateCandidateInfo: (name: string, title: string) => void;
  onSendMessage: (text: string) => void;
  onGenerateReport: () => void;
  isAiThinking: boolean;
  aiThinkingStatusText?: string;
  onLoadPresetAnswer?: (answer: string) => void;
  followupCount: number;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  currentStepIndex,
  candidateName,
  jobTitle,
  onUpdateCandidateInfo,
  onSendMessage,
  onGenerateReport,
  isAiThinking,
  aiThinkingStatusText = 'AI 偵探正在比對語意特徵與心理維度...',
  onLoadPresetAnswer,
  followupCount,
}) => {
  const [inputText, setInputText] = useState('');
  const [isEditingProfile, setIsEditingProfile] = useState(!candidateName || !jobTitle);
  const [tempName, setTempName] = useState(candidateName);
  const [tempTitle, setTempTitle] = useState(jobTitle);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isAiThinking]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 140)}px`;
    }
  }, [inputText]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isAiThinking) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateCandidateInfo(tempName || '受測求職者', tempTitle || '關鍵職缺');
    setIsEditingProfile(false);
  };

  // Determine stage progress
  const isBasePhase = currentStepIndex < 4;
  const isStressPhase = currentStepIndex === 4;
  const isReadyForReport = currentStepIndex >= 5;

  return (
    <div className="flex flex-col h-[calc(100vh-4.5rem)] max-w-5xl mx-auto bg-slate-950 border-x border-slate-800/80 shadow-2xl overflow-hidden">
      {/* Top Context & Progress Bar */}
      <div className="bg-slate-900/90 border-b border-slate-800 px-4 py-3 backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Candidate Info Badge */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-cyan-950/60 border border-cyan-800/60 flex items-center justify-center text-cyan-400">
              <Fingerprint className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-slate-100">{candidateName || '尚未設定求職者'}</span>
                <span className="text-slate-500">•</span>
                <span className="text-xs text-cyan-300 font-medium">{jobTitle || '職缺未定'}</span>
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(true)}
                  className="text-[11px] text-slate-400 hover:text-cyan-300 underline underline-offset-2 ml-1"
                >
                  修改
                </button>
              </div>
              <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                <span>鑑識模式：AI 情境動態壓力測試</span>
                <span className="text-slate-600">|</span>
                <span className="text-emerald-400 font-mono">狀態：進行中</span>
              </div>
            </div>
          </div>

          {/* Stepper Progress */}
          <div className="flex items-center gap-2 text-xs">
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4].map((step) => {
                const isCompleted = currentStepIndex >= step;
                const isCurrent = currentStepIndex === step - 1;
                return (
                  <div
                    key={step}
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-mono font-bold text-xs transition-all ${
                      isCompleted
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/60 shadow-[0_0_8px_rgba(6,182,212,0.3)]'
                        : isCurrent
                        ? 'bg-cyan-600 text-white border-2 border-cyan-300 animate-pulse'
                        : 'bg-slate-800 text-slate-500 border border-slate-700'
                    }`}
                    title={`第 ${step} 題基礎職場情境`}
                  >
                    {step}
                  </div>
                );
              })}

              <span className="text-slate-600 mx-0.5">→</span>

              {/* Stress Test Indicator */}
              <div
                className={`px-2.5 py-1 rounded-full flex items-center gap-1 text-[11px] font-semibold transition-all ${
                  isStressPhase
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/60 animate-pulse shadow-[0_0_10px_rgba(245,158,11,0.3)]'
                    : currentStepIndex > 4
                    ? 'bg-amber-950/40 text-amber-400 border border-amber-800/40'
                    : 'bg-slate-800 text-slate-500 border border-slate-700'
                }`}
              >
                <AlertTriangle className="w-3 h-3 text-amber-400" />
                <span>壓力追問</span>
              </div>

              <span className="text-slate-600 mx-0.5">→</span>

              {/* Report Ready Indicator */}
              <div
                className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all ${
                  isReadyForReport
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/60 animate-bounce'
                    : 'bg-slate-800 text-slate-500 border border-slate-700'
                }`}
              >
                產出報告
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Edit Overlay Modal if active */}
      {isEditingProfile && (
        <div className="bg-slate-900/95 border-b border-cyan-800/60 p-4 animate-in slide-in-from-top duration-300">
          <form onSubmit={handleSaveProfile} className="max-w-2xl mx-auto flex flex-col sm:flex-row items-center gap-3">
            <div className="flex-1 w-full">
              <label className="block text-[11px] text-slate-400 mb-1">求職者姓名或代號</label>
              <input
                type="text"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                placeholder="例如：陳冠宇 (David Chen)"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
                required
              />
            </div>
            <div className="flex-1 w-full">
              <label className="block text-[11px] text-slate-400 mb-1">應徵職缺名稱</label>
              <input
                type="text"
                value={tempTitle}
                onChange={(e) => setTempTitle(e.target.value)}
                placeholder="例如：資深專案經理 (Technical PM)"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
                required
              />
            </div>
            <div className="w-full sm:w-auto pt-4 sm:pt-0">
              <button
                type="submit"
                className="w-full sm:w-auto px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold shadow-md transition-colors"
              >
                確認並繼續
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
        {messages.map((msg) => {
          const isAi = msg.sender === 'ai';
          const isSystem = msg.sender === 'system';

          if (isSystem) {
            return (
              <div key={msg.id} className="flex justify-center my-2">
                <div className="bg-slate-900/80 border border-slate-800 text-slate-400 text-xs px-4 py-1.5 rounded-full flex items-center gap-2">
                  <ShieldAlert className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{msg.text}</span>
                </div>
              </div>
            );
          }

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isAi ? 'justify-start' : 'justify-end'} group`}
            >
              {isAi && (
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-lg ${
                    msg.isStressTest
                      ? 'bg-amber-950 border border-amber-600 text-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.25)]'
                      : 'bg-cyan-950 border border-cyan-700 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                  }`}
                >
                  {msg.isStressTest ? <AlertTriangle className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[78%] rounded-2xl p-4 shadow-xl transition-all ${
                  isAi
                    ? msg.isStressTest
                      ? 'bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-950 border border-amber-700/60 text-slate-100'
                      : 'bg-slate-900/90 border border-slate-800 text-slate-100'
                    : 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-[0_4px_15px_rgba(6,182,212,0.25)]'
                }`}
              >
                {/* Message Header Tag */}
                {isAi && (
                  <div className="flex items-center justify-between gap-2 border-b border-slate-800/80 pb-2 mb-2.5 text-xs">
                    <div className="flex items-center gap-1.5 font-bold tracking-wide">
                      {msg.isStressTest ? (
                        <>
                          <span className="text-amber-400 flex items-center gap-1 font-mono uppercase">
                            ⚡ AI 壓力反問 (Stress-Test Round)
                          </span>
                          {msg.stressTargetDimension && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-800/60">
                              鎖定維度：{msg.stressTargetDimension}
                            </span>
                          )}
                        </>
                      ) : (
                        <>
                          <span className="text-cyan-400">AI 情境偵探</span>
                          {msg.questionId && (
                            <span className="text-[11px] text-slate-400 font-mono">
                              第 {msg.questionId}/4 題基礎基線情境
                            </span>
                          )}
                        </>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">{msg.timestamp}</span>
                  </div>
                )}

                {/* Message Body */}
                <div className="text-sm leading-relaxed whitespace-pre-wrap font-sans">
                  {msg.text}
                </div>

                {!isAi && (
                  <div className="flex justify-end mt-1 text-[10px] text-cyan-200/80 font-mono">
                    {msg.timestamp}
                  </div>
                )}
              </div>

              {!isAi && (
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-700 flex items-center justify-center shrink-0 text-white shadow-lg">
                  <User className="w-5 h-5" />
                </div>
              )}
            </div>
          );
        })}

        {/* AI Typing / Scanning animation */}
        {isAiThinking && (
          <div className="flex items-start gap-3 justify-start animate-in fade-in duration-300">
            <div className="w-9 h-9 rounded-xl bg-cyan-950 border border-cyan-700 text-cyan-300 flex items-center justify-center shrink-0">
              <Bot className="w-5 h-5 animate-pulse" />
            </div>
            <div className="bg-slate-900 border border-cyan-800/50 rounded-2xl p-4 shadow-lg text-slate-300 flex items-center gap-3">
              <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
              <div className="space-y-1">
                <span className="text-xs text-cyan-300 font-medium font-mono">{aiThinkingStatusText}</span>
                <div className="flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce"></span>
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Bottom Action Area: Either Chat Input or "Generate Report" Button */}
      <div className="bg-slate-900/90 border-t border-slate-800 p-4 backdrop-blur-md">
        {isReadyForReport ? (
          /* Ready For Report State - transforms into high-impact report generation CTA */
          <div className="flex flex-col items-center justify-center py-3 px-2 text-center space-y-3 animate-in zoom-in-95 duration-300">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-600/50 text-emerald-300 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>情境數據已完全收斂 · 表裡落差檢測完畢</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">4 題基線與壓力追問已全數完成</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-md">
                系統已鎖定求職者的初始包裝基線與高壓真值，即刻產出 MBTI 八維雷達圖、誠實度紅黃綠燈與面試防偽報告。
              </p>
            </div>
            <button
              onClick={onGenerateReport}
              className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-extrabold text-sm sm:text-base rounded-xl shadow-[0_0_25px_rgba(16,185,129,0.4)] flex items-center justify-center gap-2.5 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <Sparkles className="w-5 h-5 text-slate-950 fill-slate-950" />
              <span>製作偵探分析報告 (Generate Detective Dossier)</span>
              <ArrowRight className="w-5 h-5 text-slate-950" />
            </button>
          </div>
        ) : (
          /* Interactive Chat Input Box */
          <div>
            <form onSubmit={handleSubmit} className="relative">
              <div className="relative flex items-end bg-slate-950 rounded-2xl border border-slate-700/80 focus-within:border-cyan-500/80 focus-within:ring-1 focus-within:ring-cyan-500/50 transition-all p-2 shadow-inner">
                <textarea
                  ref={textareaRef}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={
                    isStressPhase
                      ? '請面對 AI 偵探的壓力追問，坦率輸入你的真實極限考量（按 Enter 送出，Shift+Enter 換行）...'
                      : `請輸入你面對第 ${(currentStepIndex % 4) + 1} 題的真實做法與思考邏輯（按 Enter 送出）...`
                  }
                  rows={2}
                  disabled={isAiThinking}
                  className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 resize-none px-3 py-1.5 focus:outline-none disabled:opacity-50"
                />

                <div className="flex items-center gap-2 shrink-0 pb-1 pr-1">
                  <button
                    type="submit"
                    disabled={!inputText.trim() || isAiThinking}
                    className="p-2.5 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-xl transition-all shadow-md flex items-center justify-center"
                    title="送出回答"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Auxiliary guidance tip */}
              <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 px-1">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                  <span>
                    {isStressPhase
                      ? '⚠️ 當前階段：AI 壓力追問（逼出無法修飾的真實心理本能）'
                      : `正在評估四大維度之一：${BASE_QUESTIONS[currentStepIndex]?.contextHint || '職場情境'}`}
                  </span>
                </div>
                <span className="hidden sm:inline text-slate-400 font-mono">Shift + Enter 換行</span>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
