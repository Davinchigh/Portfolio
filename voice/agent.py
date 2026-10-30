"""
Esi on the phone and in the browser.

A LiveKit voice agent: Gemini Live (speech in, speech out, one model, low latency) with Lizab's
shop tools. Every tool calls the same agent-api the website chat uses, so stock, orders and
bookings are one system. Free to run on LiveKit Cloud's Build plan with a free Gemini API key.

Env (see .env.example): LIVEKIT_URL, LIVEKIT_API_KEY, LIVEKIT_API_SECRET, GOOGLE_API_KEY, LIZAB_AGENT_TOKEN
"""

import json
import logging
import os
import time
from pathlib import Path
from typing import Literal

import aiohttp
from dotenv import load_dotenv
from livekit import agents
from livekit.agents import Agent, AgentServer, AgentSession, JobContext, RunContext, function_tool
from livekit.plugins import google

load_dotenv(Path(__file__).with_name(".env"))
log = logging.getLogger("esi")

API = "https://qmsvrvfrdkilyypfappz.supabase.co/functions/v1/agent-api"
TOKEN = os.environ.get("LIZAB_AGENT_TOKEN", "")
VOICE = os.environ.get("ESI_VOICE", "Sulafat")  # warm, unhurried female voice; try Achernar, Vindemiatrix or Aoede
MODEL = os.environ.get("ESI_MODEL", "gemini-2.5-flash-native-audio-preview-12-2025")

PROMPT = Path(__file__).with_name("prompt.md").read_text() + """

This conversation is a voice call, so the channel is phone. You are speaking, not writing:
- Open with: "Hello, you've reached Lizab House of Fashion. I'm Esi, the shop's AI assistant. How can I help you today?"
- One question at a time. Keep each reply to one to three short sentences.
- Say prices as "nine hundred and fifty cedis". Never read out codes like LZ-W-001 unless asked; use the piece's name.
- Read phone numbers back in groups of digits and ask the caller to confirm.
- If the line is noisy or you did not catch something, ask them to repeat it.
- If the caller asks for a person, or the matter is a complaint, custom design, bridal or bulk order, use request_callback and tell them when to expect the call.
- Before saying goodbye, call log_interaction with a short summary.
"""


async def call(tool: str, **args) -> str:
    """Call one Lizab tool and hand the JSON back to the model as text."""
    clean = {k: v for k, v in args.items() if v not in (None, "")}
    try:
        async with aiohttp.ClientSession(timeout=aiohttp.ClientTimeout(total=15)) as http:
            async with http.post(f"{API}?tool={tool}&channel=phone", json=clean, headers={"x-agent-token": TOKEN}) as r:
                return json.dumps(await r.json())
    except Exception as e:  # never leave the caller in silence
        log.warning("tool %s failed: %s", tool, e)
        return json.dumps({"error": "The shop system did not answer. Offer to take a message with request_callback."})


Kind = Literal["fitting", "measurement", "collection", "consultation"]


