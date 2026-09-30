// Role Explorer categories. `icon` is a lucide icon NAME - resolved in config/roleCategoryIcons.js
// so this module stays free of React imports (it is also used by Node scripts).

export const ROLE_CATEGORIES = [
  {
    id: 'software',
    label: 'Software Development',
    icon: 'Code2',
    blurb: 'Web, mobile, backend and systems engineering.',
  },
  { id: 'ai-data', label: 'AI & Data', icon: 'BrainCircuit', blurb: 'Machine learning, analytics and data platforms.' },
  { id: 'security', label: 'Cybersecurity', icon: 'ShieldCheck', blurb: 'Defend, test and harden systems.' },
  { id: 'cloud', label: 'Cloud & DevOps', icon: 'Cloud', blurb: 'Infrastructure, delivery and reliability.' },
  { id: 'game', label: 'Game Development', icon: 'Gamepad2', blurb: 'Engines, gameplay and real-time systems.' },
  {
    id: 'creative-3d',
    label: '3D & Creative Technology',
    icon: 'Box',
    blurb: '3D art, technical art and creative coding.',
  },
  { id: 'design', label: 'Design', icon: 'PenTool', blurb: 'Product, UX and visual design.' },
  { id: 'emerging', label: 'Emerging Technology', icon: 'Sparkles', blurb: 'Blockchain, XR and robotics.' },
]

export const ROLE_CATEGORY_BY_ID = Object.fromEntries(ROLE_CATEGORIES.map((c) => [c.id, c]))
