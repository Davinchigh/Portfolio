import { workflow, node, trigger, languageModel, memory, tool, fromAi, newCredential } from '@n8n/workflow-sdk';

const API = 'https://qmsvrvfrdkilyypfappz.supabase.co/functions/v1/agent-api';

const shop_infoTool = tool({
  type: 'n8n-nodes-base.httpRequestTool',
  version: 4.5,
  config: {
    name: "shop_info",
    parameters: {
      toolDescription: "Opening hours and the current date and time in Accra.",
      method: 'POST',
      url: API,
      authentication: 'genericCredentialType',
      genericAuthType: 'httpHeaderAuth',
      sendBody: true,
      contentType: 'json',
      specifyBody: 'keypair',
      bodyParameters: { parameters: [{ name: 'tool', value: "shop_info" }] },
      options: { response: { response: { neverError: true } } }
    },
    credentials: { httpHeaderAuth: newCredential('Lizab agent token') }
  }
});

const catalogueTool = tool({
  type: 'n8n-nodes-base.httpRequestTool',
  version: 4.5,
  config: {
    name: "catalogue",
    parameters: {
      toolDescription: "List Lizab pieces with prices, availability, lead times, colours, sizes and stock. Use before recommending anything.",
      method: 'POST',
      url: API,
      authentication: 'genericCredentialType',
      genericAuthType: 'httpHeaderAuth',
      sendBody: true,
      contentType: 'json',
      specifyBody: 'keypair',
      bodyParameters: { parameters: [{ name: 'tool', value: "catalogue" }, { name: "p_query", value: fromAi("p_query", "Optional search words, e.g. suit or dress. Empty string for everything.", "string") }, { name: "p_collection", value: fromAi("p_collection", "Optional collection: women, men, bags-shoes or new-in. Empty string for all.", "string") }] },
      options: { response: { response: { neverError: true } } }
    },
    credentials: { httpHeaderAuth: newCredential('Lizab agent token') }
  }
});

const check_stockTool = tool({
  type: 'n8n-nodes-base.httpRequestTool',
  version: 4.5,
  config: {
    name: "check_stock",
    parameters: {
      toolDescription: "Check one item by code (e.g. LZ-W-001), optionally a colour and size.",
      method: 'POST',
      url: API,
      authentication: 'genericCredentialType',
      genericAuthType: 'httpHeaderAuth',
      sendBody: true,
      contentType: 'json',
      specifyBody: 'keypair',
      bodyParameters: { parameters: [{ name: 'tool', value: "check_stock" }, { name: "p_code", value: fromAi("p_code", "Item code, e.g. LZ-B-001", "string") }, { name: "p_colour", value: fromAi("p_colour", "Colour, or empty string", "string") }, { name: "p_size", value: fromAi("p_size", "Size exactly as listed, e.g. UK 12, or empty string", "string") }] },
      options: { response: { response: { neverError: true } } }
    },
    credentials: { httpHeaderAuth: newCredential('Lizab agent token') }
  }
});

const place_orderTool = tool({
  type: 'n8n-nodes-base.httpRequestTool',
  version: 4.5,
  config: {
    name: "place_order",
    parameters: {
      toolDescription: "Place an order or pre-order after the customer has said yes to the read-back. Nothing is charged.",
      method: 'POST',
      url: API,
      authentication: 'genericCredentialType',
      genericAuthType: 'httpHeaderAuth',
      sendBody: true,
      contentType: 'json',
      specifyBody: 'keypair',
      bodyParameters: { parameters: [{ name: 'tool', value: "place_order" }, { name: 'p_channel', value: 'web_chat' }, { name: "p_name", value: fromAi("p_name", "Customer full name", "string") }, { name: "p_phone", value: fromAi("p_phone", "Customer phone or WhatsApp number", "string") }, { name: "p_items", value: fromAi("p_items", "JSON array of items, each {code, colour, size, qty}", "json") }, { name: "p_delivery", value: fromAi("p_delivery", "pickup, delivery_accra, delivery_ghana, delivery_international or tbc", "string") }, { name: "p_address", value: fromAi("p_address", "Delivery address or area, or empty string", "string") }, { name: "p_notes", value: fromAi("p_notes", "Measurements, occasion, deadline, or empty string", "string") }] },
      options: { response: { response: { neverError: true } } }
    },
    credentials: { httpHeaderAuth: newCredential('Lizab agent token') }
  }
});

