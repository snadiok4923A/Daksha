import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  ShieldCheck,
  Zap,
  TrendingUp,
  Award,
  CheckCircle,
  ExternalLink,
  Code2,
  Cpu,
  Palette,
  Lock,
  ChevronRight,
  Layers,
  Sparkles,
} from 'lucide-react'
import Button from '../components/ui/Button.jsx'
import Card from '../components/ui/Card.jsx'
import Badge from '../components/ui/Badge.jsx'
import ScoreRing from '../components/ui/ScoreRing.jsx'
import { BRAND, TRUST } from '../config/brand.js'
import { ROLES } from '../data/roles/roles.js'
import { ROLE_CATEGORIES } from '../data/roles/categories.js'
import { getCommunity } from '../data/community.js'
import { SCORE_CATEGORIES } from '../data/scoring.js'

export default function Landing() {
  const [selectedCategory, setSelectedCategory] = useState('engineering')
  const communityMembers = getCommunity().slice(0, 4)

  const rolesInCategory = ROLES.filter((r) => r.category === selectedCategory).slice(0, 6)

  return (
    <div className="space-y-24 sm:space-y-32 py-12 sm:py-20 overflow-hidden">
      {/* 1. HERO SECTION */}
      <section className="page-wrap relative">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-primary/20 via-accent/15 to-transparent blur-3xl -z-10 pointer-events-none rounded-full" />

        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-primary-line bg-primary-soft text-primary-soft-fg text-xs font-medium">
            <Sparkles className="size-3.5 text-primary" />
            <span>Deterministic Career Readiness & Benchmarking</span>
          </div>

          <h1 className="text-display text-fg font-extrabold tracking-tight">
            Know where you stand.{' '}
            <span className="text-gradient">Know what to improve.</span>
          </h1>

          <p className="text-base sm:text-lg text-fg-muted max-w-2xl mx-auto leading-relaxed">
            Stop guessing why recruiters pass on your resume. SkillRank analyzes your verified skills,
            production projects, and professional presence to provide a transparent score and actionable 30-day plan.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button to="/onboarding" size="lg" iconRight={ArrowRight}>
              Analyze My Profile
            </Button>
            <Button to="/app" variant="secondary" size="lg">
              Explore Live Demo (Alex Morgan)
            </Button>
          </div>

          <p className="text-xs text-fg-subtle pt-2">
            No signup required to view demo · 100% deterministic & explainable · Free assessment
          </p>
        </div>

        {/* HERO INTERACTIVE SCORECARD PREVIEW */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="rounded-3xl border border-line bg-surface/90 backdrop-blur-xl p-6 sm:p-8 shadow-pop relative overflow-hidden">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              {/* Left Profile Info */}
              <div className="space-y-4 text-center md:text-left">
                <div className="inline-flex items-center gap-2">
                  <Badge variant="primary" size="sm">
                    Frontend Developer Benchmark
                  </Badge>
                  <span className="text-xs text-fg-subtle">Updated today</span>
                </div>
                <h3 className="text-2xl font-bold text-fg">Alex Morgan</h3>
                <p className="text-sm text-fg-muted max-w-md">
                  Strong candidate profile matching 82% of core frontend expectations with high technical project depth.
                </p>

                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-2">
                  {['React', 'TypeScript', 'Responsive Design', 'REST APIs', 'Tailwind CSS'].map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-1 rounded-lg bg-surface-2 border border-line text-xs font-mono text-fg-muted"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right Big Score Gauge */}
              <div className="flex flex-col items-center bg-surface-2/60 p-6 rounded-2xl border border-line shrink-0 min-w-[240px]">
                <ScoreRing score={82} size={150} subtitle="Readiness" />
                <div className="mt-4 text-center">
                  <span className="text-xs font-mono uppercase text-success-fg font-semibold bg-success-soft px-2.5 py-1 rounded-full">
                    Top 18% of Peers
                  </span>
                  <div className="text-[11px] text-fg-subtle mt-1.5">
                    #437 of 2,430 evaluated profiles
                  </div>
                </div>
              </div>
            </div>

            {/* Quick mini categories grid */}
            <div className="mt-8 pt-6 border-t border-line grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Technical', score: 89 },
                { label: 'Projects', score: 79 },
                { label: 'Presence', score: 85 },
                { label: 'Problem Solving', score: 76 },
              ].map((c) => (
                <div key={c.label} className="p-3 rounded-xl bg-surface border border-line/60">
                  <div className="text-[11px] text-fg-subtle">{c.label}</div>
                  <div className="text-lg font-mono font-bold text-fg mt-0.5">{c.score}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. HOW IT WORKS (4 STEPS) */}
      <section id="how-it-works" className="page-wrap space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <p className="eyebrow">Scoring Architecture</p>
          <h2 className="text-h1 text-fg">How SkillRank Evaluates You</h2>
          <p className="text-sm sm:text-base text-fg-muted">
            We evaluate your profile against role-specific requirements rather than arbitrary buzzwords.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              step: '01',
              title: 'Connect & Input',
              desc: 'Import your GitHub, LinkedIn, portfolio links, and resume. We parse actual repositories and commit consistency.',
              icon: Code2,
            },
            {
              step: '02',
              title: 'Calibrated Analysis',
              desc: 'Our engine evaluates your experience across 8 weighted dimensions tuned specifically to your desired role.',
              icon: Zap,
            },
            {
              step: '03',
              title: 'Peer Benchmarking',
              desc: 'See exactly where your skills and portfolio rank against hundreds of other professionals aiming for the same seat.',
              icon: TrendingUp,
            },
            {
              step: '04',
              title: '30-Day Action Plan',
              desc: 'Get an actionable, week-by-week roadmap highlighting the exact high-leverage skills to bridge your gaps.',
              icon: Award,
            },
          ].map((item) => {
            const Icon = item.icon
            return (
              <Card key={item.step} className="p-6 relative group hover:border-primary-line">
                <span className="font-mono text-xs text-primary font-bold">{item.step}</span>
                <div className="size-10 rounded-xl bg-primary-soft text-primary flex items-center justify-center my-4 group-hover:scale-110 transition-transform">
                  <Icon className="size-5" />
                </div>
                <h3 className="text-base font-semibold text-fg mb-2">{item.title}</h3>
                <p className="text-xs sm:text-sm text-fg-muted leading-relaxed">{item.desc}</p>
              </Card>
            )
          })}
        </div>
      </section>

      {/* 3. ROLES EXPLORER TEASER */}
      <section className="page-wrap space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <p className="eyebrow">Target Careers</p>
            <h2 className="text-h2 text-fg">35 Supported Tech & Design Roles</h2>
            <p className="text-sm text-fg-muted">
              Each role carries bespoke skill matrices, experience baselines, and project criteria.
            </p>
          </div>
          <Button to="/roles" variant="outline" size="sm" iconRight={ArrowRight}>
            View all 35 roles
          </Button>
        </div>

        {/* Category switcher */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {ROLE_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors tap ${
                selectedCategory === cat.id
                  ? 'bg-primary text-primary-fg shadow-sm'
                  : 'bg-surface-2 text-fg-muted hover:text-fg'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Roles grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rolesInCategory.map((role) => (
            <Link
              key={role.id}
              to={`/roles?role=${role.id}`}
              className="p-5 rounded-2xl border border-line bg-surface hover:border-primary-line hover:shadow-lift transition-all block group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-sm text-fg group-hover:text-primary transition-colors">
                  {role.name}
                </span>
                <ChevronRight className="size-4 text-fg-subtle group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
              <p className="text-xs text-fg-muted line-clamp-2 mb-4 leading-relaxed">
                {role.blurb}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {role.core.slice(0, 3).map((skill) => (
                  <span
                    key={skill}
                    className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-surface-2 text-fg-subtle border border-line"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. COMMUNITY CANDIDATES SHOWCASE */}
      <section className="page-wrap space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <p className="eyebrow">Community Benchmark</p>
          <h2 className="text-h2 text-fg">Real Profiles. Verified Scoring.</h2>
          <p className="text-sm text-fg-muted">
            See how candidates in our demo community measure up against their target requirements.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {communityMembers.map((member) => (
            <Link
              key={member.profile.handle}
              to={`/u/${member.profile.handle}`}
              className="p-5 rounded-2xl border border-line bg-surface hover:border-line-strong hover:shadow-card transition-all block group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="size-10 rounded-full bg-primary-soft text-primary font-bold flex items-center justify-center text-sm border border-primary-line">
                  {member.profile.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="text-right">
                  <div className="font-mono text-base font-bold text-fg">
                    {member.score}
                  </div>
                  <div className="text-[10px] font-mono text-fg-subtle">Readiness</div>
                </div>
              </div>

              <div className="font-semibold text-sm text-fg group-hover:text-primary transition-colors">
                {member.profile.name}
              </div>
              <div className="text-xs text-primary font-medium mb-1">
                {member.role.name}
              </div>
              <p className="text-xs text-fg-muted line-clamp-2">
                {member.profile.headline}
              </p>

              <div className="mt-4 pt-3 border-t border-line/60 flex items-center justify-between text-[11px] text-fg-subtle">
                <span>{member.profile.location}</span>
                <span className="font-mono text-primary flex items-center gap-0.5">
                  View <ExternalLink className="size-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. TRANSPARENCY & TRUST MANIFESTO */}
      <section id="transparency" className="page-wrap">
        <div className="rounded-3xl border border-line bg-surface p-8 sm:p-12 shadow-card space-y-8">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-2 border border-line text-xs font-mono text-fg-muted">
              <ShieldCheck className="size-3.5 text-success" />
              <span>Full Methodology Transparency</span>
            </div>
            <h2 className="text-h2 text-fg">No black boxes. No arbitrary hiring gates.</h2>
            <p className="text-sm text-fg-muted leading-relaxed">
              Recruiting platforms frequently hide behind opaque algorithms. SkillRank operates on open,
              auditable scoring rubrics. Every point awarded corresponds to explicit signals you can inspect and improve.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-3 pt-4 border-t border-line">
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-fg">100% Deterministic</h4>
              <p className="text-xs text-fg-muted leading-relaxed">
                Run the same profile twice, get the same score. We don't generate hallucinatory AI ratings.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-fg">Role-Specific Calibration</h4>
              <p className="text-xs text-fg-muted leading-relaxed">
                A score of 82 for Frontend Developer means you meet frontend criteria, not that you know Kubernetes.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-fg">Local & Privacy-First</h4>
              <p className="text-xs text-fg-muted leading-relaxed">
                Your data is stored right in your browser. You choose whether to share your public link or keep it private.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. BOTTOM CALL TO ACTION */}
      <section className="page-wrap text-center space-y-6">
        <h2 className="text-h1 text-fg font-bold">
          Ready to know where your career stands?
        </h2>
        <p className="text-sm sm:text-base text-fg-muted max-w-xl mx-auto">
          Take 3 minutes to evaluate your profile or explore the interactive demo workspace right now.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Button to="/onboarding" size="lg" iconRight={ArrowRight}>
            Start Free Assessment
          </Button>
          <Button to="/app" variant="secondary" size="lg">
            Open Interactive Demo
          </Button>
        </div>
      </section>
    </div>
  )
}
