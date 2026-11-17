import { useEffect, useRef, useState, type ReactNode } from 'react';

/**
 * Two small, dependency-free SVG charts for the parent dashboard.
 * Specs (dataviz method): one series each (title names it, no legend box),
 * <= 24px columns with 4px rounded tops, 2px lines, >= 8px dots with a 2px
 * surface ring, 10% area wash, hairline solid grid, text in text tokens,
 * hover/focus tooltips with hit targets bigger than the marks, and a table
 * view for screen readers and anyone who prefers numbers.
 */

const PAD = { top: 16, right: 16, bottom: 28, left: 36 };

/** Width of the chart's container, so text stays real size (no viewBox scaling). */
function useWidth<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [width, setWidth] = useState(560);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setWidth(Math.max(240, Math.floor(e.contentRect.width))));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, width] as const;
}

function niceMax(v: number) {
  if (v <= 5) return 5;
  if (v <= 10) return 10;
  const step = 10 ** Math.floor(Math.log10(v));
  return Math.ceil(v / step) * step;
}

interface Tip {
  x: number;
  y: number;
  content: ReactNode;
}

function Tooltip({ tip }: { tip: Tip | null }) {
  if (!tip) return null;
  return (
    <div className="viz-tip" style={{ left: tip.x, top: tip.y }} role="status">
      {tip.content}
    </div>
  );
}

