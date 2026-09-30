import React, { useState } from 'react';
import { RadarScores } from '../types';

interface RadarChartProps {
  baseline: RadarScores;
  convergent: RadarScores;
  size?: number;
}

interface AxisDef {
  key: keyof RadarScores;
  label: string;
  sub: string;
  opposite: string;
  color: string;
}

// Arranged such that opposite poles sit directly opposite (180 degrees apart):
// 0 deg: E, 180 deg: I
// 45 deg: S, 225 deg: N
// 90 deg: T, 270 deg: F
// 135 deg: J, 315 deg: P
const AXES: AxisDef[] = [
  { key: 'E', label: 'E 外向社交', sub: 'Extroversion', opposite: 'I', color: '#38bdf8' },
  { key: 'S', label: 'S 實感數據', sub: 'Sensing', opposite: 'N', color: '#38bdf8' },
  { key: 'T', label: 'T 客觀理性', sub: 'Thinking', opposite: 'F', color: '#38bdf8' },
  { key: 'J', label: 'J 條理規律', sub: 'Judging', opposite: 'P', color: '#38bdf8' },
  { key: 'I', label: 'I 內向沉澱', sub: 'Introversion', opposite: 'E', color: '#a855f7' },
  { key: 'N', label: 'N 宏觀願景', sub: 'Intuition', opposite: 'S', color: '#a855f7' },
  { key: 'F', label: 'F 情感價值', sub: 'Feeling', opposite: 'T', color: '#a855f7' },
  { key: 'P', label: 'P 彈性隨機', sub: 'Perceiving', opposite: 'J', color: '#a855f7' },
];

