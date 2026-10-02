import {
  Bike, BookOpen, Brain, Bus, Cpu, Droplets, Dumbbell, Film, Footprints, Heart, Lamp, Library, Mountain, Recycle,
  Stethoscope, Telescope, TrainFront, Trees, Trophy, Truck, WavesHorizontal, Wind, Zap, type LucideIcon,
} from 'lucide-react'
import type { IconKey, Project } from '../data/projects'
import { CATEGORIES } from '../data/projects'

const ICONS: Record<IconKey, LucideIcon> = {
  cpu: Cpu, brain: Brain, trophy: Trophy, stethoscope: Stethoscope, heart: Heart, film: Film, wind: Wind,
  telescope: Telescope, library: Library, droplets: Droplets, train: TrainFront, trees: Trees, mountain: Mountain,
  bus: Bus, recycle: Recycle, footprints: Footprints, bike: Bike, lamp: Lamp, dumbbell: Dumbbell, book: BookOpen,
  waves: WavesHorizontal, truck: Truck, zap: Zap,
}

export function ProjectIcon({ project, size = 'md' }: { project: Project; size?: 'sm' | 'md' | 'lg' }) {
  const Icon = ICONS[project.icon]
  const cat = CATEGORIES[project.category]
  const dims = size === 'lg' ? 'h-16 w-16 rounded-2xl' : size === 'sm' ? 'h-9 w-9 rounded-xl' : 'h-12 w-12 rounded-2xl'
  const icon = size === 'lg' ? 'h-8 w-8' : size === 'sm' ? 'h-4 w-4' : 'h-6 w-6'
  return (
    <span className={`inline-flex shrink-0 items-center justify-center border-2 border-ink ${dims}`} style={{ background: cat.soft, color: '#16130F' }}>
      <Icon className={icon} strokeWidth={2.2} />
    </span>
  )
}

/** Decorative cover art for a project, generated from its category */
export function ProjectCover({ project, className = '' }: { project: Project; className?: string }) {
  const Icon = ICONS[project.icon]
  const cat = CATEGORIES[project.category]
  return (
    <div className={`relative overflow-hidden border-b-2 border-ink ${className}`} style={{ background: cat.color }}>
      <div className="bg-dots absolute inset-0 opacity-40" />
      <div className="absolute -bottom-10 -right-6 rotate-[-12deg] text-white/30">
        <Icon className="h-48 w-48" strokeWidth={1.4} />
      </div>
      <div className="absolute left-5 top-5">
        <span className="inline-flex h-12 w-12 rotate-[-6deg] items-center justify-center rounded-2xl border-2 border-ink bg-white text-ink shadow-[3px_3px_0_#16130F]">
          <Icon className="h-6 w-6" strokeWidth={2.2} />
        </span>
      </div>
    </div>
  )
}
