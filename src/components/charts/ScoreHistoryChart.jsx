import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

export function ScoreHistoryChart({
  history = [],
  height = 240,
}) {
  const data = history.map((item) => ({
    label: item.label,
    score: item.score,
    date: item.date ? new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : '',
  }))

  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="scoreHistoryGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--c-primary)" stopOpacity={0.35} />
              <stop offset="95%" stopColor="var(--c-primary)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--c-line)" vertical={false} />
          <XAxis
            dataKey="label"
            stroke="var(--c-fg-subtle)"
            fontSize={11}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            domain={[0, 100]}
            stroke="var(--c-fg-subtle)"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            ticks={[0, 25, 50, 75, 100]}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const item = payload[0].payload
                return (
                  <div className="rounded-xl border border-line bg-surface p-2.5 shadow-lift text-xs">
                    <div className="text-fg-muted font-mono">{item.date || item.label}</div>
                    <div className="font-semibold text-primary mt-1 text-sm font-mono">
                      Readiness: {item.score}
                    </div>
                  </div>
                )
              }
              return null
            }}
          />
          <Area
            type="monotone"
            dataKey="score"
            stroke="var(--c-primary)"
            strokeWidth={2.5}
            fillOpacity={1}
            fill="url(#scoreHistoryGrad)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export default ScoreHistoryChart
