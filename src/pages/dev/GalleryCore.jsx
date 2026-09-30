import { useState } from 'react'
import Button from '../../components/ui/Button.jsx'
import Badge from '../../components/ui/Badge.jsx'
import Card from '../../components/ui/Card.jsx'
import ProgressBar from '../../components/ui/ProgressBar.jsx'
import ScoreRing from '../../components/ui/ScoreRing.jsx'
import EmptyState from '../../components/ui/EmptyState.jsx'
import { Sparkles, ArrowRight, FolderKanban, Check } from 'lucide-react'

export default function GalleryCore() {
  const [progress, setProgress] = useState(65)

  return (
    <div className="page-wrap py-12 space-y-12">
      <div>
        <span className="eyebrow">Design System Showcase</span>
        <h1 className="text-display text-fg font-extrabold mt-1">Core UI Primitives</h1>
        <p className="text-sm text-fg-muted mt-2">
          Living component catalog for buttons, badges, score radial rings, cards, and progress meters.
        </p>
      </div>

      {/* Buttons */}
      <Card className="p-6 space-y-4">
        <h3 className="text-base font-semibold text-fg">Button Variants & Sizes</h3>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="subtle">Subtle</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
          <Button loading>Loading</Button>
          <Button iconRight={ArrowRight}>With Icon</Button>
        </div>
      </Card>

      {/* Badges */}
      <Card className="p-6 space-y-4">
        <h3 className="text-base font-semibold text-fg">Badge Variants & Dots</h3>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="default">Default</Badge>
          <Badge variant="subtle">Subtle</Badge>
          <Badge variant="primary" dot>Primary Dot</Badge>
          <Badge variant="accent">Accent</Badge>
          <Badge variant="success" dot>Success Dot</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="danger" dot>Danger Dot</Badge>
          <Badge variant="outline">Outline</Badge>
        </div>
      </Card>

      {/* Radial Rings */}
      <Card className="p-6 space-y-4">
        <h3 className="text-base font-semibold text-fg">Score Ring Gauges</h3>
        <div className="flex flex-wrap items-center justify-around gap-6">
          <ScoreRing score={92} size={110} subtitle="Exceptional" />
          <ScoreRing score={82} size={120} subtitle="Strong" />
          <ScoreRing score={68} size={110} subtitle="Capable" />
          <ScoreRing score={48} size={100} subtitle="Developing" />
        </div>
      </Card>

      {/* Progress Bars */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-fg">Progress Meters</h3>
          <span className="font-mono text-xs text-primary">{progress}%</span>
        </div>
        <div className="space-y-3">
          <ProgressBar value={progress} variant="primary" size="lg" />
          <ProgressBar value={progress} variant="accent" size="md" />
          <ProgressBar value={progress} variant="success" size="sm" />
          <ProgressBar value={progress} variant="warning" size="xs" />
        </div>
      </Card>
    </div>
  )
}
