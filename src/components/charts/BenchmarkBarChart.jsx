import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'

export function BenchmarkBarChart({
  comparison = [],
  height = 320,
}) {
  const data = comparison.map((c) => ({
    name: c.short || c.label,
    You: c.you,
    'Peer Avg': c.average,
    'Top 10%': c.top10,
  }))

  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 10, left: -20, bottom: 20 }}
          barCategoryGap="20%"
        >
          <CartesianGrid strokeDasharray="3 3" stroke="var(--c-line)" vertical={false} />
          <XAxis
            dataKey="name"
            stroke="var(--c-fg-subtle)"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            interval={0}
            angle={-25}
            textAnchor="end"
            height={50}
          />
          <YAxis
            domain={[0, 100]}
            stroke="var(--c-fg-subtle)"
            fontSize={11}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="rounded-xl border border-line bg-surface p-3 shadow-lift text-xs">
                    <div className="font-semibold text-fg mb-1.5">{label}</div>
                    {payload.map((entry, index) => (
                      <div
                        key={`item-${index}`}
                        className="flex items-center justify-between gap-4 py-0.5"
                      >
                        <span style={{ color: entry.color }} className="font-medium">
                          {entry.name}:
                        </span>
                        <span className="font-mono font-bold">{entry.value}</span>
                      </div>
                    ))}
                  </div>
                )
              }
              return null
            }}
          />
          <Legend
            verticalAlign="top"
            align="right"
            wrapperStyle={{ paddingBottom: 12, fontSize: 12 }}
          />
          <Bar dataKey="You" fill="var(--c-primary)" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Peer Avg" fill="var(--c-fg-subtle)" opacity={0.6} radius={[4, 4, 0, 0]} />
          <Bar dataKey="Top 10%" fill="var(--c-accent)" opacity={0.8} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default BenchmarkBarChart
