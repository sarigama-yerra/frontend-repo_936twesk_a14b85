import { Rocket } from 'lucide-react'

export default function CTA() {
  return (
    <section className="relative bg-slate-950 py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-r from-blue-600/20 via-indigo-600/20 to-violet-600/20 p-8">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <h3 className="text-2xl font-bold text-white">Enlist for the Planetfall Briefing</h3>
              <p className="mt-2 max-w-xl text-blue-100/80">Get updates on prototypes, playtests, and behind‑the‑scenes AI combat tech.</p>
            </div>
            <a href="/test" className="inline-flex items-center gap-2 rounded-lg bg-blue-500 px-5 py-3 text-white shadow-lg shadow-blue-500/25 transition hover:bg-blue-400">
              <Rocket className="h-4 w-4" /> System Check
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
