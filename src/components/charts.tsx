import { useId } from 'react';
import { Box } from '@mui/material';

// Small dependency-free SVG charts used by the dashboard (sparkline, area chart, donut).

/** Smooth path through the points (Catmull-Rom → cubic Bézier). */
function smooth(points: [number, number][]) {
  if (points.length < 2) return '';
  let d = `M${points[0][0]},${points[0][1]}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0]},${c1[1]} ${c2[0]},${c2[1]} ${p2[0]},${p2[1]}`;
  }
  return d;
}

function scale(values: number[], w: number, h: number, padY: number, min?: number, max?: number): [number, number][] {
  const lo = min ?? Math.min(...values);
  const hi = max ?? Math.max(...values);
  const span = hi - lo || 1;
  return values.map((v, i) => [(i / (values.length - 1)) * w, padY + (1 - (v - lo) / span) * (h - 2 * padY)]);
}

export function Sparkline({ values, color, width = 104, height = 48 }: { values: number[]; color: string; width?: number; height?: number }) {
  const id = useId();
  const pts = scale(values, width, height, 4);
  const line = smooth(pts);
  const area = `${line} L${width},${height} L0,${height} Z`;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden style={{ display: 'block', flexShrink: 0 }}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={color} stopOpacity="0.18" />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${id})`} />
      <path d={line} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

interface AreaProps {
  values: number[];
  labels: string[];
  color: string;
  height?: number;
  /** Text for the tooltip bubble above the last point. */
  tooltip?: { title: string; value: string };
}

export function AreaChart({ values, labels, color, height = 250, tooltip }: AreaProps) {
  const id = useId();
  const W = 948;
  const pts = scale(values, W, height, 14, Math.min(...values) * 0.5);
  const line = smooth(pts);
  const area = `${line} L${W},${height} L0,${height} Z`;
  const last = pts[pts.length - 1];
  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ position: 'relative' }}>
        <svg viewBox={`0 0 ${W} ${height}`} width="100%" height={height} preserveAspectRatio="none" aria-hidden style={{ display: 'block', overflow: 'visible' }}>
          <defs>
            <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={color} stopOpacity="0.16" />
              <stop offset="1" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>
          {[0.25, 0.5, 0.75].map((t) => (
            <line key={t} x1="0" x2={W} y1={height * t} y2={height * t} stroke="rgba(11,46,31,0.06)" strokeDasharray="4 6" vectorEffect="non-scaling-stroke" />
          ))}
          <path d={area} fill={`url(#${id})`} />
          <path d={line} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
        </svg>
        <Box sx={{ position: 'absolute', left: `${(last[0] / W) * 100}%`, top: last[1], width: 12, height: 12, ml: '-6px', mt: '-6px', borderRadius: '6px', bgcolor: '#fff', border: `2.5px solid ${color}` }} />
        {tooltip ? (
          <Box sx={{ position: 'absolute', right: 8, top: Math.max(0, last[1] - 70), px: 1.5, py: 1, borderRadius: '12px', bgcolor: '#0E3B26', boxShadow: '0px 1px 2px rgba(0,0,0,0.04), 0px 10px 28px rgba(11,46,31,0.07)', whiteSpace: 'nowrap' }}>
            <Box sx={{ color: 'rgba(255,255,255,0.7)', fontSize: 11 }}>{tooltip.title}</Box>
            <Box sx={{ color: '#fff', fontSize: 15, fontWeight: 600 }}>{tooltip.value}</Box>
          </Box>
        ) : null}
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1.25, color: '#98A39B', fontSize: 12 }}>
        {labels.map((l) => (
          <span key={l}>{l}</span>
        ))}
      </Box>
    </Box>
  );
}

export interface DonutSlice {
  label: string;
  value: number;
  color: string;
}

export function Donut({ slices, size = 220, thickness = 34, children }: { slices: DonutSlice[]; size?: number; thickness?: number; children?: React.ReactNode }) {
  const total = slices.reduce((s, x) => s + x.value, 0) || 1;
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  const gap = 4; // visual gap between slices (px along the circle)
  let offset = 0;
  return (
    <Box sx={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label="Orders by role" style={{ transform: 'rotate(-90deg)' }}>
        {slices.map((s) => {
          const len = (s.value / total) * c;
          const el = (
            <circle
              key={s.label}
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke={s.color}
              strokeWidth={thickness}
              strokeDasharray={`${Math.max(len - gap, 0)} ${c - Math.max(len - gap, 0)}`}
              strokeDashoffset={-offset}
            />
          );
          offset += len;
          return el;
        })}
      </svg>
      <Box sx={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>{children}</Box>
    </Box>
  );
}
