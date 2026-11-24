
const { useState, useRef, useEffect, useCallback, useMemo } = React;

// ═══════════════════════════════════════════════════════════════════════════════
// STORAGE, localStorage-backed persistence
// ═══════════════════════════════════════════════════════════════════════════════
const STORE_KEY = "bfb_masterclass_preview_v1";
const CACHE_KEY = "bfb_masterclass_preview_cache_v1";
const KEY_KEY   = "bfb_masterclass_unused";

// ── Theme: light or dark, starting from whatever the visitor chose on the main site ──
const THEME_KEY = "bfb_masterclass_theme";
let THEME = (() => {
  try {
    const t = localStorage.getItem(THEME_KEY) || localStorage.getItem("theme");
    return t === "light" ? "light" : "dark";
  } catch (e) { return "dark"; }
})();
// Brand and unit colours are tuned for a dark page; on paper they need to be deeper to stay readable.
const LIGHT_TONE = {"#D9B36C":"#8A6420","#00C9A7":"#0B7F6C","#10A37F":"#0B7A5F","#00D2D3":"#0A8486","#FF6B6B":"#BF3B39","#FF6B35":"#B4471C","#FF6B9D":"#B23E6A","#FFC312":"#8C6A06","#E8A87C":"#A55A2A","#20B2AA":"#137A74","#F59E0B":"#965F05","#FF9F43":"#A35C18","#4285F4":"#2A63C8","#0078D4":"#0B5FA8","#CC785C":"#A1513A","#666":"#5F5A52","#888":"#5F5A52"};
function tone(c) {
  if (THEME !== "light" || typeof c !== "string" || c[0] !== "#") return c;
  const hit = LIGHT_TONE[c.toUpperCase()] || LIGHT_TONE[c];
  if (hit) return hit;
  const n = c.length === 4 ? c.slice(1).split("").map(x => x + x).join("") : c.slice(1, 7);
  const ch = [0, 2, 4].map(i => Math.round(parseInt(n.slice(i, i + 2), 16) * 0.58));
  return "#" + ch.map(v => v.toString(16).padStart(2, "0")).join("");
}
function applyTheme(t) {
  THEME = t;
  document.documentElement.dataset.theme = t;
  document.documentElement.style.colorScheme = t;
  try { localStorage.setItem(THEME_KEY, t); } catch (e) {}
}
// A unit as it should look in the current theme.
const toned = (u) => u && ({ ...u, color: tone(u.color) });

function ThemeToggle({ onChange, compact }) {
  const light = THEME === "light";
  return (
    <button className={`theme-btn ${compact ? "compact" : ""}`} onClick={() => { applyTheme(light ? "dark" : "light"); onChange(); }}
      aria-label={light ? "Switch to dark mode" : "Switch to light mode"} title={light ? "Dark mode" : "Light mode"}>
      {light
        ? <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>
        : <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>}
      {!compact && <span>{light ? "Dark" : "Light"}</span>}
    </button>
  );
}

// ── Preview build: personalised for the visitor, no live AI ──────────────────
const NAME = (() => {
  const clean = (v) => (v || "").replace(/[^\p{L}\p{M} .-]/gu, "").replace(/\s+/g, " ").trim().slice(0, 30);
  try {
    const fromLink = clean(new URLSearchParams(location.hash.slice(1)).get("name"));
    if (fromLink) { localStorage.setItem("bfb_visitor_name", fromLink); return fromLink; }
    return clean(localStorage.getItem("bfb_visitor_name")) || "friend";
  } catch (e) { return "friend"; }
})();
const PREVIEW = {"lesson_1_1a_v1": "**Hey {{name}}, let's start with what AI actually is.**\n\nThink of AI like a very well-read apprentice. It has read more text than any person could in a thousand lifetimes: books, websites, manuals, conversations. From all that reading it learned patterns: which words, ideas and answers usually follow which.\n\n> AI doesn't \"know\" things the way you do. It predicts what a good answer looks like, based on everything it has read.\n\n---\n\n**How it learned**\n\nEngineers showed it billions of examples and kept correcting it until its predictions got good. Then people rated its answers, and it learned to be more helpful and careful. That's why it can explain, draft, summarise and brainstorm.\n\n**Why the way you ask matters**\n\nBecause AI predicts from your words, your words are the steering wheel. \"Write a post\" gets you something bland. \"Write a warm Instagram post for my Kumasi bakery announcing our new coconut bread, under 60 words, with one emoji\" gets you something you can actually use.\n\n---\n\n**The 7 types of AI you'll meet in this course**\n\n- **Text:** chat assistants like Claude and ChatGPT\n- **Image:** create pictures from a description\n- **Video:** short clips from text or a photo\n- **Audio:** natural voiceovers and music\n- **Code:** formulas, scripts and simple apps\n- **Agents:** AI that takes several steps on its own to reach a goal\n- **Automation:** AI wired into your apps so routine work happens by itself\n\nYou don't need to master all seven today. You just need to know they exist, so you know what to reach for.\n\n##  Reflection Exercise\nWhich one task in your week eats the most time? Write it down. By the end of this course, you'll know which of the seven types of AI can help with it.", "lesson_1_1c_v1": "**{{name}}, your first real AI conversation starts here.**\n\n**Step 1: Sign up.** Go to claude.ai or chat.openai.com and create a free account with your email or Google account.\n\n**Step 2: Find the message box.** It's at the bottom of the screen. Everything happens there.\n\n**Step 3: Start with who you are.** One or two sentences of context changes everything. For example: \"I run a small tailoring business in Accra with two staff.\"\n\n**Step 4: Ask for one clear thing.** \"Help me write a polite WhatsApp message reminding a customer that her dress is ready for pick-up.\"\n\n**Step 5: Read, then react.** Don't accept the first answer blindly. Say what you liked and what to change: \"Good, but make it warmer and add that we're open until 7pm.\"\n\n**Step 6: Save what works.** Copy the final version somewhere safe. Good prompts are reusable.\n\n> Treat AI like a capable new colleague: give it context, ask clearly, and give feedback. It gets better with every message.\n\n---\n\n**Why context matters so much**\n\nWithout context, AI guesses. With context, it tailors. Compare \"Plan a budget\" with \"Plan a monthly budget for a nurse in Tema earning GHS 4,500 who wants to save for a car.\" The second gets you something real.\n\n##  Reflection Exercise\nHave a 10-message conversation with an AI about something real in your life: a decision, a plan or a message you need to write. After each answer, give one piece of feedback. What changed between message 1 and message 10?", "lesson_2_2a_v1": "**{{name}}, every great prompt has six ingredients.** You won't always need all six, but knowing them is the difference between \"meh\" and \"wow\".\n\n**1. Role: who should the AI be?**\nWeak: \"Write a cover letter.\"\nStrong: \"You are an experienced HR manager at a Ghanaian bank.\"\nWhy it matters: a role sets the expertise and vocabulary.\n\n**2. Task: what exactly do you want?**\nWeak: \"Help with my CV.\"\nStrong: \"Rewrite my CV summary in 3 sentences for a junior data analyst role.\"\n\n**3. Context: what does it need to know?**\nWeak: \"Plan an event.\"\nStrong: \"Plan a 2-hour product launch for 40 guests in Osu, budget GHS 8,000, Saturday evening.\"\n\n**4. Format: how should the answer look?**\n\"Give it as a table with columns for time, activity and person responsible.\"\n\n**5. Tone: how should it sound?**\n\"Friendly but professional, like a message from a trusted older colleague.\"\n\n**6. Constraints: the limits.**\n\"Under 150 words. No jargon. Don't mention prices.\"\n\n---\n\n> Put together: \"You are an experienced events planner in Accra. Plan a 2-hour product launch for 40 guests in Osu with a GHS 8,000 budget. Present it as a timed table. Keep the tone upbeat and practical, and stay under 200 words.\"\n\nThat one prompt replaces five rounds of back and forth.\n\n##  Reflection Exercise\nTake a prompt you've used recently. Rewrite it using all six elements. Run both versions and compare. Which element made the biggest difference?", "lesson_2_2d_v1": "**Ready to level up, {{name}}?** These five techniques are what separate casual users from people who get consistently excellent results.\n\n**1. Prompt Chaining**\nBreak big jobs into steps, feeding each answer into the next prompt.\nExample: (1) \"List 10 blog ideas for a Ghanaian skincare brand.\" (2) \"Take idea 4 and write an outline.\" (3) \"Write the introduction from that outline.\"\n\n**2. Devil's Advocate Prompting**\nAsk AI to attack your idea before the world does.\nExample: \"Here's my plan to open a second shop in Kasoa. Give me the five strongest reasons it could fail.\"\n\n**3. Persona Stacking**\nCombine perspectives in one answer.\nExample: \"Review my pricing as a customer, an accountant and a competitor. Give each view separately.\"\n\n**4. Calibration Prompting**\nAsk how sure it is.\nExample: \"Answer, then rate your confidence from 1 to 10 and tell me what I should double-check.\"\n\n> AI can sound confident and still be wrong. Calibration prompts make the uncertainty visible.\n\n**5. Contextual Memory Refresh**\nIn long chats, AI can drift. Restate the key facts.\nExample: \"Quick reminder before we continue: the audience is first-year students, the budget is GHS 2,000 and the deadline is Friday.\"\n\n---\n\n##  Reflection Exercise\nPick a real project. Run a 3-step prompt chain: ideas, then a plan, then a first draft. Which step needed the most correction, and why?", "lesson_3_3a_v1": "**{{name}}, here's how image AI works, in plain words.**\n\nImage AI learned from millions of pictures paired with descriptions. When you type a description, it starts from random noise and gradually \"sculpts\" an image that matches your words. Clearer words, clearer picture.\n\n**The image prompt formula**\n\n> Subject + Style + Setting + Lighting + Mood + Technical specs\n\n---\n\n**Five professional prompts using the formula**\n\n**Headshot:** \"Professional headshot of a Ghanaian woman in her 30s, navy blazer, soft studio photography, neutral grey backdrop, soft window light, confident and approachable, 85mm lens, shallow depth of field.\"\n\n**Product photography:** \"A woven straw handbag on a cream linen surface, minimal editorial style, soft morning light from the left, calm and premium, high detail, square format.\"\n\n**Logo concept:** \"Minimal logo concept for a coffee brand called 'Kofi Brew', flat vector style, single colour, clean lines, white background.\"\n\n**Authentic market scene:** \"Busy Makola market stall with colourful fabrics, documentary photography, late afternoon golden light, lively and warm, wide angle.\"\n\n**Presentation background:** \"Abstract background of soft gold and deep green gradients with subtle geometric lines, modern corporate style, lots of empty space for text, 16:9.\"\n\n**Quality boosters:** high detail, sharp focus, professional photography, natural skin texture.\n**Negative prompts** (where the tool supports them): blurry, distorted hands, extra fingers, watermark, text.\n\n##  Reflection Exercise\nWrite an image prompt for something you need this month: a flyer image, a profile picture or a slide background. Label each part of the formula in your prompt.", "lesson_3_3b_v1": "**{{name}}, let's put image AI to work on real business jobs.**\n\n**Social media content**\n\"Flat-lay of fresh Ghanaian breakfast: koko, koose and bread on a wooden table, overhead shot, bright natural light, cheerful, Instagram square.\"\n\n**Brand photography**\n\"Hands of a seamstress cutting kente-inspired fabric on a wooden table, close-up, warm workshop light, authentic and proud, editorial photography.\"\n\n**Marketing campaign**\n\"A young professional in Accra smiling at her phone on a trotro, candid street photography, morning light, optimistic, room on the right for a headline.\"\n\n**Consistent characters**\nDescribe the character the same way every time and save the description: \"Ama, a 28-year-old Ghanaian nurse with short natural hair, round glasses, teal scrubs.\" Many tools also let you upload a reference image to keep her face consistent.\n\n**Presentation visuals**\n\"Simple isometric illustration of a small shop connected to a phone and a delivery bike, flat colours, white background, clean.\"\n\n---\n\n**Which tool for what?**\n\n- **Midjourney:** the most artistic and polished images, great for campaigns\n- **ChatGPT's image tool:** best at following detailed instructions and putting readable text in images\n- **Leonardo AI:** strong free tier, good for consistent characters and product shots\n\n> Always check the details before you publish: hands, text and logos are where image AI still slips.\n\n##  Reflection Exercise\nChoose one use case above that fits your work. Write your own prompt for it, generate two versions in different tools, and note which one fits your brand better.", "lesson_4_4a_v1": "**{{name}}, video AI is newer, but it's already useful.**\n\n**Four types**\n- **Text-to-video:** describe a scene, get a clip\n- **Image-to-video:** bring a still photo to life\n- **Video-to-video:** restyle existing footage\n- **AI avatars:** a presenter speaks your script on camera\n\n**The video prompt formula**\n\n> Scene + Camera movement + Style + Lighting + Pacing\n\n**Camera terms professionals use:** slow push-in, pull-back, pan left, tilt up, tracking shot, orbit, drone fly-over, handheld, static wide shot.\n\n---\n\n**Five real prompts**\n\n**Social media short:** \"Close-up of fresh jollof being served at a party, slow push-in, vibrant food-commercial style, warm evening light, upbeat pacing, 6 seconds.\"\n\n**Corporate opener:** \"Drone fly-over of the Accra skyline at sunrise, slow and smooth, cinematic, golden light, calm and confident pacing.\"\n\n**AI avatar script:** \"Hello! I'm Esi from Bright Path Consulting. In the next minute, I'll show you three ways to cut your monthly costs.\" (Paste it into an avatar tool and choose a presenter.)\n\n**Educational animation:** \"Simple 2D animation of a seed growing into a cocoa tree, side view, soft flat colours, gentle pacing.\"\n\n**Music video concept:** \"Dancers on a rooftop in Osu at dusk, orbiting camera, neon highlights, energetic pacing, Afrobeats mood.\"\n\n**Current limitations:** clips are short, hands and text can warp, and keeping the same person across clips is still hard. Plan for short, simple shots.\n\n##  Reflection Exercise\nThink of one short video your work or a business you love could post. Write the prompt using all five parts of the formula.", "lesson_5_5a_v1": "**{{name}}, voice AI can turn any script into a natural voiceover.**\n\n**What it can do:** narrate videos, read lessons aloud, create podcast intros, translate a message into other voices and languages, and give a consistent voice to a brand.\n\n**Writing for the ear, not the eye**\n- Short sentences. One idea each.\n- Use commas and full stops for pauses. Use \"...\" for a longer pause.\n- Write numbers how they're said: \"two thousand cedis\", not \"GHS 2,000\".\n- Put the word you want stressed near the end of the sentence.\n\n---\n\n**A voiceover script written for AI**\n\n\"Every morning... thousands of small businesses in Ghana open their doors. They work hard. They serve well. But too many of them are invisible online. At Bright Path, we change that. In just two weeks, we'll give your business a website your customers will love. Bright Path. Be seen.\"\n\n**Voice cloning with ElevenLabs**\nYou upload a few minutes of clean recordings of a voice, and the tool learns to speak in that voice. It's useful for narrating your own courses without recording every time.\n\n> Only clone your own voice, or a voice you have clear written permission to use.\n\n##  Reflection Exercise\nWrite a 60-second voiceover script (about 140 words) for a product, service or cause you care about. Read it aloud once. Where did you stumble? Rewrite those lines.", "lesson_5_5b_v1": "**{{name}}, you can make original music in minutes.**\n\nTools like **Suno** and **Udio** create full songs, with or without vocals, from a description.\n\n**The music prompt formula**\n\n> Genre + Mood + Instruments + Vocal style + Tempo + Theme\n\n---\n\n**Four complete prompts**\n\n**Afrobeats:** \"Afrobeats, joyful and confident, log drums, shakers, bright guitar, smooth male vocals, 105 BPM, about chasing your dreams in Accra.\"\n\n**Corporate background:** \"Light corporate pop, optimistic, soft piano and plucked synths, no vocals, 95 BPM, for a product demo video.\"\n\n**Podcast intro:** \"Neo-soul intro, warm and curious, Rhodes piano, upright bass, brushed drums, no vocals, 85 BPM, 15 seconds.\"\n\n**Documentary score:** \"Cinematic ambient, reflective and hopeful, strings, kalimba, soft percussion, no vocals, slow tempo, about the people of a fishing village at dawn.\"\n\n**Business uses:** background music for adverts, YouTube and TikTok videos, events and podcasts. Check each tool's licence terms: paid plans usually allow commercial use, free plans often don't.\n\n**Writing your own lyrics:** Suno's custom mode lets you paste lyrics with sections like [Verse], [Chorus] and [Bridge], then choose a style.\n\n##  Reflection Exercise\nWrite a music prompt for a jingle for a business you know. Then write a four-line chorus for it in custom mode. What mood are you trying to create?", "lesson_6_6a_v1": "**{{name}}, you don't need to be a programmer to use code AI.** You just need to describe the problem clearly.\n\n**What code AI can do for non-developers**\n- Write Excel and Google Sheets formulas\n- Create simple scripts that send emails or tidy files\n- Build a basic web page\n- Analyse a spreadsheet of numbers\n\n**The non-developer code prompt formula**\n\n> Describe the goal + show a sample of your data + ask for a plain-English explanation, where to put the code, and how to test it.\n\n---\n\n**Worked example 1: a spreadsheet formula**\n\"In Google Sheets, column B has sale amounts and column C has the region (Accra, Kumasi, Takoradi). Write a formula that totals sales for Kumasi only. Explain it in plain English and tell me exactly which cell to put it in.\"\n\n**Worked example 2: an email reminder script**\n\"I keep customer due dates in Google Sheets: name in A, email in B, due date in C. Write a Google Apps Script that emails each customer a polite reminder three days before the due date. Explain step by step where to paste it, how to run it, and how to test it on my own email first.\"\n\n**Worked example 3: a one-page website**\n\"Build a simple one-page website for a hair salon in Kumasi with sections for services, prices, opening hours and a WhatsApp button. Give me a single HTML file and explain how to open it on my laptop.\"\n\n> Always test on a copy of your data first.\n\n##  Reflection Exercise\nWhat's one repetitive task in a spreadsheet you use? Write a prompt using the formula above to automate it.", "lesson_6_6b_v1": "**{{name}}, AI can be your personal data analyst.**\n\n**The step-by-step approach**\n1. **Give it the data:** paste a table or upload a spreadsheet, and remove names and private details first.\n2. **Ask layered questions:** start broad, then go deeper.\n3. **Ask for visuals:** \"Which chart would show this best, and why?\"\n4. **Ask what it means:** \"What should a business owner do with this?\"\n\n---\n\n**Sales analysis template**\n\n\"You are a business analyst. Here is 6 months of sales data for my shop [paste data]. 1) Summarise the overall trend in 3 sentences. 2) Show my top 5 products and bottom 5 products. 3) Which month was strongest and what might explain it? 4) Recommend 2 charts to present this. 5) Give 3 practical actions for next month.\"\n\n**Customer feedback template**\n\n\"You are a customer experience expert. Here are 40 customer comments [paste]. 1) Group them into themes and count each. 2) Pick out the 3 biggest complaints with example quotes. 3) What are customers praising? 4) Suggest 3 improvements, from easiest to hardest.\"\n\n> AI can miscount or misread a table. Check any number you're going to act on.\n\n##  Reflection Exercise\nWhat data do you already have: sales, attendance, budgets, feedback? Write one layered question you'd like answered about it.", "lesson_7_7a_v1": "**{{name}}, automation is AI working for you while you sleep.**\n\n**Every automation has three parts**\n\n> Trigger, then an AI step, then an action.\n\nExample: A new email arrives (trigger), AI decides whether it's urgent and summarises it (AI step), and the summary is sent to your WhatsApp (action).\n\n---\n\n**Four real examples**\n- **Email:** sort incoming emails and draft polite replies for you to approve\n- **Social media:** turn one blog post into five scheduled posts\n- **Leads:** when someone fills a form, AI scores the lead and adds it to your sheet\n- **Weekly reports:** every Friday, AI summarises the week's sales into a short report\n\n**Tools:** Zapier, Make and n8n. Zapier has an AI builder where you describe the automation in plain words: \"When a new row is added to my orders sheet, send the customer a thank-you email and notify me on Slack.\"\n\n**Writing the AI step**\nInside the automation, the AI step needs its own instructions, like a job description:\n\"You categorise customer emails. Reply with one of: ORDER, COMPLAINT, QUESTION, OTHER.\"\n\n**The key principle: ask for structured output**\nAutomations need predictable answers. Ask for JSON, like:\n{\"category\": \"ORDER\", \"urgent\": true, \"summary\": \"...\"}\nThen the next step can read each field reliably.\n\n##  Reflection Exercise\nName one task you repeat every week. Write it as trigger, AI step and action. Which tool would you try first?", "lesson_8_8a_v1": "**{{name}}, a chatbot answers. An agent acts.**\n\n**A worked example: \"Plan my team's end-of-year dinner in Accra.\"**\n\nA chatbot gives you ideas. An agent could:\n1. Ask how many people are coming and what the budget is\n2. Search for restaurants that fit\n3. Check reviews and opening times\n4. Compare three options in a table\n5. Draft an invitation\n6. Create a calendar event\n7. Report back, asking you to approve before booking\n\n**Types of agents**\n- **Single agents:** one AI with tools, like browsing or email\n- **Multi-agent systems:** several AIs with different roles, like a researcher, a writer and an editor\n- **Personal agents:** handle your inbox, calendar and reminders\n\n---\n\n**How to prompt an agent**\n\n> Goal, Context, Tools, Success criteria, Guardrails\n\n\"**Goal:** find three venues for a team dinner. **Context:** 15 people, Friday 12 December, budget GHS 6,000, near East Legon. **Tools:** web search only. **Success:** a table with price per head, distance and a booking contact. **Guardrails:** don't book or pay for anything; ask me before contacting anyone.\"\n\nGuardrails matter most: agents can take real actions, so be explicit about what they must not do.\n\n##  Reflection Exercise\nDesign your own agent task. Write the goal, context, tools, success criteria and at least two guardrails.", "lesson_8_8b_v1": "**{{name}}, RAG is how you give AI your own knowledge.**\n\nAI knows a lot about the world, but nothing about your price list, your company policy or your notes. **RAG (Retrieval-Augmented Generation)** fixes that: the AI first looks things up in your documents, then answers using them.\n\n> Think of it as giving the AI an open-book exam, with your files as the book.\n\n---\n\n**Four practical examples**\n- **Business FAQ bot:** answers customer questions from your price list and delivery policy\n- **Personal research assistant:** answers questions from 20 articles you've saved\n- **HR policy bot:** staff ask \"How many leave days do I have?\" and it answers from the handbook\n- **Professional guidelines assistant:** a nurse checks a procedure against the hospital guide\n\n**Tools you can use today**\n- Upload files to ChatGPT or Claude and ask questions about them\n- Claude Projects and Custom GPTs keep your documents ready for every chat\n- Notion AI answers questions from your Notion pages\n\n**The critical phrase**\n\"Answer only using the documents provided. If the answer isn't in them, say you don't know.\"\nWithout it, AI may fill gaps with guesses.\n\n##  Reflection Exercise\nWhich documents would you want an AI to know by heart? Write three questions you'd ask it about them.", "lesson_10_10a_v1": "**{{name}}, AI is brilliant, and it's also flawed. Knowing how it fails is a professional skill.**\n\n**Hallucinations**\nAI sometimes states false things with total confidence: a book that doesn't exist, a wrong date, an invented statistic or a fake quote. It happens because AI predicts plausible text, not verified truth.\n\n**Bias**\nAI learned from the internet, and the internet over-represents some voices. It may assume a \"doctor\" is a man, misread African names, or default to American examples and prices. For African contexts, always check whether its advice actually fits your market, laws and culture.\n\n**Other limitations**\n- Its knowledge has a cut-off date unless it can search the web\n- It can be weak at exact maths and counting\n- It can't see your local situation unless you describe it\n- It can lose track in very long conversations\n\n---\n\n> **The verification rule:** if you're going to publish it, act on it or send it to a client, verify every fact, figure, name and quote against a reliable source.\n\n##  Reflection Exercise\nThink of a situation in your work where trusting a wrong AI answer could cause real harm. What would you check, and how?", "lesson_10_10b_v1": "**{{name}}, here's your practical privacy guide.**\n\n**Never paste into AI**\n- Passwords, PINs and one-time codes\n- Ghana Card, passport or bank details\n- Client names, health details or personal stories they told you in confidence\n- Company secrets: unreleased plans, contracts, internal finances\n\n**Why it matters:** conversations may be stored, reviewed for safety, or used to improve models depending on your settings and plan. Once it's pasted, you don't fully control it.\n\n> **The public notice board test:** if you wouldn't pin it on a public notice board, don't paste it into AI.\n\n---\n\n**At work**\nFollow your organisation's AI policy, use approved tools, and ask before using AI on client work.\n\n**How to anonymise: before and after**\n\nBefore: \"Write a warning letter to Kwame Asante, ID 4471, who was late 6 times in March at our Spintex branch.\"\nAfter: \"Write a warning letter to an employee who was late 6 times in one month. Keep it firm and fair.\"\n\nYou get the same help without exposing anyone.\n\n**Deepfakes**\nAI can now fake voices and videos. If a \"boss\" or \"relative\" calls urgently asking for money, hang up and call them back on a number you already know.\n\n##  Reflection Exercise\nLook at the last three things you asked an AI. Did any of them include information that failed the notice board test? How would you rewrite them?", "lesson_10_10c_v1": "**{{name}}, let's talk about the big questions, calmly and practically.**\n\n**Transparency**\nIf AI wrote most of something important, be honest about it, especially at school, at work and with clients.\n\n**Bias in decisions about people**\nAI shouldn't be the final judge in hiring, lending or grading. A person must review decisions that affect people's lives.\n\n**Jobs, especially in Africa**\nSome tasks will be automated. But AI also lowers the cost of starting a business, learning new skills and reaching global clients from Accra, Lagos or Nairobi. The people who learn it early are best placed to benefit.\n\n**Consent and attribution**\nDon't clone someone's voice or face without permission. Credit artists and sources where you can.\n\n**Environmental cost**\nTraining and running AI uses a lot of electricity and water. Use it with purpose, not for everything.\n\n**Power concentration**\nMost major AI tools are built by a few companies far from Africa. That's why African builders, educators and voices matter in shaping how AI is used here.\n\n---\n\n> Here's your edge: you have values, context and empathy that AI will never have. AI can draft. Only you can decide what's right for your people.\n\n##  Reflection Exercise\nWhich of these questions matters most to you, and what is one rule you'll set for your own AI use because of it?", "lesson_11_11a_v1": "**{{name}}, AI skills are already creating new work.** Here are five real paths.\n\n**Prompt Engineer:** designs and tests prompts that make AI reliable for a business. Hired by tech companies, agencies and startups. Freelance: yes.\n\n**AI Automation Specialist:** connects AI to everyday tools like email, spreadsheets and CRMs so routine work runs itself. Hired by small and medium businesses and operations teams. Freelance: very much yes.\n\n**AI Content Strategist:** plans and produces content with AI while keeping a human voice and quality. Hired by brands and media companies. Freelance: yes.\n\n**AI Trainer or Educator:** teaches teams and communities to use AI well. This is a big opportunity across Africa, where demand for training is growing faster than the supply of trainers. Freelance: yes, through workshops and courses.\n\n**AI Consultant for SMEs:** helps small businesses find where AI saves time or money and sets it up. Freelance: yes.\n\n---\n\n> AI skills are **additive**. A nurse who uses AI well, an accountant who automates reports, a teacher who builds AI lessons: each becomes more valuable in the job they already have.\n\n**This week on LinkedIn**\n1. Add \"AI-assisted [your field]\" to your headline\n2. List the AI tools you use under Skills\n3. Post one short, practical thing you learned in this course\n\n##  Reflection Exercise\nWhich path fits you best right now, and what's one small step you can take towards it this week?", "lesson_11_11b_v1": "**{{name}}, a portfolio proves what a CV only claims.**\n\n**Five pieces that open doors**\n- **Prompt library:** your 10 best prompts, each with the problem it solves\n- **Before and after:** a messy task, then the AI-assisted result, side by side\n- **Workflow diagrams:** a simple picture of an automation you built\n- **Case studies:** problem, what you did, the result, ideally with a number like \"saved 4 hours a week\"\n- **Your course certificate**\n\n**Where to show it**\n- **LinkedIn:** the Featured section and regular posts\n- **A simple personal website:** tools like bolt.new can build one from a description in minutes\n\n---\n\n**The LinkedIn strategy**\n\n> One practical AI post a week, for six months.\n\nShow a prompt, a before and after, or a lesson learned. Twenty-six posts later, people will think of you when they think of AI.\n\n##  Reflection Exercise\nPlan three portfolio pieces you could make in the next month. For each, write the problem it solves and the result you'd show.", "lesson_11_11c_v1": "**{{name}}, AI changes every week. You don't need to chase all of it.**\n\n**The 3-source strategy**\nPick three sources and ignore the rest:\n- **The Rundown AI:** a short daily newsletter\n- **AI Tool Report:** practical new tools\n- **LinkedIn:** follow five people who share hands-on AI work\n\n**The practice-first rule**\n\n> For every hour you spend reading about AI, spend two hours using it.\n\n**The monthly audit (30 minutes)**\n1. Which AI tools did I actually use this month?\n2. What saved me the most time?\n3. What's one new thing I'll try next month?\n\n---\n\n**One last thing**\n\nYou started this course as a beginner. Now you understand prompts, images, video, voice, code, automation and agents, and you know how to use them safely and honestly. Most people around you haven't taken that step yet. That's your edge.\n\nKeep going. Keep building. Keep sharing what you learn.\n\n##  Reflection Exercise\nWrite down your three sources, the day of the month for your audit, and one AI skill you'll practise next.", "technique_0_v1": "**Zero-Shot Prompting**\n\n**What it is:** asking AI to do a task with no examples, just clear instructions.\n\n**When to use it:** for simple, common tasks where AI already knows the pattern, like summaries, emails and definitions.\n\nBAD: write about savings\nGOOD: In 5 bullet points, explain to a first-time saver in Ghana why a mobile money savings account beats keeping cash at home. Use simple language.\n\n> Zero-shot works when your instructions are specific enough to stand alone.", "technique_1_v1": "**Few-Shot Prompting**\n\n**What it is:** showing AI two or three examples of what you want before asking for more.\n\n**When to use it:** when you need a specific style, format or voice that's hard to describe.\n\nBAD: write product descriptions for my shop\nGOOD: Here are two descriptions in my brand voice: \"Shea butter, whipped soft. Your skin will thank you.\" and \"Black soap, made in Tamale. Pure, simple, yours.\" Write three more in the same style for: coconut oil, cocoa butter and a loofah.\n\n> Examples teach faster than explanations.", "technique_2_v1": "**Chain of Thought**\n\n**What it is:** asking AI to reason step by step before giving the answer.\n\n**When to use it:** maths, planning, decisions and anything with several moving parts.\n\nBAD: Should I take the job in Kumasi?\nGOOD: Help me decide whether to take a job in Kumasi paying GHS 6,000 or stay in Accra on GHS 5,000. Think step by step: rent difference, transport, family, career growth. Then give a recommendation.\n\n> Asking for the steps makes mistakes easier to spot.", "technique_3_v1": "**Role Prompting**\n\n**What it is:** telling AI who to be, so it answers with the right expertise and tone.\n\n**When to use it:** whenever expertise or perspective matters.\n\nBAD: check my business plan\nGOOD: You are a loan officer at a Ghanaian rural bank. Review my business plan for a poultry farm and list the three questions you would ask before approving a GHS 30,000 loan.\n\n> The role sets the lens the AI looks through.", "technique_4_v1": "**Iterative Prompting**\n\n**What it is:** improving the answer through short rounds of feedback instead of expecting perfection first time.\n\n**When to use it:** writing, design ideas and anything creative.\n\nBAD: (accepting the first draft and giving up)\nGOOD: That's close. Keep the second paragraph, cut the first, make the ending more hopeful and bring it under 120 words.\n\n> The first answer is a draft. Your feedback is the edit.", "technique_5_v1": "**Constraint Prompting**\n\n**What it is:** setting clear limits: length, words to avoid, format or reading level.\n\n**When to use it:** when the output has to fit somewhere specific, like a flyer, a WhatsApp message or a slide.\n\nBAD: write a flyer for our church harvest\nGOOD: Write flyer text for a church harvest on Saturday 14 November at 10am. Maximum 40 words. Include date, time and venue. No more than one exclamation mark.\n\n> Constraints aren't limits on quality. They're a recipe for it.", "technique_6_v1": "**Template Prompting**\n\n**What it is:** saving a prompt with blanks so you can reuse it.\n\n**When to use it:** any task you do often.\n\nBAD: (typing a new prompt from scratch every week)\nGOOD: Write a weekly update for [TEAM] covering: wins [WINS], challenges [CHALLENGES] and next week's priorities [PRIORITIES]. Keep it under 150 words, friendly and clear.\n\n> Build your own small library of templates, and you'll save hours every month.", "technique_7_v1": "**Meta Prompting**\n\n**What it is:** asking AI to help you write a better prompt.\n\n**When to use it:** when you're not sure how to ask, or your results keep missing.\n\nBAD: make me a marketing plan\nGOOD: I want a marketing plan for my new bakery in Cape Coast. Before you write it, ask me the 5 questions you need answered to make it genuinely useful.\n\n> When in doubt, let AI interview you first."};
const personalise = (t) => t.split("{{name}}").join(NAME);