const order_statusTool = tool({
  type: 'n8n-nodes-base.httpRequestTool',
  version: 4.5,
  config: {
    name: "order_status",
    parameters: {
      toolDescription: "Look up an order by reference and the phone number on it.",
      method: 'POST',
      url: API,
      authentication: 'genericCredentialType',
      genericAuthType: 'httpHeaderAuth',
      sendBody: true,
      contentType: 'json',
      specifyBody: 'keypair',
      bodyParameters: { parameters: [{ name: 'tool', value: "order_status" }, { name: "p_ref", value: fromAi("p_ref", "Order reference, e.g. LZ26-0007", "string") }, { name: "p_phone", value: fromAi("p_phone", "Phone number on the order", "string") }] },
      options: { response: { response: { neverError: true } } }
    },
    credentials: { httpHeaderAuth: newCredential('Lizab agent token') }
  }
});

const available_slotsTool = tool({
  type: 'n8n-nodes-base.httpRequestTool',
  version: 4.5,
  config: {
    name: "available_slots",
    parameters: {
      toolDescription: "Free appointment times on a date in Accra.",
      method: 'POST',
      url: API,
      authentication: 'genericCredentialType',
      genericAuthType: 'httpHeaderAuth',
      sendBody: true,
      contentType: 'json',
      specifyBody: 'keypair',
      bodyParameters: { parameters: [{ name: 'tool', value: "available_slots" }, { name: "p_date", value: fromAi("p_date", "Date as YYYY-MM-DD", "string") }, { name: "p_kind", value: fromAi("p_kind", "fitting, measurement, collection or consultation", "string") }] },
      options: { response: { response: { neverError: true } } }
    },
    credentials: { httpHeaderAuth: newCredential('Lizab agent token') }
  }
});

const book_appointmentTool = tool({
  type: 'n8n-nodes-base.httpRequestTool',
  version: 4.5,
  config: {
    name: "book_appointment",
    parameters: {
      toolDescription: "Book an appointment at a free time the customer chose.",
      method: 'POST',
      url: API,
      authentication: 'genericCredentialType',
      genericAuthType: 'httpHeaderAuth',
      sendBody: true,
      contentType: 'json',
      specifyBody: 'keypair',
      bodyParameters: { parameters: [{ name: 'tool', value: "book_appointment" }, { name: 'p_channel', value: 'web_chat' }, { name: "p_name", value: fromAi("p_name", "Customer full name", "string") }, { name: "p_phone", value: fromAi("p_phone", "Customer phone or WhatsApp number", "string") }, { name: "p_kind", value: fromAi("p_kind", "fitting, measurement, collection or consultation", "string") }, { name: "p_date", value: fromAi("p_date", "Date as YYYY-MM-DD", "string") }, { name: "p_time", value: fromAi("p_time", "Start time HH:MM exactly as returned by available_slots", "string") }, { name: "p_notes", value: fromAi("p_notes", "What it is for, or empty string", "string") }] },
      options: { response: { response: { neverError: true } } }
    },
    credentials: { httpHeaderAuth: newCredential('Lizab agent token') }
  }
});

const request_callbackTool = tool({
  type: 'n8n-nodes-base.httpRequestTool',
  version: 4.5,
  config: {
    name: "request_callback",
    parameters: {
      toolDescription: "Hand over to a person at Lizab.",
      method: 'POST',
      url: API,
      authentication: 'genericCredentialType',
      genericAuthType: 'httpHeaderAuth',
      sendBody: true,
      contentType: 'json',
      specifyBody: 'keypair',
      bodyParameters: { parameters: [{ name: 'tool', value: "request_callback" }, { name: "p_name", value: fromAi("p_name", "Customer name", "string") }, { name: "p_phone", value: fromAi("p_phone", "Customer phone or WhatsApp number", "string") }, { name: "p_reason", value: fromAi("p_reason", "What they need, in one or two sentences", "string") }, { name: "p_kind", value: fromAi("p_kind", "callback, custom_request or complaint", "string") }] },
      options: { response: { response: { neverError: true } } }
    },
    credentials: { httpHeaderAuth: newCredential('Lizab agent token') }
  }
});

const log_interactionTool = tool({
  type: 'n8n-nodes-base.httpRequestTool',
  version: 4.5,
  config: {
    name: "log_interaction",
    parameters: {
      toolDescription: "At the end of the conversation, log a short summary for the Lizab team.",
      method: 'POST',
      url: API,
      authentication: 'genericCredentialType',
      genericAuthType: 'httpHeaderAuth',
      sendBody: true,
      contentType: 'json',
      specifyBody: 'keypair',
      bodyParameters: { parameters: [{ name: 'tool', value: "log_interaction" }, { name: 'p_channel', value: 'web_chat' }, { name: "p_summary", value: fromAi("p_summary", "What the customer wanted and what happened", "string") }, { name: "p_outcome", value: fromAi("p_outcome", "sale, preorder, booking, question, callback, complaint or other", "string") }, { name: "p_phone", value: fromAi("p_phone", "Customer phone, or empty string", "string") }, { name: "p_name", value: fromAi("p_name", "Customer name, or empty string", "string") }, { name: "p_order_ref", value: fromAi("p_order_ref", "Order reference, or empty string", "string") }, { name: "p_booking_ref", value: fromAi("p_booking_ref", "Booking reference, or empty string", "string") }] },
      options: { response: { response: { neverError: true } } }
    },
    credentials: { httpHeaderAuth: newCredential('Lizab agent token') }
  }
});

