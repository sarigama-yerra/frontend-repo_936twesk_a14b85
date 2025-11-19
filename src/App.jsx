import Hero from './components/Hero'
import Planets from './components/Planets'
import Gameplay from './components/Gameplay'
import CTA from './components/CTA'

function App() {
  return (
    <div className="min-h-screen bg-slate-950">
      <header className="absolute left-0 right-0 top-0 z-20">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <a href="/" className="flex items-center gap-2 text-white">
            <img src="/flame-icon.svg" alt="logo" className="h-7 w-7" />
            <span className="text-sm font-semibold tracking-wide">Planetfall Dominion</span>
          </a>
          <nav className="hidden gap-6 text-blue-100/80 sm:flex">
            <a href="#planets" className="hover:text-white">Worlds</a>
            <a href="#gameplay" className="hover:text-white">Gameplay</a>
            <a href="/test" className="hover:text-white">System</a>
          </nav>
        </div>
      </header>

      <main>
        <Hero />
        <Planets />
        <Gameplay />
        <CTA />
      </main>

      <footer className="border-t border-white/10 bg-slate-950/80 py-10">
        <div className="mx-auto max-w-7xl px-6 text-blue-300/70">
          <p className="text-sm">© {new Date().getFullYear()} Planetfall Dominion — Concept Showcase</p>
        </div>
      </footer>
    </div>
  )
}

export default App
