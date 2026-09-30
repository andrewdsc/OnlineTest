import React from 'react';
import { ShieldAlert, FileText, RotateCcw, Printer, Sparkles, UserCheck, HelpCircle } from 'lucide-react';
import { PRESET_CASES } from '../data/defaultScenarios';
import { PresetCase } from '../types';

interface HeaderProps {
  currentView: 'chat' | 'report';
  onReset: () => void;
  onSelectPreset: (preset: PresetCase) => void;
  onPrint?: () => void;
  candidateName?: string;
  jobTitle?: string;
  dossierId?: string;
  onOpenHelp: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onReset,
  onSelectPreset,
  onPrint,
  candidateName,
  jobTitle,
  dossierId,
  onOpenHelp,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Left: Branding & Status */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/30 border border-cyan-500/40 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
            <ShieldAlert className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping"></span>
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full"></span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-base sm:text-lg tracking-tight text-white flex items-center gap-2">
                <span>AI 情境測試偵探</span>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/60">
                  Forensic v1.0
                </span>
              </h1>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-2">
              <span>面試防偽裝 MBTI 判斷引擎</span>
              {dossierId && (
                <>
                  <span className="text-slate-600">•</span>
                  <span className="font-mono text-cyan-300 text-[11px] font-semibold">{dossierId}</span>
                </>
              )}
            </p>
          </div>
        </div>

        {/* Center / Right: Candidate Banner or Action Controls */}
        <div className="flex flex-wrap items-center justify-end gap-2.5 w-full sm:w-auto">
          {/* Quick Preset Selector for HR to immediately test */}
          <div className="relative group">
            <button
              type="button"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700/80 hover:border-cyan-500/60 text-slate-200 hover:text-cyan-300 text-xs font-medium transition-all shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>載入測試範本</span>
              <span className="text-slate-500 text-[10px]">▼</span>
            </button>

            {/* Dropdown Menu */}
            <div className="absolute right-0 mt-1 w-72 bg-slate-900/95 border border-slate-700 rounded-xl shadow-2xl p-2 hidden group-hover:block hover:block z-50 backdrop-blur-xl">
              <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 px-2 py-1 border-b border-slate-800 mb-1">
                HR 專用快速範例（模擬面試情境）
              </div>
              {PRESET_CASES.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => onSelectPreset(preset)}
                  className="w-full text-left p-2 rounded-lg hover:bg-slate-800/80 transition-colors group/item"
                >
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-200 group-hover/item:text-cyan-300">
                    <span>{preset.title.split('：')[1]}</span>
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold ${
                        preset.expectedAlert === 'red'
                          ? 'bg-red-950 text-red-400 border border-red-800/60'
                          : preset.expectedAlert === 'yellow'
                          ? 'bg-amber-950 text-amber-400 border border-amber-800/60'
                          : 'bg-emerald-950 text-emerald-400 border border-emerald-800/60'
                      }`}
                    >
                      {preset.expectedAlert === 'red' ? '偽裝警示' : preset.expectedAlert === 'yellow' ? '過度包裝' : '高度真實'}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5 truncate">
                    {preset.candidateName} · {preset.jobTitle}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Help Button */}
          <button
            onClick={onOpenHelp}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700/80 hover:border-slate-600 text-slate-300 hover:text-white text-xs font-medium transition-all"
            title="系統運作機制與防偽原理說明"
          >
            <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden md:inline">系統說明</span>
          </button>

          {/* Print Report Button if in Report view */}
          {currentView === 'report' && onPrint && (
            <button
              onClick={onPrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-950/80 border border-cyan-700/80 hover:bg-cyan-900 text-cyan-200 text-xs font-medium transition-all shadow-sm"
              title="列印或另存 PDF 偵探案卷"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>列印報告</span>
            </button>
          )}

          {/* Reset / Start New Test Button */}
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700/80 hover:border-red-500/50 hover:text-red-300 text-slate-300 text-xs font-medium transition-all"
            title="清空並重新開始測驗"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">新測驗</span>
          </button>
        </div>
      </div>
    </header>
  );
};
