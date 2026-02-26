/** React Island — Animated live stats counter */
import { useState, useEffect, useRef } from 'react';

interface Stat {
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
  description?: string;
  icon: string;
}

const stats: Stat[] = [
  {
    icon: '⚡',
    label: 'Automations Running',
    value: 47,
    description: 'Active workflows',
  },
  {
    icon: '⏱',
    label: 'Hours Saved / Month',
    value: 240,
    suffix: '+',
    description: 'Across all clients',
  },
  {
    icon: '🟢',
    label: 'Uptime',
    value: 99.9,
    suffix: '%',
    description: 'Last 12 months',
  },
  {
    icon: '💸',
    label: 'Platform Cost',
    value: 0,
    prefix: '$',
    description: 'Forever free',
  },
];

function AnimatedNumber({
  value,
  prefix = '',
  suffix = '',
}: {
  value: number;
  prefix?: string;
  suffix?: string;
}) {
  const [current, setCurrent] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    const duration = 1600;
    const steps = 50;
    const delay = 30;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(step >= steps ? value : Math.round(eased * value * 10) / 10);
      if (step >= steps) clearInterval(timer);
    }, delay);

    return () => clearInterval(timer);
  }, [value]);

  const display = Number.isInteger(value) ? Math.round(current) : current.toFixed(1);

  return (
    <span className="stat-number">
      {prefix}
      {display}
      {suffix}
    </span>
  );
}

export default function LiveStats() {
  return (
    <div className="live-stats-grid">
      {stats.map((stat, i) => (
        <div key={stat.label} className="stat-item" style={{ animationDelay: `${i * 0.08}s` }}>
          <span className="stat-icon">{stat.icon}</span>
          <AnimatedNumber value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
          <span className="stat-label">{stat.label}</span>
          {stat.description && (
            <span className="stat-desc">{stat.description}</span>
          )}
        </div>
      ))}

      <style>{`
        .live-stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0;
          padding: 1.5rem 0;
        }
        @media (max-width: 768px) {
          .live-stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        .stat-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 1.5rem 1rem;
          border-right: 1px solid var(--border);
          gap: 4px;
          animation: fade-in 0.5s var(--ease-out) both;
        }
        .stat-item:last-child { border-right: none; }
        @media (max-width: 768px) {
          .stat-item:nth-child(2)  { border-right: none; }
          .stat-item:nth-child(3)  { border-right: 1px solid var(--border); border-top: 1px solid var(--border); }
          .stat-item:nth-child(4)  { border-right: none; border-top: 1px solid var(--border); }
        }
        .stat-icon {
          font-size: 1.25rem;
          margin-bottom: 4px;
          line-height: 1;
        }
        .stat-number {
          font-family: var(--font-mono, monospace);
          font-size: clamp(2rem, 4vw, 2.75rem);
          font-weight: 700;
          letter-spacing: -0.04em;
          color: var(--text-primary);
          line-height: 1;
        }
        .stat-label {
          font-size: 0.8125rem;
          color: var(--text-secondary);
          font-weight: 500;
          margin-top: 4px;
        }
        .stat-desc {
          font-size: 0.7rem;
          color: var(--text-tertiary);
          font-weight: 400;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