class Esi(Agent):
    def __init__(self) -> None:
        super().__init__(instructions=PROMPT)

    @function_tool()
    async def shop_info(self, context: RunContext) -> str:
        """Opening hours and the current date and time in Accra. Call before talking about days or times."""
        return await call("shop_info")

    @function_tool()
    async def catalogue(self, context: RunContext, query: str = "", collection: str = "") -> str:
        """List Lizab pieces with prices, availability, lead times, colours, sizes and stock.

        Args:
            query: optional search words, e.g. "suit" or "dress"
            collection: optional: women, men, bags-shoes or new-in
        """
        return await call("catalogue", p_query=query, p_collection=collection)

    @function_tool()
    async def check_stock(self, context: RunContext, code: str, colour: str = "", size: str = "") -> str:
        """Check one piece by its code (from the catalogue), optionally a colour and size.

        Args:
            code: item code such as LZ-B-001
            colour: optional colour
            size: optional size exactly as listed, e.g. "UK 12" or "EU 39"
        """
        return await call("check_stock", p_code=code, p_colour=colour, p_size=size)

    @function_tool()
    async def place_order(
        self,
        context: RunContext,
        name: str,
        phone: str,
        items: list[dict],
        delivery: Literal["pickup", "delivery_accra", "delivery_ghana", "delivery_international", "tbc"] = "tbc",
        address: str = "",
        notes: str = "",
    ) -> str:
        """Place an order or pre-order, only after reading it back and hearing a clear yes. Nothing is charged.

        Args:
            name: customer's full name
            phone: customer's phone or WhatsApp number
            items: list of {"code": ..., "colour": ..., "size": ..., "qty": 1}
            delivery: pickup or where to deliver
            address: delivery area or address, if delivering
            notes: measurements, occasion or deadline
        """
        return await call("place_order", p_name=name, p_phone=phone, p_items=items, p_delivery=delivery, p_address=address, p_notes=notes)

    @function_tool()
    async def order_status(self, context: RunContext, ref: str, phone: str) -> str:
        """Look up an order by its reference and the phone number on it.

        Args:
            ref: order reference such as LZ26-0007
            phone: the phone number on the order
        """
        return await call("order_status", p_ref=ref, p_phone=phone)

    @function_tool()
    async def available_slots(self, context: RunContext, date: str, kind: Kind = "fitting") -> str:
        """Free appointment times on a date in Accra.

        Args:
            date: YYYY-MM-DD
            kind: fitting, measurement, collection or consultation
        """
        return await call("available_slots", p_date=date, p_kind=kind)

    @function_tool()
    async def book_appointment(self, context: RunContext, name: str, phone: str, kind: Kind, date: str, time: str, notes: str = "") -> str:
        """Book an appointment at a free time the caller chose.

        Args:
            name: customer's full name
            phone: customer's phone or WhatsApp number
            kind: fitting, measurement, collection or consultation
            date: YYYY-MM-DD
            time: HH:MM exactly as returned by available_slots
            notes: what it is for
        """
        return await call("book_appointment", p_name=name, p_phone=phone, p_kind=kind, p_date=date, p_time=time, p_notes=notes)

    @function_tool()
    async def request_callback(
        self, context: RunContext, name: str, phone: str, reason: str, kind: Literal["callback", "custom_request", "complaint"] = "callback"
    ) -> str:
        """Hand over to a person at Lizab.

        Args:
            name: caller's name
            phone: caller's phone or WhatsApp number
            reason: what they need, in one or two sentences
            kind: callback, custom_request or complaint
        """
        return await call("request_callback", p_name=name, p_phone=phone, p_reason=reason, p_kind=kind)

    @function_tool()
    async def log_interaction(
        self,
        context: RunContext,
        summary: str,
        outcome: Literal["sale", "preorder", "booking", "question", "callback", "complaint", "other"] = "question",
        name: str = "",
        phone: str = "",
        order_ref: str = "",
        booking_ref: str = "",
    ) -> str:
        """Log a short summary of the call for the Lizab team. Call once, near the end.

        Args:
            summary: what the caller wanted and what happened
            outcome: the result of the call
            name: caller's name, if given
            phone: caller's phone, if given
            order_ref: order reference, if any
            booking_ref: booking reference, if any
        """
        return await call(
            "log_interaction", p_summary=summary, p_outcome=outcome, p_name=name, p_phone=phone, p_order_ref=order_ref, p_booking_ref=booking_ref
        )


server = AgentServer()


@server.rtc_session(agent_name="esi")
async def entrypoint(ctx: JobContext) -> None:
    started = time.time()
    session = AgentSession(
        llm=google.realtime.RealtimeModel(model=MODEL, voice=VOICE, temperature=0.6),
    )
    await session.start(room=ctx.room, agent=Esi())
    await session.generate_reply(instructions="Greet the caller with your opening line.")
    log.info("call started in %.1fs", time.time() - started)


if __name__ == "__main__":
    agents.cli.run_app(server)
