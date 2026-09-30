import React from 'react';
import { X, ShieldAlert, CheckCircle2, AlertTriangle, Compass, ArrowRight, Zap, Target } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">AI 情境測試偵探 · 系統運作與防偽機制</h3>
              <p className="text-xs text-slate-400">專為 HR 人資設計的高階主管與關鍵職缺防偽裝鑑識指南</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content sections */}
        <div className="space-y-5 text-xs text-slate-300 leading-relaxed">
          {/* Section 1: The Core Pain Point */}
          <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-2xl space-y-2">
            <div className="font-bold text-slate-100 flex items-center gap-2 text-sm">
              <span className="w-2 h-2 rounded-full bg-red-400"></span>
              <span>為什麼傳統網路測驗與面試無法防偽？</span>
            </div>
            <p>
              傳統 MBTI 靜態問卷（如「你喜歡去派對還是待在家？」）題意透明，求職者極易根據應徵職缺的理想人設背誦「標準答案」；
              高階面試者更擅長以「兼顧、平衡、兩全其美」等官腔話術掩蓋真實思維。招募錯誤高階人才往往導致高達 6-9 個月薪資的巨大試用期離職與團隊磨合失敗成本。
            </p>
          </div>

          {/* Section 2: 3-Stage Mechanism */}
          <div className="space-y-3">
            <div className="font-bold text-slate-100 text-sm flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              <span>本系統三大防偽鑑識階段 (Three-Stage Detection)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-slate-950/80 border border-slate-800 p-3.5 rounded-xl space-y-1.5">
                <div className="font-mono text-cyan-400 font-bold text-[11px]">階段一：4 題中立職場情境</div>
                <div className="text-slate-200 font-semibold">建立初始包裝基線</div>
                <p className="text-[11px] text-slate-400">
                  拋出四個不具對立性、兩端皆有合理性的黃金情境，引誘求職者建立第一層行為反射。
                </p>
              </div>

              <div className="bg-slate-950/80 border border-amber-800/40 p-3.5 rounded-xl space-y-1.5">
                <div className="font-mono text-amber-400 font-bold text-[11px]">階段二：AI 動態壓力追問</div>
                <div className="text-slate-200 font-semibold">逼出真實心理本能</div>
                <p className="text-[11px] text-slate-400">
                  AI 偵測「分數模糊」或「回答太官腔」的維度，給予不可妥協的極限情境二選一，拆穿預背台詞。
                </p>
              </div>

              <div className="bg-slate-950/80 border border-emerald-800/40 p-3.5 rounded-xl space-y-1.5">
                <div className="font-mono text-emerald-400 font-bold text-[11px]">階段三：偵探分析報告</div>
                <div className="text-slate-200 font-semibold">雙層雷達圖與追問指南</div>
                <p className="text-[11px] text-slate-400">
                  即時產出誠實度警示燈（綠/黃/紅）、八維雙線落差雷達圖、以及給 HR 實體面試驗證的專屬問題。
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Radar Chart Interpretation */}
          <div className="bg-cyan-950/30 border border-cyan-800/50 p-4 rounded-2xl space-y-2">
            <div className="font-bold text-cyan-200 flex items-center gap-2 text-sm">
              <Compass className="w-4 h-4 text-cyan-400" />
              <span>八維雙層雷達圖解讀技巧</span>
            </div>
            <ul className="space-y-1.5 text-[11px] text-slate-300">
              <li>
                <strong className="text-cyan-300">青藍色虛線圈：</strong>求職者在初測 4 題中主動塑造的「包裝形象面」。
              </li>
              <li>
                <strong className="text-amber-400">琥珀橙色實線圈：</strong>面對 AI 壓力追問與極端情境逼供後，收斂逼出的「真實心理面」。
              </li>
              <li>
                <strong className="text-red-400">兩條線的落差（Gap）：</strong>落差愈大，代表該求職者在該特定維度越有刻意討好或隱瞞本性的傾向！
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-4 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-semibold transition-all shadow-md"
          >
            我瞭解了，開始測驗
          </button>
        </div>
      </div>
    </div>
  );
};
