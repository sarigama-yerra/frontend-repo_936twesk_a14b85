import { Mountain, Snowflake, Leaf, Flame, Moon, ChevronRight } from 'lucide-react'

const planets = [
  {
    id: 'aurelia',
    name: 'Aurelia Prime',
    tagline: 'Desert world of open battlefields and ancient ruins',
    icon: Mountain,
    color: 'from-amber-400/20 to-amber-600/10',
    accent: 'text-amber-300',
    chips: ['Open Fields', 'Ruins', 'Mobile Warfare'],
  },
  {
    id: 'cryon6',
    name: 'Cryon‑6',
    tagline: 'Frozen planet with storms and limited visibility',
    icon: Snowflake,
    color: 'from-sky-400/20 to-sky-600/10',
    accent: 'text-sky-300',
    chips: ['Blizzards', 'Sensors', 'Thermal Ops'],
  },
  {
    id: 'verdantis',
    name: 'Verdantis',
    tagline: 'Jungle world of ambush points and dense foliage',
    icon: Leaf,
    color: 'from-emerald-400/20 to-emerald-600/10',
    accent: 'text-emerald-300',
    chips: ['Stealth', 'Guerrilla', 'Close Quarters'],
  },
  {
    id: 'obsidion',
    name: 'Obsidion Core',
    tagline: 'Volcanic terrain with unstable ground and lava flows',
    icon: Flame,
    color: 'from-orange-400/20 to-red-600/10',
    accent: 'text-orange-300',
    chips: ['Heat', 'Quakes', 'Hazards'],
  },
  {
    id: 'eclipse',
    name: 'Eclipse Haven',
    tagline: 'Twilight world with bioluminescent flora and covert zones',
    icon: Moon,
    color: 'from-violet-400/20 to-indigo-600/10',
    accent: 'text-violet-300',
    chips: ['Low‑Light', 'Silence', 'Flanking'],
  },
]

export default function Planets() {
  return (
    <section id="planets" className="relative bg-slate-900 py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="text-sm uppercase tracking-widest text-blue-300/60">The Starfront Sector</p>
            <h2 className="mt-2 text-3xl font-bold text-white sm:text-4xl">Five Worlds. Five Battlefields.</h2>
          </div>
          <a href="#gameplay" className="hidden items-center gap-2 text-blue-300/80 hover:text-blue-200 sm:flex">
            Core Gameplay <ChevronRight className="h-4 w-4" />
          </a>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {planets.map((p) => (
            <div key={p.id} className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br ${p.color} p-6`}> 
              <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(1200px_300px_at_0%_0%,rgba(255,255,255,0.06),transparent)] opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="relative z-10">
                <div className="mb-4 flex items-center gap-3">
                  <p.icon className={`h-6 w-6 ${p.accent}`} />
                  <h3 className="text-xl font-semibold text-white">{p.name}</h3>
                </div>
                <p className="text-blue-100/80">{p.tagline}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {p.chips.map((c) => (
                    <span key={c} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-blue-100/90">{c}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
