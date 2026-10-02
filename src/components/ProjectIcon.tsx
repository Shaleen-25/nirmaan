import {
  Bike, BookOpen, Brain, Bus, Cpu, Droplets, Dumbbell, Film, Footprints, Heart, Lamp, Library, Mountain, Recycle,
  Stethoscope, Telescope, TrainFront, Trees, Trophy, Truck, WavesHorizontal, Wind, type LucideIcon,
} from 'lucide-react'
import type { IconKey, Project } from '../data/projects'
import { CATEGORIES } from '../data/projects'

const ICONS: Record<IconKey, LucideIcon> = {
  cpu: Cpu, brain: Brain, trophy: Trophy, stethoscope: Stethoscope, heart: Heart, film: Film, wind: Wind,
  telescope: Telescope, library: Library, droplets: Droplets, train: TrainFront, trees: Trees, mountain: Mountain,
  bus: Bus, recycle: Recycle, footprints: Footprints, bike: Bike, lamp: Lamp, dumbbell: Dumbbell, book: BookOpen,
  waves: WavesHorizontal, truck: Truck,
}

export function ProjectIcon({ project, size = 'md' }: { project: Project; size?: 'sm' | 'md' | 'lg' }) {
  const Icon = ICONS[project.icon]
  const cat = CATEGORIES[project.category]
  const dims = size === 'lg' ? 'h-16 w-16 rounded-2xl' : size === 'sm' ? 'h-9 w-9 rounded-xl' : 'h-12 w-12 rounded-2xl'
  const icon = size === 'lg' ? 'h-8 w-8' : size === 'sm' ? 'h-4 w-4' : 'h-6 w-6'
  return (
    <span className={`inline-flex shrink-0 items-center justify-center ${dims}`} style={{ background: cat.soft, color: cat.color }}>
      <Icon className={icon} strokeWidth={2} />
    </span>
  )
}

/** Decorative cover art for a project, generated from its category */
export function ProjectCover({ project, className = '' }: { project: Project; className?: string }) {
  const Icon = ICONS[project.icon]
  const cat = CATEGORIES[project.category]
  return (
    <div className={`relative overflow-hidden ${className}`} style={{ background: `linear-gradient(135deg, ${cat.soft}, #ffffff)` }}>
      <div className="grain absolute inset-0 opacity-60" />
      <div className="absolute -right-6 -bottom-8 opacity-[0.13]" style={{ color: cat.color }}>
        <Icon className="h-44 w-44" strokeWidth={1.25} />
      </div>
      <div className="absolute left-5 top-5">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm" style={{ color: cat.color }}>
          <Icon className="h-6 w-6" />
        </span>
      </div>
    </div>
  )
}
