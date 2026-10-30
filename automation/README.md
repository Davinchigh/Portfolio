# Lizab automation

One brain, many doors. Every channel talks to the same back office (Supabase project `lizab-house-of-fashion`, ref `qmsvrvfrdkilyypfappz`).

| Piece | Where | Status |
|---|---|---|
| Stock, orders, pre-orders, bookings, chat and call logs, staff tasks | Supabase tables, RLS on | Live |
| Toolbox for agents (`agent-api`) | Supabase edge function, token in `x-agent-token` | Live |
| Esi on the website | n8n workflow "Lizab sales assistant (website chat)", Claude via n8n credits | Needs the token credential, then publish |
| Live stock on product pages | `lib/live.ts`, public read-only RPC | Live |
| Studio (back office) | `/studio`, staff emails in the `staff` table | Needs the Site URL set in Supabase Auth |
| Phone agent | Vapi (or Retell / ElevenLabs) using the same toolbox | Needs an account and a number |
| WhatsApp agent | WhatsApp Business Cloud API into n8n | Needs Meta Business verification |
| Payments | Paystack (MoMo and cards) payment links | Needs a Paystack account |

## Phone agent (Vapi)
1. Create an assistant. System prompt: `sales-agent-prompt.md`, plus "This conversation is a phone call: the channel is phone."
2. First message: "Hello, you've reached Lizab House of Fashion. I'm Esi, the AI assistant. How can I help?"
3. Tools: add each function from `GET https://qmsvrvfrdkilyypfappz.supabase.co/functions/v1/agent-api` as a custom tool with
   server URL `https://qmsvrvfrdkilyypfappz.supabase.co/functions/v1/agent-api` and header `x-agent-token: <token>`.
   The function understands Vapi's tool-call format and fills in `p_channel: phone` itself.
4. Transfer: add a transfer-call tool to her real number for "speak to a person".
5. Buy or import a number and attach the assistant.

## Tokens
Tokens live hashed in the `agent_tokens` table. To revoke one: `update agent_tokens set active = false where label = '...'`.
