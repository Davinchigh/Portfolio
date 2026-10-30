"use client"

import { useEffect, useRef, useState } from "react"
import { Mic, MicOff, Phone, PhoneOff } from "lucide-react"
import type { Room } from "livekit-client"
import { LIVE } from "@/lib/live"

type State = "idle" | "connecting" | "live" | "unavailable" | "error"

/** Talk to Esi out loud, in the browser. Free for the customer, no phone number needed. */
export function VoiceCall() {
  const [state, setState] = useState<State>("idle")
  const [muted, setMuted] = useState(false)
  const [speaking, setSpeaking] = useState(false)
  const room = useRef<Room | null>(null)
  const audio = useRef<HTMLDivElement>(null)

  const end = async () => {
    await room.current?.disconnect()
    room.current = null
    audio.current?.replaceChildren()
    setState("idle")
    setSpeaking(false)
  }
  useEffect(() => () => void room.current?.disconnect(), [])

  const start = async () => {
    setState("connecting")
    try {
      const r = await fetch(`${LIVE.url}/functions/v1/voice-token`, { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" })
      if (r.status === 503) return setState("unavailable")
      if (!r.ok) throw new Error(String(r.status))
      const { url, token } = await r.json()
      const { Room, RoomEvent, Track } = await import("livekit-client")
      const rm = new Room({ adaptiveStream: true, dynacast: true })
      room.current = rm
      rm.on(RoomEvent.TrackSubscribed, (track) => {
        if (track.kind === Track.Kind.Audio) audio.current?.appendChild(track.attach())
      })
      rm.on(RoomEvent.ActiveSpeakersChanged, (s) => setSpeaking(s.some((p) => p.identity !== rm.localParticipant.identity)))
      rm.on(RoomEvent.Disconnected, () => setState((st) => (st === "live" ? "idle" : st)))
      await rm.connect(url, token)
      await rm.localParticipant.setMicrophoneEnabled(true)
      setState("live")
    } catch {
      await room.current?.disconnect()
      room.current = null
      setState("error")
    }
  }

  return (
    <div className="border-b border-gold/15 px-5 py-3">
      <div ref={audio} hidden />
      {state === "live" ? (
        <div className="flex items-center gap-3">
          <span aria-hidden="true" className={`relative grid h-9 w-9 place-items-center rounded-full bg-gold/20 ${speaking ? "after:absolute after:inset-0 after:animate-ping after:rounded-full after:bg-gold/30" : ""}`}>
            <span className="h-2.5 w-2.5 rounded-full bg-gold" />
          </span>
          <p role="status" className="flex-1 text-sm text-champagne">{speaking ? "Esi is speaking" : "Listening"}</p>
          <button type="button" onClick={async () => { await room.current?.localParticipant.setMicrophoneEnabled(muted); setMuted(!muted) }} className="grid h-10 w-10 place-items-center rounded-full border border-champagne/25 text-champagne">
            {muted ? <MicOff className="h-4 w-4" aria-hidden="true" /> : <Mic className="h-4 w-4" aria-hidden="true" />}
            <span className="sr-only">{muted ? "Unmute" : "Mute"}</span>
          </button>
          <button type="button" onClick={end} className="flex h-10 items-center gap-2 rounded-full bg-[#C2453A] px-4 text-sm font-medium text-white">
            <PhoneOff className="h-4 w-4" aria-hidden="true" /> End
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <button type="button" onClick={start} disabled={state === "connecting"} className="flex h-10 shrink-0 items-center gap-2 whitespace-nowrap rounded-full border border-gold/50 px-4 text-sm font-medium text-champagne hover:border-gold disabled:opacity-60">
            <Phone className="h-4 w-4 text-gold" aria-hidden="true" />
            {state === "connecting" ? "Calling Esi…" : "Talk to Esi"}
          </button>
          <p role="status" className="text-xs text-ash">
            {state === "unavailable" ? "Voice calls are coming soon. Type below for now." : state === "error" ? "Couldn't start the call. Check your microphone and try again." : "Free, uses your microphone"}
          </p>
        </div>
      )}
    </div>
  )
}
