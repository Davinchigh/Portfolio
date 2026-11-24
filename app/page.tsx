import { ArrowUpRight, Check, Droplets, Flower2, Leaf, Recycle, Sun, Trees } from "lucide-react"
import { Header } from "@/components/header"
import { Logo, Mark } from "@/components/logo"
import { Motion } from "@/components/motion"
import { Planner } from "@/components/planner"
import { VisitForm } from "@/components/visit-form"
import { PlanBuilder } from "@/components/plan-builder"
import { audiences, plans, projects, promises } from "@/lib/business"
import { extras, steps, values } from "@/lib/content"

const extraIcons = [Droplets, Trees, Recycle, Leaf, Flower2, Sun]

const services = [
  {
    n: "01",
    title: "Landscape design & installation",
    body: "Paths, beds, water features and shade, planned around how you actually live outside. We draw it, price it, then build it.",
    items: ["Site visit and measured plan", "Paths, edging and stonework", "Water features and lighting"],
    image: "/img/landscape.webp",
    alt: "A home garden with pale stepping stones through lawn, beds of lavender, croton and heliconia, and a stone water bowl",
  },
  {
    n: "02",
    title: "Lawn care & maintenance",
    body: "Mowing, edging, feeding and weed control on a schedule that fits the seasons, so the grass stays thick all year.",
    items: ["Weekly or fortnightly visits", "Feeding and weed control", "Aeration and repair"],
    image: "/img/lawn.webp",
    alt: "A freshly striped lawn meeting a clean border of marigolds and ferns, with a sprinkler in the morning sun",
  },
  {
    n: "03",
    title: "Garden design & planting",
    body: "Flower beds, kitchen gardens and pots, chosen for your light, your soil and our climate, then planted to last.",
    items: ["Plant selection for your light", "Kitchen and herb gardens", "Pots, balconies and courtyards"],
    image: "/img/planting.webp",
    alt: "Hands pressing soil around a young tomato plant in a raised bed beside basil, lettuce and peppers",
  },
]

function Arrow() {
  return (
    <span className="arrow-swap" aria-hidden="true">
      <ArrowUpRight className="a1 h-4 w-4" />
      <ArrowUpRight className="a2 h-4 w-4" />
    </span>
  )
}

const statement = "We design, plant and care for gardens across Accra, from a balcony of pots to a whole compound. You enjoy it. We keep it growing."

