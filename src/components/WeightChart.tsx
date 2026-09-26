type Point = { label: string; value: number };

const W = 340;
const H = 200;
const PAD = { top: 16, right: 16, bottom: 36, left: 44 };

export default function WeightChart({ points, goal }: { points: Point[]; goal: number | null }) {
  const values = points.map((p) => p.value).concat(goal !== null ? [goal] : []);
  const lo = Math.floor(Math.min(...values) - 2);
  const hi = Math.ceil(Math.max(...values) + 2);
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;
  const x = (i: number) => PAD.left + (points.length === 1 ? innerW / 2 : (i / (points.length - 1)) * innerW);
  const y = (v: number) => PAD.top + ((hi - v) / (hi - lo)) * innerH;
  const ticks = [hi, Math.round((hi + lo) / 2), lo];
  const path = points.map((p, i) => `${x(i).toFixed(1)},${y(p.value).toFixed(1)}`).join(" ");
  const first = points[0];
  const last = points[points.length - 1];

  return (
    <figure className="chart">
      <figcaption>Body weight by plan week (lb)</figcaption>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Line chart of weekly body weight in pounds">
        {ticks.map((t) => (
          <g key={t}>
            <line className="grid" x1={PAD.left} x2={W - PAD.right} y1={y(t)} y2={y(t)} />
            <text className="axis" x={PAD.left - 6} y={y(t) + 4} textAnchor="end">
              {t}
            </text>
          </g>
        ))}
        {goal !== null && (
          <g>
            <line className="goal" x1={PAD.left} x2={W - PAD.right} y1={y(goal)} y2={y(goal)} />
            <text className="goal-label" x={W - PAD.right} y={y(goal) - 5} textAnchor="end">
              {`Goal ${goal}`}
            </text>
          </g>
        )}
        <polyline className="line" points={path} />
        {points.map((p, i) => (
          <circle key={p.label} className="dot" cx={x(i)} cy={y(p.value)} r={3.5}>
            <title>{`${p.label}: ${p.value} lb`}</title>
          </circle>
        ))}
        {first && (
          <text className="axis" x={x(0)} y={H - PAD.bottom + 16} textAnchor={points.length === 1 ? "middle" : "start"}>
            {first.label}
          </text>
        )}
        {last && points.length > 1 && (
          <text className="axis" x={x(points.length - 1)} y={H - PAD.bottom + 16} textAnchor="end">
            {last.label}
          </text>
        )}
        <text className="axis-title" x={PAD.left + innerW / 2} y={H - 4} textAnchor="middle">
          Plan week
        </text>
      </svg>
    </figure>
  );
}
