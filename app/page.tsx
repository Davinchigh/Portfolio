import { ArrowRight, Leaf, Sun, Droplets, Scissors, Trees, Recycle, Flower2 } from "lucide-react"
import { Header } from "@/components/header"
import { Logo, Mark } from "@/components/logo"
import { Planner } from "@/components/planner"
import { VisitForm } from "@/components/visit-form"
import { extras, services, steps, values } from "@/lib/content"

const extraIcons = [Droplets, Trees, Recycle, Leaf, Flower2, Sun]

/** The hero sprout: draws its stem, then its two leaves pop open and sway. */
function Sprout() {
  return (
    <svg viewBox="0 0 120 150" className="h-24 w-20 sm:h-28 sm:w-24" aria-hidden="true">
      <path className="sprout-stem" d="M60 148 C60 120 58 95 60 60" fill="none" stroke="#3F6B45" strokeWidth="5" strokeLinecap="round" />
      <path className="sprout-leaf l" d="M60 82 C40 82 24 70 20 46 C42 46 58 60 60 82 Z" fill="#7FB069" />
      <path className="sprout-leaf r" d="M60 66 C80 66 96 52 100 26 C78 26 62 42 60 66 Z" fill="#A9D18E" />
    </svg>
  )
}

export default function Home() {
  return (
    <div id="top">
      <aside aria-label="About this site" className="bg-forest px-4 py-2 text-center text-xs text-cream/90">
        A concept brand and website by Benedict Frimpong Boateng. Photos are AI-generated.
      </aside>
      <Header />
      <main id="main">
        {/* HERO */}
        <section aria-labelledby="hero-title" className="wrap grid items-center gap-10 pb-16 pt-8 lg:grid-cols-[1fr_1.15fr] lg:pb-24 lg:pt-14">
          <div>
            <Sprout />
            <h1 id="hero-title" className="mt-4 text-[clamp(2.8rem,7vw,5.4rem)] font-semibold leading-[0.98] text-forest">
              Gardening in your home, <em className="text-moss">made joyful.</em>
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-ink/80">
              We design, plant and care for gardens across Accra, from a single balcony of pots to a whole compound. You enjoy it, we keep it growing.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#visit" className="btn-primary">Book a free garden visit <ArrowRight className="h-4 w-4" aria-hidden="true" /></a>
              <a href="#services" className="btn-light">See what we do</a>
            </div>
            <ul className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-stone">
              <li className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-leaf" aria-hidden="true" /> Free first visit</li>
              <li className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-sun" aria-hidden="true" /> Plants chosen for our climate</li>
              <li className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-clay" aria-hidden="true" /> Clear, fair quotes</li>
            </ul>
          </div>
          <div className="relative">
            <img src="/img/hero.webp" alt="A sunlit home garden patio with potted monstera, bird of paradise and ferns against a cream wall, bougainvillea and a wooden bench" className="aspect-[4/3] w-full rounded-[36px] object-cover shadow-[0_40px_80px_-40px_rgba(24,58,44,0.6)]" fetchPriority="high" />
            <div className="absolute -bottom-6 left-4 flex items-center gap-3 rounded-2xl bg-white/95 p-3 pr-5 shadow-xl backdrop-blur sm:left-[-28px]">
              <Mark className="h-11 w-11" />
              <div>
                <p className="text-sm font-bold text-forest">Your first visit is free</p>
                <p className="text-xs text-stone">45 minutes, no obligation</p>
              </div>
            </div>
          </div>
        </section>

        {/* WORD BAND */}
        <div aria-hidden="true" className="overflow-hidden border-y border-forest/10 bg-leaf-soft/60 py-4">
          <div className="marquee flex w-max gap-10 whitespace-nowrap font-display text-2xl italic text-forest/80">
            {[0, 1].map((k) => (
              <span key={k} className="flex gap-10">
                {["Landscaping", "Lawn care", "Planting", ...extras].map((w) => (
                  <span key={w} className="flex items-center gap-10">{w}<Leaf className="h-5 w-5 text-moss" /></span>
                ))}
              </span>
            ))}
          </div>
        </div>

        {/* SERVICES */}
        <section id="services" aria-labelledby="services-title" className="wrap py-20 sm:py-28">
          <div className="rise max-w-2xl">
            <p className="eyebrow"><Leaf className="h-4 w-4" aria-hidden="true" /> What we do</p>
            <h2 id="services-title" className="mt-4 text-4xl font-semibold text-forest sm:text-5xl">Everything your garden needs, from first sketch to weekly trim.</h2>
          </div>
          <ul className="mt-14 grid gap-6 md:grid-cols-3">
            {services.map((s) => (
              <li key={s.id} className="rise group overflow-hidden rounded-[28px] bg-white shadow-[0_20px_50px_-35px_rgba(24,58,44,0.6)] transition-transform duration-300 hover:-translate-y-1">
                <div className="overflow-hidden">
                  <img src={s.image} alt={s.alt} loading="lazy" className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-105 motion-reduce:transition-none" />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-semibold text-forest">{s.title}</h3>
                  <p className="mt-2 leading-relaxed text-stone">{s.line}</p>
                </div>
              </li>
            ))}
          </ul>
          <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {extras.map((e, k) => {
              const Icon = extraIcons[k]
              return (
                <li key={e} className="rise flex items-center gap-3 rounded-2xl border border-forest/10 bg-cream px-4 py-4 text-[15px] font-semibold text-forest transition-colors hover:bg-leaf-soft">
                  <Icon className="h-5 w-5 shrink-0 text-moss" aria-hidden="true" /> {e}
                </li>
              )
            })}
          </ul>
        </section>

        {/* HOW IT WORKS */}
        <section id="how" aria-labelledby="how-title" className="bg-sand/70 py-20 sm:py-28">
          <div className="wrap">
            <p className="eyebrow"><Scissors className="h-4 w-4" aria-hidden="true" /> How it works</p>
            <h2 id="how-title" className="mt-4 max-w-2xl text-4xl font-semibold text-forest sm:text-5xl">Three steps from bare ground to a garden you love.</h2>
            <div className="relative mt-16">
              <svg viewBox="0 0 1000 40" preserveAspectRatio="none" className="absolute left-0 right-0 top-6 hidden h-10 w-full md:block" aria-hidden="true">
                <path className="vine" pathLength={1} d="M20 20 C 180 -10, 320 50, 500 20 S 820 -10, 980 20" fill="none" stroke="#7FB069" strokeWidth="3" strokeLinecap="round" />
              </svg>
              <ol className="relative grid gap-10 md:grid-cols-3">
                {steps.map((s) => (
                  <li key={s.n} className="rise">
                    <span className="grid h-14 w-14 place-items-center rounded-full bg-forest font-display text-lg text-cream ring-8 ring-sand">{s.n}</span>
                    <h3 className="mt-6 text-3xl font-semibold text-forest">{s.title}</h3>
                    <p className="mt-3 max-w-xs leading-relaxed text-ink/75">{s.body}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* ABOUT / GARDENER */}
        <section id="about" aria-labelledby="about-title" className="wrap grid items-center gap-12 py-20 sm:py-28 lg:grid-cols-2">
          <div className="rise relative">
            <img src="/img/gardener.webp" alt="A smiling gardener in a sage linen shirt and canvas apron repotting a monstera into a terracotta pot" loading="lazy" className="aspect-[4/5] w-full rounded-[36px] object-cover" />
            <span aria-hidden="true" className="absolute -right-4 -top-4 hidden h-24 w-24 rounded-full bg-sun/90 sm:block" />
          </div>
          <div className="rise">
            <p className="eyebrow"><Sun className="h-4 w-4" aria-hidden="true" /> Meet your gardener</p>
            <h2 id="about-title" className="mt-4 text-4xl font-semibold text-forest sm:text-5xl">Gordin Grey, senior gardener</h2>
            <p className="mt-6 text-lg leading-relaxed text-ink/80">
              Here at Glee Garden, we believe a beautiful garden is more than plants and flowers. It&apos;s where families gather, memories are made and nature flourishes. Whether you want expert landscaping, routine care or a complete transformation, our team brings your idea to life.
            </p>
            <ul className="mt-10 grid gap-4 sm:grid-cols-2">
              {values.map((v) => (
                <li key={v.title} className="rounded-2xl bg-white p-5 shadow-[0_14px_40px_-30px_rgba(24,58,44,0.6)]">
                  <p className="font-display text-xl font-semibold text-forest">{v.title}</p>
                  <p className="mt-1 text-[15px] text-stone">{v.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* PLANTING GUIDE */}
        <section id="guide" aria-labelledby="guide-title" className="wrap pb-20 sm:pb-28">
          <div className="rise mb-10 max-w-2xl">
            <p className="eyebrow"><Flower2 className="h-4 w-4" aria-hidden="true" /> Planting guide</p>
            <h2 id="guide-title" className="mt-4 text-4xl font-semibold text-forest sm:text-5xl">What should I plant this month?</h2>
          </div>
          <div className="rise">
            <Planner />
          </div>
        </section>

        {/* VISIT */}
        <section id="visit" aria-labelledby="visit-title" className="bg-leaf-soft/70 py-20 sm:py-28">
          <div className="wrap grid gap-12 lg:grid-cols-[1fr_1.2fr]">
            <div className="rise">
              <p className="eyebrow"><Leaf className="h-4 w-4" aria-hidden="true" /> Get started</p>
              <h2 id="visit-title" className="mt-4 text-4xl font-semibold text-forest sm:text-5xl">Book a free garden visit.</h2>
              <p className="mt-6 max-w-md text-lg leading-relaxed text-ink/80">Tell us a little about your space. A gardener calls you back within a day to find a time that suits you.</p>
            </div>
            <div className="rise">
              <VisitForm />
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-forest-deep text-cream">
        <div className="wrap grid gap-10 py-16 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Logo light />
            <p className="mt-5 max-w-xs text-cream/75">Bringing nature closer to you, one garden at a time.</p>
          </div>
          {[
            ["Services", ["Landscaping", "Lawn care", "Garden design", "Planting", "Installations"]],
            ["More care", ["Irrigation", "Tree & shrub care", "Organic gardening", "Seasonal clean-ups", "Mulching"]],
            ["Why us", ["Expertise", "Made for you", "Sustainability", "Fair prices", "Happy gardens"]],
          ].map(([h, items]) => (
            <div key={h as string}>
              <h2 className="font-sans text-xs font-bold uppercase tracking-[0.18em] text-leaf">{h as string}</h2>
              <ul className="mt-4 space-y-2 text-[15px] text-cream/80">
                {(items as string[]).map((i) => <li key={i}>{i}</li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-cream/10">
          <p className="wrap py-6 text-sm text-cream/70">
            © 2026 Glee Garden. A concept brand, logo and website designed by Benedict Frimpong Boateng. Photos are AI-generated and the gardener is fictional.
          </p>
        </div>
      </footer>
    </div>
  )
}
