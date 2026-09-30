import React from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Printer,
  RotateCcw,
  Target,
  Sparkles,
  Users,
  Compass,
  FileSearch,
  ExternalLink,
  ChevronRight,
  TrendingDown,
  Layers,
  ArrowRight,
  Eye,
} from 'lucide-react';
import { DetectiveReport } from '../types';
import { RadarChart } from './RadarChart';

interface ReportViewProps {
  report: DetectiveReport;
  onRetest: () => void;
  onPrint: () => void;
}

export const ReportView: React.FC<ReportViewProps> = ({ report, onRetest, onPrint }) => {
  // Alert Light Badge styles
  const alertStyles = {
    green: {
      border: 'border-emerald-500/50',
      bg: 'bg-emerald-950/30',
      text: 'text-emerald-400',
      badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      icon: <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />,
      label: '綠燈 · 高度真誠 (Low Camouflage Risk)',
      desc: '受測者表裡高度一致，面對壓力追問未見明顯話術包裝或迎合傾向。',
    },
    yellow: {
      border: 'border-amber-500/50',
      bg: 'bg-amber-950/30',
      text: 'text-amber-400',
      badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      icon: <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0" />,
      label: '黃燈 · 局部過度包裝 (Moderate Packaging Risk)',
      desc: '在特定維度偵測到標準官腔或防禦修飾，建議在實體面試中針對疑點進行複核。',
    },
    red: {
      border: 'border-red-500/50',
      bg: 'bg-red-950/30',
      text: 'text-red-400',
      badgeBg: 'bg-red-500/20 text-red-300 border-red-500/40',
      icon: <XCircle className="w-6 h-6 text-red-400 shrink-0" />,
      label: '紅燈 · 顯著偽裝斷層 (High Deception Risk)',
      desc: '基線回答與高壓追問產生極大矛盾，受測者有強烈迎合職缺刻板印象的造假傾向！',
    },
  }[report.alertLevel];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 animate-in fade-in-50 duration-500 print:p-0 print:m-0 print:max-w-none print:text-black">
      {/* Print Top Action Banner (Hidden when printing) */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-4 rounded-2xl backdrop-blur-md shadow-xl print:hidden">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-950/70 border border-cyan-700/60 flex items-center justify-center text-cyan-400">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <span>偵探鑑識完成 · 報告已鎖定</span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                {report.dossierId}
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              評估對象：{report.candidateName}（應徵：{report.jobTitle}）• 鑑識時間：{report.evaluatedAt}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          <button
            onClick={onPrint}
            className="flex-1 sm:flex-initial px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-semibold shadow-md flex items-center justify-center gap-1.5 transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>友善列印 (Ctrl+P)</span>
          </button>

          <button
            onClick={onRetest}
            className="flex-1 sm:flex-initial px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-medium border border-slate-700 flex items-center justify-center gap-1.5 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>重新進行測驗</span>
          </button>
        </div>
      </div>

      {/* Main Dossier Card */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden print:bg-white print:border print:border-black print:text-black print:shadow-none">
        {/* Subtle Watermark Badge */}
        <div className="absolute top-4 right-6 font-mono text-[9px] uppercase tracking-widest text-slate-700 select-none print:text-gray-400">
          CONFIDENTIAL FORENSIC DOSSIER // HR INTELLIGENCE
        </div>

        {/* Header Section: MBTI Verdict & Honesty Light */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch border-b border-slate-800 pb-8 print:border-gray-300">
          {/* Left Column: True Predicted MBTI */}
          <div className="lg:col-span-5 flex flex-col justify-between bg-slate-950/60 border border-slate-800/80 rounded-2xl p-6 relative overflow-hidden print:bg-gray-50 print:border-gray-300">
            <div className="space-y-2">
              <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider font-semibold">
                真實性格收斂預測 (True MBTI Type)
              </div>
              <div className="flex items-baseline gap-3">
                <span className="text-4xl sm:text-5xl font-black tracking-tight text-white font-mono bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-400 print:text-black">
                  {report.predictedMBTI}
                </span>
                <span className="text-xs px-2.5 py-1 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800/60 font-semibold print:border print:border-gray-400 print:text-gray-800">
                  {report.mbtiTitle}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed pt-2 print:text-gray-700">
                {report.mbtiSummary}
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 print:border-gray-200">
              <span>評估對象：{report.candidateName}</span>
              <span className="font-mono text-cyan-300">{report.jobTitle}</span>
            </div>
          </div>

          {/* Right Column: Honesty Alert Light & Score */}
          <div
            className={`lg:col-span-7 flex flex-col justify-between rounded-2xl p-6 border ${alertStyles.border} ${alertStyles.bg} transition-all print:border print:border-gray-400 print:bg-white`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  {alertStyles.icon}
                  <div>
                    <div className="text-xs text-slate-400 uppercase tracking-wider font-mono">
                      防偽裝誠實度警示燈號
                    </div>
                    <div className={`text-base font-bold ${alertStyles.text} print:text-black`}>
                      {alertStyles.label}
                    </div>
                  </div>
                </div>

                {/* Score gauge circle */}
                <div className="text-right">
                  <div className="text-2xl sm:text-3xl font-black font-mono text-white print:text-black">
                    {report.honestyScore}
                    <span className="text-sm font-normal text-slate-400">%</span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">心理誠實指數</div>
                </div>
              </div>

              {/* Progress Bar of Honesty vs Packaging */}
              <div className="space-y-1 pt-1">
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>表面包裝落差度 (Packaging Gap)</span>
                  <span className="font-mono font-semibold text-amber-400">{report.discrepancyGap}%</span>
                </div>
                <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800 print:border-gray-300">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${
                      report.alertLevel === 'red'
                        ? 'bg-gradient-to-r from-amber-500 to-red-500'
                        : report.alertLevel === 'yellow'
                        ? 'bg-gradient-to-r from-teal-500 to-amber-500'
                        : 'bg-gradient-to-r from-emerald-500 to-teal-400'
                    }`}
                    style={{ width: `${report.honestyScore}%` }}
                  ></div>
                </div>
              </div>

              {/* Verdict Summary Text */}
              <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl text-xs text-slate-200 leading-relaxed print:bg-gray-50 print:border-gray-300 print:text-black">
                <div className="font-semibold text-slate-300 mb-0.5 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>鑑識專家結論摘要：</span>
                </div>
                {report.detectiveVerdict}
              </div>
            </div>
          </div>
        </div>

        {/* Middle Section: Radar Chart (Core Visualization) */}
        <div className="py-8 border-b border-slate-800 print:border-gray-300">
          <div className="text-center max-w-xl mx-auto mb-6">
            <h3 className="text-lg font-extrabold text-white flex items-center justify-center gap-2 print:text-black">
              <Compass className="w-5 h-5 text-cyan-400" />
              <span>MBTI 八大屬性雙層雷達圖</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1 print:text-gray-600">
              可視化對比「初始基線（求職者想展現的包裝面）」與「壓力收斂線（追問逼出的真實面）」
            </p>
          </div>

          <RadarChart baseline={report.baselineScores} convergent={report.convergentScores} />
        </div>

        {/* Section: Camouflage Breakdown (Core Value Proposition) */}
        <div className="py-8 border-b border-slate-800 print:border-gray-300">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 rounded-lg bg-red-950/60 border border-red-800/60 flex items-center justify-center text-red-400">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white print:text-black">
                「需要關注可能的包裝」防偽深度解析
              </h3>
              <p className="text-xs text-slate-400 print:text-gray-600">
                精準指出求職者在面試初測與追問中的矛盾斷層與心態動機
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Box 1: Discrepancy details */}
            <div className="bg-slate-950/60 border border-red-900/40 rounded-2xl p-5 space-y-2 print:bg-white print:border-gray-300">
              <div className="text-[11px] font-mono text-red-400 uppercase tracking-wider font-bold flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>偵測到的表裡矛盾斷層</span>
              </div>
              <div className="text-xs font-bold text-slate-200 print:text-black">
                鎖定維度：{report.camouflageAnalysis.suspectDimension}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed print:text-gray-800">
                {report.camouflageAnalysis.discrepancyDetail}
              </p>
            </div>

            {/* Box 2: Psychological motive */}
            <div className="bg-slate-950/60 border border-amber-900/40 rounded-2xl p-5 space-y-2 print:bg-white print:border-gray-300">
              <div className="text-[11px] font-mono text-amber-400 uppercase tracking-wider font-bold flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5" />
                <span>背後心理動機剖析</span>
              </div>
              <div className="text-xs font-bold text-slate-200 print:text-black">職缺迎合傾向</div>
              <p className="text-xs text-slate-300 leading-relaxed print:text-gray-800">
                {report.camouflageAnalysis.psychologicalMotive}
              </p>
            </div>

            {/* Box 3: Workplace friction risk */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5 space-y-2 print:bg-white print:border-gray-300">
              <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider font-bold flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                <span>入職後團隊磨合風險預警</span>
              </div>
              <div className="text-xs font-bold text-slate-200 print:text-black">潛在衝突點</div>
              <p className="text-xs text-slate-300 leading-relaxed print:text-gray-800">
                {report.camouflageAnalysis.workplaceRisk}
              </p>
            </div>
          </div>
        </div>

        {/* Section: HR Exclusive Interview Guide (High ROI for HR) */}
        <div className="py-8 border-b border-slate-800 print:border-gray-300">
          <div className="bg-gradient-to-br from-cyan-950/40 via-slate-900 to-slate-950 border border-cyan-500/40 rounded-2xl p-6 sm:p-7 shadow-xl relative overflow-hidden print:bg-white print:border-2 print:border-black">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-cyan-600/30 border border-cyan-400/50 flex items-center justify-center text-cyan-300">
                  <Eye className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white print:text-black">
                    HR 專用「實體面試追問指南」
                  </h3>
                  <p className="text-xs text-cyan-300/80 print:text-gray-600">
                    針對該包裝疑點設計的直球問題，供面試官在實體面試時親自拆解
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-cyan-950 text-cyan-300 border border-cyan-700/60 print:border-gray-400 print:text-black">
                建議驗證技巧：{report.hrInterviewGuide.recommendedVerificationTech}
              </span>
            </div>

            {/* The Sharp Question */}
            <div className="bg-slate-950/80 border border-cyan-800/60 rounded-xl p-4 my-4 print:bg-gray-100 print:border-gray-400">
              <div className="text-[11px] font-mono font-bold text-cyan-400 mb-1">
                犀利面試問題 (Sharp Interview Question)：
              </div>
              <div className="text-sm font-semibold text-white leading-relaxed print:text-black">
                {report.hrInterviewGuide.sharpQuestion}
              </div>
            </div>

            {/* Observation points */}
            <div>
              <div className="text-xs font-bold text-slate-300 mb-2 flex items-center gap-1.5 print:text-black">
                <span>面試現場觀察與驗證要點：</span>
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300 print:text-gray-800">
                {report.hrInterviewGuide.observationPoints.map((point, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800 print:bg-white print:border-gray-300"
                  >
                    <ChevronRight className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Section: True Dominant Traits & Management Guide */}
        <div className="pt-8">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-8 h-8 rounded-lg bg-teal-950/60 border border-teal-800/60 flex items-center justify-center text-teal-400">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white print:text-black">
                真實顯著特質與團隊管理指引 (Onboarding & Leadership)
              </h3>
              <p className="text-xs text-slate-400 print:text-gray-600">
                基於壓力收斂後的真實 MBTI 核心特徵，為該求職者量身打造之入職協同策略
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {report.dominantTraits.map((trait, index) => (
              <div
                key={index}
                className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5 space-y-3 print:bg-white print:border-gray-300"
              >
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                  <span className="text-xs font-bold text-white print:text-black">{trait.title}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-950 text-teal-300 border border-teal-800/60">
                    {trait.tag}
                  </span>
                </div>

                <div className="text-xs space-y-2 text-slate-300 print:text-gray-800">
                  <div>
                    <span className="text-slate-400 font-semibold">職場真實行為特徵：</span>
                    <p className="mt-0.5 leading-relaxed">{trait.behaviorDesc}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold">團隊角色與溝通風格：</span>
                    <p className="mt-0.5 leading-relaxed">{trait.teamRoleStyle}</p>
                  </div>
                  <div className="pt-2 border-t border-slate-800/60">
                    <span className="text-cyan-400 font-semibold">主管管理與引導建議：</span>
                    <p className="mt-0.5 leading-relaxed text-cyan-200/90 print:text-black">{trait.managementAdvice}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer print disclaimer */}
        <div className="mt-10 pt-4 border-t border-slate-800 text-center text-[10px] text-slate-400 font-mono print:text-gray-500">
          AI 情境測試偵探 (AI Stress-Test Detective) • 專供內部徵選與面試複核參考，請結合結構化實體面談進行最終錄取決策
        </div>
      </div>
    </div>
  );
};
