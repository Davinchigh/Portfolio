/**
 * Live data from the Lizab back office (Supabase). Only read-only, public functions are reachable with this key;
 * orders and bookings go through Esi, the sales assistant, never straight from the browser.
 */
export const LIVE = {
  url: "https://qmsvrvfrdkilyypfappz.supabase.co",
  key: "sb_publishable_dDoi9oapnCe3OocjxV16gA_WsjdXMTN",
  /** Esi's chat endpoint (n8n chat trigger). If it is down, the chat falls back to WhatsApp. */
  chat: "https://frimpongboatengbenedict.app.n8n.cloud/webhook/f26a160a-ec62-4055-915d-45e0f5a72af9/chat",
}

export type StockOption = { colour: string; size: string; in_stock: number; can_make: boolean }
export type StockInfo = { found: boolean; code: string; availability: string; options: StockOption[] }

export async function liveStock(code: string, signal?: AbortSignal): Promise<StockInfo | null> {
  try {
    const r = await fetch(`${LIVE.url}/rest/v1/rpc/check_stock`, {
      method: "POST",
      headers: { apikey: LIVE.key, Authorization: `Bearer ${LIVE.key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ p_code: code }),
      signal,
    })
    if (!r.ok) return null
    const d = (await r.json()) as StockInfo
    return d.found ? d : null
  } catch {
    return null
  }
}