const model = languageModel({
  type: '@n8n/n8n-nodes-langchain.lmChatAnthropic',
  version: 1.6,
  config: {
    name: 'Claude',
    parameters: { model: { __rl: true, mode: 'list', value: 'claude-sonnet-5', cachedResultName: 'Claude Sonnet 5' }, options: { maxTokensToSample: 1024 } },
    credentials: { anthropicApi: newCredential('Anthropic') }
  }
});

const chatMemory = memory({
  type: '@n8n/n8n-nodes-langchain.memoryBufferWindow',
  version: 1.4,
  config: { name: 'Conversation memory', parameters: { sessionIdType: 'fromInput', contextWindowLength: 20 } }
});

const chat = trigger({
  type: '@n8n/n8n-nodes-langchain.chatTrigger',
  version: 1.5,
  config: {
    name: 'Website chat',
    parameters: {
      public: true,
      mode: 'webhook',
      authentication: 'none',
      options: { responseMode: 'streaming', allowedOrigins: 'https://lizab-house-of-fashion.vercel.app,https://lizabhouseoffashion.com,http://localhost:3200' }
    }
  }
});

const esi = node({
  type: '@n8n/n8n-nodes-langchain.agent',
  version: 3.1,
  config: {
    name: 'Esi, sales assistant',
    parameters: {
      promptType: 'auto',
      options: { systemMessage: "You are Esi, the sales assistant for Lizab House of Fashion, a fashion house in Accra, Ghana that makes men's and women's clothing and sells bags and shoes. You are an AI assistant and you say so if asked, or when you introduce yourself on a call. You talk like a warm, confident shop assistant in a good boutique: short sentences, friendly, never pushy. British English spelling. Prices are in Ghana cedis (GH\u20b5).\n\nWhat you can do, always with your tools, never from memory:\n- shop_info: opening hours and today's date and time in Accra. Call it first in any conversation about dates or times.\n- catalogue: what Lizab sells, prices, colours, sizes and how many are in stock.\n- check_stock: one item by code (codes look like LZ-W-001).\n- place_order: orders and pre-orders. Made-to-order pieces become a pre-order with a ready-by date.\n- order_status: where an order is. Needs the order reference and the phone number on the order.\n- available_slots then book_appointment: fittings, measurements, collections and consultations.\n- request_callback: hand over to a person.\n- log_interaction: at the end of every conversation, write a short summary for the Lizab team.\n\nHow to sell well:\n- Ask what the occasion is, who it is for and their size, then suggest at most two pieces from the catalogue with one line on why each suits them.\n- Never invent items, prices, fabrics, stock or delivery promises. If the catalogue says sample: true, tell the customer the piece and price are a preview and the team will confirm details.\n- Before place_order: read back each item (name, colour, size, quantity), the total, pick-up or delivery, their name and phone number, and get a clear yes.\n- After place_order: give the reference, say nothing is charged now and Lizab will confirm availability and delivery on WhatsApp before payment. Never ask for card numbers, mobile money PINs or passwords, and never take payment yourself.\n- Bookings: offer two or three free times from available_slots, confirm the one they pick, then book and give the reference.\n- Hand over with request_callback for custom designs, bridal or bulk orders, alterations, refunds, complaints, anything you cannot answer, or whenever someone asks for a person.\n- Keep personal details to what the order or booking needs.\n- On the phone: one question at a time, spell back phone numbers digit by digit, and keep replies under three sentences.\n\nThis conversation is the website chat: the channel is web_chat. Keep replies short and use plain text, no markdown tables.", maxIterations: 12, enableStreaming: true }
    },
    subnodes: { model, memory: chatMemory, tools: [shop_infoTool, catalogueTool, check_stockTool, place_orderTool, order_statusTool, available_slotsTool, book_appointmentTool, request_callbackTool, log_interactionTool] }
  }
});

export default workflow('lizab-sales-chat', 'Lizab sales assistant (website chat)')
  .add(chat)
  .to(esi);
