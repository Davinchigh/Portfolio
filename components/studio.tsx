"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { createClient, type Session } from "@supabase/supabase-js"
import { LIVE } from "@/lib/live"
import { ghs } from "@/lib/store"

/**
 * The Lizab studio: the back office in the browser. Sign in with an email on the staff list,
 * then see what needs doing, every order and booking, and change stock in one place.
 */
const sb = typeof window === "undefined" ? null : createClient(LIVE.url, LIVE.key, { auth: { persistSession: true, detectSessionInUrl: true } })

type Task = { id: number; kind: string; title: string; phone: string | null; details: Record<string, unknown> | null; created_at: string }
type Order = { id: number; ref: string; kind: string; status: string; channel: string; total_ghs: number; delivery: string; ready_by: string | null; notes: string | null; created_at: string; customers: { name: string; phone: string } | null; order_items: { product_code: string; colour: string; size: string; qty: number; from_stock: boolean }[] }
type Booking = { id: number; ref: string; kind: string; starts_at: string; status: string; notes: string | null; customers: { name: string; phone: string } | null }
type Variant = { id: number; product_code: string; colour: string; size: string; stock: number; reserved: number; made_to_order: boolean; products: { name: string } | null }

const STATUSES = ["new", "confirmed", "awaiting_payment", "paid", "in_production", "ready", "out_for_delivery", "delivered", "collected", "cancelled"]
const nice = (s: string) => s.replace(/_/g, " ")
const when = (iso: string) => new Date(iso).toLocaleString("en-GB", { timeZone: "Africa/Accra", weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })
const wa = (phone: string, text: string) => `https://wa.me/${phone}?text=${encodeURIComponent(text)}`

export function Studio() {
  const [session, setSession] = useState<Session | null>(null)
  const [ready, setReady] = useState(false)
  useEffect(() => {
    if (!sb) return
    sb.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setReady(true)
    })
    const { data } = sb.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => data.subscription.unsubscribe()
  }, [])
  if (!ready) return <div className="wrap min-h-[60vh] py-20 text-ash">Loading…</div>
  return session ? <Board email={session.user.email ?? ""} /> : <SignIn />
}

function SignIn() {
  const [email, setEmail] = useState("")
  const [sent, setSent] = useState(false)
  const [err, setErr] = useState("")
  return (
    <section className="wrap max-w-md py-24">
      <p className="eyebrow">LIZAB STUDIO</p>
      <h1 className="mt-3 text-5xl">Sign in</h1>
      <p className="mt-4 text-ash">For the Lizab team only. We email you a one-time sign-in link.</p>
      {sent ? (
        <p role="status" className="mt-8 rounded-2xl border border-gold/30 p-5 text-champagne">Check {email} for the link. It works once and expires in an hour.</p>
      ) : (
        <form
          className="mt-8 flex flex-col gap-3"
          onSubmit={async (e) => {
            e.preventDefault()
            setErr("")
            const { error } = await sb!.auth.signInWithOtp({ email: email.trim().toLowerCase(), options: { emailRedirectTo: `${location.origin}/studio/` } })
            if (error) setErr(error.message)
            else setSent(true)
          }}
        >
          <label htmlFor="studio-email" className="text-xs font-medium tracking-caps text-ash">EMAIL</label>
          <input id="studio-email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className="min-h-12 rounded-full border border-champagne/25 bg-espresso px-5 text-champagne focus:border-gold focus:outline-none" />
          <button className="btn-gold mt-2">Email me a link</button>
          {err && <p role="alert" className="text-sm text-[#E8998D]">{err}</p>}
        </form>
      )}
    </section>
  )
}

