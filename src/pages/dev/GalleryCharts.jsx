import Card from '../../components/ui/Card.jsx'
import ScoreRadarChart from '../../components/charts/ScoreRadarChart.jsx'
import ScoreHistoryChart from '../../components/charts/ScoreHistoryChart.jsx'
import BenchmarkBarChart from '../../components/charts/BenchmarkBarChart.jsx'

export default function GalleryCharts() {
  const sampleCategories = [
    { id: 'technical', label: 'Technical', score: 89, benchmark: { average: 75, top10: 95 } },
    { id: 'projects', label: 'Projects', score: 79, benchmark: { average: 69, top10: 89 } },
    { id: 'experience', label: 'Experience', score: 70, benchmark: { average: 68, top10: 87 } },
    { id: 'problemSolving', label: 'Problem Solving', score: 76, benchmark: { average: 63, top10: 82 } },
    { id: 'profileQuality', label: 'Profile Quality', score: 99, benchmark: { average: 71, top10: 88 } },
    { id: 'portfolio', label: 'Portfolio', score: 81, benchmark: { average: 69, top10: 84 } },
    { id: 'consistency', label: 'Consistency', score: 73, benchmark: { average: 65, top10: 82 } },
    { id: 'presence', label: 'Presence', score: 85, benchmark: { average: 71, top10: 90 } },
  ]

  const sampleHistory = [
    { date: 'Jan 15', score: 64 },
    { date: 'Feb 01', score: 71 },
    { date: 'Feb 15', score: 75 },
    { date: 'Mar 01', score: 78 },
    { date: 'Mar 15', score: 82 },
  ]

  return (
    <div className="page-wrap py-12 space-y-12">
      <div>
        <span className="eyebrow">Data Visualizations</span>
        <h1 className="text-display text-fg font-extrabold mt-1">Recharts Gallery</h1>
        <p className="text-sm text-fg-muted mt-2">
          Responsive, accessible charts wired to CSS tokens and themed dynamically.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6 space-y-4">
          <h3 className="text-base font-semibold text-fg">8-Dimension Radar Chart</h3>
          <ScoreRadarChart categories={sampleCategories} height={280} />
        </Card>

        <Card className="p-6 space-y-4">
          <h3 className="text-base font-semibold text-fg">Score Trajectory Area Chart</h3>
          <ScoreHistoryChart data={sampleHistory} height={280} />
        </Card>
      </div>

      <Card className="p-6 space-y-4">
        <h3 className="text-base font-semibold text-fg">Peer Benchmark Comparison</h3>
        <BenchmarkBarChart categories={sampleCategories} height={320} />
      </Card>
    </div>
  )
}
