# Security review, 4 Nov 2026

Strix could not run in this environment (no LLM key for Strix, and its sandbox image could not be downloaded),
so this was a manual white-box review with live checks against Lizab's own backend.

Checked and fine
- Tables: RLS on everywhere; a signed-in non-staff user reads 0 rows and changes 0 rows.
- Public (anon) can call only read-only functions: catalogue, check_stock, available_slots, shop_info.
- agent-api rejects calls without a valid key (401); voice-token rejects other origins (403).
- No keys in the repo or its history; no known vulnerable dependencies (pnpm audit).
- Chat and studio text is rendered as text (no HTML injection).

Fixed
- agent-api accepted its key in the URL; now header only, so keys don't land in logs.
- agent-api passed raw database errors to callers; now only customer-facing messages pass through.
- Booking spam: a phone number can hold at most 3 upcoming appointments.
- Callback spam: at most 5 open requests per number per day.
- voice-token could be called in a loop to burn free voice minutes; now 5 per address per hour, 150 per day.
- Trigger and helper functions were executable by the public API role; revoked.
- Site headers: no framing, nosniff, HSTS, referrer policy, microphone allowed only for this site.

Left as is (needs the owner)
- pg_net sits in the public schema (moving it needs a confirmed drop and recreate).
- The n8n chat webhook is public by design; a flood of chats would use n8n AI credits.
- Order references are sequential; lookups also need the matching phone number.

# Independent audit, 5 Nov 2026 (Cloudflare security-audit skill, fresh agent)

Also run: Semgrep (575 rules, 56 files), detect-secrets over files and full git history, pnpm audit, pip-audit, retire.js.
Not runnable here: Strix (no LLM key, sandbox image blocked), Claude Security agent (needs workflows), ZAP and Gitleaks (downloads blocked).

Confirmed by the audit, now fixed
- Medium: anyone could hold all stock or fill the diary by giving fresh phone numbers to Esi.
  Fix: unconfirmed chat and phone orders and bookings are released after 48 hours; shop-wide daily caps
  (40 unconfirmed orders, 15 new bookings, 60 callbacks); at most 6 chat or phone bookings on any one day; 1 to 5 of each piece.
- Low: giving someone's phone number renamed that customer. Fix: the stored name is kept; the name given is saved on each order and booking.

Needs-validation items, now closed in code
- Staff access trusted the email in the sign-in claim. is_staff() now requires a confirmed account whose id matches.
- voice-token rate limit read the first X-Forwarded-For entry. It now prefers cf-connecting-ip, then x-real-ip, then the last entry.

Hardening
- Public and signed-in roles can no longer write, truncate or alter the staff list.
- agent-api checks the tool name with Object.hasOwn.
- Structured data in pages is escaped so product text can't close its script tag (Semgrep).

Still open
- The chat webhook is public; a per-visitor key (chat session id) is not yet passed through to the limits.
- Order references are sequential; lookups need the matching phone number.
