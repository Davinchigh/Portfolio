# Esi by voice

Esi's voice agent: LiveKit Agents (open source) running Gemini Live with Lizab's nine shop tools.
The same back office as the website chat, so a phone order shows up in the Studio instantly.

## Free stack
| Part | Service | Free allowance |
|---|---|---|
| Agent hosting + calls | LiveKit Cloud, Build plan | 1,000 agent minutes a month, 1 agent, no card |
| Voice + brain | Gemini Live (Google AI Studio key) | Free tier, rate limited |
| Phone number | LiveKit free US number | 1 number, 50 inbound minutes a month |
| WhatsApp calls | Meta (user-initiated calls are free) + LiveKit WhatsApp connector | Needs WhatsApp Business Platform |

## Run it
```
cd voice
python -m venv .venv && . .venv/bin/activate      # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env                              # fill in the five values
python agent.py console                           # talk to her in your terminal first
python agent.py dev                               # connect to LiveKit Cloud
lk agent create                                    # host her on LiveKit Cloud (always on)
```

## Website button
The "Talk to Esi" button in the chat panel asks the `voice-token` edge function for a ticket.
Set LIVEKIT_URL, LIVEKIT_API_KEY and LIVEKIT_API_SECRET in Supabase > Edge Functions > Secrets.
Until then the button says voice calls are coming soon.

## Voice
ESI_VOICE in .env. Default Sulafat (warm). Others to try: Achernar (soft), Vindemiatrix (gentle), Aoede (bright), Kore (firm).
