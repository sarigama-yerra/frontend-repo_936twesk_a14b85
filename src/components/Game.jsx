import { useEffect, useRef, useState } from 'react'

// Simple top‑down arena prototype
// Controls: WASD to move, Mouse to aim, Left click to shoot, P to pause
export default function Game() {
  const canvasRef = useRef(null)
  const rafRef = useRef(0)
  const runningRef = useRef(true)
  const inputRef = useRef({ w:false, a:false, s:false, d:false, mouseX:0, mouseY:0, shooting:false })
  const worldRef = useRef(null)
  const [hud, setHud] = useState({ hp: 100, ammo: 999, score: 0, captured: 0, paused: false })

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    // Resize handling
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.floor(canvas.clientWidth * dpr)
      canvas.height = Math.floor(canvas.clientHeight * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    // Initialize world
    const initWorld = () => {
      const width = canvas.clientWidth
      const height = canvas.clientHeight
      const centerX = width/2
      const centerY = height/2

      const capturePoints = [
        { x: width*0.2, y: height*0.25, radius: 28, progress: 0, owner: 0 },
        { x: width*0.8, y: height*0.35, radius: 28, progress: 0, owner: 0 },
        { x: width*0.5, y: height*0.75, radius: 28, progress: 0, owner: 0 },
      ]

      const enemies = new Array(8).fill(0).map(() => spawnEnemy(width, height))

      worldRef.current = {
        width, height,
        player: { x:centerX, y:centerY, vx:0, vy:0, speed: 210, angle: 0, hp: 100, fireCooldown: 0 },
        bullets: [],
        enemies,
        capturePoints,
        lastTime: performance.now(),
        score: 0,
      }
    }

    const spawnEnemy = (W, H) => ({
      x: Math.random()*W, y: Math.random()*H, vx:0, vy:0, hp: 30, speed: 120, target: {x: Math.random()*W, y: Math.random()*H}, fireCooldown: 0,
    })

    const onKey = (e, down) => {
      const k = e.key.toLowerCase()
      if (k === 'w') inputRef.current.w = down
      if (k === 'a') inputRef.current.a = down
      if (k === 's') inputRef.current.s = down
      if (k === 'd') inputRef.current.d = down
      if (k === 'p') {
        runningRef.current = down ? runningRef.current : runningRef.current
        // toggle on keyup to avoid rapid flip
        if (!down) {
          runningRef.current = !runningRef.current
          setHud((h) => ({ ...h, paused: !h.paused }))
        }
      }
    }

    const onMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect()
      inputRef.current.mouseX = e.clientX - rect.left
      inputRef.current.mouseY = e.clientY - rect.top
    }
    const onMouseDown = () => { inputRef.current.shooting = true }
    const onMouseUp = () => { inputRef.current.shooting = false }

    canvas.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mouseup', onMouseUp)
    window.addEventListener('keydown', (e) => onKey(e, true))
    window.addEventListener('keyup', (e) => onKey(e, false))

    const loop = (now) => {
      const world = worldRef.current
      if (!world) return

      const dt = Math.min(0.033, (now - world.lastTime) / 1000)
      world.lastTime = now

      if (runningRef.current) {
        update(world, dt)
        draw(ctx, world)
      } else {
        draw(ctx, world)
        drawPauseOverlay(ctx, world)
      }

      rafRef.current = requestAnimationFrame(loop)
    }

    const update = (world, dt) => {
      const { player } = world

      // Movement
      const dirX = (inputRef.current.d ? 1 : 0) - (inputRef.current.a ? 1 : 0)
      const dirY = (inputRef.current.s ? 1 : 0) - (inputRef.current.w ? 1 : 0)
      const len = Math.hypot(dirX, dirY) || 1
      const spd = player.speed
      player.vx = (dirX/len) * spd
      player.vy = (dirY/len) * spd
      player.x += player.vx * dt
      player.y += player.vy * dt
      // Clamp
      player.x = Math.max(20, Math.min(world.width-20, player.x))
      player.y = Math.max(20, Math.min(world.height-20, player.y))

      // Aim angle
      const dx = inputRef.current.mouseX - player.x
      const dy = inputRef.current.mouseY - player.y
      player.angle = Math.atan2(dy, dx)

      // Shooting
      player.fireCooldown -= dt
      if (inputRef.current.shooting && player.fireCooldown <= 0) {
        world.bullets.push({ x: player.x + Math.cos(player.angle)*14, y: player.y + Math.sin(player.angle)*14, vx: Math.cos(player.angle)*520, vy: Math.sin(player.angle)*520, life: 1, friendly: true })
        player.fireCooldown = 0.16
      }

      // Update bullets
      world.bullets.forEach(b => { b.x += b.vx*dt; b.y += b.vy*dt; b.life -= dt })
      world.bullets = world.bullets.filter(b => b.life > 0 && b.x>-50 && b.x<world.width+50 && b.y>-50 && b.y<world.height+50)

      // Enemies AI
      for (const en of world.enemies) {
        if (en.hp <= 0) continue
        // pursue player if close else move to target
        const toPlayer = Math.hypot(player.x - en.x, player.y - en.y)
        let tx = en.target.x, ty = en.target.y
        if (toPlayer < 220) { tx = player.x; ty = player.y } else if (Math.hypot(en.x - en.target.x, en.y - en.target.y) < 20) {
          en.target = { x: Math.random()*world.width, y: Math.random()*world.height }
        }
        const adx = tx - en.x, ady = ty - en.y
        const alen = Math.hypot(adx, ady) || 1
        en.vx = (adx/alen) * en.speed
        en.vy = (ady/alen) * en.speed
        en.x += en.vx * dt
        en.y += en.vy * dt

        // Enemy occasional shots
        en.fireCooldown -= dt
        if (toPlayer < 260 && en.fireCooldown <= 0) {
          const ang = Math.atan2(player.y - en.y, player.x - en.x)
          world.bullets.push({ x: en.x + Math.cos(ang)*12, y: en.y + Math.sin(ang)*12, vx: Math.cos(ang)*360, vy: Math.sin(ang)*360, life: 1.2, friendly: false })
          en.fireCooldown = 0.9 + Math.random()*0.6
        }
      }

      // Bullet collisions
      for (const b of world.bullets) {
        if (b.friendly) {
          for (const en of world.enemies) {
            if (en.hp > 0 && Math.hypot(b.x - en.x, b.y - en.y) < 14) {
              en.hp -= 20
              b.life = 0
              if (en.hp <= 0) {
                world.score += 25
              }
              break
            }
          }
        } else {
          if (Math.hypot(b.x - player.x, b.y - player.y) < 14) {
            player.hp -= 10
            b.life = 0
          }
        }
      }

      // Remove dead enemies occasionally and respawn
      const deadCount = world.enemies.filter(e => e.hp <= 0).length
      if (deadCount > 0) {
        world.enemies = world.enemies.filter(e => e.hp > 0).concat(new Array(deadCount).fill(0).map(() => spawnEnemy(world.width, world.height)))
      }

      // Capture logic
      for (const cp of world.capturePoints) {
        const dist = Math.hypot(player.x - cp.x, player.y - cp.y)
        const playerIn = dist < cp.radius + 14
        const enemiesIn = world.enemies.some(e => e.hp>0 && Math.hypot(e.x - cp.x, e.y - cp.y) < cp.radius + 14)
        const rate = playerIn && !enemiesIn ? 20 : (!playerIn && enemiesIn ? -12 : 0)
        cp.progress = Math.max(0, Math.min(100, cp.progress + rate * dt))
        cp.owner = cp.progress >= 100 ? 1 : (cp.progress <= 0 ? 0 : cp.owner)
      }

      // Update HUD state sparingly (every ~100ms) to avoid extra overhead
      accumTime += dt
      if (accumTime > 0.1) {
        const captured = world.capturePoints.filter(c => c.owner === 1).length
        setHud({ hp: Math.max(0, Math.round(player.hp)), ammo: 999, score: world.score, captured, paused: !runningRef.current })
        accumTime = 0
      }

      // Game over simple rule
      if (player.hp <= 0) {
        // reset
        initWorld()
      }
    }

    const drawGrid = (ctx, world) => {
      ctx.fillStyle = '#0f172a' // slate-900
      ctx.fillRect(0, 0, world.width, world.height)
      ctx.strokeStyle = 'rgba(148,163,184,0.08)'
      ctx.lineWidth = 1
      const step = 40
      for (let x=0; x<world.width; x+=step) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, world.height); ctx.stroke() }
      for (let y=0; y<world.height; y+=step) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(world.width, y); ctx.stroke() }
    }

    const draw = (ctx, world) => {
      drawGrid(ctx, world)

      // Capture points
      for (const cp of world.capturePoints) {
        ctx.beginPath()
        ctx.arc(cp.x, cp.y, cp.radius, 0, Math.PI*2)
        ctx.fillStyle = 'rgba(59,130,246,0.12)'
        ctx.fill()
        ctx.strokeStyle = 'rgba(59,130,246,0.5)'
        ctx.lineWidth = 2
        ctx.stroke()
        // progress ring
        ctx.beginPath()
        ctx.strokeStyle = 'rgba(96,165,250,0.9)'
        ctx.lineWidth = 4
        ctx.arc(cp.x, cp.y, cp.radius+6, -Math.PI/2, -Math.PI/2 + (cp.progress/100)*Math.PI*2)
        ctx.stroke()
      }

      // Enemies
      for (const en of world.enemies) {
        if (en.hp <= 0) continue
        drawTri(ctx, en.x, en.y, Math.atan2(en.vy, en.vx), 12, '#f87171')
      }

      // Bullets
      for (const b of world.bullets) {
        ctx.beginPath()
        ctx.arc(b.x, b.y, 2.5, 0, Math.PI*2)
        ctx.fillStyle = b.friendly ? '#93c5fd' : '#fdba74'
        ctx.fill()
      }

      // Player
      const p = world.player
      drawTri(ctx, p.x, p.y, p.angle, 14, '#60a5fa')

      // Damage vignette if low hp
      if (p.hp < 40) {
        const alpha = 0.15 + (1 - p.hp/40) * 0.25
        ctx.fillStyle = `rgba(239,68,68,${alpha})`
        ctx.fillRect(0,0,world.width, world.height)
      }
    }

    const drawTri = (ctx, x, y, angle, size, color) => {
      ctx.save()
      ctx.translate(x, y)
      ctx.rotate(angle)
      ctx.beginPath()
      ctx.moveTo(size, 0)
      ctx.lineTo(-size*0.6, -size*0.6)
      ctx.lineTo(-size*0.6, size*0.6)
      ctx.closePath()
      ctx.fillStyle = color
      ctx.shadowColor = 'rgba(59,130,246,0.4)'
      ctx.shadowBlur = 8
      ctx.fill()
      ctx.restore()
    }

    const drawPauseOverlay = (ctx, world) => {
      ctx.fillStyle = 'rgba(2,6,23,0.6)'
      ctx.fillRect(0,0,world.width, world.height)
      ctx.fillStyle = '#e2e8f0'
      ctx.font = '600 20px Inter, system-ui, sans-serif'
      ctx.fillText('Paused (press P to resume)', 20, 32)
    }

    let accumTime = 0

    resize()
    initWorld()
    draw(ctx, worldRef.current)
    rafRef.current = requestAnimationFrame(loop)
    window.addEventListener('resize', () => { resize(); if (worldRef.current) { worldRef.current.width = canvas.clientWidth; worldRef.current.height = canvas.clientHeight } })

    return () => {
      cancelAnimationFrame(rafRef.current)
      canvas.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mouseup', onMouseUp)
      // We didn't store bound key handlers separately; rely on new page lifecycle (dev env). In real app, store refs to remove.
    }
  }, [])

  return (
    <section id="play" className="relative w-full bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 pt-16">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Playable Prototype</h2>
          <p className="text-xs text-blue-300/70">WASD move · Mouse aim · Click shoot · P pause</p>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 pb-8">
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80">
          <canvas ref={canvasRef} className="block h-[520px] w-full sm:h-[620px]" />
          <div className="pointer-events-none absolute left-0 top-0 z-10 flex w-full justify-between p-3 text-xs">
            <HUDDisplay hud={hud} />
          </div>
        </div>
      </div>
    </section>
  )
}

function HUDDisplay({ hud }) {
  return (
    <div className="flex w-full items-start justify-between">
      <div className="rounded bg-black/40 px-3 py-2 text-blue-100/90 backdrop-blur">
        <div>HP: <span className="text-white">{hud.hp}</span></div>
        <div>Score: <span className="text-white">{hud.score}</span></div>
        <div>Captured: <span className="text-white">{hud.captured}/3</span></div>
      </div>
      {hud.paused && (
        <div className="rounded bg-black/50 px-3 py-2 text-blue-100/90 backdrop-blur">
          Paused
        </div>
      )}
    </div>
  )
}
