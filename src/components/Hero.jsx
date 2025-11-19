import Spline from '@splinetool/react-spline'
import { ArrowRight, Play } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative min-h-[92vh] w-full overflow-hidden">
      {/* Spline 3D cover background */}
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/TQzTfOv9igPMLRJd/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>

      {/* Dark gradient to ensure text contrast (does not block scene) */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-slate-900/80" />

      <div className="relative z-10 mx-auto flex min-h-[92vh] max-w-7xl flex-col items-center justify-center px-6 text-center">
        <p className="mb-4 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium tracking-wide text-blue-100/90 backdrop-blur">
          New Sci‑Fi RTS x Tactical Shooter
        </p>
        <h1 className="max-w-4xl text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl md:text-6xl">
          Planetfall Dominion
        </h1>
        <p className="mt-4 max-w-2xl text-base text-blue-100/90 sm:text-lg">
          Command autonomous drone armies, seize planetary strongholds, and drop into the fray yourself across a cluster of hostile, beautifully dangerous worlds.
        </p>

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
          <a href="#planets" className="inline-flex items-center gap-2 rounded-lg bg-blue-500 px-5 py-3 text-white shadow-lg shadow-blue-500/25 transition hover:bg-blue-400">
            Explore the Worlds <ArrowRight className="h-4 w-4" />
          </a>
          <button className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-5 py-3 text-blue-100 transition hover:bg-white/10">
            <Play className="h-4 w-4" /> Watch Concept Teaser
          </button>
        </div>
      </div>
    </section>
  )
}
