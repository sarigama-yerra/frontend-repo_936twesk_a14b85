import { Radar, Crosshair, Wrench, Shield, Radio, Bolt, Satellite, Sword } from 'lucide-react'

const features = [
  {
    icon: Radar,
    title: 'Drone Conquest',
    desc: 'Recon, Assault, Siege, and Support drones fight for control points with adaptive behaviors.',
  },
  {
    icon: Crosshair,
    title: 'Tactical Insertion',
    desc: 'Drop from commander view into on‑foot combat for breaches, sabotage, and boss fights.',
  },
  {
    icon: Shield,
    title: 'Command Abilities',
    desc: 'Call orbital strikes, unleash drone swarms, or trigger sector‑wide EMP waves.',
  },
  {
    icon: Wrench,
    title: 'Progression',
    desc: 'Unlock planet tech, stronger drones, armor tiers, and weapon upgrades.',
  },
]

const factions = [
  { icon: Satellite, name: 'Guardian Protocol', desc: 'Defensive wardens locking down zones.' },
  { icon: Bolt, name: 'Rogue Harvesters', desc: 'Aggressive scavengers that rush targets.' },
  { icon: Sword, name: 'Phantom Operatives', desc: 'Stealth assassins striking from the dark.' },
]

export default function Gameplay() {
  return (
    <section id="gameplay" className="relative bg-slate-950 py-20">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="text-3xl font-bold text-white sm:text-4xl">Core Gameplay</h2>
        <p className="mt-2 max-w-2xl text-blue-200/80">
          Seize territory in real‑time, coordinate AI bot factions, and take matters into your own hands when objectives demand precision.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {features.map((f) => (
            <div key={f.title} className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="mb-3 flex items-center gap-3">
                <f.icon className="h-5 w-5 text-blue-300" />
                <h3 className="text-lg font-semibold text-white">{f.title}</h3>
              </div>
              <p className="text-blue-100/80">{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-14 rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-800 p-6">
          <p className="text-sm uppercase tracking-widest text-blue-300/60">AI Bot Factions</p>
          <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {factions.map((fa) => (
              <div key={fa.name} className="rounded-xl border border-white/10 bg-white/5 p-5">
                <div className="mb-3 flex items-center gap-3">
                  <fa.icon className="h-5 w-5 text-blue-300" />
                  <h4 className="font-semibold text-white">{fa.name}</h4>
                </div>
                <p className="text-blue-100/80">{fa.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
