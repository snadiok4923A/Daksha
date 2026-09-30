import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'

export function ScoreRadarChart({
  categories = [],
  height = 320,
}) {
  const data = categories.map((c) => ({
    subject: c.short || c.label,
    score: c.score,
    fullMark: 100,
    average: c.average || 70,
  }))

  return (
    <div className="w-full flex items-center justify-center" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
          <PolarGrid stroke="var(--c-line)" strokeDasharray="3 3" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: 'var(--c-fg-muted)', fontSize: 12, fontWeight: 500 }}
          />
          <PolarRadiusAxis
            angle={30}
            domain={[0, 100]}
            tick={{ fill: 'var(--c-fg-subtle)', fontSize: 10 }}
            stroke="var(--c-line)"
          />
          <Radar
            name="Your Score"
            dataKey="score"
            stroke="var(--c-primary)"
            fill="var(--c-primary)"
            fillOpacity={0.25}
          />
          <Radar
            name="Benchmark Average"
            dataKey="average"
            stroke="var(--c-fg-subtle)"
            fill="var(--c-fg-subtle)"
            fillOpacity={0.1}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const item = payload[0].payload
                return (
                  <div className="rounded-xl border border-line bg-surface p-3 shadow-lift text-xs">
                    <div className="font-semibold text-fg mb-1">{item.subject}</div>
                    <div className="flex items-center justify-between gap-4 text-primary font-medium">
                      <span>You:</span>
                      <span className="font-mono font-bold">{item.score} / 100</span>
                    </div>
                    <div className="flex items-center justify-between gap-4 text-fg-subtle mt-0.5">
                      <span>Peer Avg:</span>
                      <span className="font-mono">{item.average}</span>
                    </div>
                  </div>
                )
              }
              return null
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default ScoreRadarChart
