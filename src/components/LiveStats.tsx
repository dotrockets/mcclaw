/** React Island — Animated live stats counter */
import { useState, useEffect } from 'react';

interface Stat {
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
}

const stats: Stat[] = [
  { label: 'Automations Running', value: 47 },
  { label: 'Hours Saved / Month', value: 240, suffix: '+' },
  { label: 'Uptime', value: 99.9, suffix: '%' },
  { label: 'Monthly Platform Cost', value: 0, prefix: '$' },
];

function AnimatedNumber({ value, prefix = '', suffix = '' }: { value: number; prefix?: string; suffix?: string }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const duration = 1500;
    const steps = 40;
    const increment = value / steps;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      setCurrent(step >= steps ? value : Math.round(increment * step * 10) / 10);
      if (step >= steps) clearInterval(timer);
    }, duration / steps);
    return () => clearInterval(timer);
  }, [value]);

  return (
    <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '2.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>
      {prefix}{Number.isInteger(value) ? Math.round(current) : current.toFixed(1)}{suffix}
    </span>
  );
}

export default function LiveStats() {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '2rem',
      padding: '3rem 0',
    }}>
      {stats.map((stat) => (
        <div key={stat.label} style={{ textAlign: 'center' }}>
          <AnimatedNumber value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
          <div style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem', marginTop: '0.5rem', fontWeight: 500 }}>
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
}