export const RadarChart: React.FC<RadarChartProps> = ({ baseline, convergent, size = 480 }) => {
  const [hoveredAxis, setHoveredAxis] = useState<AxisDef | null>(null);

  const center = size / 2;
  const radius = size * 0.36; // leave room for labels
  const totalAxes = AXES.length;
  const angleStep = (Math.PI * 2) / totalAxes;

  // Function to calculate (x, y) given an index and a normalized value (0 - 100)
  const getCoordinates = (index: number, value: number) => {
    // Start at top (-PI / 2)
    const angle = index * angleStep - Math.PI / 2;
    const r = (value / 100) * radius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y, angle };
  };

  // Build polygon path string for a score set
  const buildPolygonPath = (scores: RadarScores) => {
    return AXES.map((axis, index) => {
      const val = Math.max(10, Math.min(100, scores[axis.key] || 0));
      const { x, y } = getCoordinates(index, val);
      return `${index === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
    }).join(' ') + ' Z';
  };

  const baselinePath = buildPolygonPath(baseline);
  const convergentPath = buildPolygonPath(convergent);

  // Concentric polygon grids (20%, 40%, 60%, 80%, 100%)
  const gridLevels = [20, 40, 60, 80, 100];

  return (
    <div className="flex flex-col items-center">
      {/* Legend & Summary Info */}
      <div className="flex flex-wrap items-center justify-center gap-6 mb-4 text-xs font-medium">
        <div className="flex items-center gap-2 bg-cyan-950/40 border border-cyan-800/50 px-3 py-1.5 rounded-md text-cyan-300">
          <span className="w-3 h-3 rounded-full border-2 border-cyan-400 bg-cyan-400/20 inline-block"></span>
          <span>初始基線（求職者想展現的包裝面）</span>
        </div>
        <div className="flex items-center gap-2 bg-amber-950/40 border border-amber-800/50 px-3 py-1.5 rounded-md text-amber-300">
          <span className="w-3 h-3 rounded-full border-2 border-amber-400 bg-amber-400 inline-block shadow-[0_0_8px_rgba(251,191,36,0.5)]"></span>
          <span className="font-semibold">壓力收斂線（追問逼出的真實面）</span>
        </div>
        <div className="text-slate-400 italic">
          💡 兩條線落差愈大，代表該維度之包裝修飾程度愈高
        </div>
      </div>

      <div className="relative w-full max-w-[500px] aspect-square flex items-center justify-center">
        <svg
          viewBox={`0 0 ${size} ${size}`}
          className="w-full h-full drop-shadow-2xl overflow-visible select-none"
        >
          <defs>
            {/* Gradients */}
            <radialGradient id="radarBg" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#0f172a" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#020617" stopOpacity="0.95" />
            </radialGradient>
            <linearGradient id="baselineFill" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0.1" />
            </linearGradient>
            <linearGradient id="convergentFill" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0.2" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background circle */}
          <circle cx={center} cy={center} r={radius * 1.08} fill="url(#radarBg)" stroke="#1e293b" strokeWidth="1" />

          {/* Grid rings */}
          {gridLevels.map((level) => {
            const gridPoints = AXES.map((_, i) => {
              const { x, y } = getCoordinates(i, level);
              return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
            }).join(' ') + ' Z';

            return (
              <g key={level}>
                <path
                  d={gridPoints}
                  fill="none"
                  stroke={level === 100 ? '#334155' : '#1e293b'}
                  strokeWidth={level === 100 ? 1.5 : 1}
                  strokeDasharray={level < 100 ? '3 3' : undefined}
                />
                <text
                  x={center + 4}
                  y={center - (level / 100) * radius - 2}
                  fill="#64748b"
                  fontSize="9"
                  fontFamily="monospace"
                >
                  {level}%
                </text>
              </g>
            );
          })}

          {/* Axis spokes */}
          {AXES.map((axis, i) => {
            const { x, y, angle } = getCoordinates(i, 100);
            const isHovered = hoveredAxis?.key === axis.key;

            // Compute label coordinates further out
            const labelRadius = radius * 1.22;
            const lx = center + labelRadius * Math.cos(angle);
            const ly = center + labelRadius * Math.sin(angle);

            return (
              <g key={axis.key}>
                {/* Spoke line */}
                <line
                  x1={center}
                  y1={center}
                  x2={x}
                  y2={y}
                  stroke={isHovered ? '#38bdf8' : '#334155'}
                  strokeWidth={isHovered ? 2 : 1}
                  strokeDasharray="2 2"
                />

                {/* Axis label button area */}
                <g
                  className="cursor-pointer transition-all duration-200"
                  onMouseEnter={() => setHoveredAxis(axis)}
                  onMouseLeave={() => setHoveredAxis(null)}
                >
                  <text
                    x={lx}
                    y={ly - 4}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill={isHovered ? '#38bdf8' : '#e2e8f0'}
                    fontSize="11"
                    fontWeight="700"
                    className="transition-colors"
                  >
                    {axis.label}
                  </text>
                  <text
                    x={lx}
                    y={ly + 10}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="#94a3b8"
                    fontSize="9"
                    fontFamily="monospace"
                  >
                    {axis.sub}
                  </text>
                </g>
              </g>
            );
          })}

          {/* Layer 1: Baseline Polygon (Blue/Cyan - Initial Packaged Face) */}
          <path
            d={baselinePath}
            fill="url(#baselineFill)"
            stroke="#06b6d4"
            strokeWidth="2"
            strokeDasharray="4 3"
            className="transition-all duration-500"
          />

          {/* Layer 2: Convergent Polygon (Amber/Red - Real Stress Converged Face) */}
          <path
            d={convergentPath}
            fill="url(#convergentFill)"
            stroke="#f59e0b"
            strokeWidth="2.5"
            filter="url(#glow)"
            className="transition-all duration-500"
          />

          {/* Vertices & Data Points */}
          {AXES.map((axis, i) => {
            const bVal = baseline[axis.key] || 0;
            const cVal = convergent[axis.key] || 0;
            const bCoord = getCoordinates(i, bVal);
            const cCoord = getCoordinates(i, cVal);
            const gap = Math.abs(bVal - cVal);
            const isHighGap = gap >= 25;

            return (
              <g key={`vertex-${axis.key}`}>
                {/* Connecting discrepancy vector if significant */}
                {isHighGap && (
                  <line
                    x1={bCoord.x}
                    y1={bCoord.y}
                    x2={cCoord.x}
                    y2={cCoord.y}
                    stroke="#ef4444"
                    strokeWidth="2.5"
                    strokeDasharray="2 2"
                  />
                )}

                {/* Baseline point (Cyan diamond/circle) */}
                <circle
                  cx={bCoord.x}
                  cy={bCoord.y}
                  r={hoveredAxis?.key === axis.key ? 5 : 3.5}
                  fill="#0891b2"
                  stroke="#22d3ee"
                  strokeWidth="1.5"
                />

                {/* Convergent point (Amber solid circle) */}
                <circle
                  cx={cCoord.x}
                  cy={cCoord.y}
                  r={hoveredAxis?.key === axis.key ? 6 : 4.5}
                  fill="#f59e0b"
                  stroke="#fef08a"
                  strokeWidth="2"
                />
              </g>
            );
          })}
        </svg>

        {/* Hover info tooltip */}
        {hoveredAxis && (
          <div className="absolute top-2 right-2 bg-slate-900/95 border border-slate-700 backdrop-blur-md p-3 rounded-lg shadow-xl text-xs max-w-[200px] pointer-events-none z-10">
            <div className="font-bold text-slate-100 flex items-center justify-between border-b border-slate-800 pb-1 mb-1.5">
              <span>{hoveredAxis.label}</span>
              <span className="font-mono text-cyan-400">{hoveredAxis.key}</span>
            </div>
            <div className="space-y-1 text-[11px]">
              <div className="flex justify-between text-cyan-300">
                <span>初始包裝得分：</span>
                <span className="font-mono font-bold">{baseline[hoveredAxis.key]}%</span>
              </div>
              <div className="flex justify-between text-amber-300">
                <span>壓力收斂真值：</span>
                <span className="font-mono font-bold">{convergent[hoveredAxis.key]}%</span>
              </div>
              <div className="flex justify-between text-slate-400 pt-1 border-t border-slate-800">
                <span>表面落差：</span>
                <span className={`font-mono font-bold ${Math.abs(baseline[hoveredAxis.key] - convergent[hoveredAxis.key]) >= 25 ? 'text-red-400' : 'text-emerald-400'}`}>
                  {Math.abs(baseline[hoveredAxis.key] - convergent[hoveredAxis.key])}%
                  {Math.abs(baseline[hoveredAxis.key] - convergent[hoveredAxis.key]) >= 25 ? ' (顯著包裝)' : ' (可信)'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Discrepancy metric chips */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full mt-3">
        {[
          { pair: 'E / I', label: '人際能量', b: baseline.E, c: convergent.E, diff: Math.abs(baseline.E - convergent.E) },
          { pair: 'S / N', label: '認知維度', b: baseline.S, c: convergent.S, diff: Math.abs(baseline.S - convergent.S) },
          { pair: 'T / F', label: '決策機制', b: baseline.T, c: convergent.T, diff: Math.abs(baseline.T - convergent.T) },
          { pair: 'J / P', label: '生活節奏', b: baseline.J, c: convergent.J, diff: Math.abs(baseline.J - convergent.J) },
        ].map((item) => (
          <div
            key={item.pair}
            className={`p-2.5 rounded-lg border text-center transition-all ${
              item.diff >= 25
                ? 'bg-red-950/30 border-red-800/60 text-red-200'
                : 'bg-slate-900/60 border-slate-800 text-slate-300'
            }`}
          >
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">{item.pair} · {item.label}</div>
            <div className="flex items-center justify-center gap-1.5 my-1 text-xs font-mono font-semibold">
              <span className="text-cyan-400">{item.b}%</span>
              <span className="text-slate-500">→</span>
              <span className="text-amber-400">{item.c}%</span>
            </div>
            <div className="text-[11px]">
              {item.diff >= 25 ? (
                <span className="inline-flex items-center gap-1 text-red-400 font-bold">
                  ⚠️ 落差 {item.diff}% (包裝)
                </span>
              ) : (
                <span className="text-emerald-400 font-medium">✓ 落差 {item.diff}% (一致)</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
