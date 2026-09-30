import { useEffect, useState } from 'react'
import { cn } from '../../utils/cn.js'
import { useCountUp } from '../../hooks/useCountUp.js'

export function ScoreRing({
  score = 0,
  size = 140,
  strokeWidth = 10,
  showLabel = true,
  label = 'Readiness',
  subtitle,
  className = '',
}) {
  const animatedScore = useCountUp(score, { duration: 1200 })
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference

  // Color by score band
  const getColor = (val) => {
    if (val >= 85) return 'var(--c-primary)'
    if (val >= 75) return 'var(--c-accent)'
    if (val >= 60) return 'var(--c-success)'
    if (val >= 45) return 'var(--c-warning)'
    return 'var(--c-danger)'
  }

  const strokeColor = getColor(score)

  return (
    <div
      className={cn('relative inline-flex flex-col items-center justify-center select-none', className)}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="rotate-[-90deg]">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--c-surface-2)"
          strokeWidth={strokeWidth}
          className="transition-colors"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="font-dot text-3xl font-bold tracking-tight text-fg tabular">
          {animatedScore}
        </span>
        {showLabel && (
          <span className="text-[11px] font-mono uppercase tracking-wider text-fg-muted mt-0.5">
            {subtitle || label}
          </span>
        )}
      </div>
    </div>
  )
}

export default ScoreRing