function previewCoach(prompt) {
  const p = prompt.toLowerCase();
  const checks = [
    ["Role", /\b(you are|act as|as an? |pretend you)/.test(p), "Start with a role, e.g. \"You are an experienced marketing manager in Accra.\""],
    ["Task", /\b(write|create|plan|explain|summari[sz]e|draft|list|make|give|help|rewrite|design|analy[sz]e|suggest)\b/.test(p), "Say exactly what you want done, starting with a verb like write, plan or summarise."],
    ["Context", p.length > 90 || /\b(i run|i am|i'm|we are|my |our |for a |audience|customers?)\b/.test(p), "Add context: who it's for, your situation and the goal."],
    ["Format", /\b(table|bullet|list|steps|paragraphs?|email|post|outline|sentences?)\b/.test(p), "Ask for a format: a table, 5 bullet points, a short email."],
    ["Tone", /\b(tone|friendly|formal|warm|professional|casual|polite|upbeat|firm)\b/.test(p), "Name the tone: warm, professional, upbeat or firm."],
    ["Constraints", /\b(under|max|maximum|no more than|limit|avoid|don't|do not|words|characters|budget)\b/.test(p), "Add a limit: word count, things to avoid, a budget."],
  ];
  const have = checks.filter(c => c[1]).map(c => c[0]);
  const missing = checks.filter(c => !c[1]);
  const score = have.length;
  let reply = `Prompt check: ${score} of 6 elements, ${NAME}.

`;
  reply += have.length ? `You've got: ${have.join(", ")}.

` : "";
  if (missing.length) {
    reply += `Try adding:
` + missing.slice(0, 3).map(m => `• ${m[0]}: ${m[2]}`).join(String.fromCharCode(10));
    reply += `

Rewrite it with those added and send it again. Watch your score climb.`;
  } else {
    reply += `That's a complete prompt. Paste it into Claude or ChatGPT and compare the result with a one-line version.`;
  }
  reply += `

(Preview build: this coach checks your prompt against the six elements from Unit 2. It doesn't call a live AI.)`;
  return reply;
}

function loadStore() {
  try { return JSON.parse(localStorage.getItem(STORE_KEY) || "{}"); }
  catch { return {}; }
}
function saveStore(data) {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(data)); } catch {}
}
function loadCache() {
  try { return JSON.parse(localStorage.getItem(CACHE_KEY) || "{}"); }
  catch { return {}; }
}
function saveCache(data) {
  try { localStorage.setItem(CACHE_KEY, JSON.stringify(data)); } catch {}
}

// Custom hook: useState that auto-persists to localStorage under a single key
function usePersistedState(initial) {
  const [state, setState] = useState(() => {
    const stored = loadStore();
    return { ...initial, ...stored };
  });
  useEffect(() => { saveStore(state); }, [state]);
  return [state, setState];
}

// ═══════════════════════════════════════════════════════════════════════════════
// CSS
// ═══════════════════════════════════════════════════════════════════════════════
const CSS = `
:root,[data-theme="dark"]{
  --bg:#0D0E11;--bg-rgb:13 14 17;--panel:#111317;--fg-rgb:255 255 255;
  --ink:#F4F1EA;--ink-2:#C8C4BB;--muted:#918C84;--muted-2:#6C6863;--faint:#47443F;
  --accent:#D9B36C;--accent-rgb:217 179 108;--accent-ink:#EBD9B0;--on-accent:#17140D;
  --well:rgba(0,0,0,0.28);--code-ink:#B8CBE4;--card:rgb(255 255 255 / 0.035);--card-solid:#15171B;--line:rgb(255 255 255 / 0.08);
  --lift:inset 0 1px 0 rgb(255 255 255 / 0.05),0 24px 48px -28px rgb(0 0 0 / 0.9);
}
[data-theme="light"]{
  --bg:#F6F2EA;--bg-rgb:246 242 234;--panel:#FBF8F2;--fg-rgb:40 30 15;
  --ink:#1C1813;--ink-2:#3E382F;--muted:#6B655B;--muted-2:#837C70;--faint:#B3AB9E;
  --accent:#8A6420;--accent-rgb:138 100 32;--accent-ink:#6E4F17;--on-accent:#FFFCF5;
  --well:#FFFFFF;--code-ink:#24476B;--card:#FFFFFF;--card-solid:#FFFFFF;--line:rgb(60 45 20 / 0.12);
  --lift:0 1px 2px rgb(60 45 20 / 0.06),0 16px 36px -22px rgb(60 45 20 / 0.28);
}
*{box-sizing:border-box;}
.sr-only{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;}
html,body{margin:0;padding:0;background:var(--bg);color:var(--ink);}
body{transition:background-color .4s ease,color .4s ease;}
::-webkit-scrollbar{width:8px;height:8px;}
::-webkit-scrollbar-track{background:transparent;}
::-webkit-scrollbar-thumb{background:rgb(var(--fg-rgb) / 0.14);border-radius:8px;border:2px solid transparent;background-clip:padding-box;}
textarea,input,button{font-family:'Plus Jakarta Sans',sans-serif;}
textarea,input{color:var(--ink)!important;}
textarea::placeholder,input::placeholder{color:var(--muted-2);}
button:focus-visible,input:focus-visible,textarea:focus-visible,a:focus-visible{outline:2px solid var(--accent);outline-offset:2px;}
@keyframes fadeUp{from{opacity:0;transform:translateY(14px);}to{opacity:1;transform:translateY(0);}}
@keyframes pulse{0%,100%{opacity:1;}50%{opacity:0.35;}}
@keyframes float{0%,100%{transform:translateY(0);}50%{transform:translateY(-7px);}}
@keyframes celebrate{from{opacity:0;transform:scale(0.8);}60%{transform:scale(1.04);}to{opacity:1;transform:scale(1);}}
@keyframes spin{from{transform:rotate(0deg);}to{transform:rotate(360deg);}}
@keyframes drawIn{from{stroke-dashoffset:var(--len);}}
.fu{animation:fadeUp 0.5s cubic-bezier(.2,.7,.1,1) both;}
.fu2{animation:fadeUp 0.5s cubic-bezier(.2,.7,.1,1) .08s both;}
.spin{animation:spin 1s linear infinite;}

/* Shell: a soft wash of the unit's colour behind everything */
.shell{position:relative;background:var(--bg);}
.shell::before{content:"";position:fixed;inset:0;pointer-events:none;background:radial-gradient(60% 50% at 85% -10%,color-mix(in oklab,var(--unit) 22%,transparent),transparent 70%),radial-gradient(50% 40% at 10% 110%,color-mix(in oklab,var(--unit) 10%,transparent),transparent 70%);transition:background .8s ease;}
[data-theme="light"] .shell::before{opacity:.7;}
.shell>*{position:relative;}

/* Sidebar */
.sidebar{background:color-mix(in oklab,var(--panel) 88%,transparent)!important;backdrop-filter:blur(18px);border-right:1px solid var(--line)!important;}
.sb-head{padding:18px 16px 16px;border-bottom:1px solid var(--line);}
.sb-brand{display:flex;align-items:center;gap:10px;}
.sb-ring{position:relative;width:44px;height:44px;flex-shrink:0;}
.sb-ring svg{width:44px;height:44px;transform:rotate(-90deg);}
.sb-ring circle{fill:none;stroke-width:4;}
.sb-ring .track{stroke:rgb(var(--fg-rgb) / 0.08);}
.sb-ring .val{stroke:var(--accent);stroke-linecap:round;transition:stroke-dashoffset .9s cubic-bezier(.2,.7,.1,1);}
.sb-ring b{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:800;color:var(--ink);font-variant-numeric:tabular-nums;}
.sb-title{font-family:'Playfair Display',serif;font-size:16px;font-weight:700;color:var(--ink);line-height:1.15;}
.sb-sub{font-size:11px;color:var(--muted);margin-top:3px;}
.sb-units{padding:10px 8px;flex:1;}
.sb-unit{width:100%;text-align:left;background:transparent;border:1px solid transparent;border-radius:10px;padding:9px 10px;cursor:pointer;display:flex;align-items:center;gap:10px;color:var(--ink-2);transition:background .2s,border-color .2s;font-family:inherit;}
.sb-unit:hover{background:rgb(var(--fg-rgb) / 0.04);}
.sb-unit.on{background:color-mix(in oklab,var(--u) 12%,transparent);border-color:color-mix(in oklab,var(--u) 30%,transparent);color:var(--ink);}
.sb-num{width:26px;height:26px;border-radius:8px;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:10.5px;font-weight:800;font-variant-numeric:tabular-nums;background:rgb(var(--fg-rgb) / 0.05);color:var(--muted);}
.sb-unit.on .sb-num{background:var(--u);color:var(--on-accent);}
.sb-unit.done .sb-num{background:color-mix(in oklab,var(--u) 22%,transparent);color:var(--u);}
.sb-name{flex:1;font-size:12.5px;font-weight:600;line-height:1.3;}
.sb-count{font-size:10.5px;color:var(--muted-2);font-variant-numeric:tabular-nums;}
.sb-lessons{position:relative;margin:4px 0 8px 22px;padding-left:14px;border-left:2px solid rgb(var(--fg-rgb) / 0.08);}
.sb-lesson{position:relative;width:100%;text-align:left;background:transparent;border:none;border-radius:8px;padding:7px 10px;cursor:pointer;color:var(--muted);font-size:12px;line-height:1.35;font-family:inherit;transition:background .2s,color .2s;}
.sb-lesson:hover{color:var(--ink);background:rgb(var(--fg-rgb) / 0.04);}
.sb-lesson::before{content:"";position:absolute;left:-21px;top:12px;width:10px;height:10px;border-radius:50%;background:var(--bg);border:2px solid rgb(var(--fg-rgb) / 0.2);transition:all .3s;}
.sb-lesson.done{color:var(--ink-2);}
.sb-lesson.done::before{background:var(--u);border-color:var(--u);}
.sb-lesson.on{color:var(--ink);font-weight:700;background:color-mix(in oklab,var(--u) 10%,transparent);}
.sb-lesson.on::before{border-color:var(--u);box-shadow:0 0 0 4px color-mix(in oklab,var(--u) 22%,transparent);}
.sb-foot{padding:12px;border-top:1px solid var(--line);display:flex;flex-direction:column;gap:8px;}
.sb-btn{flex:1;background:rgb(var(--fg-rgb) / 0.04);border:1px solid var(--line);border-radius:10px;padding:9px 10px;color:var(--ink-2);font-size:12px;font-weight:600;cursor:pointer;font-family:inherit;}
.sb-btn:hover{color:var(--ink);}

/* Theme switch */
.theme-btn{display:inline-flex;align-items:center;gap:7px;height:36px;padding:0 13px;border-radius:999px;border:1px solid var(--line);background:var(--card);color:var(--ink-2);font-size:12px;font-weight:700;cursor:pointer;box-shadow:var(--lift);transition:color .2s,transform .2s;}
.theme-btn.compact{width:36px;padding:0;justify-content:center;}
.theme-btn:hover{color:var(--ink);}
.theme-btn:active{transform:scale(.95);}
.theme-btn svg{width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;}

/* Topbar */
.menu-btn{display:none;}
.topbar{position:sticky;top:0;z-index:40;display:flex;align-items:center;gap:12px;padding:12px 24px 14px;background:color-mix(in oklab,var(--bg) 82%,transparent);backdrop-filter:blur(16px) saturate(1.2);-webkit-backdrop-filter:blur(16px) saturate(1.2);border-bottom:1px solid var(--line);font-size:12.5px;color:var(--muted);}
.topbar-text{flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.topbar-pct{font-weight:800;color:var(--ink);font-variant-numeric:tabular-nums;}
.topbar-bar{position:absolute;left:0;right:0;bottom:-1px;height:3px;background:transparent;}
.topbar-bar span{display:block;height:100%;border-radius:0 3px 3px 0;transition:width .8s ease;box-shadow:0 0 12px currentColor;}
.menu-btn{align-items:center;gap:6px;background:rgb(var(--accent-rgb) / 0.12);border:1px solid rgb(var(--accent-rgb) / 0.3);border-radius:10px;padding:8px 12px;color:var(--accent);font-size:12px;font-weight:700;cursor:pointer;flex-shrink:0;}
.narr{display:flex;align-items:center;gap:8px;flex-shrink:0;}
.narr-btn{background:var(--card);border:1px solid;border-radius:999px;padding:7px 13px;font-size:12px;font-weight:700;cursor:pointer;}
.narr-time{font-size:11px;color:var(--muted);font-variant-numeric:tabular-nums;}
.narr-rate{background:rgb(var(--fg-rgb) / 0.05);border:1px solid var(--line);border-radius:6px;color:var(--ink-2);font-size:11px;padding:3px 6px;cursor:pointer;}
.narr-bar{width:70px;height:3px;border-radius:3px;background:rgb(var(--fg-rgb) / 0.1);overflow:hidden;}
.narr-bar span{display:block;height:100%;}

/* Lesson page: a reading column with a cover, like a well-made course */
.lesson{max-width:760px;margin:0 auto;padding:40px 40px 90px;}
.cover{position:relative;overflow:hidden;margin-bottom:36px;padding:34px 34px 30px;border-radius:22px;background:linear-gradient(135deg,color-mix(in oklab,var(--unit) 20%,var(--card-solid)),var(--card-solid) 70%);border:1px solid color-mix(in oklab,var(--unit) 30%,transparent);box-shadow:var(--lift);}
.cover-num{position:absolute;right:-6px;top:-34px;font-family:'Playfair Display',serif;font-size:190px;font-weight:800;line-height:1;color:transparent;-webkit-text-stroke:1.5px color-mix(in oklab,var(--unit) 45%,transparent);pointer-events:none;user-select:none;}
.cover>*:not(.cover-num){position:relative;}
.cover-eyebrow{font-size:11px;font-weight:800;letter-spacing:.18em;text-transform:uppercase;color:var(--unit);}
.cover-title{font-family:'Playfair Display',serif;font-size:36px;font-weight:800;color:var(--ink);line-height:1.12;margin:10px 0 8px;max-width:15ch;}
.cover-tag{font-size:15px;color:var(--ink-2);font-style:italic;max-width:46ch;line-height:1.6;}
.cover-list{display:flex;flex-wrap:wrap;gap:6px;margin-top:20px;}
.cover-list span{font-size:11.5px;padding:5px 10px;border-radius:999px;background:rgb(var(--fg-rgb) / 0.05);border:1px solid var(--line);color:var(--ink-2);}
.lhead{margin-bottom:28px;}
.lhead-eyebrow{display:flex;align-items:center;gap:10px;flex-wrap:wrap;font-size:11px;font-weight:800;letter-spacing:.16em;text-transform:uppercase;color:var(--muted);}
.lhead-eyebrow i{width:22px;height:2px;border-radius:2px;background:var(--unit);}
.lhead-title{font-family:'Playfair Display',serif;font-size:40px;font-weight:700;color:var(--ink);line-height:1.12;margin:12px 0 0;letter-spacing:-0.01em;}
.lhead-meta{display:flex;gap:8px;flex-wrap:wrap;margin-top:14px;}
.lhead-rule{height:1px;margin-top:26px;background:linear-gradient(90deg,var(--unit),transparent 60%);opacity:.5;}
.lnav{margin-top:48px;display:grid;grid-template-columns:1fr 1fr;gap:12px;}
.lnav button{text-align:left;padding:16px 18px;border-radius:16px;border:1px solid var(--line);background:var(--card);box-shadow:var(--lift);cursor:pointer;font-family:inherit;color:var(--ink);transition:transform .25s cubic-bezier(.2,.7,.1,1),border-color .25s;}
.lnav button:hover:not(:disabled){transform:translateY(-2px);border-color:color-mix(in oklab,var(--unit) 50%,transparent);}
.lnav button:disabled{opacity:.45;cursor:default;box-shadow:none;}
.lnav small{display:block;font-size:10.5px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:var(--muted);margin-bottom:5px;}
.lnav strong{display:block;font-size:15px;line-height:1.35;}
.lnav .next{text-align:right;background:linear-gradient(135deg,color-mix(in oklab,var(--unit) 16%,var(--card-solid)),var(--card-solid));border-color:color-mix(in oklab,var(--unit) 40%,transparent);}
.lnav .next small{color:var(--unit);}
.lnav-dots{display:flex;gap:5px;justify-content:center;margin-top:40px;}
.lnav-dots button{height:6px;border-radius:3px;border:none;cursor:pointer;padding:0;transition:all .3s;}
.lock-note{grid-column:1/-1;text-align:center;font-size:13px;color:var(--muted);}

/* Welcome */
.welcome{min-height:100vh;background:var(--bg);font-family:'Plus Jakarta Sans',sans-serif;color:var(--ink);position:relative;overflow:hidden;}
.welcome::before{content:"";position:absolute;inset:0;pointer-events:none;background:radial-gradient(50% 45% at 20% 0%,rgb(var(--accent-rgb) / 0.18),transparent 70%),radial-gradient(40% 40% at 100% 100%,rgb(var(--accent-rgb) / 0.08),transparent 70%);}
.w-top{position:relative;display:flex;align-items:center;justify-content:space-between;padding:20px 32px;}
.w-brand{display:flex;align-items:center;gap:10px;font-weight:800;font-size:14px;}
.w-brand i{width:30px;height:30px;border-radius:9px;background:var(--accent);color:var(--on-accent);display:flex;align-items:center;justify-content:center;font-style:normal;font-family:'Playfair Display',serif;font-size:16px;}
.w-badge{font-size:11px;font-weight:700;color:var(--muted);border:1px solid var(--line);border-radius:999px;padding:5px 11px;}
.w-grid{position:relative;max-width:1180px;margin:0 auto;padding:40px 32px 80px;display:grid;grid-template-columns:1.05fr 1fr;gap:56px;align-items:start;}
.w-eyebrow{font-size:11px;letter-spacing:.3em;color:var(--accent);font-weight:800;}
.w-title{font-family:'Playfair Display',serif;font-size:64px;font-weight:800;line-height:1.02;letter-spacing:-0.02em;margin:18px 0 14px;}
.w-title em{color:var(--accent);font-style:italic;font-weight:700;}
.w-lede{font-size:17px;line-height:1.75;color:var(--ink-2);max-width:48ch;}
.w-cta{display:flex;gap:12px;flex-wrap:wrap;margin-top:30px;}
.w-primary{background:var(--accent);color:var(--on-accent);border:none;border-radius:14px;padding:15px 28px;font-size:15px;font-weight:800;cursor:pointer;box-shadow:0 14px 34px -14px rgb(var(--accent-rgb) / 0.8);transition:transform .2s;}
.w-primary:hover{transform:translateY(-2px);}
.w-ghost{background:transparent;color:var(--ink);border:1px solid var(--line);border-radius:14px;padding:15px 22px;font-size:14px;font-weight:700;cursor:pointer;}
.w-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-top:36px;max-width:520px;}
.w-stats div{padding:14px 12px;border-radius:14px;background:var(--card);border:1px solid var(--line);box-shadow:var(--lift);}
.w-stats b{display:block;font-family:'Playfair Display',serif;font-size:28px;color:var(--ink);}
.w-stats span{font-size:11px;color:var(--muted);font-weight:600;}
.w-note{margin-top:16px;font-size:12px;color:var(--muted-2);}
.w-resume{margin-top:26px;padding:18px 20px;border-radius:16px;background:var(--card);border:1px solid rgb(var(--accent-rgb) / 0.35);box-shadow:var(--lift);display:flex;align-items:center;gap:16px;flex-wrap:wrap;}
.w-map{border-radius:22px;background:var(--card);border:1px solid var(--line);box-shadow:var(--lift);padding:10px;}
.w-map h2{font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:var(--muted);font-weight:800;margin:10px 12px 8px;}
.w-unit{display:grid;grid-template-columns:34px 1fr auto;align-items:center;gap:12px;padding:10px 12px;border-radius:12px;transition:background .2s;}
.w-unit:hover{background:rgb(var(--fg-rgb) / 0.04);}
.w-unit .n{font-family:'Playfair Display',serif;font-size:18px;font-weight:800;color:var(--u);font-variant-numeric:tabular-nums;}
.w-unit .t{font-size:13.5px;font-weight:600;color:var(--ink);line-height:1.3;}
.w-unit .s{font-size:11.5px;color:var(--muted);margin-top:2px;}
.w-unit .bar{width:54px;height:4px;border-radius:4px;background:rgb(var(--fg-rgb) / 0.08);overflow:hidden;}
.w-unit .bar i{display:block;height:100%;background:var(--u);}

/* Reading typography for generated lessons */
.md p,.md li{font-size:16px!important;line-height:1.85!important;color:var(--ink-2)!important;}
.md h2{font-size:26px!important;}
.md h3{font-size:20px!important;margin-top:28px!important;}
.md blockquote{font-style:normal!important;font-size:16px!important;background:color-mix(in oklab,var(--unit,var(--accent)) 9%,transparent);border-radius:0 14px 14px 0;padding:14px 18px!important;color:var(--ink)!important;}

/* Responsive */
@media (max-width: 960px){ .w-grid{grid-template-columns:1fr;gap:36px;} .w-title{font-size:46px;} }
@media (max-width: 880px){
  .sidebar{position:fixed!important;left:0;top:0;bottom:0;z-index:100;transform:translateX(-100%);transition:transform 0.25s ease;width:290px!important;}
  .sidebar.open{transform:translateX(0);}
  .sidebar-backdrop{position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:99;}
  .menu-btn{display:flex!important;}
  .lesson{padding:22px 18px 70px;}
  .cover{padding:24px 20px;border-radius:18px;}
  .cover-num{font-size:120px;top:-14px;right:-10px;opacity:.45;}
  .cover-title{font-size:27px;}
  .lhead-title{font-size:29px;}
  .lnav{grid-template-columns:1fr;}
  .lnav .next{order:-1;}
  .topbar{padding:10px 14px 12px;} .topbar-title{display:none;} .narr-time,.narr-bar{display:none;}
  .w-top{padding:16px 18px;} .w-grid{padding:20px 18px 60px;} .w-title{font-size:40px;} .w-stats{grid-template-columns:repeat(2,1fr);}
}
@media (prefers-reduced-motion: reduce){ .fu,.fu2{animation:none;} .topbar-bar span,.sb-ring .val{transition:none;} body{transition:none;} }
`;

// ═══════════════════════════════════════════════════════════════════════════════
// COURSE STRUCTURE (unchanged from your original)
// ═══════════════════════════════════════════════════════════════════════════════
const PLATFORMS = {
  text:[
    {n:"ChatGPT",url:"https://chat.openai.com",c:"#10A37F",e:"",d:"Best all-rounder. Free plan. Start here!"},
    {n:"Claude",url:"https://claude.ai",c:"#CC785C",e:"",d:"Brilliant for writing, analysis & long docs"},
    {n:"Gemini",url:"https://gemini.google.com",c:"#4285F4",e:"",d:"Google AI. Great for research + web access"},
    {n:"Copilot",url:"https://copilot.microsoft.com",c:"#0078D4",e:"⬡",d:"Microsoft AI. Built into Office & Windows"},
    {n:"Perplexity",url:"https://www.perplexity.ai",c:"#20B2AA",e:"◈",d:"AI + live web search. Best for research"},
    {n:"Grok",url:"https://grok.x.ai",c:"#888",e:"⊕",d:"xAI. Real-time info, bold answers"},
  ],
  image:[
    {n:"Midjourney",url:"https://www.midjourney.com",c:"#D9B36C",e:"",d:"Most popular. Stunning artistic images"},
    {n:"DALL·E 3",url:"https://chat.openai.com",c:"#10A37F",e:"",d:"Inside ChatGPT Plus. Great for quick gen"},
    {n:"Leonardo AI",url:"https://leonardo.ai",c:"#F59E0B",e:"",d:"Free credits daily. Excellent characters"},
    {n:"Adobe Firefly",url:"https://firefly.adobe.com",c:"#FF6B35",e:"",d:"Commercially safe. Great for designers"},
    {n:"Ideogram",url:"https://ideogram.ai",c:"#D9B36C",e:"",d:"Best for images with text. Free plan"},
    {n:"Stable Diffusion",url:"https://stability.ai",c:"#FF6B6B",e:"",d:"Open-source. Free & customisable"},
  ],
  video:[
    {n:"Runway ML",url:"https://runwayml.com",c:"#00D2D3",e:"",d:"Industry standard. Text-to-video"},
    {n:"Sora",url:"https://sora.com",c:"#10A37F",e:"",d:"OpenAI video model. Highly realistic"},
    {n:"Pika Labs",url:"https://pika.art",c:"#D9B36C",e:"",d:"Fast video generation. Free tier"},
    {n:"Kling AI",url:"https://klingai.com",c:"#FF6B9D",e:"",d:"High quality text or image to video"},
    {n:"HeyGen",url:"https://heygen.com",c:"#FF9F43",e:"",d:"AI avatar videos. Great for business"},
    {n:"Synthesia",url:"https://synthesia.io",c:"#4285F4",e:"",d:"Professional AI presenter videos"},
  ],
  audio:[
    {n:"ElevenLabs",url:"https://elevenlabs.io",c:"#FF6B35",e:"",d:"Best text-to-speech. Clone your voice"},
    {n:"Suno",url:"https://suno.ai",c:"#D9B36C",e:"",d:"Full AI music from a text prompt"},
    {n:"Udio",url:"https://udio.com",c:"#00D2D3",e:"",d:"High-quality AI music. Remix & extend"},
    {n:"Murf AI",url:"https://murf.ai",c:"#10A37F",e:"",d:"Professional voiceovers for videos"},
    {n:"Adobe Podcast",url:"https://podcast.adobe.com",c:"#FF6B35",e:"",d:"AI audio cleanup. Studio-quality sound"},
  ],
  code:[
    {n:"GitHub Copilot",url:"https://github.com/features/copilot",c:"#555",e:"",d:"AI pair programmer in VS Code"},
    {n:"Cursor",url:"https://cursor.sh",c:"#D9B36C",e:"⌨️",d:"AI-first code editor. Chat your codebase"},
    {n:"bolt.new",url:"https://bolt.new",c:"#D9B36C",e:"",d:"Full-stack apps from one prompt"},
    {n:"Replit AI",url:"https://replit.com",c:"#FF6B35",e:"",d:"Build & deploy with AI. Beginner friendly"},
    {n:"v0 by Vercel",url:"https://v0.dev",c:"#333",e:"",d:"Generate UI components from descriptions"},
  ],
  automation:[
    {n:"Zapier",url:"https://zapier.com",c:"#FF4A00",e:"",d:"Connect 7,000+ apps without coding"},
    {n:"Make",url:"https://make.com",c:"#B8904A",e:"",d:"Visual workflow automation. Powerful"},
    {n:"n8n",url:"https://n8n.io",c:"#EA4B71",e:"",d:"Open-source. Connect anything"},
    {n:"Notion AI",url:"https://notion.so",c:"#555",e:"",d:"AI inside your notes & project tools"},
    {n:"Airtable AI",url:"https://airtable.com",c:"#FCB400",e:"",d:"AI-powered databases & spreadsheets"},
  ],
  agents:[
    {n:"AutoGPT",url:"https://agpt.co",c:"#10A37F",e:"",d:"Autonomous AI for multi-step tasks"},
    {n:"CrewAI",url:"https://crewai.com",c:"#FF6B6B",e:"",d:"Multiple AI agents working as a team"},
    {n:"Relevance AI",url:"https://relevanceai.com",c:"#00D2D3",e:"",d:"Build custom AI agents, no code"},
    {n:"Lindy",url:"https://lindy.ai",c:"#D9B36C",e:"",d:"Personal AI agents for email & tasks"},
    {n:"AgentGPT",url:"https://agentgpt.reworkd.ai",c:"#D9B36C",e:"",d:"Web-based autonomous AI agent"},
  ],
};

const UNITS = [
  {id:1,emoji:"01",title:"Welcome: AI From Zero",color:"#D9B36C",dark:"#17150F",tagline:"No jargon. No fear. Just you, me, and AI getting acquainted.",
    lessons:[
      {id:"1a",title:"What Is AI, Really?",type:"ai_content",topic:"Explain what AI is to a complete beginner. Cover: what AI actually is (simple analogy), how it learned, why the way you prompt it matters, and the 7 types of AI (text, image, video, audio, code, agents, automation). Warm, personal, humanised tone. Include a reflection question at the end."},
      {id:"1b",title:"The AI Landscape: Your Map",type:"platforms"},
      {id:"1c",title:"Your First AI Conversation",type:"ai_content",topic:"Write a step-by-step walkthrough for the learner's very first AI conversation. Include: where to sign up, how the interface works (6 concrete steps), what to type first, how to give follow-up feedback, and why context matters. End with a practical exercise: have a 10-message conversation about something real in her life."},
    ]
  },
  {id:2,emoji:"02",title:"Text Prompting: The Foundation",color:"#D9B36C",dark:"#17150F",tagline:"Master this and you master 80% of everything AI can do.",
    lessons:[
      {id:"2a",title:"Anatomy of a Perfect Prompt",type:"ai_content",topic:"Teach the learner the 6 elements of a perfect prompt (Role, Task, Context, Format, Tone, Constraints). For each: explain what it is, show a weak vs strong example, explain why it matters. Use real-world examples relevant to an African professional. End with a reflection exercise."},
      {id:"2b",title:"8 Core Prompting Techniques",type:"techniques"},
      {id:"2c",title:"Prompt Template Library",type:"templates"},
      {id:"2d",title:"Advanced Text Techniques",type:"ai_content",topic:"Teach the learner 5 advanced prompting techniques: Prompt Chaining, Devil's Advocate Prompting, Persona Stacking, Calibration Prompting (asking AI to rate its own confidence), and Contextual Memory Refresh. For each: what it is, when to use it, a concrete example. End with a chain-prompting exercise."},
    ]
  },
  {id:3,emoji:"03",title:"Image Generation Prompting",color:"#D9B36C",dark:"#17150F",tagline:"Turn words into stunning visuals, zero design skills required.",
    lessons:[
      {id:"3a",title:"How Image AI Works",type:"ai_content",topic:"Explain to the learner how image AI works (simple), then teach the image prompt formula: Subject + Style + Setting + Lighting + Mood + Technical Specs. Show 5 professional image prompts with this formula: headshot, product photography, logo concept, authentic market scene, presentation background. Include quality booster terms and negative prompts. End with a reflection exercise."},
      {id:"3b",title:"Image Prompts by Use Case",type:"ai_content",topic:"Give the learner a comprehensive guide to image prompting for real business use cases: social media content, brand photography, marketing campaigns, AI character creation (consistent characters), and presentation visuals. Include complete copy-paste prompts for each. Mention Midjourney, DALL-E 3, Leonardo AI and which is best for each use case."},
      {id:"3c",title:"Image AI Platforms",type:"platforms_section",category:"image",tips:["Try DALL·E 3 via ChatGPT: Type 'generate an image of...' with your full prompt","Try Leonardo AI (free daily credits): Great for product shots and portraits","Try Ideogram (free): Best if you need readable text inside your image","Try Adobe Firefly (free): Best for commercially safe images for business use"]},
    ]
  },
  {id:4,emoji:"04",title:"Video Generation Prompting",color:"#D9B36C",dark:"#17150F",tagline:"Create professional video content from a single sentence.",
    lessons:[
      {id:"4a",title:"How Video AI Works",type:"ai_content",topic:"Teach the learner how video AI works: types (text-to-video, image-to-video, video-to-video, AI avatars). Teach the video prompt formula: Scene + Camera Movement + Style + Lighting + Pacing. List camera movement terms professionals use. Show 5 real video prompts: social media short, corporate opener, AI avatar script, educational animation, music video concept. Include current limitations. End with a reflection exercise."},
      {id:"4b",title:"Video AI Platforms",type:"platforms_section",category:"video",tips:["Try Pika Labs (free): Animate any image or generate from text prompt","Try Runway ML (free credits): Use 'text to video' with a cinematic prompt","Try HeyGen (free trial): Write a 60-second script and create an AI avatar video","Try Kling AI (free tier): Excellent quality image-to-video results"]},
    ]
  },
  {id:5,emoji:"05",title:"Audio & Voice AI",color:"#D9B36C",dark:"#17150F",tagline:"Generate music, voiceovers, and professional audio with AI.",
    lessons:[
      {id:"5a",title:"Text-to-Speech & Voice Cloning",type:"ai_content",topic:"Teach the learner all about voice AI: what it can do, how to format text for natural AI speech (pauses, emphasis, rhythm), show a complete voiceover script example optimised for AI TTS, explain voice cloning with ElevenLabs (what it is, how it works, practical uses). End with an exercise: write a 60-second voiceover script."},
      {id:"5b",title:"AI Music Generation",type:"ai_content",topic:"Teach the learner how to generate music with Suno and Udio. The music prompt formula: Genre + Mood + Instruments + Vocal Style + Tempo + Theme. Show 4 complete music prompts: Afrobeats, corporate background, podcast intro, documentary score. Explain practical business uses (no copyright issues). Explain Suno's custom mode for writing lyrics. End with a reflection exercise."},
      {id:"5c",title:"Audio AI Platforms",type:"platforms_section",category:"audio",tips:["Try ElevenLabs (free): Type any paragraph and hear it in a realistic voice","Try Suno (free): Write a music prompt and generate a full song in 30 seconds","Try Udio (free): Try the same prompt in both Suno and Udio to compare","Try Adobe Podcast (free): Upload a voice recording and hear the AI noise removal"]},
    ]
  },
  {id:6,emoji:"06",title:"Code & Technical AI",color:"#D9B36C",dark:"#17150F",tagline:"You don't need to be a developer to build with AI code tools.",
    lessons:[
      {id:"6a",title:"Code AI for Non-Developers",type:"ai_content",topic:"Reassure the learner she doesn't need to code. Show what code AI can do for non-developers: Excel/Google Sheets formulas, email automation scripts, simple web pages, data analysis. Give the Non-Developer Code Prompt Formula (always ask for: explanation in plain English, where to install, how to test). Show 3 complete worked examples with full prompts."},
      {id:"6b",title:"AI for Data Analysis",type:"ai_content",topic:"Teach the learner how to use AI as a powerful data analyst. Step-by-step approach: give data, ask layered questions, request visualisation recommendations, ask for business implications. Show a complete Sales Analysis template and a Customer Feedback Analysis template with full prompts. End with a reflection exercise about her own data."},
      {id:"6c",title:"Code AI Platforms",type:"platforms_section",category:"code",tips:["Try Claude or ChatGPT: Ask it to write an Excel formula for a calculation you do manually","Try bolt.new (free): Describe a simple app idea and watch it build the whole thing","Try Replit AI (free): Tell it you're not a developer and ask it to build something small","Try v0.dev (free): Describe a web page and see it generate the visual design"]},
    ]
  },
  {id:7,emoji:"07",title:"AI Automation & Workflows",color:"#D9B36C",dark:"#17150F",tagline:"Build systems that work for you while you sleep.",
    lessons:[
      {id:"7a",title:"What Is AI Automation?",type:"ai_content",topic:"Explain AI automation to the learner in plain English. Cover: what automation is (trigger + AI step + action), 4 real automation examples (email management, social media, lead management, weekly reporting). Then teach how to prompt Zapier's AI builder and how to write AI step system prompts inside automations. Include the key principle about JSON outputs. End with a reflection exercise."},
      {id:"7b",title:"Automation Platforms",type:"platforms_section",category:"automation",tips:["Try Zapier (free): Connect Gmail to Google Sheets, auto-log every email you receive","Try Notion AI (free): Write rough meeting notes, ask AI to turn them into action items","Try Make.com (free): Build a visual workflow connecting 2 apps you use daily","Try Airtable AI (free): Create a database, use AI to auto-fill fields based on your data"]},
    ]
  },
  {id:8,emoji:"08",title:"AI Agents: The Next Frontier",color:"#D9B36C",dark:"#17150F",tagline:"AI that doesn't just answer, it acts.",
    lessons:[
      {id:"8a",title:"What Are AI Agents?",type:"ai_content",topic:"Explain AI agents to the learner: chatbot vs agent difference with a real worked example (7-step task). Types of agents: single, multi-agent systems, personal agents. How to prompt an agent effectively: Goal, Context, Tools, Success Criteria, Guardrails, with a complete worked example. End with a reflection exercise designing her own agent task."},
      {id:"8b",title:"RAG & Custom Knowledge Bases",type:"ai_content",topic:"Explain RAG (Retrieval-Augmented Generation) to the learner in plain English. Why it matters: AI knows general things but not YOUR company's specific data. Show 4 practical examples: business FAQ bot, personal research assistant, HR policy bot, professional guidelines assistant. List tools: ChatGPT file upload, Claude, Notion AI, Custom GPTs. The critical RAG prompt phrase. End with a reflection exercise."},
      {id:"8c",title:"Agent AI Platforms",type:"platforms_section",category:"agents",tips:["Try Perplexity AI: Research a topic and watch how it browses the web in real time","Try Claude with a document: Upload a PDF and ask it detailed questions about the content","Try ChatGPT Custom GPTs: Explore the GPT Store and find one tailored to your field","Try Lindy (free trial): Set up a personal AI agent to help draft email responses"]},
    ]
  },
  {id:9,emoji:"09",title:"Real-World Industry Applications",color:"#D9B36C",dark:"#17150F",tagline:"Exactly how professionals in every field use AI right now.",
    lessons:[
      {id:"9a",title:"AI for Business & Entrepreneurship",type:"industry_templates",industry:"Business & Entrepreneurship",tasks:["Market Research (Ghana-specific)","Investor Pitch Deck Narrative (10 slides)","Executive Summary for Business Plan","Competitor Analysis","Go-to-Market Strategy"]},
      {id:"9b",title:"AI for Marketing & Communications",type:"industry_templates",industry:"Marketing & Communications",tasks:["90-Day Marketing Strategy","Content Repurposing Engine (7 formats from 1 piece)","Brand Voice Guide","Social Media Calendar (2 weeks)","Email Campaign Sequence"]},
      {id:"9c",title:"AI for HR & People Management",type:"industry_templates",industry:"HR & People Management",tasks:["Job Description Writer","Interview Question Set","Difficult Performance Conversation Script","Employee Onboarding Plan","Culture Survey Design"]},
      {id:"9d",title:"AI for Finance & Personal Planning",type:"industry_templates",industry:"Finance & Personal Planning",tasks:["Personal Budget Builder","Financial Report Analysis","Contract First-Pass Review","Business Case for Investment","Salary Negotiation Prep"]},
    ]
  },
  {id:10,emoji:"10",title:"AI Safety, Ethics & Critical Thinking",color:"#D9B36C",dark:"#17150F",tagline:"Great power requires great responsibility.",
    lessons:[
      {id:"10a",title:"Hallucinations, Bias & Limitations",type:"ai_content",topic:"Teach the learner honestly about AI's flaws: hallucinations (what they are, real examples, why they happen), bias in AI (gender, racial, cultural, especially relevant for African contexts), the full list of AI limitations. The verification rule for professional use. End with a reflection exercise about a risky scenario in her work."},
      {id:"10b",title:"Privacy & What NOT to Share",type:"ai_content",topic:"Give the learner a practical privacy guide for AI use. What never to share (passwords, IDs, client info, company secrets). Why (data storage, training use). The public notice board test. At-work guidelines. How to anonymise sensitive information with before/after examples. Deepfakes awareness. End with a reflection on her current AI use habits."},
      {id:"10c",title:"AI Ethics: The Big Picture",type:"ai_content",topic:"Walk the learner through the major AI ethical questions: transparency in AI use, bias in decisions affecting people, AI's impact on jobs (especially in Africa), consent and attribution, environmental cost, power concentration in Western tech companies. Keep it grounded and practical. End by empowering her: she has values, context, and empathy AI will never have. That's the edge."},
    ]
  },
  {id:11,emoji:"11",title:"Your AI Career & Future",color:"#D9B36C",dark:"#17150F",tagline:"How to turn these skills into real professional opportunities.",
    lessons:[
      {id:"11a",title:"AI Career Opportunities",type:"ai_content",topic:"Show the learner the real AI career opportunities emerging right now: Prompt Engineer, AI Automation Specialist, AI Content Strategist, AI Trainer/Educator (especially the African opportunity), AI Consultant for SMEs. For each: what they do, who hires them, can they freelance. Then explain how AI skills are ADDITIVE to her current career, and how to position herself on LinkedIn starting this week."},
      {id:"11b",title:"Building Your AI Portfolio",type:"ai_content",topic:"Teach the learner how to build an AI portfolio that opens doors: Prompt Library, Before/After showcases, Workflow Diagrams, Case Studies, her course certificate. Where to showcase it (LinkedIn, personal website via bolt.new). The LinkedIn strategy: one practical AI post per week for 6 months. End with an exercise: plan 3 portfolio pieces."},
      {id:"11c",title:"Staying Current in AI",type:"ai_content",topic:"Give the learner a sustainable strategy for staying current in AI without being overwhelmed: 3-source strategy (The Rundown AI, AI Tool Report, LinkedIn), practice-first rule (2 hours using for every 1 hour reading), monthly audit (30 minutes). Close with a powerful, personal message about the edge she now has and an encouragement to keep going."},
    ]
  },
  {id:12,emoji:"12",title:"Final Project & Certification",color:"#D9B36C",dark:"#17150F",tagline:"Demonstrate everything you've learned. Earn your certificate.",
    lessons:[
      {id:"12a",title:"Final Project: Part 1: AI Toolkit",type:"final",minLen:300,instructions:"Create your Personal AI Toolkit:\n\nA) PROMPT LIBRARY: Write 5 reusable prompt templates for tasks you actually face. Each must use all 6 elements with [BRACKETS] for customisation. Cover at least 3 categories.\n\nB) AI STACK: Pick 8 AI tools you'll actually use. For each: name, URL, what you'll use it for, why this one, your first project.\n\nC) TOP 3 TECHNIQUES: From all the techniques you learned, which 3 are most powerful for you? Explain why and give a real use case each.\n\nD) FIRST AUTOMATION: Describe one real automation you'll build in 30 days. Trigger → AI Step → Action.",placeholder:"A) MY PROMPT LIBRARY:\n\nTemplate 1: [Task]:\nRole: You are a...\nTask: ...\nContext: ...\nFormat: ...\nTone: ...\nConstraints: ...\n\n(add all 5 templates)\n\n---\nB) MY AI STACK:\n1. [Tool name] | [Use] | [Why] | [First project]\n(add all 8)\n\n---\nC) MY TOP 3 TECHNIQUES:\n1. [Name]: Why: ... Real use case: ...\n\n---\nD) MY FIRST AUTOMATION:\nTrigger: ...\nAI Step: ...\nAction: ..."},
      {id:"12b",title:"Final Project: Part 2: Applied Challenge",type:"final",minLen:200,instructions:"Multi-modal AI campaign challenge. Use at least 4 AI tools.\n\nTHE CHALLENGE: Create a mini campaign for something you care about (business idea, cause, personal brand, event).\n\n1. STRATEGY: Write a full prompt for a 30-day awareness strategy. Paste the prompt + summarise output.\n\n2. VISUAL IDENTITY: Write 2 image prompts (logo concept + key visual). Describe what you got.\n\n3. CONTENT: Use the repurposing template to create 3 pieces of content from one core message.\n\n4. AUTOMATION: Describe how you'd automate this campaign. Trigger → AI step → Action.\n\n5. VIDEO CONCEPT: Write the prompt for a 15-second promotional video.\n\nDocument everything: prompts, outputs, what worked, what didn't.",placeholder:"MY CAMPAIGN: [Name & 1-sentence description]\n\n1. STRATEGY PROMPT:\n...\nSummary of AI output:\n...\n\n2. IMAGE PROMPTS:\nLogo: ...\nKey visual: ...\nWhat I got: ...\n\n3. CONTENT (3 pieces):\n...\n\n4. AUTOMATION PLAN:\nTrigger: ...\nAI Step: ...\nAction: ...\n\n5. VIDEO PROMPT:\n...\n\nWHAT WORKED / WHAT DIDN'T:\n..."},
      {id:"12c",title:"Final Project: Part 3: Your Reflection",type:"final",minLen:150,instructions:"Write a personal letter from where you are now to where you're going. At least 250 words. Be honest and personal.\n\nAnswer these in your own voice:\n1. Before this course, what did you think AI was? What were you afraid of?\n2. What was the most surprising thing you learned?\n3. Which technique will you use most in the next 90 days, and why?\n4. What do you still find challenging? (Naming gaps is how you fill them.)\n5. What ONE thing will you do differently in your work starting this week?\n6. Where do you see yourself professionally in 12 months if you apply this consistently?\n7. What would you teach first to a friend who's nervous about AI?\n8. What would you tell yourself the day before you started this course?",placeholder:"Dear Future "+NAME+",\n\nBefore this course, I honestly thought AI was...\n\nThe most surprising thing I learned was...\n\nThe technique I'll use most is...\n\nI'm still unsure about...\n\nStarting this week, I will...\n\nIn 12 months I see myself...\n\nIf I had to teach one thing first, it would be...\n\nTo myself before this course I'd say...\n\nWith love and confidence,\n"+NAME},
    ]
  },
];

const TECHNIQUE_NAMES = [
  {name:"1. Zero-Shot Prompting",emoji:""},
  {name:"2. Few-Shot Prompting",emoji:""},
  {name:"3. Chain of Thought",emoji:""},
  {name:"4. Role Prompting",emoji:""},
  {name:"5. Iterative Prompting",emoji:""},
  {name:"6. Constraint Prompting",emoji:""},
  {name:"7. Template Prompting",emoji:""},
  {name:"8. Meta Prompting",emoji:""},
];

// ═══════════════════════════════════════════════════════════════════════════════
// FALLBACK CONTENT, used when no API key, so course works fully offline
// ═══════════════════════════════════════════════════════════════════════════════
function fallbackLesson(topic) {
  return `**This lesson is coming soon in the preview.**\n\n> ${topic}\n\n##  Reflection Exercise\nWhat is one task in your daily work you'd love AI to help with?`;
}
function fallbackLessonOld(topic) {
  return `**This lesson is ready to be generated by Claude.**

To get a fully personalised lesson written just for you, add your Anthropic API key using the **" API Key"** button in the top-right.

In the meantime, here is the topic this lesson will cover:

> ${topic}

---

**Without an API key, you can still:**

- Explore every platform card and visit the real AI tools
- Read every prompt template in Units 2 and 9
- Compare the 8 prompting techniques (descriptions cached when API is on)
- Complete and save every reflection and final project
- Earn your certificate

Your progress is saved automatically in this browser. 

##  Reflection Exercise
What is one task in your daily work that you'd love AI to help you with? Write it down, we'll come back to this throughout the course.`;
}

function fallbackTechnique(name) {
  return `**${name}**\n\nThis technique is part of the full course.`;
}
function fallbackTechniqueOld(name) {
  return `**${name}**, full lesson available once you add your Anthropic API key.

This technique is one of the 8 core methods you'll use every day. Add your key with the ** API Key** button to unlock the full lesson, including a weak-vs-strong comparison and a personalised African-context example.

BAD: write something about marketing
GOOD: (Full example loads once API key is provided)`;
}

function fallbackIndustry(lesson) {
  return lesson.tasks.map(t => ({
    task: t,
    prompt: `You are a professional ${lesson.industry} expert.

Task: ${t}

Context: [DESCRIBE YOUR SITUATION]
Goal: [WHAT YOU WANT TO ACHIEVE]
Constraints: [ANY LIMITATIONS, time, budget, audience]

Please provide a comprehensive, actionable response tailored to my specific context. Include:
1. A clear recommendation
2. Concrete next steps
3. Anything important I haven't asked about`
  }));
}

// ═══════════════════════════════════════════════════════════════════════════════
// CLAUDE API CALL, with browser support + caching + fallback
// ═══════════════════════════════════════════════════════════════════════════════
async function askClaude(systemPrompt, userMsg, maxTokens=800, cacheKey=null) {
  await new Promise(r => setTimeout(r, 300));
  if (cacheKey && PREVIEW[cacheKey]) return personalise(PREVIEW[cacheKey]);
  if (!cacheKey) return previewCoach(userMsg);
  throw new Error("PREVIEW");
}

// ═══════════════════════════════════════════════════════════════════════════════
// UI ATOMS
// ═══════════════════════════════════════════════════════════════════════════════
const Tag = ({children,color:c0="#D9B36C",small}) => { const color = tone(c0); return (
  <span style={{display:"inline-block",fontSize:small?9:10,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",padding:small?"2px 8px":"3px 11px",borderRadius:20,background:color+"20",color,border:`1px solid ${color}40`}}>{children}</span>
); };

const Btn = ({children,onClick,disabled,color:c0="#D9B36C",outline,small,full,style={}}) => { const color = tone(c0); return (
  <button onClick={onClick} disabled={disabled} style={{background:outline?"transparent":disabled?"rgb(var(--fg-rgb) / 0.05)":`linear-gradient(135deg,${color},${color}cc)`,border:outline?`1px solid ${color}55`:"none",borderRadius:10,padding:small?"7px 16px":"11px 26px",color:disabled?"var(--faint)":outline?color:"var(--on-accent)",fontSize:small?11:13,fontWeight:700,letterSpacing:"0.04em",cursor:disabled?"default":"pointer",transition:"all 0.2s",fontFamily:"'Plus Jakarta Sans',sans-serif",width:full?"100%":"auto",...style}}>{children}</button>
); };

const Card = ({children,style={}}) => (
  <div style={{background:"var(--card)",border:"1px solid var(--line)",borderRadius:16,padding:20,boxShadow:"var(--lift)",...style}}>{children}</div>
);

const SL = ({children}) => (
  <div style={{fontSize:10,fontWeight:700,letterSpacing:"0.15em",color:"var(--muted-2)",textTransform:"uppercase",marginBottom:10}}>{children}</div>
);

const Code = ({children}) => (
  <div style={{background:"rgba(0,0,0,0.4)",border:"1px solid rgb(var(--fg-rgb) / 0.06)",borderRadius:10,padding:"14px 16px",fontFamily:"'JetBrains Mono',monospace",fontSize:12,lineHeight:1.85,color:"var(--code-ink)",whiteSpace:"pre-wrap",overflowX:"auto"}}>{children}</div>
);

function Spinner({color:c0="#D9B36C"}) {
  const color = tone(c0);
  return <div className="spin" style={{width:20,height:20,borderRadius:"50%",border:`2px solid ${color}33`,borderTop:`2px solid ${color}`,display:"inline-block"}}/>;
}

// ═══════════════════════════════════════════════════════════════════════════════
// MARKDOWN RENDERER
// ═══════════════════════════════════════════════════════════════════════════════
function MD({text,color}) {
  if(!text) return null;
  const html = text
    .replace(/\*\*(.*?)\*\*/g, '<strong style="color:var(--ink);font-weight:700">$1</strong>')
    .replace(/`(.*?)`/g, '<code style="background:rgb(var(--fg-rgb) / 0.08);padding:2px 6px;border-radius:4px;font-family:JetBrains Mono,monospace;font-size:11px">$1</code>');
  return (
    <div className="md">
      {html.split("\n\n").map((para,i) => {
        const p = para.trim();
        if(!p) return null;
        if(p.startsWith("---")) return <hr key={i} style={{border:"none",borderTop:"1px solid rgb(var(--fg-rgb) / 0.07)",margin:"18px 0"}}/>;
        if(p.startsWith(">")) return (
          <blockquote key={i} style={{borderLeft:`3px solid ${color}`,paddingLeft:16,margin:"14px 0",color:"var(--ink-2)",fontStyle:"italic",fontSize:14,lineHeight:1.7}}>
            <span dangerouslySetInnerHTML={{__html:p.slice(1).trim()}}/>
          </blockquote>
        );
        if(p.startsWith("# ")) return <h2 key={i} style={{fontFamily:"'Playfair Display',serif",fontSize:22,color:"var(--ink)",margin:"20px 0 10px"}} dangerouslySetInnerHTML={{__html:p.slice(2)}}/>;
        if(p.startsWith("## ")) return <h3 key={i} style={{fontFamily:"'Playfair Display',serif",fontSize:17,color:"var(--ink)",margin:"16px 0 8px"}} dangerouslySetInnerHTML={{__html:p.slice(3)}}/>;
        // A block of "- " lines is a list; a block that starts with a line of text followed by "- " lines is a heading line plus a list.
        const lines = p.split("\n");
        const firstItem = lines.findIndex(l => /^[-•] /.test(l.trim()));
        if (firstItem !== -1 && lines.slice(firstItem).every(l => /^[-•] /.test(l.trim()))) {
          const lead = lines.slice(0, firstItem).join(" ").trim();
          return (
            <div key={i} style={{margin:"6px 0 12px"}}>
              {lead && <p style={{fontSize:14,lineHeight:1.9,color:"var(--ink-2)",margin:"0 0 6px"}} dangerouslySetInnerHTML={{__html:lead}}/>}
              <ul style={{margin:0,paddingLeft:20,display:"grid",gap:6}}>
                {lines.slice(firstItem).map((l,j)=><li key={j} style={{fontSize:14,lineHeight:1.75,color:"var(--ink-2)"}} dangerouslySetInnerHTML={{__html:l.trim().slice(2)}}/>)}
              </ul>
            </div>
          );
        }
        return <p key={i} style={{fontSize:14,lineHeight:1.9,color:"var(--ink-2)",marginBottom:10}} dangerouslySetInnerHTML={{__html:p.split("\n").join("<br/>")}}/>;
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// LIVE CHAT
// ═══════════════════════════════════════════════════════════════════════════════
function LiveChat({color,ctx}) {
  const [msgs,setMsgs] = useState([]);
  const [inp,setInp] = useState("");
  const [loading,setLoading] = useState(false);
  const bot = useRef();
  useEffect(()=>{bot.current?.scrollIntoView({behavior:"smooth"});},[msgs,loading]);

  const send = async () => {
    if(!inp.trim()||loading) return;
    const um = {role:"user",content:inp};
    const all = [...msgs,um];
    setMsgs(all); setInp(""); setLoading(true);
    try {
      const txt = await askClaude(
        `You are a warm, expert AI tutor coaching the learner on prompt engineering. Context: ${ctx}. Keep responses under 180 words. When she writes a prompt, respond naturally AND give one brief coaching tip to improve it. Always warm. End with encouragement or a small follow-up question.`,
        inp, 700
      );
      setMsgs([...all,{role:"assistant",content:txt}]);
    } catch (e) {
      const msg = e.message === "NO_KEY"
        ? "The preview coach is resting. Try again in a moment."
        : "Connection hiccup, please try again. ("+e.message+")";
      setMsgs([...all,{role:"assistant",content:msg}]);
    }
    setLoading(false);
  };

  return (
    <div style={{marginTop:24}}>
      <div style={{background:"var(--well)",border:`1px solid ${color}28`,borderRadius:14,overflow:"hidden"}}>
        <div style={{padding:"10px 14px",borderBottom:`1px solid ${color}18`,display:"flex",alignItems:"center",gap:8}}>
          <div style={{width:7,height:7,borderRadius:"50%",background:color,animation:"pulse 2s infinite"}}/>
          <span style={{fontSize:11,fontWeight:700,letterSpacing:"0.12em",color}}>LIVE AI PRACTICE</span>
          <span style={{fontSize:10,color:"var(--faint)",marginLeft:"auto"}}>powered by Claude</span>
        </div>
        <div style={{minHeight:90,maxHeight:280,overflowY:"auto",padding:14,display:"flex",flexDirection:"column",gap:10}}>
          {msgs.length===0 && <div style={{color:"var(--faint)",fontSize:13,textAlign:"center",padding:"12px 0"}}> Practice here, type any prompt and your AI tutor will respond and coach you.</div>}
          {msgs.map((m,i)=>(
            <div key={i} style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start"}}>
              <div style={{maxWidth:"85%",padding:"9px 13px",borderRadius:10,background:m.role==="user"?color+"28":"rgb(var(--fg-rgb) / 0.04)",border:`1px solid ${m.role==="user"?color+"38":"rgb(var(--fg-rgb) / 0.06)"}`,fontSize:13,lineHeight:1.7,color:m.role==="user"?"var(--ink)":"var(--ink-2)",whiteSpace:"pre-wrap"}}>
                {m.role==="assistant" && <div style={{fontSize:9,color,fontWeight:700,marginBottom:5,letterSpacing:"0.12em"}}> AI TUTOR</div>}
                {m.content}
              </div>
            </div>
          ))}
          {loading && (
            <div style={{display:"flex"}}>
              <div style={{padding:"9px 13px",borderRadius:10,background:"rgb(var(--fg-rgb) / 0.04)",border:"1px solid rgb(var(--fg-rgb) / 0.06)"}}>
                <div style={{fontSize:9,color,fontWeight:700,marginBottom:6,letterSpacing:"0.12em"}}> AI TUTOR</div>
                <div style={{display:"flex",gap:4}}>{[0,1,2].map(j=><div key={j} style={{width:5,height:5,borderRadius:"50%",background:color,animation:`pulse 1.2s ${j*0.2}s infinite`}}/>)}</div>
              </div>
            </div>
          )}
          <div ref={bot}/>
        </div>
        <div style={{padding:"10px 14px",borderTop:"1px solid rgb(var(--fg-rgb) / 0.04)",display:"flex",gap:10}}>
          <input value={inp} onChange={e=>setInp(e.target.value)} onKeyDown={e=>e.key==="Enter"&&!e.shiftKey&&send()} placeholder="Type a prompt to practise... press Enter to send" style={{flex:1,background:"rgb(var(--fg-rgb) / 0.04)",border:"1px solid rgb(var(--fg-rgb) / 0.07)",borderRadius:8,padding:"9px 12px",color:"var(--ink)",fontSize:12,outline:"none",fontFamily:"'Plus Jakarta Sans',sans-serif"}}/>
          <Btn onClick={send} disabled={loading||!inp.trim()} color={color} small>→</Btn>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// AI CONTENT LESSON
// ═══════════════════════════════════════════════════════════════════════════════
function AIContentLesson({lesson,color,onSave,saved,cacheKey,passed,onPass}) {
  const [content,setContent] = useState("");
  const [loading,setLoading] = useState(false);
  const [err,setErr] = useState("");
  const [ans,setAns] = useState(saved||"");
  const loaded = useRef(false);

  // Sync saved when navigating between lessons
  useEffect(()=>{ setAns(saved||""); loaded.current = false; setContent(""); setErr(""); }, [cacheKey]);

  useEffect(()=>{
    if(loaded.current) return;
    loaded.current = true;
    setLoading(true);
    setErr("");
    askClaude(
      `You are writing lesson content for an AI & Prompt Engineering course designed specifically for the learner, a beginner based in Ghana. Voice: warm, humanised, encouraging, relatable, never condescending. Use concrete African/Ghanaian examples where relevant. Format with bold headers using ** **, use > for key callouts, use --- for section breaks. Include a practical reflection question at the end marked with ##  Reflection Exercise\n[question here]`,
      lesson.topic, 1000, cacheKey
    ).then(txt => { setContent(txt); setLoading(false); })
     .catch(e => {
       setContent(fallbackLesson(lesson.topic));
       setErr(e.message === "NO_KEY" ? "no_key" : e.message);
       setLoading(false);
     });
  }, [cacheKey]);

  const parts = content.split("##  Reflection Exercise");
  const mainContent = parts[0] || "";
  const reflectionQ = parts[1]?.trim() || "What is one thing from this lesson you'll try in the next 7 days?";

  return (
    <div className="fu">
      {loading ? (
        <div style={{display:"flex",alignItems:"center",gap:12,padding:"40px 20px",color:"var(--muted-2)"}}>
          <Spinner color={color}/>
          <span style={{fontSize:14}}>Loading lesson content...</span>
        </div>
      ) : (
        <>
          <MD text={mainContent} color={color}/>
          <LessonExtras key={lesson.id} lessonId={lesson.id} color={color} passed={passed} onPass={onPass}/>
          <Card style={{marginTop:20,borderColor:color+"30"}}>
            <SL> Reflection Exercise</SL>
            <p style={{fontSize:14,color:"var(--ink-2)",marginBottom:12,lineHeight:1.7}}>{reflectionQ}</p>
            <textarea value={ans} onChange={e=>setAns(e.target.value)} placeholder="Write your reflection here, there are no wrong answers..." rows={5} style={{width:"100%",background:"var(--well)",border:`1px solid ${ans?color+"44":"rgb(var(--fg-rgb) / 0.07)"}`,borderRadius:8,padding:"12px 14px",color:"var(--ink)",fontSize:13,lineHeight:1.7,resize:"vertical",outline:"none",fontFamily:"inherit"}}/>
            <div style={{marginTop:10,display:"flex",gap:10,alignItems:"center",flexWrap:"wrap"}}>
              <Btn color={color} onClick={()=>onSave(ans)} disabled={!ans.trim()}>Save Reflection</Btn>
              {saved && <Tag color="#00C9A7" small>✓ Saved</Tag>}
            </div>
          </Card>
        </>
      )}
      <LiveChat color={color} ctx={lesson.title}/>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PLATFORMS OVERVIEW
// ═══════════════════════════════════════════════════════════════════════════════
function PlatformsOverview({color}) {
  const [cat,setCat] = useState("text");
  const catColors = {text:"#10A37F",image:"#D9B36C",video:"#00D2D3",audio:"#FF6B9D",code:"#10A37F",automation:"#FF6B35",agents:"#D9B36C"};
  const catLabels = {text:" Text AI",image:" Image AI",video:" Video AI",audio:" Audio AI",code:" Code AI",automation:" Automation",agents:" Agents"};
  return (
    <div className="fu">
      <p style={{fontSize:14,color:"var(--muted)",marginBottom:18,lineHeight:1.7}}>All AI tools fall into 7 categories. Explore each, click any card to visit the platform directly.</p>
      <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:18}}>
        {Object.entries(catLabels).map(([k,v])=>(
          <button key={k} onClick={()=>setCat(k)} style={{background:cat===k?tone(catColors[k]):"rgb(var(--fg-rgb) / 0.04)",border:`1px solid ${cat===k?tone(catColors[k]):"rgb(var(--fg-rgb) / 0.07)"}`,borderRadius:8,padding:"6px 13px",cursor:"pointer",color:cat===k?"var(--bg)":"var(--muted-2)",fontSize:11,fontWeight:700,fontFamily:"inherit",transition:"all 0.15s"}}>{v}</button>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:10}}>
        {(PLATFORMS[cat]||[]).map((p,i)=>(
          <a key={i} href={p.url} target="_blank" rel="noopener noreferrer" style={{textDecoration:"none"}}>
            <Card style={{borderColor:tone(p.c)+"28",transition:"all 0.2s",cursor:"pointer"}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
                <div style={{width:34,height:34,borderRadius:8,background:tone(p.c)+"18",border:`1px solid ${tone(p.c)}38`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,flexShrink:0}}>{p.e}</div>
                <div>
                  <div style={{fontWeight:700,color:"var(--ink)",fontSize:13}}>{p.n}</div>
                  <div style={{fontSize:9,color:tone(p.c),letterSpacing:"0.08em",fontWeight:700}}>CLICK TO VISIT →</div>
                </div>
              </div>
              <p style={{fontSize:11,color:"var(--muted-2)",lineHeight:1.5}}>{p.d}</p>
            </Card>
          </a>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PLATFORMS SECTION
// ═══════════════════════════════════════════════════════════════════════════════
function PlatformsSection({lesson,color}) {
  const plats = PLATFORMS[lesson.category]||[];
  return (
    <div className="fu">
      <p style={{fontSize:14,color:"var(--ink-2)",marginBottom:16,lineHeight:1.7}}>Top platforms for this category. Click to visit. Try the practice suggestions below to apply what you just learned.</p>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:10,marginBottom:20}}>
        {plats.map((p,i)=>(
          <a key={i} href={p.url} target="_blank" rel="noopener noreferrer" style={{textDecoration:"none"}}>
            <Card style={{borderColor:tone(p.c)+"28",transition:"all 0.2s"}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
                <div style={{width:32,height:32,borderRadius:8,background:tone(p.c)+"18",border:`1px solid ${tone(p.c)}35`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0}}>{p.e}</div>
                <div>
                  <div style={{fontWeight:700,color:"var(--ink)",fontSize:13}}>{p.n}</div>
                  <div style={{fontSize:9,color:tone(p.c),letterSpacing:"0.08em",fontWeight:700}}>VISIT →</div>
                </div>
              </div>
              <p style={{fontSize:11,color:"var(--muted-2)",lineHeight:1.4}}>{p.d}</p>
            </Card>
          </a>
        ))}
      </div>
      {lesson.tips && (
        <Card style={{borderColor:color+"28"}}>
          <SL> Practice These Right Now</SL>
          {lesson.tips.map((tip,i)=>(
            <div key={i} style={{display:"flex",gap:10,marginBottom:10}}>
              <div style={{width:22,height:22,borderRadius:"50%",background:color+"18",border:`1px solid ${color}35`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color,flexShrink:0}}>{i+1}</div>
              <p style={{fontSize:13,color:"var(--ink-2)",lineHeight:1.6}}>{tip}</p>
            </div>
          ))}
        </Card>
      )}
      <LiveChat color={color} ctx={`${lesson.category} AI tools practice`}/>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TECHNIQUES LESSON
// ═══════════════════════════════════════════════════════════════════════════════
function TechniquesLesson({lesson,color,onSave,saved,cacheKey}) {
  const [sel,setSel] = useState(null);
  const [tab,setTab] = useState("learn");
  const [content,setContent] = useState({});
  const [loading,setLoading] = useState(false);
  const [ans,setAns] = useState(saved||"");

  useEffect(()=>{ setAns(saved||""); }, [cacheKey]);

  const loadTechnique = async (idx) => {
    if(content[idx]) return;
    setLoading(true);
    const t = TECHNIQUE_NAMES[idx];
    try {
      const txt = await askClaude(
        "You are writing a lesson for the learner learning prompt engineering. Be warm, practical, concrete. Use Ghanaian/African examples where relevant.",
        `Teach the "${t.name}" prompting technique. Include: 1) What it is (2-3 sentences), 2) When to use it (2-3 sentences), 3) A weak prompt example (labelled BAD:), 4) A strong prompt using this technique (labelled GOOD:, make it detailed and realistic for an African professional), 5) A pro tip (1-2 sentences). Format clearly with bold labels.`,
        600,
        `technique_${idx}_v1`
      );
      setContent(prev => ({...prev,[idx]:txt}));
    } catch (e) {
      setContent(prev => ({...prev,[idx]:fallbackTechnique(t.name)}));
    }
    setLoading(false);
  };

  const handleSelect = (i) => {
    setSel(sel===i?null:i);
    setTab("learn");
    if(sel!==i) loadTechnique(i);
  };

  const tc = TECHNIQUE_NAMES[sel];
  const tc_content = content[sel]||"";

  let badPrompt = "", goodPrompt = "";
  if(tc_content) {
    const badMatch = tc_content.match(/BAD:([\s\S]*?)(?=GOOD:|$)/i);
    const goodMatch = tc_content.match(/GOOD:([\s\S]*?)(?=\n[A-Z]|$)/i);
    badPrompt = badMatch ? badMatch[1].trim() : "";
    goodPrompt = goodMatch ? goodMatch[1].trim() : "";
  }

  return (
    <div className="fu">
      <p style={{fontSize:13,color:"var(--muted-2)",marginBottom:18,lineHeight:1.7}}>8 essential techniques. Click any card to deep-dive, see what it is, compare weak vs strong examples, then practise it.</p>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:10,marginBottom:20}}>
        {TECHNIQUE_NAMES.map((t,i)=>(
          <div key={i} onClick={()=>handleSelect(i)} style={{background:sel===i?color+"10":"rgb(var(--fg-rgb) / 0.03)",border:`1px solid ${sel===i?color+"40":"rgb(var(--fg-rgb) / 0.07)"}`,borderRadius:12,padding:14,cursor:"pointer",transition:"all 0.2s"}}>
            <div style={{fontSize:22,marginBottom:8}}>{t.emoji}</div>
            <div style={{fontSize:12,fontWeight:700,color:sel===i?color:"var(--ink-2)",lineHeight:1.3}}>{t.name}</div>
          </div>
        ))}
      </div>

      {sel!==null && (
        <Card style={{borderColor:color+"38",animation:"fadeUp 0.3s ease"}}>
          <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap"}}>
            {["learn","compare","practice"].map(tb=>(
              <button key={tb} onClick={()=>setTab(tb)} style={{background:tab===tb?color:"transparent",border:`1px solid ${tab===tb?color:"rgb(var(--fg-rgb) / 0.1)"}`,borderRadius:7,padding:"6px 14px",cursor:"pointer",color:tab===tb?"var(--bg)":"var(--muted)",fontSize:11,fontWeight:700,fontFamily:"inherit",transition:"all 0.2s"}}>
                {tb==="learn"?" Learn":tb==="compare"?" Compare":" Practice"}
              </button>
            ))}
          </div>

          {tab==="learn" && (
            loading ? <div style={{display:"flex",gap:10,alignItems:"center",color:"var(--muted-2)",padding:"20px 0"}}><Spinner color={color}/><span>Loading technique...</span></div>
            : <MD text={tc_content.split("BAD:")[0].split("GOOD:")[0]} color={color}/>
          )}

          {tab==="compare" && (
            loading ? <div style={{display:"flex",gap:10,alignItems:"center",color:"var(--muted-2)",padding:"20px 0"}}><Spinner color={color}/><span>Loading examples...</span></div>
            : (
              <div>
                <div style={{marginBottom:14}}>
                  <div style={{fontSize:10,color:"#FF6B6B",fontWeight:700,letterSpacing:"0.1em",marginBottom:8}}>✗ WEAK PROMPT (without this technique)</div>
                  <Code>{badPrompt||"Example loading..."}</Code>
                </div>
                <div>
                  <div style={{fontSize:10,color:"#00C9A7",fontWeight:700,letterSpacing:"0.1em",marginBottom:8}}>✓ STRONG PROMPT (with this technique applied)</div>
                  <Code>{goodPrompt||"Example loading..."}</Code>
                </div>
              </div>
            )
          )}

          {tab==="practice" && (
            <div>
              <p style={{fontSize:14,color:"var(--ink-2)",lineHeight:1.7,marginBottom:14}}>Now use the <strong style={{color:"var(--ink)"}}>{tc?.name}</strong> technique for a real task in your own life or work.</p>
              <textarea value={ans} onChange={e=>setAns(e.target.value)} placeholder={`Write your own prompt using ${tc?.name}...`} rows={6} style={{width:"100%",background:"var(--well)",border:`1px solid ${color}38`,borderRadius:8,padding:"12px 14px",color:"var(--ink)",fontSize:13,lineHeight:1.7,resize:"vertical",outline:"none",fontFamily:"inherit"}}/>
              <div style={{marginTop:10,display:"flex",gap:10,alignItems:"center",flexWrap:"wrap"}}>
                <Btn color={color} onClick={()=>onSave(ans)} disabled={!ans.trim()}>Save Practice</Btn>
                {saved && <Tag color="#00C9A7" small>✓ Saved</Tag>}
              </div>
            </div>
          )}
        </Card>
      )}
      <LiveChat color={color} ctx="Prompting Techniques"/>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TEMPLATES LESSON
// ═══════════════════════════════════════════════════════════════════════════════
const TEMPLATE_CATS = [
  {name:" Professional",key:"professional"},
  {name:" Learning",key:"learning"},
  {name:" Creative",key:"creative"},
  {name:" Analysis",key:"analysis"},
];

const TEMPLATE_PROMPTS = {
  professional:[
    {title:"Professional Email",prompt:`You are a professional communications expert.\n\nWrite a [TONE: formal/friendly/firm] email from [YOUR NAME] to [RECIPIENT & ROLE] about [SUBJECT].\n\nKey points to cover:\n- [POINT 1]\n- [POINT 2]\n- [POINT 3]\n\nDesired outcome: [WHAT YOU WANT TO HAPPEN]\nLength: [SHORT / MEDIUM / LONG]\nDo NOT include: [ANYTHING TO AVOID]`},
    {title:"Meeting Preparation",prompt:`You are a senior consultant preparing me for an important meeting.\n\nMeeting with: [WHO, role, company, what they care about]\nMy goal: [WHAT I WANT TO ACHIEVE]\nMy concerns: [WHAT WORRIES ME]\nBackground: [CONTEXT]\n\nGive me:\n1. 5 smart questions I should ask\n2. 3 likely objections + how to handle each\n3. The one key message I must land\n4. How to open the first 30 seconds`},
    {title:"Performance Review Prep",prompt:`Act as my career coach helping me prepare for my annual performance review.\n\nMy role: [JOB TITLE]\nKey achievements this year: [LIST THEM]\nChallenges I faced: [HONEST LIST]\nWhat I want: [PAY RISE / PROMOTION / MORE RESPONSIBILITY]\nMy manager's style: [DESCRIBE THEM]\n\nHelp me:\n1. Frame achievements powerfully (with metrics)\n2. Address challenges constructively\n3. Make my case for [WHAT I WANT]\n4. Anticipate what my manager will push back on`},
    {title:"Salary Negotiation Script",prompt:`You are an expert negotiation coach. Help me prepare for a salary negotiation.\n\nCurrent salary: [AMOUNT]\nSalary I want: [TARGET AMOUNT]\nMy achievements this year: [LIST]\nMarket rate for my role in [CITY/COUNTRY]: [AMOUNT if known]\nMy leverage: [ANY OFFERS, SKILLS, ACHIEVEMENTS]\n\nGive me:\n1. The exact opening words to use\n2. How to respond if they say "we don't have budget"\n3. What to do if they offer less than I want\n4. Non-salary benefits to negotiate if salary is stuck`},
  ],
  learning:[
    {title:"Explain Any Concept",prompt:`You are a brilliant teacher who makes complex things simple.\n\nConcept: [TOPIC]\nMy background: [WHAT I ALREADY KNOW]\nWhy I need to understand it: [CONTEXT]\n\nExplain using:\n1. A simple 3-sentence overview\n2. One real-world analogy relevant to [MY CONTEXT]\n3. A practical example in action\n4. The 3 most important things to remember\n5. One common misconception`},
    {title:"Personal Study Plan",prompt:`Create a personalised study plan.\n\nSubject: [TOPIC]\nCurrent level: [BEGINNER / INTERMEDIATE / ADVANCED]\nAvailable time: [HOURS PER WEEK]\nTimeline: [HOW LONG I HAVE]\nGoal: [WHAT I WANT TO BE ABLE TO DO]\n\nCreate a week-by-week plan:\n- What to study each week\n- Free resources to use\n- Practical exercise per week\n- How to measure progress`},
    {title:"Research Deep Dive",prompt:`You are a senior research analyst. I need to understand [TOPIC] deeply.\n\nContext: [WHY YOU NEED THIS]\nMy current knowledge: [WHAT I KNOW]\n\nProvide:\n1. Overview (3 clear paragraphs)\n2. The 5 most important things to know\n3. Common misconceptions\n4. Key debates or unresolved questions\n5. Best resources to go deeper (books, articles, courses)\n6. 3 questions worth researching further`},
  ],
  creative:[
    {title:"Social Media Calendar",prompt:`You are a social media strategist for [INDUSTRY].\n\nBrand: [NAME]\nAudience: [DESCRIBE YOUR AUDIENCE IN DETAIL]\nBrand voice: [ADJECTIVES, e.g. warm, professional, bold]\nPlatform: [INSTAGRAM / LINKEDIN / TWITTER]\nFrequency: [HOW OFTEN]\n\nCreate a 2-week content calendar:\n- Topic/angle per day\n- Caption (ready to post)\n- Content type (photo/reel/carousel)\n- Best time to post\n- Hashtags\n\nDon't repeat similar themes in the same week.`},
    {title:"Brand Story (3 Versions)",prompt:`You are a master storyteller and brand strategist.\n\nMy brand: [DESCRIPTION]\nMy journey: [HOW YOU GOT HERE, the real story]\nProblem I solve: [BE SPECIFIC]\nIdeal customer: [DESCRIBE IN DETAIL]\nWhat makes me different: [YOUR HONEST ANSWER]\n\nWrite 3 versions:\n1. 60-second spoken intro (for networking events)\n2. LinkedIn About section (300 words)\n3. Instagram bio (under 150 chars + 3 highlights)`},
    {title:"Content Repurposing Engine",prompt:`I have written this content: [PASTE ARTICLE / BLOG / REPORT]\n\nRepurpose it into ALL of the following:\n1. LinkedIn article (800 words, professional tone)\n2. Instagram carousel (10 slides: heading + 2 sentences each)\n3. Twitter/X thread (10 tweets, each under 280 characters)\n4. Email newsletter (400 words + subject line)\n5. WhatsApp message for client list (under 200 chars)\n6. YouTube video script intro (60 seconds)\n7. 3 pull quotes for graphics\n\nMaintain my voice and key messages throughout.`},
  ],
  analysis:[
    {title:"Data Analysis",prompt:`You are a data analyst and business strategist.\n\nHere is my data: [PASTE DATA OR DESCRIBE IT]\n\nPlease:\n1. Summarise findings in plain English (no jargon)\n2. Identify top 3 positive indicators\n3. Flag top 3 concerns\n4. Identify patterns or trends\n5. Give 3 actionable recommendations\n6. Note anything missing I should investigate\n\nFlag anything you're uncertain about clearly.`},
    {title:"Competitor Analysis",prompt:`You are a senior market research analyst.\n\nMy business: [DESCRIBE WHAT YOU DO]\nMarket: [LOCATION / SECTOR]\nMy target customer: [DESCRIBE]\n\nResearch for me:\n1. Top 5 direct competitors with pricing\n2. Their key strengths and weaknesses\n3. Gaps in the market I could fill\n4. 3 things they do better than me\n5. 3 things I could do better than them\n6. A simple positioning recommendation`},
    {title:"Decision Analysis",prompt:`Help me make an important decision using structured analysis.\n\nDecision: [WHAT YOU'RE DECIDING]\nOption A: [DESCRIBE FULLY]\nOption B: [DESCRIBE FULLY]\nMy constraints: [TIME / MONEY / RISK TOLERANCE / VALUES]\nWhat matters most to me: [YOUR PRIORITIES]\n\nAnalyse step by step:\n1. Pros and cons of each option\n2. Short-term vs long-term implications\n3. Risk assessment for each\n4. What am I not considering?\n5. Final recommendation with clear reasoning`},
  ],
};

function TemplatesLesson({color}) {
  const [cat,setCat] = useState(0);
  const [open,setOpen] = useState(null);
  const [copied,setCopied] = useState(null);
  const copy = (i,text) => { navigator.clipboard.writeText(text); setCopied(i); setTimeout(()=>setCopied(null),2000); };
  const c = TEMPLATE_CATS[cat];
  const templates = TEMPLATE_PROMPTS[c.key]||[];

  return (
    <div className="fu">
      <p style={{fontSize:13,color:"var(--muted)",marginBottom:18,lineHeight:1.7}}>Ready-to-use prompt templates, click to expand, then copy and fill in the [BRACKETS] with your own details.</p>
      <div style={{display:"flex",gap:8,marginBottom:18,flexWrap:"wrap"}}>
        {TEMPLATE_CATS.map((ca,i)=>(
          <button key={i} onClick={()=>{setCat(i);setOpen(null);}} style={{background:cat===i?color:"rgb(var(--fg-rgb) / 0.04)",border:`1px solid ${cat===i?color:"rgb(var(--fg-rgb) / 0.08)"}`,borderRadius:8,padding:"6px 14px",cursor:"pointer",color:cat===i?"var(--bg)":"var(--muted)",fontSize:11,fontWeight:700,fontFamily:"inherit",transition:"all 0.2s"}}>{ca.name}</button>
        ))}
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {templates.map((t,i)=>(
          <Card key={i} style={{borderColor:open===i?color+"40":"rgb(var(--fg-rgb) / 0.07)",transition:"all 0.2s"}}>
            <div onClick={()=>setOpen(open===i?null:i)} style={{display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer"}}>
              <div style={{fontWeight:700,color:"var(--ink)",fontSize:14}}>{t.title}</div>
              <span style={{color:"var(--faint)",fontSize:12}}>{open===i?"▲":"▼"}</span>
            </div>
            {open===i && (
              <div style={{marginTop:14,animation:"fadeUp 0.25s ease"}}>
                <SL>Prompt Template, fill in the [BRACKETS]</SL>
                <Code>{t.prompt}</Code>
                <div style={{display:"flex",gap:10,marginTop:12,flexWrap:"wrap"}}>
                  <Btn color={color} small onClick={()=>copy(i,t.prompt)}>{copied===i?"✓ Copied!":" Copy Template"}</Btn>
                  <a href="https://chat.openai.com" target="_blank" rel="noopener noreferrer"><Btn outline color="#10A37F" small>Try on ChatGPT →</Btn></a>
                  <a href="https://claude.ai" target="_blank" rel="noopener noreferrer"><Btn outline color="#CC785C" small>Try on Claude →</Btn></a>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
      <LiveChat color={color} ctx="Prompt Templates, ask for help customising any template"/>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// INDUSTRY TEMPLATES
// ═══════════════════════════════════════════════════════════════════════════════
function IndustryLesson({lesson,color,cacheKey}) {
  const [templates,setTemplates] = useState([]);
  const [loading,setLoading] = useState(false);
  const [open,setOpen] = useState(null);
  const [copied,setCopied] = useState(null);
  const loaded = useRef(false);

  useEffect(()=>{ loaded.current = false; setTemplates([]); }, [cacheKey]);

  useEffect(()=>{
    if(loaded.current) return;
    loaded.current = true;
    setLoading(true);
    askClaude(
      "You generate professional prompt templates. Return ONLY valid JSON, no markdown, no explanation, just the JSON array.",
      `Create ${lesson.tasks.length} professional prompt templates for ${lesson.industry} professionals. For each task in this list: ${lesson.tasks.join(", ")}.\n\nReturn JSON array: [{"task":"task name","prompt":"full prompt template with [BRACKETS] for customisation, detailed, professional, 100-200 words each"}]`,
      1200,
      cacheKey
    ).then(txt => {
      try {
        const clean = txt.replace(/```json|```/g,"").trim();
        const data = JSON.parse(clean);
        setTemplates(data);
      } catch {
        setTemplates(fallbackIndustry(lesson));
      }
      setLoading(false);
    }).catch(()=>{
      setTemplates(fallbackIndustry(lesson));
      setLoading(false);
    });
  }, [cacheKey]);

  const copy = (i,text) => { navigator.clipboard.writeText(text); setCopied(i); setTimeout(()=>setCopied(null),2000); };

  return (
    <div className="fu">
      <div style={{marginBottom:18,padding:14,background:color+"10",border:`1px solid ${color}28`,borderRadius:12}}>
        <div style={{fontSize:11,fontWeight:700,color,marginBottom:5,letterSpacing:"0.1em"}}>{lesson.industry.toUpperCase()}</div>
        <p style={{fontSize:13,color:"var(--ink-2)",lineHeight:1.6}}>Ready-to-use professional templates. Click to expand and copy.</p>
      </div>

      {loading ? (
        <div style={{display:"flex",alignItems:"center",gap:12,padding:"30px 0",color:"var(--muted-2)"}}>
          <Spinner color={color}/>
          <span style={{fontSize:14}}>Generating professional templates for {lesson.industry}...</span>
        </div>
      ) : (
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {templates.map((t,i)=>(
            <Card key={i} style={{borderColor:open===i?color+"40":"rgb(var(--fg-rgb) / 0.07)",transition:"all 0.2s"}}>
              <div onClick={()=>setOpen(open===i?null:i)} style={{display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer"}}>
                <div style={{fontWeight:700,color:"var(--ink)",fontSize:14}}>{t.task}</div>
                <span style={{color:"var(--faint)",fontSize:12}}>{open===i?"▲":"▼"}</span>
              </div>
              {open===i && (
                <div style={{marginTop:14,animation:"fadeUp 0.25s ease"}}>
                  <SL>Full Prompt Template</SL>
                  <Code>{t.prompt}</Code>
                  <div style={{display:"flex",gap:10,marginTop:12,flexWrap:"wrap"}}>
                    <Btn color={color} small onClick={()=>copy(i,t.prompt)}>{copied===i?"✓ Copied!":" Copy Template"}</Btn>
                    <a href="https://chat.openai.com" target="_blank" rel="noopener noreferrer"><Btn outline color="#10A37F" small>Use on ChatGPT →</Btn></a>
                    <a href="https://claude.ai" target="_blank" rel="noopener noreferrer"><Btn outline color="#CC785C" small>Use on Claude →</Btn></a>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
      <LiveChat color={color} ctx={`${lesson.industry} professional AI applications`}/>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// FINAL PROJECT LESSON
// ═══════════════════════════════════════════════════════════════════════════════
function FinalLesson({lesson,color,onSave,saved,onDone,cacheKey}) {
  const [ans,setAns] = useState(saved||"");
  useEffect(()=>{ setAns(saved||""); }, [cacheKey]);
  const ok = ans.trim().length >= (lesson.minLen||100);
  return (
    <div className="fu">
      <div style={{display:"flex",gap:8,marginBottom:18,flexWrap:"wrap"}}>
        <Tag color={color}>Final Project</Tag>
        <Tag color="#D9B36C">Capstone</Tag>
      </div>
      <Card style={{borderColor:color+"28",marginBottom:18}}>
        <SL> Instructions</SL>
        <div style={{fontSize:14,lineHeight:1.9,color:"var(--ink-2)",whiteSpace:"pre-wrap"}}>{lesson.instructions}</div>
      </Card>
      <textarea value={ans} onChange={e=>setAns(e.target.value)} placeholder={lesson.placeholder} rows={14} style={{width:"100%",background:"var(--well)",border:`1px solid ${ans?color+"40":"rgb(var(--fg-rgb) / 0.07)"}`,borderRadius:10,padding:"14px 16px",color:"var(--ink)",fontSize:13,lineHeight:1.7,resize:"vertical",outline:"none",fontFamily:"'Plus Jakarta Sans',sans-serif"}}/>
      <div style={{marginTop:6,fontSize:11,color:ok?"#00C9A7":"var(--muted-2)"}}>{ans.trim().length} / {lesson.minLen||100} characters minimum</div>
      <div style={{marginTop:14,display:"flex",gap:10,alignItems:"center",flexWrap:"wrap"}}>
        <Btn color={color} onClick={()=>{onSave(ans);onDone();}} disabled={!ok}>✓ Submit This Part</Btn>
        {saved && <Tag color="#00C9A7" small>✓ Submitted</Tag>}
      </div>
      <LiveChat color={color} ctx="Final project, ask for feedback on any part of your work"/>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// CERTIFICATE
// ═══════════════════════════════════════════════════════════════════════════════
function Certificate({onBack}) {
  const d = new Date().toLocaleDateString("en-GB",{day:"numeric",month:"long",year:"numeric"});
  const corners = [{top:18,left:18,borderTop:"2px solid rgb(var(--accent-rgb) / 0.4)",borderLeft:"2px solid rgb(var(--accent-rgb) / 0.4)"},{top:18,right:18,borderTop:"2px solid rgb(var(--accent-rgb) / 0.4)",borderRight:"2px solid rgb(var(--accent-rgb) / 0.4)"},{bottom:18,left:18,borderBottom:"2px solid rgb(var(--accent-rgb) / 0.4)",borderLeft:"2px solid rgb(var(--accent-rgb) / 0.4)"},{bottom:18,right:18,borderBottom:"2px solid rgb(var(--accent-rgb) / 0.4)",borderRight:"2px solid rgb(var(--accent-rgb) / 0.4)"}];
  return (
    <div style={{minHeight:"100vh",background:"var(--bg)",display:"flex",alignItems:"center",justifyContent:"center",padding:40,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>
      <div style={{maxWidth:700,width:"100%"}}>
        <div style={{background:"var(--panel)",border:"1px solid rgb(var(--fg-rgb) / 0.1)",borderRadius:28,padding:60,textAlign:"center",position:"relative",overflow:"hidden",animation:"celebrate 0.8s cubic-bezier(0.34,1.56,0.64,1)",boxShadow:"0 0 100px rgb(var(--accent-rgb) / 0.3)"}}>
          {corners.map((c,i)=><div key={i} style={{position:"absolute",...c,width:44,height:44}}/>)}
          <div style={{fontSize:60,marginBottom:16,animation:"float 3s ease-in-out infinite"}}></div>
          <div style={{fontSize:10,letterSpacing:"0.35em",color:"var(--accent)",fontWeight:700,marginBottom:16}}>CERTIFICATE OF COMPLETION</div>
          <p style={{fontFamily:"'Playfair Display',serif",fontSize:15,color:"var(--muted-2)",fontStyle:"italic",marginBottom:8}}>This proudly certifies that</p>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:50,fontWeight:800,background:"var(--accent)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",marginBottom:10,lineHeight:1.15}}>{NAME}</div>
          <p style={{fontFamily:"'Playfair Display',serif",fontSize:15,color:"var(--muted-2)",fontStyle:"italic",marginBottom:6}}>has successfully mastered</p>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:26,color:"var(--ink)",fontWeight:700,marginBottom:6}}>AI & Prompt Engineering</div>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:17,color:"var(--accent)",fontStyle:"italic",marginBottom:32}}>The Complete Masterclass</div>
          <div style={{display:"flex",justifyContent:"center",gap:8,flexWrap:"wrap",marginBottom:30}}>
            {["12 Units","40+ Lessons","Text · Image · Video · Audio","Code · Automation · Agents","RAG & Knowledge Bases","Industry Templates","AI Ethics & Safety","Career Development"].map(b=>(
              <span key={b} style={{padding:"4px 12px",borderRadius:20,background:"rgb(var(--accent-rgb) / 0.1)",border:"1px solid rgb(var(--accent-rgb) / 0.2)",fontSize:10,color:"var(--accent)",fontWeight:600}}>{b}</span>
            ))}
          </div>
          <div style={{borderTop:"1px solid rgb(var(--fg-rgb) / 0.06)",paddingTop:22,display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:28,flexWrap:"wrap",gap:14}}>
            <div>
              <div style={{fontFamily:"'Playfair Display',serif",fontSize:18,color:"var(--ink)",fontStyle:"italic",marginBottom:2}}>Claude AI</div>
              <div style={{fontSize:10,color:"var(--faint)",letterSpacing:"0.1em"}}>COURSE INSTRUCTOR</div>
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{fontSize:14,color:"var(--muted)",marginBottom:2}}>{d}</div>
              <div style={{fontSize:10,color:"var(--faint)",letterSpacing:"0.1em"}}>DATE COMPLETED</div>
            </div>
          </div>
          <div style={{padding:22,background:"rgb(var(--fg-rgb) / 0.02)",borderRadius:14,border:"1px solid rgb(var(--fg-rgb) / 0.05)"}}>
            <p style={{fontFamily:"'Playfair Display',serif",fontSize:14,color:"var(--ink-2)",lineHeight:1.85,fontStyle:"italic"}}>
              "{NAME}, you came into this course as a beginner and leave as someone who genuinely understands AI across every domain: text, image, video, audio, code, automation, agents, ethics, and career. That is remarkable. More importantly, you know HOW to think about AI, critically, responsibly, and strategically. The world needs more people like you using this technology thoughtfully. Go build something extraordinary. The tools are in your hands. "
            </p>
          </div>
        </div>
        <div style={{textAlign:"center",marginTop:24,display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap"}}>
          <Btn color="#D9B36C" onClick={()=>window.print()}> Print / Save as PDF</Btn>
          <Btn outline color="#D9B36C" onClick={onBack}>← Back to course</Btn>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// WELCOME / RESUME
// ═══════════════════════════════════════════════════════════════════════════════
function Welcome({onStart, hasProgress, progress, doneSet, onTheme}) {
  const lessonsTotal = UNITS.reduce((n,u)=>n+u.lessons.length,0);
  return (
    <div className="welcome">
      <header className="w-top">
        <div className="w-brand"><i>M</i> AI Masterclass</div>
        <div style={{display:"flex",gap:10,alignItems:"center"}}>
          <span className="w-badge">Preview build</span>
          <ThemeToggle onChange={onTheme}/>
        </div>
      </header>
      <div className="w-grid">
        <div className="fu">
          <div className="w-eyebrow">A PERSONAL MASTERCLASS</div>
          <h1 className="w-title">AI &amp; prompt<br/>engineering, <em>for {NAME}</em></h1>
          <p className="w-lede">From your first conversation with an AI to agents, automation and a capstone you can show off. Short lessons, a diagram or activity in each, a quick check before you move on, and every lesson read aloud if you'd rather listen.</p>
          {hasProgress ? (
            <div className="w-resume">
              <div style={{flex:"1 1 220px"}}>
                <div style={{fontSize:11,fontWeight:800,letterSpacing:".16em",color:"var(--accent)"}}>WELCOME BACK</div>
                <div style={{fontSize:15,color:"var(--ink)",marginTop:4}}>{progress.doneCount} of {progress.totalL} lessons done. Pick up where you left off.</div>
              </div>
              <button className="w-primary" onClick={()=>onStart(true)}>Resume →</button>
            </div>
          ) : null}
          <div className="w-cta">
            {!hasProgress && <button className="w-primary" onClick={()=>onStart(false)}>Start unit 1 →</button>}
            {hasProgress && <button className="w-ghost" onClick={()=>onStart(false)}>Start again from unit 1</button>}
          </div>
          <div className="w-stats">
            {[[UNITS.length,"units"],[lessonsTotal,"lessons"],["7","kinds of AI"],["1","certificate"]].map(([n,l])=>(
              <div key={l}><b>{n}</b><span>{l}</span></div>
            ))}
          </div>
          <p className="w-note">About 6 to 10 hours. Go at your own pace; progress is saved in this browser.</p>
        </div>
        <nav className="w-map fu2" aria-label="Course map">
          <h2>What you'll learn</h2>
          {UNITS.map((u0,ui)=>{
            const u = toned(u0);
            const d = u.lessons.filter((_,li)=>doneSet.has(`${ui}-${li}`)).length;
            return (
              <div key={u.id} className="w-unit" style={{"--u":u.color}}>
                <span className="n">{String(u.id).padStart(2,"0")}</span>
                <div><div className="t">{u.title}</div><div className="s">{u.lessons.length} lessons{d ? ` · ${d} done` : ""}</div></div>
                <span className="bar" aria-label={`${d} of ${u.lessons.length} done`}><i style={{width:`${(d/u.lessons.length)*100}%`}}/></span>
              </div>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// API KEY MODAL
// ═══════════════════════════════════════════════════════════════════════════════
function ApiKeyModal({onClose}) {
  const [val, setVal] = useState(localStorage.getItem(KEY_KEY) || "");
  const [show, setShow] = useState(false);
  const save = () => {
    if (val.trim()) localStorage.setItem(KEY_KEY, val.trim());
    else localStorage.removeItem(KEY_KEY);
    onClose();
  };
  const remove = () => {
    localStorage.removeItem(KEY_KEY);
    setVal("");
    onClose();
  };
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",backdropFilter:"blur(8px)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div style={{maxWidth:500,width:"100%",background:"var(--panel)",border:"1px solid rgb(var(--accent-rgb) / 0.3)",borderRadius:16,padding:28}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
          <div style={{fontSize:24}}></div>
          <div>
            <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:20,color:"var(--ink)",margin:0}}>Anthropic API Key</h3>
            <p style={{fontSize:11,color:"var(--muted-2)",margin:"2px 0 0"}}>For live AI-generated lessons and chat tutor</p>
          </div>
        </div>
        <p style={{fontSize:13,color:"var(--ink-2)",lineHeight:1.7,marginBottom:14}}>
          To unlock AI-generated lesson content and the live tutor chat, paste your Anthropic API key below.
          It is stored <strong style={{color:"var(--ink)"}}>only in this browser</strong> (localStorage) and sent only to Anthropic's API.
        </p>
        <p style={{fontSize:12,color:"var(--muted)",lineHeight:1.6,marginBottom:14}}>
          Don't have one? Get a key at <a href="https://console.anthropic.com/settings/keys" target="_blank" rel="noopener" style={{color:"var(--accent)"}}>console.anthropic.com</a>.
          Without a key, the course still works, you just see placeholder content for AI-generated lessons.
        </p>
        <div style={{position:"relative",marginBottom:12}}>
          <input
            type={show?"text":"password"}
            value={val}
            onChange={e=>setVal(e.target.value)}
            placeholder="sk-ant-api03-..."
            style={{width:"100%",background:"rgba(0,0,0,0.4)",border:"1px solid rgb(var(--fg-rgb) / 0.1)",borderRadius:10,padding:"12px 50px 12px 14px",color:"var(--ink)",fontSize:13,fontFamily:"'JetBrains Mono',monospace",outline:"none"}}
          />
          <button onClick={()=>setShow(!show)} style={{position:"absolute",right:8,top:"50%",transform:"translateY(-50%)",background:"transparent",border:"none",color:"var(--muted)",cursor:"pointer",padding:6,fontSize:11}}>{show?"":""}</button>
        </div>
        <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
          <Btn color="#D9B36C" onClick={save}> Save Key</Btn>
          {localStorage.getItem(KEY_KEY) && <Btn outline color="#FF6B6B" onClick={remove} small>Remove Key</Btn>}
          <Btn outline color="#666" onClick={onClose} small>Cancel</Btn>
        </div>
        <div style={{marginTop:16,padding:12,background:"rgba(255,193,18,0.08)",border:"1px solid rgba(255,193,18,0.2)",borderRadius:10,fontSize:11,color:"#FFC312",lineHeight:1.6}}>
           Keys typed into a browser are vulnerable to browser extensions. Use a key with usage limits set in your Anthropic console.
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SETTINGS MODAL, export / import / reset
// ═══════════════════════════════════════════════════════════════════════════════
function SettingsModal({onClose, onReset}) {
  const fileRef = useRef();

  const exportData = () => {
    const data = {
      progress: loadStore(),
      cache: loadCache(),
      exportedAt: new Date().toISOString(),
      version: 2,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {type:"application/json"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `masterclass-backup-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importData = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        if (data.progress) saveStore(data.progress);
        if (data.cache) saveCache(data.cache);
        alert("✓ Progress imported! Reloading...");
        location.reload();
      } catch {
        alert("✗ Invalid backup file.");
      }
    };
    reader.readAsText(file);
  };

  const reset = () => {
    if (confirm("Are you sure you want to delete ALL your progress, reflections, and saved content? This cannot be undone.")) {
      localStorage.removeItem(STORE_KEY);
      localStorage.removeItem(CACHE_KEY);
      onReset();
    }
  };

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",backdropFilter:"blur(8px)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div style={{maxWidth:500,width:"100%",background:"var(--panel)",border:"1px solid rgb(var(--accent-rgb) / 0.3)",borderRadius:16,padding:28}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:18}}>
          <div style={{fontSize:24}}></div>
          <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:20,color:"var(--ink)",margin:0}}>Progress Settings</h3>
        </div>

        <Card style={{marginBottom:12}}>
          <SL> Backup Your Progress</SL>
          <p style={{fontSize:12,color:"var(--muted)",lineHeight:1.6,marginBottom:10}}>Download a JSON file with all your reflections, completed lessons, and cached lesson content.</p>
          <Btn color="#D9B36C" small onClick={exportData}> Export Backup</Btn>
        </Card>

        <Card style={{marginBottom:12}}>
          <SL> Restore from Backup</SL>
          <p style={{fontSize:12,color:"var(--muted)",lineHeight:1.6,marginBottom:10}}>Restore from a previously exported backup file. This will replace your current progress.</p>
          <input type="file" accept=".json" ref={fileRef} onChange={importData} style={{display:"none"}}/>
          <Btn outline color="#00C9A7" small onClick={()=>fileRef.current.click()}> Choose Backup File</Btn>
        </Card>

        <Card style={{marginBottom:18,borderColor:"rgba(255,107,107,0.2)"}}>
          <SL> Reset Everything</SL>
          <p style={{fontSize:12,color:"var(--muted)",lineHeight:1.6,marginBottom:10}}>Delete all your saved progress, reflections, and cached content. This cannot be undone.</p>
          <Btn outline color="#FF6B6B" small onClick={reset}> Reset All Progress</Btn>
        </Card>

        <div style={{textAlign:"right"}}>
          <Btn outline color="#666" small onClick={onClose}>Close</Btn>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════════════════════
function App() {
  const [state, setState] = usePersistedState({
    screen: "welcome",
    uIdx: 0,
    lIdx: 0,
    saved: {},
    done: [],
    checks: {},
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [tick, setTick] = useState(0); // forces re-render after reset
  const [, setThemeTick] = useState(0);
  const onTheme = () => setThemeTick(t => t + 1);
  const mainRef = useRef(null);

  const { screen, uIdx, lIdx, saved, done } = state;
  const checks = state.checks || {};
  const doneSet = useMemo(() => new Set(done), [done]);

  // Every lesson starts at its top: the lesson pane is its own scroller, so reset it (and the page) on each change.
  useEffect(() => {
    if (mainRef.current) mainRef.current.scrollTop = 0;
    window.scrollTo(0, 0);
  }, [uIdx, lIdx, screen]);

  const unit = toned(UNITS[uIdx]);
  const lesson = unit?.lessons[lIdx];
  const totalL = UNITS.reduce((s,u)=>s+u.lessons.length,0);
  const doneCount = doneSet.size;
  const hasProgress = doneCount > 0 || Object.keys(saved).length > 0;

  const markDone = useCallback(() => {
    const k = `${uIdx}-${lIdx}`;
    if (!doneSet.has(k)) {
      setState(s => ({ ...s, done: [...new Set([...s.done, k])] }));
    }
  }, [uIdx, lIdx, doneSet, setState]);

  const save = useCallback((k,v) => {
    setState(s => ({ ...s, saved: { ...s.saved, [k]: v } }));
  }, [setState]);

  const goto = useCallback((newUIdx, newLIdx) => {
    setState(s => ({ ...s, uIdx: newUIdx, lIdx: newLIdx }));
    setSidebarOpen(false);
  }, [setState]);

  const next = () => {
    markDone();
    if(lIdx < unit.lessons.length-1) setState(s=>({...s, lIdx: s.lIdx+1}));
    else if(uIdx < UNITS.length-1) setState(s=>({...s, uIdx: s.uIdx+1, lIdx: 0}));
    else setState(s=>({...s, screen: "certificate"}));
  };

  const back = () => {
    if(lIdx>0) setState(s=>({...s, lIdx: s.lIdx-1}));
    else if(uIdx>0) setState(s=>({...s, uIdx: s.uIdx-1, lIdx: UNITS[uIdx-1].lessons.length-1}));
  };

  const onReset = () => {
    setShowSettings(false);
    setState({ screen: "welcome", uIdx: 0, lIdx: 0, saved: {}, done: [], checks: {} });
    setTick(t=>t+1);
  };

  if (screen === "certificate") {
    return <><style>{CSS}</style><Certificate onBack={()=>setState(s=>({...s, screen:"course"}))}/></>;
  }
  if (screen === "welcome") {
    return (
      <>
        <style>{CSS}</style>
        <Welcome
          hasProgress={hasProgress}
          progress={{doneCount, totalL}}
          doneSet={doneSet}
          onTheme={onTheme}
          onStart={(resume) => {
            if (!resume) setState({ screen:"course", uIdx:0, lIdx:0, saved:{}, done:[], checks:{} });
            else setState(s => ({ ...s, screen: "course" }));
          }}
        />
      </>
    );
  }

  const allDone = doneCount >= totalL;
  const k = `${uIdx}-${lIdx}`;
  const sv = saved[k];
  const onSave = v => save(k,v);
  const cacheKey = `lesson_${unit.id}_${lesson.id}_v1`;

  // A lesson with a quick check unlocks Next once it is passed. Lessons finished before checks existed stay unlocked.
  const hasCheck = !!(typeof EXTRAS !== "undefined" && EXTRAS[lesson.id] && EXTRAS[lesson.id].check);
  const passed = !!checks[k] || doneSet.has(k);
  const locked = hasCheck && !passed;
  const onPass = () => setState(s => ({ ...s, checks: { ...(s.checks || {}), [k]: true } }));

  const renderLesson = () => {
    const props = {lesson, color:unit.color, onSave, saved:sv, cacheKey, passed, onPass};
    switch(lesson.type) {
      case"platforms": return <PlatformsOverview {...props}/>;
      case"platforms_section": return <PlatformsSection {...props}/>;
      case"techniques": return <TechniquesLesson {...props}/>;
      case"templates": return <TemplatesLesson {...props}/>;
      case"industry_templates": return <IndustryLesson {...props}/>;
      case"final": return <FinalLesson {...props} onDone={markDone}/>;
      default: return <AIContentLesson {...props}/>;
    }
  };

  return (
    <>
      <style>{CSS}</style>
      <div key={tick} className="shell" style={{"--unit":unit.color,display:"flex",height:"100dvh",overflow:"hidden",fontFamily:"'Plus Jakarta Sans',sans-serif",color:"var(--ink)"}}>

        {sidebarOpen && <div className="sidebar-backdrop" onClick={()=>setSidebarOpen(false)}/>}

        {/* SIDEBAR: the whole course, always in view */}
        <nav aria-label="Course contents" className={`sidebar ${sidebarOpen?"open":""}`} style={{width:288,minWidth:288,height:"100%",display:"flex",flexDirection:"column",overflowY:"auto",flexShrink:0}}>
          <div className="sb-head">
            <div className="sb-brand">
              <div className="sb-ring" role="img" aria-label={`${Math.round((doneCount/totalL)*100)}% of the course done`}>
                <svg viewBox="0 0 44 44"><circle className="track" cx="22" cy="22" r="18"/><circle className="val" cx="22" cy="22" r="18" strokeDasharray={113.1} strokeDashoffset={113.1*(1-doneCount/totalL)}/></svg>
                <b>{Math.round((doneCount/totalL)*100)}%</b>
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div className="sb-title">AI Masterclass</div>
                <div className="sb-sub">{doneCount} of {totalL} lessons · for {NAME}</div>
              </div>
            </div>
          </div>

          <div className="sb-units">
            {UNITS.map((u0,ui)=>{
              const u = toned(u0);
              const dCount = u.lessons.filter((_,li)=>doneSet.has(`${ui}-${li}`)).length;
              const uDone = dCount === u.lessons.length;
              const active = uIdx===ui;
              return (
                <div key={u.id} style={{"--u":u.color,marginBottom:2}}>
                  <button onClick={()=>goto(ui,0)} aria-expanded={active} className={`sb-unit ${active?"on":""} ${uDone?"done":""}`}>
                    <span className="sb-num">{uDone?"✓":String(u.id).padStart(2,"0")}</span>
                    <span className="sb-name">{u.title}</span>
                    <span className="sb-count">{dCount}/{u.lessons.length}</span>
                  </button>
                  {active && (
                    <div className="sb-lessons">
                      {u.lessons.map((l,li)=>{
                        const lDone = doneSet.has(`${ui}-${li}`);
                        return (
                          <button key={l.id} onClick={()=>goto(ui,li)} aria-current={lIdx===li?"step":undefined} className={`sb-lesson ${lIdx===li?"on":""} ${lDone?"done":""}`}>
                            {l.title}{lDone && <span className="sr-only"> (done)</span>}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="sb-foot">
            {allDone && (
              <button onClick={()=>setState(s=>({...s, screen:"certificate"}))} className="w-primary" style={{width:"100%",padding:12,fontSize:13}}>Get my certificate</button>
            )}
            <div style={{display:"flex",gap:8}}>
              <button onClick={()=>setState(s=>({...s, screen:"welcome"}))} className="sb-btn">Course home</button>
              <button onClick={()=>setShowSettings(true)} title="Backup or reset" className="sb-btn">Save & reset</button>
            </div>
          </div>
        </nav>

        {/* MAIN CONTENT */}
        <main ref={mainRef} style={{flex:1,height:"100%",overflowY:"auto",minWidth:0,scrollBehavior:"auto"}}>
          <div className="topbar">
            <button className="menu-btn" onClick={()=>setSidebarOpen(true)} aria-label="Open course contents">☰ Lessons</button>
            <div className="topbar-text"><span style={{color:unit.color,fontWeight:700}}>Unit {unit.id}</span> · Lesson {lIdx+1} of {unit.lessons.length}<span className="topbar-title"> · {lesson.title}</span></div>
            <Narration lessonId={lesson.id} color={unit.color}/>
            <div className="topbar-pct">{Math.round((doneCount/totalL)*100)}%</div>
            <ThemeToggle compact onChange={onTheme}/>
            <div className="topbar-bar" role="progressbar" aria-label="Course progress" aria-valuemin={0} aria-valuemax={totalL} aria-valuenow={doneCount}><span style={{width:`${(doneCount/totalL)*100}%`,background:unit.color,color:unit.color}}/></div>
          </div>
          <div className="lesson" key={`${uIdx}-${lIdx}`}>

            {lIdx===0 && (
              <div className="fu cover">
                <div className="cover-num" aria-hidden="true">{String(unit.id).padStart(2,"0")}</div>
                <div className="cover-eyebrow">Unit {unit.id} of {UNITS.length}</div>
                <h1 className="cover-title">{unit.title}</h1>
                <p className="cover-tag">{unit.tagline}</p>
                <div className="cover-list" aria-label="Lessons in this unit">
                  {unit.lessons.map((l,li)=><span key={l.id}>{li+1}. {l.title}</span>)}
                </div>
              </div>
            )}

            <header className="fu lhead">
              <div className="lhead-eyebrow"><i aria-hidden="true"/>Lesson {lIdx+1} of {unit.lessons.length}</div>
              <h2 className="lhead-title">{lesson.title}</h2>
              {(doneSet.has(`${uIdx}-${lIdx}`) || sv) && (
                <div className="lhead-meta">
                  {doneSet.has(`${uIdx}-${lIdx}`) && <Tag color="#00C9A7" small>✓ Completed</Tag>}
                  {sv && <Tag color="#D9B36C" small>Reflection saved</Tag>}
                </div>
              )}
              <div className="lhead-rule" aria-hidden="true"/>
            </header>

            {renderLesson()}

            <div className="lnav-dots" aria-label="Lessons in this unit">
              {unit.lessons.map((l,li)=>(
                <button key={li} aria-label={`Lesson ${li+1}: ${l.title}`} onClick={()=>setState(s=>({...s, lIdx:li}))} style={{width:li===lIdx?22:7,background:li===lIdx?unit.color:doneSet.has(`${uIdx}-${li}`)?unit.color+"66":"rgb(var(--fg-rgb) / 0.12)"}}/>
              ))}
            </div>
            <nav className="lnav" aria-label="Lesson navigation">
              {(() => {
                const prev = lIdx>0 ? unit.lessons[lIdx-1] : uIdx>0 ? UNITS[uIdx-1].lessons[UNITS[uIdx-1].lessons.length-1] : null;
                const last = uIdx===UNITS.length-1 && lIdx===unit.lessons.length-1;
                const nxt = lIdx<unit.lessons.length-1 ? unit.lessons[lIdx+1] : !last ? UNITS[uIdx+1].lessons[0] : null;
                return (
                  <>
                    <button onClick={back} disabled={!prev}><small>← Previous</small><strong>{prev ? prev.title : "You're at the start"}</strong></button>
                    <button className="next" onClick={next} disabled={locked}>
                      <small>{last ? "Finish" : lIdx===unit.lessons.length-1 ? `Next: unit ${uIdx+2}` : "Next lesson"} →</small>
                      <strong>{last ? "Complete and get your certificate" : nxt.title}</strong>
                    </button>
                    {locked && <p className="lock-note">Answer the quick check above to unlock the next lesson.</p>}
                  </>
                );
              })()}
            </nav>
          </div>
        </main>
      </div>

      {showSettings && <SettingsModal onClose={()=>setShowSettings(false)} onReset={onReset}/>}
    </>
  );
}

applyTheme(THEME);
ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