export default function Home() {
  return (
    <div id="top">
      <Motion />
      <Header />
      <main id="main">
        {/* HERO */}
        <section aria-labelledby="hero-title" className="wrap pb-10 pt-32 sm:pt-40">
          <h1 id="hero-title" className="display reveal-lines text-[clamp(3.2rem,9.4vw,9.25rem)] text-ink">
            <span className="line">
              <span style={{ "--d": "80ms" } as React.CSSProperties}>Gardening in</span>
            </span>
            <span className="line">
              <span style={{ "--d": "200ms" } as React.CSSProperties}>
                your home, <span className="serif-i text-green">made joyful.</span>
              </span>
            </span>
          </h1>
          <div className="mt-10 grid gap-8 md:grid-cols-[1.1fr_1fr] md:items-end">
            <p data-reveal style={{ "--d": "350ms" } as React.CSSProperties} className="max-w-md text-lg leading-relaxed text-ink-soft">
              Garden design and monthly garden care for homes, balconies, businesses and estates in Accra. One team, from the first sketch to the weekly trim.
            </p>
            <div data-reveal style={{ "--d": "450ms" } as React.CSSProperties} className="flex flex-wrap gap-3 md:justify-end">
              <a href="#visit" className="btn-dark">
                Book a free garden visit <Arrow />
              </a>
              <a href="#services" className="btn-ghost">Our services</a>
            </div>
          </div>
        </section>
        <div className="px-3 sm:px-5">
          <div className="hero-frame relative mx-auto max-w-[1400px] overflow-hidden">
            <img src="/img/hero.webp" alt="A sunlit home garden patio with potted monstera, bird of paradise and ferns against a cream wall, bougainvillea and a wooden bench" className="aspect-[4/5] w-full object-cover sm:aspect-[16/8]" fetchPriority="high" />
            <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 sm:bottom-6 sm:left-6 sm:right-auto">
              <div className="flex items-center gap-3 rounded-2xl border border-white/50 bg-white/65 p-3 pr-5 backdrop-blur-xl">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-white"><Mark className="h-7 w-7" /></span>
                <div>
                  <p className="text-[15px] font-medium text-ink">Your first visit is free</p>
                  <p className="text-[13px] text-ink-soft">45 minutes, no obligation</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* MARQUEE */}
        <div aria-hidden="true" className="mt-20 overflow-hidden border-y border-line py-6">
          <div className="marquee flex w-max gap-12 whitespace-nowrap font-serif text-4xl italic text-ink/80 sm:text-5xl">
            {[0, 1].map((k) => (
              <span key={k} className="flex items-center gap-12">
                {["Landscaping", "Lawn care", "Planting", ...extras].map((w) => (
                  <span key={w} className="flex items-center gap-12">
                    {w}
                    <span className="h-2 w-2 rounded-full bg-green" />
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>

        {/* STATEMENT */}
        <section aria-label="What we do" className="wrap py-28 sm:py-40">
          <p className="kicker" data-reveal>Glee Garden, Accra</p>
          <p className="statement mt-8 max-w-5xl text-[clamp(1.9rem,4.4vw,3.9rem)] font-medium leading-[1.08] tracking-[-0.035em] text-ink">
            {statement.split(" ").map((w, i) => (
              <span key={i} className="word" style={{ opacity: 0.18 }}>
                {w}{" "}
              </span>
            ))}
          </p>
        </section>

        {/* WHO IT'S FOR */}
        <section aria-labelledby="who-title" className="wrap pb-28 sm:pb-36">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2 id="who-title" className="display reveal-lines max-w-3xl text-[clamp(2.4rem,5vw,4.25rem)]">
              <span className="line"><span>Who we garden for</span></span>
            </h2>
            <p data-reveal className="max-w-xs text-ink-mute">Four kinds of client, one way of working: visit first, fixed price, then steady care.</p>
          </div>
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {audiences.map((a, k) => (
              <li key={a.id} data-reveal style={{ "--d": `${k * 80}ms` } as React.CSSProperties} className="group rounded-[28px] border border-line bg-white p-7 transition-[transform,box-shadow] duration-500 ease-out hover:-translate-y-1 hover:shadow-[0_30px_60px_-40px_rgba(17,22,19,0.5)]">
                <p className="font-serif text-5xl italic text-green">0{k + 1}</p>
                <h3 className="mt-8 text-2xl font-medium leading-tight">{a.title}</h3>
                <p className="mt-3 leading-relaxed text-ink-mute">{a.body}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* SERVICES: cards stack as you scroll */}
        <section id="services" aria-labelledby="services-title" className="bg-paper py-24 sm:py-32">
          <div className="wrap">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <h2 id="services-title" className="display reveal-lines max-w-3xl text-[clamp(2.4rem,5.6vw,4.75rem)]">
                <span className="line"><span>Everything a garden needs,</span></span>
                <span className="line"><span style={{ "--d": "120ms" } as React.CSSProperties}><span className="serif-i text-green">nothing it doesn&apos;t.</span></span></span>
              </h2>
              <p data-reveal className="max-w-xs text-ink-mute">Three core services, and the care around them. Mix and match, or let us look after all of it.</p>
            </div>
            <ol className="mt-16">
              {services.map((s, i) => (
                <li key={s.n} className="stack-card pb-6" style={{ "--i": i } as React.CSSProperties}>
                  <article className="grid overflow-hidden rounded-[32px] border border-line bg-white shadow-[0_30px_80px_-50px_rgba(17,22,19,0.45)] md:grid-cols-2">
                    <div className="flex flex-col p-7 sm:p-12">
                      <p className="kicker">{s.n} / 03</p>
                      <h3 className="mt-6 text-3xl font-medium leading-[1.05] sm:text-[44px]">{s.title}</h3>
                      <p className="mt-5 max-w-md text-lg leading-relaxed text-ink-soft">{s.body}</p>
                      <ul className="mt-8 divide-y divide-line border-y border-line md:mt-auto">
                        {s.items.map((it) => (
                          <li key={it} className="flex items-center gap-3 py-3.5 text-[15px] text-ink-soft">
                            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-green" />
                            {it}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="relative min-h-[320px] overflow-hidden md:min-h-[560px]">
                      <img src={s.image} alt={s.alt} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
                    </div>
                  </article>
                </li>
              ))}
            </ol>
            <ul className="mt-14 grid gap-x-10 border-t border-line sm:grid-cols-2 lg:grid-cols-3">
              {extras.map((e, k) => {
                const Icon = extraIcons[k]
                return (
                  <li key={e} data-reveal style={{ "--d": `${k * 60}ms` } as React.CSSProperties} className="group flex items-center gap-4 border-b border-line py-5 text-lg tracking-tight">
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-sage text-green transition-colors duration-500 group-hover:bg-green group-hover:text-white">
                      <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
                    </span>
                    {e}
                  </li>
                )
              })}
            </ul>
          </div>
        </section>

        {/* BUILD YOUR PLAN */}
        <section id="build" aria-labelledby="build-title" className="wrap py-28 sm:py-36">
          <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
            <h2 id="build-title" className="display reveal-lines text-[clamp(2.4rem,5vw,4.25rem)]">
              <span className="line"><span>Build your garden,</span></span>
              <span className="line"><span style={{ "--d": "120ms" } as React.CSSProperties}><span className="serif-i text-green">see your plan.</span></span></span>
            </h2>
            <p data-reveal className="max-w-xs text-ink-mute">Tell us about your space and watch it grow. You get the plan that fits and a rough monthly price.</p>
          </div>
          <div data-reveal>
            <PlanBuilder />
          </div>
        </section>

        {/* PLANS */}
        <section id="plans" aria-labelledby="plans-title" className="bg-paper py-28 sm:py-36">
          <div className="wrap">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <h2 id="plans-title" className="display reveal-lines max-w-3xl text-[clamp(2.4rem,5.6vw,4.75rem)]">
                <span className="line"><span>Care plans,</span></span>
                <span className="line"><span style={{ "--d": "120ms" } as React.CSSProperties}><span className="serif-i text-green">month to month.</span></span></span>
              </h2>
              <p data-reveal className="max-w-xs text-ink-mute">One monthly price for steady care. No contract: pause or stop with a message.</p>
            </div>
            <ul className="mt-14 grid gap-5 lg:grid-cols-3">
              {plans.map((p, k) => (
                <li key={p.id} data-reveal style={{ "--d": `${k * 100}ms` } as React.CSSProperties} className={`relative flex flex-col rounded-[32px] p-8 sm:p-10 ${p.featured ? "bg-green-deep text-white shadow-[0_40px_80px_-40px_rgba(20,51,38,0.7)]" : "border border-line bg-white"}`}>
                  {p.featured && <span className="absolute right-6 top-6 rounded-full bg-white/15 px-3 py-1 text-[12px] uppercase tracking-[0.14em]">Most homes</span>}
                  <p className={`kicker ${p.featured ? "!text-white/60" : ""}`}>{p.visits}</p>
                  <h3 className="mt-5 font-serif text-5xl italic">{p.name}</h3>
                  <p className={`mt-2 ${p.featured ? "text-white/75" : "text-ink-mute"}`}>{p.for}</p>
                  <p className="mt-8 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                    <span className="whitespace-nowrap text-[44px] font-medium leading-none tracking-tight tabular-nums">GH₵ {p.price.toLocaleString()}</span>
                    <span className={p.featured ? "text-white/60" : "text-ink-mute"}>{p.per}</span>
                  </p>
                  <ul className={`mt-8 space-y-3 border-t pt-6 ${p.featured ? "border-white/15" : "border-line"}`}>
                    {p.includes.map((it) => (
                      <li key={it} className="flex gap-3 text-[15px] leading-snug">
                        <Check className={`mt-0.5 h-4 w-4 shrink-0 ${p.featured ? "text-white" : "text-green"}`} aria-hidden="true" />
                        {it}
                      </li>
                    ))}
                  </ul>
                  <a href="#visit" className={`btn mt-10 ${p.featured ? "bg-white text-ink hover:bg-sage" : "btn-dark"}`}>Start with a free visit</a>
                </li>
              ))}
            </ul>
            <div className="mt-16 grid gap-10 lg:grid-cols-[1fr_2fr]">
              <div>
                <p className="kicker" data-reveal>One-off projects</p>
                <p data-reveal className="mt-4 max-w-sm text-lg leading-relaxed text-ink-soft">Fixed quotes after the free visit. Typical ranges, so you know roughly where you stand:</p>
              </div>
              <ul className="divide-y divide-line border-y border-line">
                {projects.map((pr) => (
                  <li key={pr.name} data-reveal className="grid grid-cols-[1fr_auto] items-baseline gap-4 py-5 sm:grid-cols-[1fr_1fr_auto]">
                    <span className="text-xl font-medium tracking-tight">{pr.name}</span>
                    <span className="hidden text-ink-mute sm:block">{pr.note}</span>
                    <span className="font-serif text-2xl italic text-green tabular-nums">{pr.range}</span>
                  </li>
                ))}
              </ul>
            </div>
            <p className="mt-8 text-sm text-ink-mute">Concept prices for a business plan, in Ghana cedis. Not a quote.</p>
          </div>
        </section>

        {/* PARALLAX BAND */}
        <section aria-label="A garden we love" className="relative h-[80vh] min-h-[520px] overflow-hidden">
          <img data-parallax src="/img/landscape.webp" alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover will-change-transform" style={{ transform: "scale(1.15)" }} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
          <div className="wrap relative flex h-full items-end pb-14">
            <p data-reveal className="max-w-3xl font-serif text-[clamp(2.2rem,5vw,4.5rem)] italic leading-[1.02] text-white">
              &ldquo;A garden should feel like the best room in the house.&rdquo;
            </p>
          </div>
        </section>

        {/* PROCESS */}
        <section id="process" aria-labelledby="process-title" className="wrap py-28 sm:py-36">
          <div className="grid gap-12 lg:grid-cols-[1fr_2fr]">
            <div>
              <p className="kicker" data-reveal>How it works</p>
              <h2 id="process-title" className="display reveal-lines mt-5 text-[clamp(2.4rem,5vw,4.25rem)]">
                <span className="line"><span>Three steps,</span></span>
                <span className="line"><span style={{ "--d": "120ms" } as React.CSSProperties}><span className="serif-i text-green">no surprises.</span></span></span>
              </h2>
            </div>
            <ol className="grid gap-10 sm:grid-cols-3">
              {steps.map((s, k) => (
                <li key={s.n} data-reveal style={{ "--d": `${k * 120}ms` } as React.CSSProperties} className="border-t border-ink pt-6">
                  <p className="font-serif text-6xl italic text-green">{s.n}</p>
                  <h3 className="mt-6 text-2xl font-medium">{s.title}</h3>
                  <p className="mt-3 leading-relaxed text-ink-mute">{s.body}</p>
                </li>
              ))}
            </ol>
          </div>

          <ul className="mt-20 grid gap-x-10 gap-y-2 border-t border-line pt-10 sm:grid-cols-2 lg:grid-cols-4">
            {promises.map((p, k) => (
              <li key={p.title} data-reveal style={{ "--d": `${k * 80}ms` } as React.CSSProperties} className="py-4">
                <h3 className="text-lg font-medium">{p.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-mute">{p.body}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* ABOUT */}
        <section id="about" aria-labelledby="about-title" className="wrap grid items-center gap-12 pb-28 sm:pb-36 lg:grid-cols-[1fr_1.05fr] lg:gap-20">
          <div data-mask className="overflow-hidden rounded-[28px]">
            <img src="/img/gardener.webp" alt="A smiling gardener in a sage linen shirt and canvas apron repotting a monstera into a terracotta pot" loading="lazy" className="aspect-[4/5] w-full object-cover" />
          </div>
          <div>
            <p className="kicker" data-reveal>Meet your gardener</p>
            <h2 id="about-title" className="display reveal-lines mt-5 text-[clamp(2.4rem,5vw,4.25rem)]">
              <span className="line"><span>Gordin Grey,</span></span>
              <span className="line"><span style={{ "--d": "120ms" } as React.CSSProperties}><span className="serif-i text-green">senior gardener</span></span></span>
            </h2>
            <p data-reveal className="mt-8 max-w-lg text-lg leading-relaxed text-ink-soft">
              A beautiful garden is more than plants and flowers. It&apos;s where families gather, memories are made and nature does its quiet work. Whether you want expert landscaping, routine care or a complete transformation, we bring the idea to life and keep it thriving.
            </p>
            <dl className="mt-12 grid gap-x-10 sm:grid-cols-2">
              {values.map((v, k) => (
                <div key={v.title} data-reveal style={{ "--d": `${k * 80}ms` } as React.CSSProperties} className="border-t border-line py-5">
                  <dt className="font-medium">{v.title}</dt>
                  <dd className="mt-1 text-[15px] text-ink-mute">{v.body}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* GUIDE */}
        <section id="guide" aria-labelledby="guide-title" className="bg-paper py-28 sm:py-36">
          <div className="wrap">
            <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
              <h2 id="guide-title" className="display reveal-lines text-[clamp(2.4rem,5vw,4.25rem)]">
                <span className="line"><span>What should I plant</span></span>
                <span className="line"><span style={{ "--d": "120ms" } as React.CSSProperties}><span className="serif-i text-green">this month?</span></span></span>
              </h2>
              <p data-reveal className="max-w-xs text-ink-mute">Pick a month for what to sow, and one thing to do for the garden you already have.</p>
            </div>
            <div data-reveal>
              <Planner />
            </div>
          </div>
        </section>

        {/* VISIT */}
        <section id="visit" aria-labelledby="visit-title" className="px-3 py-3 sm:px-5 sm:py-5">
          <div className="mx-auto grid max-w-[1400px] gap-14 rounded-[36px] bg-green-deep px-6 py-20 text-white sm:px-14 sm:py-28 lg:grid-cols-[1fr_1.2fr]">
            <div>
              <p className="kicker !text-white/60">Get started</p>
              <h2 id="visit-title" className="display reveal-lines mt-5 text-[clamp(2.6rem,5.4vw,4.75rem)]">
                <span className="line"><span>Book a free</span></span>
                <span className="line"><span style={{ "--d": "120ms" } as React.CSSProperties}><span className="serif-i">garden visit.</span></span></span>
              </h2>
              <p data-reveal className="mt-8 max-w-sm text-lg leading-relaxed text-white/75">Tell us a little about your space. A gardener calls you back within a day to find a time that suits you.</p>
            </div>
            <div data-reveal>
              <VisitForm />
            </div>
          </div>
        </section>
      </main>

      <footer className="wrap pb-10 pt-20">
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-5 max-w-xs text-ink-mute">Bringing nature closer to you, one garden at a time.</p>
          </div>
          {[
            ["Services", ["Landscaping", "Lawn care", "Garden design", "Planting", "Installations"]],
            ["Care", ["Irrigation", "Tree & shrub care", "Organic gardening", "Seasonal clean-ups", "Mulching"]],
            ["Explore", ["Build your plan", "Care plans", "Process", "Planting guide", "Book a visit"]],
          ].map(([h, items]) => (
            <div key={h as string}>
              <h2 className="kicker">{h as string}</h2>
              <ul className="mt-4 space-y-2.5 text-[15px] text-ink-soft">
                {(items as string[]).map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p aria-hidden="true" className="mt-20 select-none font-serif text-[clamp(4.5rem,17vw,15rem)] italic leading-[0.85] tracking-[-0.03em] text-ink">
          Glee Garden
        </p>
        <p className="mt-8 max-w-[34em] border-t border-line pt-6 text-sm leading-relaxed text-ink-mute">
          © 2026 Glee Garden. A concept brand, logo and website designed by Benedict Frimpong Boateng. Photos are AI-generated, the gardener is fictional, and prices are indicative concept prices.
        </p>
      </footer>
    </div>
  )
}