function TableView({ caption, head, rows }: { caption: string; head: string[]; rows: (string | number)[][] }) {
  return (
    <details className="viz-table">
      <summary>{caption}</summary>
      <table>
        <thead>
          <tr>{head.map((h) => <th key={h}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>{r.map((c, j) => <td key={j}>{c}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </details>
  );
}

export interface Column {
  label: string; // short x-axis label
  value: number;
  tip: ReactNode;
  row: (string | number)[]; // table row
}

/** Vertical columns from one baseline, e.g. questions answered per day. */
export function ColumnChart({ data, height = 200, summary, tableHead, tableCaption }: { data: Column[]; height?: number; summary: string; tableHead: string[]; tableCaption: string }) {
  const [ref, width] = useWidth<HTMLDivElement>();
  const [tip, setTip] = useState<Tip | null>(null);
  const plotW = width - PAD.left - PAD.right;
  const plotH = height - PAD.top - PAD.bottom;
  const max = niceMax(Math.max(1, ...data.map((d) => d.value)));
  const band = plotW / data.length;
  const barW = Math.min(24, band * 0.6);
  const y = (v: number) => PAD.top + plotH - (v / max) * plotH;
  const ticks = [0, max / 2, max];
  const labelEvery = band < 28 ? 2 : 1;

  return (
    <div ref={ref} className="viz" onMouseLeave={() => setTip(null)}>
      <svg width={width} height={height} role="img" aria-label={summary}>
        {ticks.map((t) => (
          <g key={t}>
            <line x1={PAD.left} x2={width - PAD.right} y1={y(t)} y2={y(t)} className="viz-grid" />
            <text x={PAD.left - 6} y={y(t)} className="viz-axis" textAnchor="end" dominantBaseline="middle">
              {t}
            </text>
          </g>
        ))}
        {data.map((d, i) => {
          const cx = PAD.left + band * i + band / 2;
          const h = Math.max(0, PAD.top + plotH - y(d.value));
          const r = Math.min(4, h / 2);
          const x0 = cx - barW / 2;
          const yTop = PAD.top + plotH - h;
          const show = () => setTip({ x: cx, y: Math.max(PAD.top, yTop) - 8, content: d.tip });
          return (
            <g key={i}>
              {h > 0 && (
                <path
                  className="viz-bar"
                  d={`M${x0},${yTop + h} V${yTop + r} Q${x0},${yTop} ${x0 + r},${yTop} H${x0 + barW - r} Q${x0 + barW},${yTop} ${x0 + barW},${yTop + r} V${yTop + h} Z`}
                />
              )}
              {i % labelEvery === labelEvery - 1 || data.length <= 7 ? (
                <text x={cx} y={height - 8} className="viz-axis" textAnchor="middle">
                  {d.label}
                </text>
              ) : null}
              {/* hit target: the whole band, taller than the bar */}
              <rect
                x={PAD.left + band * i}
                y={PAD.top}
                width={band}
                height={plotH}
                fill="transparent"
                tabIndex={0}
                aria-label={d.row.join(', ')}
                onMouseEnter={show}
                onFocus={show}
                onBlur={() => setTip(null)}
              />
            </g>
          );
        })}
        <line x1={PAD.left} x2={width - PAD.right} y1={PAD.top + plotH} y2={PAD.top + plotH} className="viz-baseline" />
      </svg>
      <Tooltip tip={tip} />
      <TableView caption={tableCaption} head={tableHead} rows={data.map((d) => d.row)} />
    </div>
  );
}

export interface Point {
  label: string; // x-axis label (e.g. round number)
  value: number; // 0..100
  tip: ReactNode;
  row: (string | number)[];
}

/** Accuracy (0-100%) over rounds: 2px line, dots, 10% area wash, crosshair tooltip. */
export function LineChart({ data, height = 220, summary, tableHead, tableCaption }: { data: Point[]; height?: number; summary: string; tableHead: string[]; tableCaption: string }) {
  const [ref, width] = useWidth<HTMLDivElement>();
  const [hover, setHover] = useState<number | null>(null);
  const plotW = width - PAD.left - PAD.right;
  const plotH = height - PAD.top - PAD.bottom;
  const n = data.length;
  const x = (i: number) => PAD.left + (n === 1 ? plotW / 2 : (i / (n - 1)) * plotW);
  const y = (v: number) => PAD.top + plotH - (v / 100) * plotH;
  const line = data.map((d, i) => `${i ? 'L' : 'M'}${x(i)},${y(d.value)}`).join(' ');
  const area = n > 1 ? `${line} L${x(n - 1)},${PAD.top + plotH} L${x(0)},${PAD.top + plotH} Z` : '';
  const last = data[n - 1];
  const labelEvery = Math.max(1, Math.ceil(n / Math.max(2, Math.floor(plotW / 44))));

  const nearest = (clientX: number, el: SVGSVGElement) => {
    const px = clientX - el.getBoundingClientRect().left;
    let best = 0;
    for (let i = 1; i < n; i++) if (Math.abs(x(i) - px) < Math.abs(x(best) - px)) best = i;
    return best;
  };

  return (
    <div ref={ref} className="viz" onMouseLeave={() => setHover(null)}>
      <svg
        width={width}
        height={height}
        role="img"
        aria-label={summary}
        tabIndex={0}
        onMouseMove={(e) => n && setHover(nearest(e.clientX, e.currentTarget))}
        onKeyDown={(e) => {
          if (!n) return;
          if (e.key === 'ArrowRight') setHover((h) => Math.min(n - 1, (h ?? -1) + 1));
          if (e.key === 'ArrowLeft') setHover((h) => Math.max(0, (h ?? n) - 1));
        }}
        onBlur={() => setHover(null)}
      >
        {[0, 50, 100].map((t) => (
          <g key={t}>
            <line x1={PAD.left} x2={width - PAD.right} y1={y(t)} y2={y(t)} className="viz-grid" />
            <text x={PAD.left - 6} y={y(t)} className="viz-axis" textAnchor="end" dominantBaseline="middle">
              {t}%
            </text>
          </g>
        ))}
        {area && <path d={area} className="viz-area" />}
        {n > 1 && <path d={line} className="viz-line" />}
        {hover != null && <line x1={x(hover)} x2={x(hover)} y1={PAD.top} y2={PAD.top + plotH} className="viz-crosshair" />}
        {data.map((d, i) => (
          <circle key={i} cx={x(i)} cy={y(d.value)} r={hover === i ? 6 : 4} className="viz-dot" />
        ))}
        {data.map((d, i) =>
          i % labelEvery === 0 || i === n - 1 ? (
            <text key={i} x={x(i)} y={height - 8} className="viz-axis" textAnchor="middle">
              {d.label}
            </text>
          ) : null,
        )}
        {last && hover == null && (
          <text x={Math.min(x(n - 1), width - PAD.right)} y={y(last.value) - 12} className="viz-value" textAnchor={n > 1 ? 'end' : 'middle'}>
            {Math.round(last.value)}%
          </text>
        )}
      </svg>
      {hover != null && <Tooltip tip={{ x: x(hover), y: y(data[hover].value) - 12, content: data[hover].tip }} />}
      <TableView caption={tableCaption} head={tableHead} rows={data.map((d) => d.row)} />
    </div>
  );
}
