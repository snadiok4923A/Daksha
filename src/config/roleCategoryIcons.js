import { Code2, BrainCircuit, ShieldCheck, Cloud, Gamepad2, Box, PenTool, Sparkles, Layers } from 'lucide-react'

/** Maps the icon names used in data/roles/categories.js to lucide components. */
const ICONS = { Code2, BrainCircuit, ShieldCheck, Cloud, Gamepad2, Box, PenTool, Sparkles }

export const getRoleCategoryIcon = (name) => ICONS[name] ?? Layers