function Board({ email }: { email: string }) {
  const [tab, setTab] = useState<"today" | "orders" | "bookings" | "stock" | "chats">("today")
  const [staff, setStaff] = useState<boolean | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [variants, setVariants] = useState<Variant[]>([])
  const [chats, setChats] = useState<{ id: number; channel: string; name: string | null; phone: string | null; summary: string; outcome: string | null; created_at: string }[]>([])

  const load = useCallback(async () => {
    const me = await sb!.from("staff").select("email").maybeSingle()
    setStaff(!!me.data)
    if (!me.data) return
    const [t, o, b, v, c] = await Promise.all([
      sb!.from("staff_tasks").select("*").eq("done", false).order("created_at", { ascending: false }).limit(100),
      sb!.from("orders").select("*, customers(name, phone), order_items(product_code, colour, size, qty, from_stock)").order("created_at", { ascending: false }).limit(200),
      sb!.from("bookings").select("*, customers(name, phone)").gte("starts_at", new Date(Date.now() - 864e5).toISOString()).order("starts_at").limit(200),
      sb!.from("variants").select("*, products(name)").order("product_code").order("id"),
      sb!.from("interactions").select("id, channel, name, phone, summary, outcome, created_at").order("created_at", { ascending: false }).limit(100),
    ])
    setTasks((t.data as Task[]) ?? [])
    setOrders((o.data as Order[]) ?? [])
    setBookings((b.data as Booking[]) ?? [])
    setVariants((v.data as Variant[]) ?? [])
    setChats(c.data ?? [])
  }, [])

  useEffect(() => {
    load()
    // live: new orders, bookings and tasks appear without refreshing
    const ch = sb!.channel("studio").on("postgres_changes", { event: "*", schema: "public" }, () => load()).subscribe()
    const t = setInterval(load, 60_000)
    return () => {
      sb!.removeChannel(ch)
      clearInterval(t)
    }
  }, [load])

  const counts = useMemo(() => ({
    today: tasks.length,
    orders: orders.filter((o) => !["delivered", "collected", "cancelled"].includes(o.status)).length,
    bookings: bookings.filter((b) => b.status === "confirmed").length,
    stock: variants.filter((v) => !v.made_to_order && v.stock - v.reserved <= 1).length,
    chats: chats.length,
  }), [tasks, orders, bookings, variants, chats])

  if (staff === false)
    return (
      <section className="wrap max-w-lg py-24">
        <h1 className="text-4xl">Not on the staff list</h1>
        <p className="mt-4 text-ash">{email} is signed in but is not a Lizab team member. Ask the owner to add you.</p>
        <button className="btn-ghost mt-8" onClick={() => sb!.auth.signOut()}>Sign out</button>
      </section>
    )

  return (
    <section className="wrap py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">LIZAB STUDIO</p>
          <h1 className="mt-2 text-5xl">Good {new Date().getHours() < 12 ? "morning" : new Date().getHours() < 17 ? "afternoon" : "evening"}.</h1>
        </div>
        <button className="text-sm text-ash underline underline-offset-4 hover:text-gold" onClick={() => sb!.auth.signOut()}>Sign out {email}</button>
      </div>

      <div role="tablist" className="mt-10 flex flex-wrap gap-2 border-b border-gold/15 pb-4">
        {(["today", "orders", "bookings", "stock", "chats"] as const).map((k) => (
          <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)} className={`min-h-11 rounded-full px-5 text-sm capitalize ${tab === k ? "bg-gold text-onyx" : "border border-champagne/20 text-champagne hover:border-gold"}`}>
            {k} <span className="ml-1 opacity-70">{counts[k]}</span>
          </button>
        ))}
      </div>

      {tab === "today" && (
        <ul className="mt-6 divide-y divide-gold/10">
          {tasks.length === 0 && <li className="py-8 text-ash">Nothing waiting. New orders, bookings, callbacks and low stock will show here.</li>}
          {tasks.map((t) => (
            <li key={t.id} className="flex flex-wrap items-center gap-4 py-4">
              <span className="rounded-full border border-gold/30 px-3 py-1 text-xs capitalize text-gold">{nice(t.kind)}</span>
              <div className="min-w-0 flex-1">
                <p className="text-champagne">{t.title}</p>
                <p className="text-sm text-ash">{when(t.created_at)}{t.details && "reason" in t.details ? ` · ${String(t.details.reason)}` : ""}</p>
              </div>
              {t.phone && <a className="text-sm text-gold underline underline-offset-4" href={wa(t.phone, "Hello, this is Lizab House of Fashion.")} target="_blank" rel="noopener noreferrer">WhatsApp</a>}
              {t.phone && <a className="text-sm text-gold underline underline-offset-4" href={`tel:+${t.phone}`}>Call</a>}
              <button className="btn-ghost min-h-10 px-4" onClick={async () => { await sb!.from("staff_tasks").update({ done: true }).eq("id", t.id); load() }}>Done</button>
            </li>
          ))}
        </ul>
      )}

      {tab === "orders" && (
        <ul className="mt-6 space-y-4">
          {orders.length === 0 && <li className="py-8 text-ash">No orders yet. Esi and the website put them here.</li>}
          {orders.map((o) => (
            <li key={o.id} className="rounded-2xl border border-gold/15 p-5">
              <div className="flex flex-wrap items-center gap-3">
                <p className="font-display text-xl text-champagne">{o.ref}</p>
                <span className="text-xs uppercase tracking-caps text-gold">{o.kind}</span>
                <span className="text-sm text-ash">{when(o.created_at)} · {nice(o.channel)}</span>
                <span className="ml-auto text-gold">{ghs(o.total_ghs)}</span>
              </div>
              <p className="mt-2 text-sm text-champagne/85">{o.customers?.name} · +{o.customers?.phone} · {nice(o.delivery)}{o.ready_by ? ` · ready by ${o.ready_by}` : ""}</p>
              <ul className="mt-2 text-sm text-ash">
                {o.order_items.map((i, n) => <li key={n}>{i.qty} × {i.product_code} {i.colour}, {i.size}{i.from_stock ? "" : " (to make)"}</li>)}
              </ul>
              {o.notes && <p className="mt-2 text-sm italic text-ash">“{o.notes}”</p>}
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <label className="text-xs tracking-caps text-ash" htmlFor={`st-${o.id}`}>STATUS</label>
                <select id={`st-${o.id}`} value={o.status} onChange={async (e) => { await sb!.from("orders").update({ status: e.target.value }).eq("id", o.id); load() }} className="min-h-10 rounded-full border border-champagne/25 bg-espresso px-4 text-sm capitalize text-champagne">
                  {STATUSES.map((s) => <option key={s} value={s}>{nice(s)}</option>)}
                </select>
                {o.customers && <a className="text-sm text-gold underline underline-offset-4" target="_blank" rel="noopener noreferrer" href={wa(o.customers.phone, `Hello ${o.customers.name.split(" ")[0]}, this is Lizab House of Fashion about your order ${o.ref}.`)}>Confirm on WhatsApp</a>}
              </div>
            </li>
          ))}
        </ul>
      )}

      {tab === "bookings" && (
        <ul className="mt-6 divide-y divide-gold/10">
          {bookings.length === 0 && <li className="py-8 text-ash">No upcoming appointments.</li>}
          {bookings.map((b) => (
            <li key={b.id} className="flex flex-wrap items-center gap-4 py-4">
              <p className="w-40 font-display text-lg text-champagne">{when(b.starts_at)}</p>
              <div className="min-w-0 flex-1">
                <p className="capitalize text-champagne">{b.kind} · {b.customers?.name}</p>
                <p className="text-sm text-ash">{b.ref}{b.notes ? ` · ${b.notes}` : ""}</p>
              </div>
              <select aria-label={`Status of ${b.ref}`} value={b.status} onChange={async (e) => { await sb!.from("bookings").update({ status: e.target.value }).eq("id", b.id); load() }} className="min-h-10 rounded-full border border-champagne/25 bg-espresso px-4 text-sm capitalize text-champagne">
                {["requested", "confirmed", "done", "no_show", "cancelled"].map((s) => <option key={s} value={s}>{nice(s)}</option>)}
              </select>
              {b.customers && <a className="text-sm text-gold underline underline-offset-4" target="_blank" rel="noopener noreferrer" href={wa(b.customers.phone, `Hello ${b.customers.name.split(" ")[0]}, this is Lizab House of Fashion about your ${b.kind} (${b.ref}).`)}>WhatsApp</a>}
            </li>
          ))}
        </ul>
      )}

      {tab === "stock" && (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="text-xs tracking-caps text-ash">
              <tr><th className="py-3 font-medium">PIECE</th><th className="font-medium">COLOUR</th><th className="font-medium">SIZE</th><th className="font-medium">IN STOCK</th><th className="font-medium">HELD FOR ORDERS</th><th className="font-medium">CAN MAKE</th></tr>
            </thead>
            <tbody className="divide-y divide-gold/10">
              {variants.map((v) => (
                <tr key={v.id} className={!v.made_to_order && v.stock - v.reserved <= 1 ? "bg-gold/5" : ""}>
                  <td className="py-3 pr-4 text-champagne">{v.products?.name}<span className="block text-xs text-ash">{v.product_code}</span></td>
                  <td className="pr-4">{v.colour}</td>
                  <td className="pr-4">{v.size}</td>
                  <td className="pr-4">
                    <div className="flex items-center gap-2">
                      <button aria-label={`One less ${v.product_code} ${v.size}`} className="grid h-9 w-9 place-items-center rounded-full border border-champagne/25" onClick={async () => { await sb!.from("variants").update({ stock: Math.max(v.stock - 1, 0) }).eq("id", v.id); load() }}>−</button>
                      <span className="w-8 text-center text-base text-champagne">{v.stock}</span>
                      <button aria-label={`One more ${v.product_code} ${v.size}`} className="grid h-9 w-9 place-items-center rounded-full border border-champagne/25" onClick={async () => { await sb!.from("variants").update({ stock: v.stock + 1 }).eq("id", v.id); load() }}>+</button>
                    </div>
                  </td>
                  <td className="pr-4 text-ash">{v.reserved}</td>
                  <td>
                    <input type="checkbox" aria-label={`Can make ${v.product_code} ${v.size} to order`} checked={v.made_to_order} onChange={async (e) => { await sb!.from("variants").update({ made_to_order: e.target.checked }).eq("id", v.id); load() }} className="h-5 w-5 accent-[#C9A45C]" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "chats" && (
        <ul className="mt-6 divide-y divide-gold/10">
          {chats.length === 0 && <li className="py-8 text-ash">Esi writes a summary of every conversation here.</li>}
          {chats.map((c) => (
            <li key={c.id} className="py-4">
              <p className="text-sm text-ash">{when(c.created_at)} · {nice(c.channel)}{c.outcome ? ` · ${c.outcome}` : ""}{c.name ? ` · ${c.name}` : ""}</p>
              <p className="mt-1 text-champagne">{c.summary}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
