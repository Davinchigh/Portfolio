// Compiled from builds-src/masterclass.jsx. Edit the source, then run pnpm build:demos.
const { useState, useRef, useEffect, useCallback, useMemo } = React;
const STORE_KEY = "bfb_masterclass_preview_v1";
const CACHE_KEY = "bfb_masterclass_preview_cache_v1";
const KEY_KEY = "bfb_masterclass_unused";
const NAME = (() => {
  const clean = (v) => (v || "").replace(/[^\p{L}\p{M} .-]/gu, "").replace(/\s+/g, " ").trim().slice(0, 30);
  try {
    const fromLink = clean(new URLSearchParams(location.hash.slice(1)).get("name"));
    if (fromLink) {
      localStorage.setItem("bfb_visitor_name", fromLink);
      return fromLink;
    }
    return clean(localStorage.getItem("bfb_visitor_name")) || "friend";
  } catch (e) {
    return "friend";
  }
})();
const PREVIEW = { "lesson_1_1a_v1": `**Hey {{name}}, let's start with what AI actually is.**

Think of AI like a very well-read apprentice. It has read more text than any person could in a thousand lifetimes: books, websites, manuals, conversations. From all that reading it learned patterns: which words, ideas and answers usually follow which.

> AI doesn't "know" things the way you do. It predicts what a good answer looks like, based on everything it has read.

---

**How it learned**

Engineers showed it billions of examples and kept correcting it until its predictions got good. Then people rated its answers, and it learned to be more helpful and careful. That's why it can explain, draft, summarise and brainstorm.

**Why the way you ask matters**

Because AI predicts from your words, your words are the steering wheel. "Write a post" gets you something bland. "Write a warm Instagram post for my Kumasi bakery announcing our new coconut bread, under 60 words, with one emoji" gets you something you can actually use.

---

**The 7 types of AI you'll meet in this course**

- **Text:** chat assistants like Claude and ChatGPT
- **Image:** create pictures from a description
- **Video:** short clips from text or a photo
- **Audio:** natural voiceovers and music
- **Code:** formulas, scripts and simple apps
- **Agents:** AI that takes several steps on its own to reach a goal
- **Automation:** AI wired into your apps so routine work happens by itself

You don't need to master all seven today. You just need to know they exist, so you know what to reach for.

##  Reflection Exercise
Which one task in your week eats the most time? Write it down. By the end of this course, you'll know which of the seven types of AI can help with it.`, "lesson_1_1c_v1": `**{{name}}, your first real AI conversation starts here.**

**Step 1: Sign up.** Go to claude.ai or chat.openai.com and create a free account with your email or Google account.

**Step 2: Find the message box.** It's at the bottom of the screen. Everything happens there.

**Step 3: Start with who you are.** One or two sentences of context changes everything. For example: "I run a small tailoring business in Accra with two staff."

**Step 4: Ask for one clear thing.** "Help me write a polite WhatsApp message reminding a customer that her dress is ready for pick-up."

**Step 5: Read, then react.** Don't accept the first answer blindly. Say what you liked and what to change: "Good, but make it warmer and add that we're open until 7pm."

**Step 6: Save what works.** Copy the final version somewhere safe. Good prompts are reusable.

> Treat AI like a capable new colleague: give it context, ask clearly, and give feedback. It gets better with every message.

---

**Why context matters so much**

Without context, AI guesses. With context, it tailors. Compare "Plan a budget" with "Plan a monthly budget for a nurse in Tema earning GHS 4,500 who wants to save for a car." The second gets you something real.

##  Reflection Exercise
Have a 10-message conversation with an AI about something real in your life: a decision, a plan or a message you need to write. After each answer, give one piece of feedback. What changed between message 1 and message 10?`, "lesson_2_2a_v1": `**{{name}}, every great prompt has six ingredients.** You won't always need all six, but knowing them is the difference between "meh" and "wow".

**1. Role: who should the AI be?**
Weak: "Write a cover letter."
Strong: "You are an experienced HR manager at a Ghanaian bank."
Why it matters: a role sets the expertise and vocabulary.

**2. Task: what exactly do you want?**
Weak: "Help with my CV."
Strong: "Rewrite my CV summary in 3 sentences for a junior data analyst role."

**3. Context: what does it need to know?**
Weak: "Plan an event."
Strong: "Plan a 2-hour product launch for 40 guests in Osu, budget GHS 8,000, Saturday evening."

**4. Format: how should the answer look?**
"Give it as a table with columns for time, activity and person responsible."

**5. Tone: how should it sound?**
"Friendly but professional, like a message from a trusted older colleague."

**6. Constraints: the limits.**
"Under 150 words. No jargon. Don't mention prices."

---

> Put together: "You are an experienced events planner in Accra. Plan a 2-hour product launch for 40 guests in Osu with a GHS 8,000 budget. Present it as a timed table. Keep the tone upbeat and practical, and stay under 200 words."

That one prompt replaces five rounds of back and forth.

##  Reflection Exercise
Take a prompt you've used recently. Rewrite it using all six elements. Run both versions and compare. Which element made the biggest difference?`, "lesson_2_2d_v1": `**Ready to level up, {{name}}?** These five techniques are what separate casual users from people who get consistently excellent results.

**1. Prompt Chaining**
Break big jobs into steps, feeding each answer into the next prompt.
Example: (1) "List 10 blog ideas for a Ghanaian skincare brand." (2) "Take idea 4 and write an outline." (3) "Write the introduction from that outline."

**2. Devil's Advocate Prompting**
Ask AI to attack your idea before the world does.
Example: "Here's my plan to open a second shop in Kasoa. Give me the five strongest reasons it could fail."

**3. Persona Stacking**
Combine perspectives in one answer.
Example: "Review my pricing as a customer, an accountant and a competitor. Give each view separately."

**4. Calibration Prompting**
Ask how sure it is.
Example: "Answer, then rate your confidence from 1 to 10 and tell me what I should double-check."

> AI can sound confident and still be wrong. Calibration prompts make the uncertainty visible.

**5. Contextual Memory Refresh**
In long chats, AI can drift. Restate the key facts.
Example: "Quick reminder before we continue: the audience is first-year students, the budget is GHS 2,000 and the deadline is Friday."

---

##  Reflection Exercise
Pick a real project. Run a 3-step prompt chain: ideas, then a plan, then a first draft. Which step needed the most correction, and why?`, "lesson_3_3a_v1": `**{{name}}, here's how image AI works, in plain words.**

Image AI learned from millions of pictures paired with descriptions. When you type a description, it starts from random noise and gradually "sculpts" an image that matches your words. Clearer words, clearer picture.

**The image prompt formula**

> Subject + Style + Setting + Lighting + Mood + Technical specs

---

**Five professional prompts using the formula**

**Headshot:** "Professional headshot of a Ghanaian woman in her 30s, navy blazer, soft studio photography, neutral grey backdrop, soft window light, confident and approachable, 85mm lens, shallow depth of field."

**Product photography:** "A woven straw handbag on a cream linen surface, minimal editorial style, soft morning light from the left, calm and premium, high detail, square format."

**Logo concept:** "Minimal logo concept for a coffee brand called 'Kofi Brew', flat vector style, single colour, clean lines, white background."

**Authentic market scene:** "Busy Makola market stall with colourful fabrics, documentary photography, late afternoon golden light, lively and warm, wide angle."

**Presentation background:** "Abstract background of soft gold and deep green gradients with subtle geometric lines, modern corporate style, lots of empty space for text, 16:9."

**Quality boosters:** high detail, sharp focus, professional photography, natural skin texture.
**Negative prompts** (where the tool supports them): blurry, distorted hands, extra fingers, watermark, text.

##  Reflection Exercise
Write an image prompt for something you need this month: a flyer image, a profile picture or a slide background. Label each part of the formula in your prompt.`, "lesson_3_3b_v1": `**{{name}}, let's put image AI to work on real business jobs.**

**Social media content**
"Flat-lay of fresh Ghanaian breakfast: koko, koose and bread on a wooden table, overhead shot, bright natural light, cheerful, Instagram square."

**Brand photography**
"Hands of a seamstress cutting kente-inspired fabric on a wooden table, close-up, warm workshop light, authentic and proud, editorial photography."

**Marketing campaign**
"A young professional in Accra smiling at her phone on a trotro, candid street photography, morning light, optimistic, room on the right for a headline."

**Consistent characters**
Describe the character the same way every time and save the description: "Ama, a 28-year-old Ghanaian nurse with short natural hair, round glasses, teal scrubs." Many tools also let you upload a reference image to keep her face consistent.

**Presentation visuals**
"Simple isometric illustration of a small shop connected to a phone and a delivery bike, flat colours, white background, clean."

---

**Which tool for what?**

- **Midjourney:** the most artistic and polished images, great for campaigns
- **ChatGPT's image tool:** best at following detailed instructions and putting readable text in images
- **Leonardo AI:** strong free tier, good for consistent characters and product shots

> Always check the details before you publish: hands, text and logos are where image AI still slips.

##  Reflection Exercise
Choose one use case above that fits your work. Write your own prompt for it, generate two versions in different tools, and note which one fits your brand better.`, "lesson_4_4a_v1": `**{{name}}, video AI is newer, but it's already useful.**

**Four types**
- **Text-to-video:** describe a scene, get a clip
- **Image-to-video:** bring a still photo to life
- **Video-to-video:** restyle existing footage
- **AI avatars:** a presenter speaks your script on camera

**The video prompt formula**

> Scene + Camera movement + Style + Lighting + Pacing

**Camera terms professionals use:** slow push-in, pull-back, pan left, tilt up, tracking shot, orbit, drone fly-over, handheld, static wide shot.

---

**Five real prompts**

**Social media short:** "Close-up of fresh jollof being served at a party, slow push-in, vibrant food-commercial style, warm evening light, upbeat pacing, 6 seconds."

**Corporate opener:** "Drone fly-over of the Accra skyline at sunrise, slow and smooth, cinematic, golden light, calm and confident pacing."

**AI avatar script:** "Hello! I'm Esi from Bright Path Consulting. In the next minute, I'll show you three ways to cut your monthly costs." (Paste it into an avatar tool and choose a presenter.)

**Educational animation:** "Simple 2D animation of a seed growing into a cocoa tree, side view, soft flat colours, gentle pacing."

**Music video concept:** "Dancers on a rooftop in Osu at dusk, orbiting camera, neon highlights, energetic pacing, Afrobeats mood."

**Current limitations:** clips are short, hands and text can warp, and keeping the same person across clips is still hard. Plan for short, simple shots.

##  Reflection Exercise
Think of one short video your work or a business you love could post. Write the prompt using all five parts of the formula.`, "lesson_5_5a_v1": `**{{name}}, voice AI can turn any script into a natural voiceover.**

**What it can do:** narrate videos, read lessons aloud, create podcast intros, translate a message into other voices and languages, and give a consistent voice to a brand.

**Writing for the ear, not the eye**
- Short sentences. One idea each.
- Use commas and full stops for pauses. Use "..." for a longer pause.
- Write numbers how they're said: "two thousand cedis", not "GHS 2,000".
- Put the word you want stressed near the end of the sentence.

---

**A voiceover script written for AI**

"Every morning... thousands of small businesses in Ghana open their doors. They work hard. They serve well. But too many of them are invisible online. At Bright Path, we change that. In just two weeks, we'll give your business a website your customers will love. Bright Path. Be seen."

**Voice cloning with ElevenLabs**
You upload a few minutes of clean recordings of a voice, and the tool learns to speak in that voice. It's useful for narrating your own courses without recording every time.

> Only clone your own voice, or a voice you have clear written permission to use.

##  Reflection Exercise
Write a 60-second voiceover script (about 140 words) for a product, service or cause you care about. Read it aloud once. Where did you stumble? Rewrite those lines.`, "lesson_5_5b_v1": `**{{name}}, you can make original music in minutes.**

Tools like **Suno** and **Udio** create full songs, with or without vocals, from a description.

**The music prompt formula**

> Genre + Mood + Instruments + Vocal style + Tempo + Theme

---

**Four complete prompts**

**Afrobeats:** "Afrobeats, joyful and confident, log drums, shakers, bright guitar, smooth male vocals, 105 BPM, about chasing your dreams in Accra."

**Corporate background:** "Light corporate pop, optimistic, soft piano and plucked synths, no vocals, 95 BPM, for a product demo video."

**Podcast intro:** "Neo-soul intro, warm and curious, Rhodes piano, upright bass, brushed drums, no vocals, 85 BPM, 15 seconds."

**Documentary score:** "Cinematic ambient, reflective and hopeful, strings, kalimba, soft percussion, no vocals, slow tempo, about the people of a fishing village at dawn."

**Business uses:** background music for adverts, YouTube and TikTok videos, events and podcasts. Check each tool's licence terms: paid plans usually allow commercial use, free plans often don't.

**Writing your own lyrics:** Suno's custom mode lets you paste lyrics with sections like [Verse], [Chorus] and [Bridge], then choose a style.

##  Reflection Exercise
Write a music prompt for a jingle for a business you know. Then write a four-line chorus for it in custom mode. What mood are you trying to create?`, "lesson_6_6a_v1": `**{{name}}, you don't need to be a programmer to use code AI.** You just need to describe the problem clearly.

**What code AI can do for non-developers**
- Write Excel and Google Sheets formulas
- Create simple scripts that send emails or tidy files
- Build a basic web page
- Analyse a spreadsheet of numbers

**The non-developer code prompt formula**

> Describe the goal + show a sample of your data + ask for a plain-English explanation, where to put the code, and how to test it.

---

**Worked example 1: a spreadsheet formula**
"In Google Sheets, column B has sale amounts and column C has the region (Accra, Kumasi, Takoradi). Write a formula that totals sales for Kumasi only. Explain it in plain English and tell me exactly which cell to put it in."

**Worked example 2: an email reminder script**
"I keep customer due dates in Google Sheets: name in A, email in B, due date in C. Write a Google Apps Script that emails each customer a polite reminder three days before the due date. Explain step by step where to paste it, how to run it, and how to test it on my own email first."

**Worked example 3: a one-page website**
"Build a simple one-page website for a hair salon in Kumasi with sections for services, prices, opening hours and a WhatsApp button. Give me a single HTML file and explain how to open it on my laptop."

> Always test on a copy of your data first.

##  Reflection Exercise
What's one repetitive task in a spreadsheet you use? Write a prompt using the formula above to automate it.`, "lesson_6_6b_v1": `**{{name}}, AI can be your personal data analyst.**

**The step-by-step approach**
1. **Give it the data:** paste a table or upload a spreadsheet, and remove names and private details first.
2. **Ask layered questions:** start broad, then go deeper.
3. **Ask for visuals:** "Which chart would show this best, and why?"
4. **Ask what it means:** "What should a business owner do with this?"

---

**Sales analysis template**

"You are a business analyst. Here is 6 months of sales data for my shop [paste data]. 1) Summarise the overall trend in 3 sentences. 2) Show my top 5 products and bottom 5 products. 3) Which month was strongest and what might explain it? 4) Recommend 2 charts to present this. 5) Give 3 practical actions for next month."

**Customer feedback template**

"You are a customer experience expert. Here are 40 customer comments [paste]. 1) Group them into themes and count each. 2) Pick out the 3 biggest complaints with example quotes. 3) What are customers praising? 4) Suggest 3 improvements, from easiest to hardest."

> AI can miscount or misread a table. Check any number you're going to act on.

##  Reflection Exercise
What data do you already have: sales, attendance, budgets, feedback? Write one layered question you'd like answered about it.`, "lesson_7_7a_v1": `**{{name}}, automation is AI working for you while you sleep.**

**Every automation has three parts**

> Trigger, then an AI step, then an action.

Example: A new email arrives (trigger), AI decides whether it's urgent and summarises it (AI step), and the summary is sent to your WhatsApp (action).

---

**Four real examples**
- **Email:** sort incoming emails and draft polite replies for you to approve
- **Social media:** turn one blog post into five scheduled posts
- **Leads:** when someone fills a form, AI scores the lead and adds it to your sheet
- **Weekly reports:** every Friday, AI summarises the week's sales into a short report

**Tools:** Zapier, Make and n8n. Zapier has an AI builder where you describe the automation in plain words: "When a new row is added to my orders sheet, send the customer a thank-you email and notify me on Slack."

**Writing the AI step**
Inside the automation, the AI step needs its own instructions, like a job description:
"You categorise customer emails. Reply with one of: ORDER, COMPLAINT, QUESTION, OTHER."

**The key principle: ask for structured output**
Automations need predictable answers. Ask for JSON, like:
{"category": "ORDER", "urgent": true, "summary": "..."}
Then the next step can read each field reliably.

##  Reflection Exercise
Name one task you repeat every week. Write it as trigger, AI step and action. Which tool would you try first?`, "lesson_8_8a_v1": `**{{name}}, a chatbot answers. An agent acts.**

**A worked example: "Plan my team's end-of-year dinner in Accra."**

A chatbot gives you ideas. An agent could:
1. Ask how many people are coming and what the budget is
2. Search for restaurants that fit
3. Check reviews and opening times
4. Compare three options in a table
5. Draft an invitation
6. Create a calendar event
7. Report back, asking you to approve before booking

**Types of agents**
- **Single agents:** one AI with tools, like browsing or email
- **Multi-agent systems:** several AIs with different roles, like a researcher, a writer and an editor
- **Personal agents:** handle your inbox, calendar and reminders

---

**How to prompt an agent**

> Goal, Context, Tools, Success criteria, Guardrails

"**Goal:** find three venues for a team dinner. **Context:** 15 people, Friday 12 December, budget GHS 6,000, near East Legon. **Tools:** web search only. **Success:** a table with price per head, distance and a booking contact. **Guardrails:** don't book or pay for anything; ask me before contacting anyone."

Guardrails matter most: agents can take real actions, so be explicit about what they must not do.

##  Reflection Exercise
Design your own agent task. Write the goal, context, tools, success criteria and at least two guardrails.`, "lesson_8_8b_v1": `**{{name}}, RAG is how you give AI your own knowledge.**

AI knows a lot about the world, but nothing about your price list, your company policy or your notes. **RAG (Retrieval-Augmented Generation)** fixes that: the AI first looks things up in your documents, then answers using them.

> Think of it as giving the AI an open-book exam, with your files as the book.

---

**Four practical examples**
- **Business FAQ bot:** answers customer questions from your price list and delivery policy
- **Personal research assistant:** answers questions from 20 articles you've saved
- **HR policy bot:** staff ask "How many leave days do I have?" and it answers from the handbook
- **Professional guidelines assistant:** a nurse checks a procedure against the hospital guide

**Tools you can use today**
- Upload files to ChatGPT or Claude and ask questions about them
- Claude Projects and Custom GPTs keep your documents ready for every chat
- Notion AI answers questions from your Notion pages

**The critical phrase**
"Answer only using the documents provided. If the answer isn't in them, say you don't know."
Without it, AI may fill gaps with guesses.

##  Reflection Exercise
Which documents would you want an AI to know by heart? Write three questions you'd ask it about them.`, "lesson_10_10a_v1": `**{{name}}, AI is brilliant, and it's also flawed. Knowing how it fails is a professional skill.**

**Hallucinations**
AI sometimes states false things with total confidence: a book that doesn't exist, a wrong date, an invented statistic or a fake quote. It happens because AI predicts plausible text, not verified truth.

**Bias**
AI learned from the internet, and the internet over-represents some voices. It may assume a "doctor" is a man, misread African names, or default to American examples and prices. For African contexts, always check whether its advice actually fits your market, laws and culture.

**Other limitations**
- Its knowledge has a cut-off date unless it can search the web
- It can be weak at exact maths and counting
- It can't see your local situation unless you describe it
- It can lose track in very long conversations

---

> **The verification rule:** if you're going to publish it, act on it or send it to a client, verify every fact, figure, name and quote against a reliable source.

##  Reflection Exercise
Think of a situation in your work where trusting a wrong AI answer could cause real harm. What would you check, and how?`, "lesson_10_10b_v1": `**{{name}}, here's your practical privacy guide.**

**Never paste into AI**
- Passwords, PINs and one-time codes
- Ghana Card, passport or bank details
- Client names, health details or personal stories they told you in confidence
- Company secrets: unreleased plans, contracts, internal finances

**Why it matters:** conversations may be stored, reviewed for safety, or used to improve models depending on your settings and plan. Once it's pasted, you don't fully control it.

> **The public notice board test:** if you wouldn't pin it on a public notice board, don't paste it into AI.

---

**At work**
Follow your organisation's AI policy, use approved tools, and ask before using AI on client work.

**How to anonymise: before and after**

Before: "Write a warning letter to Kwame Asante, ID 4471, who was late 6 times in March at our Spintex branch."
After: "Write a warning letter to an employee who was late 6 times in one month. Keep it firm and fair."

You get the same help without exposing anyone.

**Deepfakes**
AI can now fake voices and videos. If a "boss" or "relative" calls urgently asking for money, hang up and call them back on a number you already know.

##  Reflection Exercise
Look at the last three things you asked an AI. Did any of them include information that failed the notice board test? How would you rewrite them?`, "lesson_10_10c_v1": "**{{name}}, let's talk about the big questions, calmly and practically.**\n\n**Transparency**\nIf AI wrote most of something important, be honest about it, especially at school, at work and with clients.\n\n**Bias in decisions about people**\nAI shouldn't be the final judge in hiring, lending or grading. A person must review decisions that affect people's lives.\n\n**Jobs, especially in Africa**\nSome tasks will be automated. But AI also lowers the cost of starting a business, learning new skills and reaching global clients from Accra, Lagos or Nairobi. The people who learn it early are best placed to benefit.\n\n**Consent and attribution**\nDon't clone someone's voice or face without permission. Credit artists and sources where you can.\n\n**Environmental cost**\nTraining and running AI uses a lot of electricity and water. Use it with purpose, not for everything.\n\n**Power concentration**\nMost major AI tools are built by a few companies far from Africa. That's why African builders, educators and voices matter in shaping how AI is used here.\n\n---\n\n> Here's your edge: you have values, context and empathy that AI will never have. AI can draft. Only you can decide what's right for your people.\n\n##  Reflection Exercise\nWhich of these questions matters most to you, and what is one rule you'll set for your own AI use because of it?", "lesson_11_11a_v1": `**{{name}}, AI skills are already creating new work.** Here are five real paths.

**Prompt Engineer:** designs and tests prompts that make AI reliable for a business. Hired by tech companies, agencies and startups. Freelance: yes.

**AI Automation Specialist:** connects AI to everyday tools like email, spreadsheets and CRMs so routine work runs itself. Hired by small and medium businesses and operations teams. Freelance: very much yes.

**AI Content Strategist:** plans and produces content with AI while keeping a human voice and quality. Hired by brands and media companies. Freelance: yes.

**AI Trainer or Educator:** teaches teams and communities to use AI well. This is a big opportunity across Africa, where demand for training is growing faster than the supply of trainers. Freelance: yes, through workshops and courses.

**AI Consultant for SMEs:** helps small businesses find where AI saves time or money and sets it up. Freelance: yes.

---

> AI skills are **additive**. A nurse who uses AI well, an accountant who automates reports, a teacher who builds AI lessons: each becomes more valuable in the job they already have.

**This week on LinkedIn**
1. Add "AI-assisted [your field]" to your headline
2. List the AI tools you use under Skills
3. Post one short, practical thing you learned in this course

##  Reflection Exercise
Which path fits you best right now, and what's one small step you can take towards it this week?`, "lesson_11_11b_v1": `**{{name}}, a portfolio proves what a CV only claims.**

**Five pieces that open doors**
- **Prompt library:** your 10 best prompts, each with the problem it solves
- **Before and after:** a messy task, then the AI-assisted result, side by side
- **Workflow diagrams:** a simple picture of an automation you built
- **Case studies:** problem, what you did, the result, ideally with a number like "saved 4 hours a week"
- **Your course certificate**

**Where to show it**
- **LinkedIn:** the Featured section and regular posts
- **A simple personal website:** tools like bolt.new can build one from a description in minutes

---

**The LinkedIn strategy**

> One practical AI post a week, for six months.

Show a prompt, a before and after, or a lesson learned. Twenty-six posts later, people will think of you when they think of AI.

##  Reflection Exercise
Plan three portfolio pieces you could make in the next month. For each, write the problem it solves and the result you'd show.`, "lesson_11_11c_v1": "**{{name}}, AI changes every week. You don't need to chase all of it.**\n\n**The 3-source strategy**\nPick three sources and ignore the rest:\n- **The Rundown AI:** a short daily newsletter\n- **AI Tool Report:** practical new tools\n- **LinkedIn:** follow five people who share hands-on AI work\n\n**The practice-first rule**\n\n> For every hour you spend reading about AI, spend two hours using it.\n\n**The monthly audit (30 minutes)**\n1. Which AI tools did I actually use this month?\n2. What saved me the most time?\n3. What's one new thing I'll try next month?\n\n---\n\n**One last thing**\n\nYou started this course as a beginner. Now you understand prompts, images, video, voice, code, automation and agents, and you know how to use them safely and honestly. Most people around you haven't taken that step yet. That's your edge.\n\nKeep going. Keep building. Keep sharing what you learn.\n\n##  Reflection Exercise\nWrite down your three sources, the day of the month for your audit, and one AI skill you'll practise next.", "technique_0_v1": "**Zero-Shot Prompting**\n\n**What it is:** asking AI to do a task with no examples, just clear instructions.\n\n**When to use it:** for simple, common tasks where AI already knows the pattern, like summaries, emails and definitions.\n\nBAD: write about savings\nGOOD: In 5 bullet points, explain to a first-time saver in Ghana why a mobile money savings account beats keeping cash at home. Use simple language.\n\n> Zero-shot works when your instructions are specific enough to stand alone.", "technique_1_v1": `**Few-Shot Prompting**

**What it is:** showing AI two or three examples of what you want before asking for more.

**When to use it:** when you need a specific style, format or voice that's hard to describe.

BAD: write product descriptions for my shop
GOOD: Here are two descriptions in my brand voice: "Shea butter, whipped soft. Your skin will thank you." and "Black soap, made in Tamale. Pure, simple, yours." Write three more in the same style for: coconut oil, cocoa butter and a loofah.

> Examples teach faster than explanations.`, "technique_2_v1": "**Chain of Thought**\n\n**What it is:** asking AI to reason step by step before giving the answer.\n\n**When to use it:** maths, planning, decisions and anything with several moving parts.\n\nBAD: Should I take the job in Kumasi?\nGOOD: Help me decide whether to take a job in Kumasi paying GHS 6,000 or stay in Accra on GHS 5,000. Think step by step: rent difference, transport, family, career growth. Then give a recommendation.\n\n> Asking for the steps makes mistakes easier to spot.", "technique_3_v1": "**Role Prompting**\n\n**What it is:** telling AI who to be, so it answers with the right expertise and tone.\n\n**When to use it:** whenever expertise or perspective matters.\n\nBAD: check my business plan\nGOOD: You are a loan officer at a Ghanaian rural bank. Review my business plan for a poultry farm and list the three questions you would ask before approving a GHS 30,000 loan.\n\n> The role sets the lens the AI looks through.", "technique_4_v1": "**Iterative Prompting**\n\n**What it is:** improving the answer through short rounds of feedback instead of expecting perfection first time.\n\n**When to use it:** writing, design ideas and anything creative.\n\nBAD: (accepting the first draft and giving up)\nGOOD: That's close. Keep the second paragraph, cut the first, make the ending more hopeful and bring it under 120 words.\n\n> The first answer is a draft. Your feedback is the edit.", "technique_5_v1": "**Constraint Prompting**\n\n**What it is:** setting clear limits: length, words to avoid, format or reading level.\n\n**When to use it:** when the output has to fit somewhere specific, like a flyer, a WhatsApp message or a slide.\n\nBAD: write a flyer for our church harvest\nGOOD: Write flyer text for a church harvest on Saturday 14 November at 10am. Maximum 40 words. Include date, time and venue. No more than one exclamation mark.\n\n> Constraints aren't limits on quality. They're a recipe for it.", "technique_6_v1": "**Template Prompting**\n\n**What it is:** saving a prompt with blanks so you can reuse it.\n\n**When to use it:** any task you do often.\n\nBAD: (typing a new prompt from scratch every week)\nGOOD: Write a weekly update for [TEAM] covering: wins [WINS], challenges [CHALLENGES] and next week's priorities [PRIORITIES]. Keep it under 150 words, friendly and clear.\n\n> Build your own small library of templates, and you'll save hours every month.", "technique_7_v1": "**Meta Prompting**\n\n**What it is:** asking AI to help you write a better prompt.\n\n**When to use it:** when you're not sure how to ask, or your results keep missing.\n\nBAD: make me a marketing plan\nGOOD: I want a marketing plan for my new bakery in Cape Coast. Before you write it, ask me the 5 questions you need answered to make it genuinely useful.\n\n> When in doubt, let AI interview you first." };
const personalise = (t) => t.split("{{name}}").join(NAME);
function previewCoach(prompt) {
  const p = prompt.toLowerCase();
  const checks = [
    ["Role", /\b(you are|act as|as an? |pretend you)/.test(p), 'Start with a role, e.g. "You are an experienced marketing manager in Accra."'],
    ["Task", /\b(write|create|plan|explain|summari[sz]e|draft|list|make|give|help|rewrite|design|analy[sz]e|suggest)\b/.test(p), "Say exactly what you want done, starting with a verb like write, plan or summarise."],
    ["Context", p.length > 90 || /\b(i run|i am|i'm|we are|my |our |for a |audience|customers?)\b/.test(p), "Add context: who it's for, your situation and the goal."],
    ["Format", /\b(table|bullet|list|steps|paragraphs?|email|post|outline|sentences?)\b/.test(p), "Ask for a format: a table, 5 bullet points, a short email."],
    ["Tone", /\b(tone|friendly|formal|warm|professional|casual|polite|upbeat|firm)\b/.test(p), "Name the tone: warm, professional, upbeat or firm."],
    ["Constraints", /\b(under|max|maximum|no more than|limit|avoid|don't|do not|words|characters|budget)\b/.test(p), "Add a limit: word count, things to avoid, a budget."]
  ];
  const have = checks.filter((c) => c[1]).map((c) => c[0]);
  const missing = checks.filter((c) => !c[1]);
  const score = have.length;
  let reply = `Prompt check: ${score} of 6 elements, ${NAME}.

`;
  reply += have.length ? `You've got: ${have.join(", ")}.

` : "";
  if (missing.length) {
    reply += `Try adding:
` + missing.slice(0, 3).map((m) => `• ${m[0]}: ${m[2]}`).join(String.fromCharCode(10));
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
  try {
    return JSON.parse(localStorage.getItem(STORE_KEY) || "{}");
  } catch {
    return {};
  }
}
function saveStore(data) {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(data));
  } catch {
  }
}
function loadCache() {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY) || "{}");
  } catch {
    return {};
  }
}
function saveCache(data) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch {
  }
}
function usePersistedState(initial) {
  const [state, setState] = useState(() => {
    const stored = loadStore();
    return { ...initial, ...stored };
  });
  useEffect(() => {
    saveStore(state);
  }, [state]);
  return [state, setState];
}
const CSS = `
*{box-sizing:border-box;}
html,body{margin:0;padding:0;}
::-webkit-scrollbar{width:6px;height:6px;}
::-webkit-scrollbar-track{background:transparent;}
::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.12);border-radius:3px;}
::-webkit-scrollbar-thumb:hover{background:rgba(255,255,255,0.22);}
textarea,input,button{font-family:'Plus Jakarta Sans',sans-serif;}
textarea::placeholder,input::placeholder{color:rgba(255,255,255,0.2);}
button:focus-visible,input:focus-visible,textarea:focus-visible{outline:2px solid #D9B36C;outline-offset:2px;}
@keyframes fadeUp{from{opacity:0;transform:translateY(14px);}to{opacity:1;transform:translateY(0);}}
@keyframes pulse{0%,100%{opacity:1;}50%{opacity:0.35;}}
@keyframes float{0%,100%{transform:translateY(0);}50%{transform:translateY(-7px);}}
@keyframes celebrate{from{opacity:0;transform:scale(0.8);}60%{transform:scale(1.04);}to{opacity:1;transform:scale(1);}}
@keyframes spin{from{transform:rotate(0deg);}to{transform:rotate(360deg);}}
.fu{animation:fadeUp 0.4s ease both;}
.spin{animation:spin 1s linear infinite;}

/* Responsive */
@media (max-width: 880px){
  .sidebar{position:fixed!important;left:0;top:0;bottom:0;z-index:100;transform:translateX(-100%);transition:transform 0.25s ease;width:280px!important;}
  .sidebar.open{transform:translateX(0);}
  .sidebar-backdrop{position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:99;}
  .menu-btn{display:flex!important;}
  .main-pad{padding:14px 16px 60px!important;}
  .hero-title{font-size:22px!important;}
  .lesson-title{font-size:22px!important;}
  .hero{padding:18px!important;}
}
.menu-btn{display:none;}
.topbar{position:sticky;top:0;z-index:40;display:flex;align-items:center;gap:12px;padding:12px 24px 14px;background:rgba(11,12,14,0.86);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border-bottom:1px solid rgba(255,255,255,0.05);font-size:12px;color:#9a9a9a;}
.topbar-text{flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.topbar-pct{font-weight:700;color:#EBD9B0;font-variant-numeric:tabular-nums;}
.topbar-bar{position:absolute;left:0;right:0;bottom:0;height:3px;background:rgba(255,255,255,0.05);}
.topbar-bar span{display:block;height:100%;transition:width .8s ease;}
.menu-btn{align-items:center;gap:6px;background:rgba(217,179,108,0.15);border:1px solid rgba(217,179,108,0.3);border-radius:8px;padding:8px 12px;color:#D9B36C;font-size:12px;font-weight:700;cursor:pointer;flex-shrink:0;}
.narr{display:flex;align-items:center;gap:8px;flex-shrink:0;}
.narr-btn{background:transparent;border:1px solid;border-radius:999px;padding:6px 12px;font-size:12px;font-weight:700;cursor:pointer;}
.narr-time{font-size:11px;color:#8a8a8a;font-variant-numeric:tabular-nums;}
.narr-rate{background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:6px;color:#cfcfcf;font-size:11px;padding:3px 6px;cursor:pointer;}
.narr-bar{width:70px;height:3px;border-radius:3px;background:rgba(255,255,255,0.08);overflow:hidden;}
.narr-bar span{display:block;height:100%;}
@media (max-width: 880px){ .topbar{padding:10px 14px 12px;} .topbar-title{display:none;} .narr-time,.narr-bar{display:none;} }
@media (prefers-reduced-motion: reduce){ .fu{animation:none;} .topbar-bar span{transition:none;} }
`;
const PLATFORMS = {
  text: [
    { n: "ChatGPT", url: "https://chat.openai.com", c: "#10A37F", e: "", d: "Best all-rounder. Free plan. Start here!" },
    { n: "Claude", url: "https://claude.ai", c: "#CC785C", e: "", d: "Brilliant for writing, analysis & long docs" },
    { n: "Gemini", url: "https://gemini.google.com", c: "#4285F4", e: "", d: "Google AI. Great for research + web access" },
    { n: "Copilot", url: "https://copilot.microsoft.com", c: "#0078D4", e: "⬡", d: "Microsoft AI. Built into Office & Windows" },
    { n: "Perplexity", url: "https://www.perplexity.ai", c: "#20B2AA", e: "◈", d: "AI + live web search. Best for research" },
    { n: "Grok", url: "https://grok.x.ai", c: "#888", e: "⊕", d: "xAI. Real-time info, bold answers" }
  ],
  image: [
    { n: "Midjourney", url: "https://www.midjourney.com", c: "#D9B36C", e: "", d: "Most popular. Stunning artistic images" },
    { n: "DALL·E 3", url: "https://chat.openai.com", c: "#10A37F", e: "", d: "Inside ChatGPT Plus. Great for quick gen" },
    { n: "Leonardo AI", url: "https://leonardo.ai", c: "#F59E0B", e: "", d: "Free credits daily. Excellent characters" },
    { n: "Adobe Firefly", url: "https://firefly.adobe.com", c: "#FF6B35", e: "", d: "Commercially safe. Great for designers" },
    { n: "Ideogram", url: "https://ideogram.ai", c: "#D9B36C", e: "", d: "Best for images with text. Free plan" },
    { n: "Stable Diffusion", url: "https://stability.ai", c: "#FF6B6B", e: "", d: "Open-source. Free & customisable" }
  ],
  video: [
    { n: "Runway ML", url: "https://runwayml.com", c: "#00D2D3", e: "", d: "Industry standard. Text-to-video" },
    { n: "Sora", url: "https://sora.com", c: "#10A37F", e: "", d: "OpenAI video model. Highly realistic" },
    { n: "Pika Labs", url: "https://pika.art", c: "#D9B36C", e: "", d: "Fast video generation. Free tier" },
    { n: "Kling AI", url: "https://klingai.com", c: "#FF6B9D", e: "", d: "High quality text or image to video" },
    { n: "HeyGen", url: "https://heygen.com", c: "#FF9F43", e: "", d: "AI avatar videos. Great for business" },
    { n: "Synthesia", url: "https://synthesia.io", c: "#4285F4", e: "", d: "Professional AI presenter videos" }
  ],
  audio: [
    { n: "ElevenLabs", url: "https://elevenlabs.io", c: "#FF6B35", e: "", d: "Best text-to-speech. Clone your voice" },
    { n: "Suno", url: "https://suno.ai", c: "#D9B36C", e: "", d: "Full AI music from a text prompt" },
    { n: "Udio", url: "https://udio.com", c: "#00D2D3", e: "", d: "High-quality AI music. Remix & extend" },
    { n: "Murf AI", url: "https://murf.ai", c: "#10A37F", e: "", d: "Professional voiceovers for videos" },
    { n: "Adobe Podcast", url: "https://podcast.adobe.com", c: "#FF6B35", e: "", d: "AI audio cleanup. Studio-quality sound" }
  ],
  code: [
    { n: "GitHub Copilot", url: "https://github.com/features/copilot", c: "#555", e: "", d: "AI pair programmer in VS Code" },
    { n: "Cursor", url: "https://cursor.sh", c: "#D9B36C", e: "⌨️", d: "AI-first code editor. Chat your codebase" },
    { n: "bolt.new", url: "https://bolt.new", c: "#D9B36C", e: "", d: "Full-stack apps from one prompt" },
    { n: "Replit AI", url: "https://replit.com", c: "#FF6B35", e: "", d: "Build & deploy with AI. Beginner friendly" },
    { n: "v0 by Vercel", url: "https://v0.dev", c: "#333", e: "", d: "Generate UI components from descriptions" }
  ],
  automation: [
    { n: "Zapier", url: "https://zapier.com", c: "#FF4A00", e: "", d: "Connect 7,000+ apps without coding" },
    { n: "Make", url: "https://make.com", c: "#B8904A", e: "", d: "Visual workflow automation. Powerful" },
    { n: "n8n", url: "https://n8n.io", c: "#EA4B71", e: "", d: "Open-source. Connect anything" },
    { n: "Notion AI", url: "https://notion.so", c: "#555", e: "", d: "AI inside your notes & project tools" },
    { n: "Airtable AI", url: "https://airtable.com", c: "#FCB400", e: "", d: "AI-powered databases & spreadsheets" }
  ],
  agents: [
    { n: "AutoGPT", url: "https://agpt.co", c: "#10A37F", e: "", d: "Autonomous AI for multi-step tasks" },
    { n: "CrewAI", url: "https://crewai.com", c: "#FF6B6B", e: "", d: "Multiple AI agents working as a team" },
    { n: "Relevance AI", url: "https://relevanceai.com", c: "#00D2D3", e: "", d: "Build custom AI agents, no code" },
    { n: "Lindy", url: "https://lindy.ai", c: "#D9B36C", e: "", d: "Personal AI agents for email & tasks" },
    { n: "AgentGPT", url: "https://agentgpt.reworkd.ai", c: "#D9B36C", e: "", d: "Web-based autonomous AI agent" }
  ]
};
const UNITS = [
  {
    id: 1,
    emoji: "01",
    title: "Welcome: AI From Zero",
    color: "#D9B36C",
    dark: "#17150F",
    tagline: "No jargon. No fear. Just you, me, and AI getting acquainted.",
    lessons: [
      { id: "1a", title: "What Is AI, Really?", type: "ai_content", topic: "Explain what AI is to a complete beginner. Cover: what AI actually is (simple analogy), how it learned, why the way you prompt it matters, and the 7 types of AI (text, image, video, audio, code, agents, automation). Warm, personal, humanised tone. Include a reflection question at the end." },
      { id: "1b", title: "The AI Landscape: Your Map", type: "platforms" },
      { id: "1c", title: "Your First AI Conversation", type: "ai_content", topic: "Write a step-by-step walkthrough for the learner's very first AI conversation. Include: where to sign up, how the interface works (6 concrete steps), what to type first, how to give follow-up feedback, and why context matters. End with a practical exercise: have a 10-message conversation about something real in her life." }
    ]
  },
  {
    id: 2,
    emoji: "02",
    title: "Text Prompting: The Foundation",
    color: "#D9B36C",
    dark: "#17150F",
    tagline: "Master this and you master 80% of everything AI can do.",
    lessons: [
      { id: "2a", title: "Anatomy of a Perfect Prompt", type: "ai_content", topic: "Teach the learner the 6 elements of a perfect prompt (Role, Task, Context, Format, Tone, Constraints). For each: explain what it is, show a weak vs strong example, explain why it matters. Use real-world examples relevant to an African professional. End with a reflection exercise." },
      { id: "2b", title: "8 Core Prompting Techniques", type: "techniques" },
      { id: "2c", title: "Prompt Template Library", type: "templates" },
      { id: "2d", title: "Advanced Text Techniques", type: "ai_content", topic: "Teach the learner 5 advanced prompting techniques: Prompt Chaining, Devil's Advocate Prompting, Persona Stacking, Calibration Prompting (asking AI to rate its own confidence), and Contextual Memory Refresh. For each: what it is, when to use it, a concrete example. End with a chain-prompting exercise." }
    ]
  },
  {
    id: 3,
    emoji: "03",
    title: "Image Generation Prompting",
    color: "#D9B36C",
    dark: "#17150F",
    tagline: "Turn words into stunning visuals, zero design skills required.",
    lessons: [
      { id: "3a", title: "How Image AI Works", type: "ai_content", topic: "Explain to the learner how image AI works (simple), then teach the image prompt formula: Subject + Style + Setting + Lighting + Mood + Technical Specs. Show 5 professional image prompts with this formula: headshot, product photography, logo concept, authentic market scene, presentation background. Include quality booster terms and negative prompts. End with a reflection exercise." },
      { id: "3b", title: "Image Prompts by Use Case", type: "ai_content", topic: "Give the learner a comprehensive guide to image prompting for real business use cases: social media content, brand photography, marketing campaigns, AI character creation (consistent characters), and presentation visuals. Include complete copy-paste prompts for each. Mention Midjourney, DALL-E 3, Leonardo AI and which is best for each use case." },
      { id: "3c", title: "Image AI Platforms", type: "platforms_section", category: "image", tips: ["Try DALL·E 3 via ChatGPT: Type 'generate an image of...' with your full prompt", "Try Leonardo AI (free daily credits): Great for product shots and portraits", "Try Ideogram (free): Best if you need readable text inside your image", "Try Adobe Firefly (free): Best for commercially safe images for business use"] }
    ]
  },
  {
    id: 4,
    emoji: "04",
    title: "Video Generation Prompting",
    color: "#D9B36C",
    dark: "#17150F",
    tagline: "Create professional video content from a single sentence.",
    lessons: [
      { id: "4a", title: "How Video AI Works", type: "ai_content", topic: "Teach the learner how video AI works: types (text-to-video, image-to-video, video-to-video, AI avatars). Teach the video prompt formula: Scene + Camera Movement + Style + Lighting + Pacing. List camera movement terms professionals use. Show 5 real video prompts: social media short, corporate opener, AI avatar script, educational animation, music video concept. Include current limitations. End with a reflection exercise." },
      { id: "4b", title: "Video AI Platforms", type: "platforms_section", category: "video", tips: ["Try Pika Labs (free): Animate any image or generate from text prompt", "Try Runway ML (free credits): Use 'text to video' with a cinematic prompt", "Try HeyGen (free trial): Write a 60-second script and create an AI avatar video", "Try Kling AI (free tier): Excellent quality image-to-video results"] }
    ]
  },
  {
    id: 5,
    emoji: "05",
    title: "Audio & Voice AI",
    color: "#D9B36C",
    dark: "#17150F",
    tagline: "Generate music, voiceovers, and professional audio with AI.",
    lessons: [
      { id: "5a", title: "Text-to-Speech & Voice Cloning", type: "ai_content", topic: "Teach the learner all about voice AI: what it can do, how to format text for natural AI speech (pauses, emphasis, rhythm), show a complete voiceover script example optimised for AI TTS, explain voice cloning with ElevenLabs (what it is, how it works, practical uses). End with an exercise: write a 60-second voiceover script." },
      { id: "5b", title: "AI Music Generation", type: "ai_content", topic: "Teach the learner how to generate music with Suno and Udio. The music prompt formula: Genre + Mood + Instruments + Vocal Style + Tempo + Theme. Show 4 complete music prompts: Afrobeats, corporate background, podcast intro, documentary score. Explain practical business uses (no copyright issues). Explain Suno's custom mode for writing lyrics. End with a reflection exercise." },
      { id: "5c", title: "Audio AI Platforms", type: "platforms_section", category: "audio", tips: ["Try ElevenLabs (free): Type any paragraph and hear it in a realistic voice", "Try Suno (free): Write a music prompt and generate a full song in 30 seconds", "Try Udio (free): Try the same prompt in both Suno and Udio to compare", "Try Adobe Podcast (free): Upload a voice recording and hear the AI noise removal"] }
    ]
  },
  {
    id: 6,
    emoji: "06",
    title: "Code & Technical AI",
    color: "#D9B36C",
    dark: "#17150F",
    tagline: "You don't need to be a developer to build with AI code tools.",
    lessons: [
      { id: "6a", title: "Code AI for Non-Developers", type: "ai_content", topic: "Reassure the learner she doesn't need to code. Show what code AI can do for non-developers: Excel/Google Sheets formulas, email automation scripts, simple web pages, data analysis. Give the Non-Developer Code Prompt Formula (always ask for: explanation in plain English, where to install, how to test). Show 3 complete worked examples with full prompts." },
      { id: "6b", title: "AI for Data Analysis", type: "ai_content", topic: "Teach the learner how to use AI as a powerful data analyst. Step-by-step approach: give data, ask layered questions, request visualisation recommendations, ask for business implications. Show a complete Sales Analysis template and a Customer Feedback Analysis template with full prompts. End with a reflection exercise about her own data." },
      { id: "6c", title: "Code AI Platforms", type: "platforms_section", category: "code", tips: ["Try Claude or ChatGPT: Ask it to write an Excel formula for a calculation you do manually", "Try bolt.new (free): Describe a simple app idea and watch it build the whole thing", "Try Replit AI (free): Tell it you're not a developer and ask it to build something small", "Try v0.dev (free): Describe a web page and see it generate the visual design"] }
    ]
  },
  {
    id: 7,
    emoji: "07",
    title: "AI Automation & Workflows",
    color: "#D9B36C",
    dark: "#17150F",
    tagline: "Build systems that work for you while you sleep.",
    lessons: [
      { id: "7a", title: "What Is AI Automation?", type: "ai_content", topic: "Explain AI automation to the learner in plain English. Cover: what automation is (trigger + AI step + action), 4 real automation examples (email management, social media, lead management, weekly reporting). Then teach how to prompt Zapier's AI builder and how to write AI step system prompts inside automations. Include the key principle about JSON outputs. End with a reflection exercise." },
      { id: "7b", title: "Automation Platforms", type: "platforms_section", category: "automation", tips: ["Try Zapier (free): Connect Gmail to Google Sheets, auto-log every email you receive", "Try Notion AI (free): Write rough meeting notes, ask AI to turn them into action items", "Try Make.com (free): Build a visual workflow connecting 2 apps you use daily", "Try Airtable AI (free): Create a database, use AI to auto-fill fields based on your data"] }
    ]
  },
  {
    id: 8,
    emoji: "08",
    title: "AI Agents: The Next Frontier",
    color: "#D9B36C",
    dark: "#17150F",
    tagline: "AI that doesn't just answer, it acts.",
    lessons: [
      { id: "8a", title: "What Are AI Agents?", type: "ai_content", topic: "Explain AI agents to the learner: chatbot vs agent difference with a real worked example (7-step task). Types of agents: single, multi-agent systems, personal agents. How to prompt an agent effectively: Goal, Context, Tools, Success Criteria, Guardrails, with a complete worked example. End with a reflection exercise designing her own agent task." },
      { id: "8b", title: "RAG & Custom Knowledge Bases", type: "ai_content", topic: "Explain RAG (Retrieval-Augmented Generation) to the learner in plain English. Why it matters: AI knows general things but not YOUR company's specific data. Show 4 practical examples: business FAQ bot, personal research assistant, HR policy bot, professional guidelines assistant. List tools: ChatGPT file upload, Claude, Notion AI, Custom GPTs. The critical RAG prompt phrase. End with a reflection exercise." },
      { id: "8c", title: "Agent AI Platforms", type: "platforms_section", category: "agents", tips: ["Try Perplexity AI: Research a topic and watch how it browses the web in real time", "Try Claude with a document: Upload a PDF and ask it detailed questions about the content", "Try ChatGPT Custom GPTs: Explore the GPT Store and find one tailored to your field", "Try Lindy (free trial): Set up a personal AI agent to help draft email responses"] }
    ]
  },
  {
    id: 9,
    emoji: "09",
    title: "Real-World Industry Applications",
    color: "#D9B36C",
    dark: "#17150F",
    tagline: "Exactly how professionals in every field use AI right now.",
    lessons: [
      { id: "9a", title: "AI for Business & Entrepreneurship", type: "industry_templates", industry: "Business & Entrepreneurship", tasks: ["Market Research (Ghana-specific)", "Investor Pitch Deck Narrative (10 slides)", "Executive Summary for Business Plan", "Competitor Analysis", "Go-to-Market Strategy"] },
      { id: "9b", title: "AI for Marketing & Communications", type: "industry_templates", industry: "Marketing & Communications", tasks: ["90-Day Marketing Strategy", "Content Repurposing Engine (7 formats from 1 piece)", "Brand Voice Guide", "Social Media Calendar (2 weeks)", "Email Campaign Sequence"] },
      { id: "9c", title: "AI for HR & People Management", type: "industry_templates", industry: "HR & People Management", tasks: ["Job Description Writer", "Interview Question Set", "Difficult Performance Conversation Script", "Employee Onboarding Plan", "Culture Survey Design"] },
      { id: "9d", title: "AI for Finance & Personal Planning", type: "industry_templates", industry: "Finance & Personal Planning", tasks: ["Personal Budget Builder", "Financial Report Analysis", "Contract First-Pass Review", "Business Case for Investment", "Salary Negotiation Prep"] }
    ]
  },
  {
    id: 10,
    emoji: "10",
    title: "AI Safety, Ethics & Critical Thinking",
    color: "#D9B36C",
    dark: "#17150F",
    tagline: "Great power requires great responsibility.",
    lessons: [
      { id: "10a", title: "Hallucinations, Bias & Limitations", type: "ai_content", topic: "Teach the learner honestly about AI's flaws: hallucinations (what they are, real examples, why they happen), bias in AI (gender, racial, cultural, especially relevant for African contexts), the full list of AI limitations. The verification rule for professional use. End with a reflection exercise about a risky scenario in her work." },
      { id: "10b", title: "Privacy & What NOT to Share", type: "ai_content", topic: "Give the learner a practical privacy guide for AI use. What never to share (passwords, IDs, client info, company secrets). Why (data storage, training use). The public notice board test. At-work guidelines. How to anonymise sensitive information with before/after examples. Deepfakes awareness. End with a reflection on her current AI use habits." },
      { id: "10c", title: "AI Ethics: The Big Picture", type: "ai_content", topic: "Walk the learner through the major AI ethical questions: transparency in AI use, bias in decisions affecting people, AI's impact on jobs (especially in Africa), consent and attribution, environmental cost, power concentration in Western tech companies. Keep it grounded and practical. End by empowering her: she has values, context, and empathy AI will never have. That's the edge." }
    ]
  },
  {
    id: 11,
    emoji: "11",
    title: "Your AI Career & Future",
    color: "#D9B36C",
    dark: "#17150F",
    tagline: "How to turn these skills into real professional opportunities.",
    lessons: [
      { id: "11a", title: "AI Career Opportunities", type: "ai_content", topic: "Show the learner the real AI career opportunities emerging right now: Prompt Engineer, AI Automation Specialist, AI Content Strategist, AI Trainer/Educator (especially the African opportunity), AI Consultant for SMEs. For each: what they do, who hires them, can they freelance. Then explain how AI skills are ADDITIVE to her current career, and how to position herself on LinkedIn starting this week." },
      { id: "11b", title: "Building Your AI Portfolio", type: "ai_content", topic: "Teach the learner how to build an AI portfolio that opens doors: Prompt Library, Before/After showcases, Workflow Diagrams, Case Studies, her course certificate. Where to showcase it (LinkedIn, personal website via bolt.new). The LinkedIn strategy: one practical AI post per week for 6 months. End with an exercise: plan 3 portfolio pieces." },
      { id: "11c", title: "Staying Current in AI", type: "ai_content", topic: "Give the learner a sustainable strategy for staying current in AI without being overwhelmed: 3-source strategy (The Rundown AI, AI Tool Report, LinkedIn), practice-first rule (2 hours using for every 1 hour reading), monthly audit (30 minutes). Close with a powerful, personal message about the edge she now has and an encouragement to keep going." }
    ]
  },
  {
    id: 12,
    emoji: "12",
    title: "Final Project & Certification",
    color: "#D9B36C",
    dark: "#17150F",
    tagline: "Demonstrate everything you've learned. Earn your certificate.",
    lessons: [
      { id: "12a", title: "Final Project: Part 1: AI Toolkit", type: "final", minLen: 300, instructions: "Create your Personal AI Toolkit:\n\nA) PROMPT LIBRARY: Write 5 reusable prompt templates for tasks you actually face. Each must use all 6 elements with [BRACKETS] for customisation. Cover at least 3 categories.\n\nB) AI STACK: Pick 8 AI tools you'll actually use. For each: name, URL, what you'll use it for, why this one, your first project.\n\nC) TOP 3 TECHNIQUES: From all the techniques you learned, which 3 are most powerful for you? Explain why and give a real use case each.\n\nD) FIRST AUTOMATION: Describe one real automation you'll build in 30 days. Trigger → AI Step → Action.", placeholder: "A) MY PROMPT LIBRARY:\n\nTemplate 1: [Task]:\nRole: You are a...\nTask: ...\nContext: ...\nFormat: ...\nTone: ...\nConstraints: ...\n\n(add all 5 templates)\n\n---\nB) MY AI STACK:\n1. [Tool name] | [Use] | [Why] | [First project]\n(add all 8)\n\n---\nC) MY TOP 3 TECHNIQUES:\n1. [Name]: Why: ... Real use case: ...\n\n---\nD) MY FIRST AUTOMATION:\nTrigger: ...\nAI Step: ...\nAction: ..." },
      { id: "12b", title: "Final Project: Part 2: Applied Challenge", type: "final", minLen: 200, instructions: "Multi-modal AI campaign challenge. Use at least 4 AI tools.\n\nTHE CHALLENGE: Create a mini campaign for something you care about (business idea, cause, personal brand, event).\n\n1. STRATEGY: Write a full prompt for a 30-day awareness strategy. Paste the prompt + summarise output.\n\n2. VISUAL IDENTITY: Write 2 image prompts (logo concept + key visual). Describe what you got.\n\n3. CONTENT: Use the repurposing template to create 3 pieces of content from one core message.\n\n4. AUTOMATION: Describe how you'd automate this campaign. Trigger → AI step → Action.\n\n5. VIDEO CONCEPT: Write the prompt for a 15-second promotional video.\n\nDocument everything: prompts, outputs, what worked, what didn't.", placeholder: "MY CAMPAIGN: [Name & 1-sentence description]\n\n1. STRATEGY PROMPT:\n...\nSummary of AI output:\n...\n\n2. IMAGE PROMPTS:\nLogo: ...\nKey visual: ...\nWhat I got: ...\n\n3. CONTENT (3 pieces):\n...\n\n4. AUTOMATION PLAN:\nTrigger: ...\nAI Step: ...\nAction: ...\n\n5. VIDEO PROMPT:\n...\n\nWHAT WORKED / WHAT DIDN'T:\n..." },
      { id: "12c", title: "Final Project: Part 3: Your Reflection", type: "final", minLen: 150, instructions: "Write a personal letter from where you are now to where you're going. At least 250 words. Be honest and personal.\n\nAnswer these in your own voice:\n1. Before this course, what did you think AI was? What were you afraid of?\n2. What was the most surprising thing you learned?\n3. Which technique will you use most in the next 90 days, and why?\n4. What do you still find challenging? (Naming gaps is how you fill them.)\n5. What ONE thing will you do differently in your work starting this week?\n6. Where do you see yourself professionally in 12 months if you apply this consistently?\n7. What would you teach first to a friend who's nervous about AI?\n8. What would you tell yourself the day before you started this course?", placeholder: "Dear Future " + NAME + ",\n\nBefore this course, I honestly thought AI was...\n\nThe most surprising thing I learned was...\n\nThe technique I'll use most is...\n\nI'm still unsure about...\n\nStarting this week, I will...\n\nIn 12 months I see myself...\n\nIf I had to teach one thing first, it would be...\n\nTo myself before this course I'd say...\n\nWith love and confidence,\n" + NAME }
    ]
  }
];
const TECHNIQUE_NAMES = [
  { name: "1. Zero-Shot Prompting", emoji: "" },
  { name: "2. Few-Shot Prompting", emoji: "" },
  { name: "3. Chain of Thought", emoji: "" },
  { name: "4. Role Prompting", emoji: "" },
  { name: "5. Iterative Prompting", emoji: "" },
  { name: "6. Constraint Prompting", emoji: "" },
  { name: "7. Template Prompting", emoji: "" },
  { name: "8. Meta Prompting", emoji: "" }
];
function fallbackLesson(topic) {
  return `**This lesson is coming soon in the preview.**

> ${topic}

##  Reflection Exercise
What is one task in your daily work you'd love AI to help with?`;
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
  return `**${name}**

This technique is part of the full course.`;
}
function fallbackTechniqueOld(name) {
  return `**${name}**, full lesson available once you add your Anthropic API key.

This technique is one of the 8 core methods you'll use every day. Add your key with the ** API Key** button to unlock the full lesson, including a weak-vs-strong comparison and a personalised African-context example.

BAD: write something about marketing
GOOD: (Full example loads once API key is provided)`;
}
function fallbackIndustry(lesson) {
  return lesson.tasks.map((t) => ({
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
async function askClaude(systemPrompt, userMsg, maxTokens = 800, cacheKey = null) {
  await new Promise((r) => setTimeout(r, 300));
  if (cacheKey && PREVIEW[cacheKey]) return personalise(PREVIEW[cacheKey]);
  if (!cacheKey) return previewCoach(userMsg);
  throw new Error("PREVIEW");
}
const Tag = ({ children, color = "#D9B36C", small }) => /* @__PURE__ */ React.createElement("span", { style: { display: "inline-block", fontSize: small ? 9 : 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: small ? "2px 8px" : "3px 11px", borderRadius: 20, background: color + "20", color, border: `1px solid ${color}40` } }, children);
const Btn = ({ children, onClick, disabled, color = "#D9B36C", outline, small, full, style = {} }) => /* @__PURE__ */ React.createElement("button", { onClick, disabled, style: { background: outline ? "transparent" : disabled ? "rgba(255,255,255,0.05)" : `linear-gradient(135deg,${color},${color}cc)`, border: outline ? `1px solid ${color}55` : "none", borderRadius: 10, padding: small ? "7px 16px" : "11px 26px", color: disabled ? "#333" : outline ? color : "#0B0C0E", fontSize: small ? 11 : 13, fontWeight: 700, letterSpacing: "0.04em", cursor: disabled ? "default" : "pointer", transition: "all 0.2s", fontFamily: "'Plus Jakarta Sans',sans-serif", width: full ? "100%" : "auto", ...style } }, children);
const Card = ({ children, style = {} }) => /* @__PURE__ */ React.createElement("div", { style: { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: 18, ...style } }, children);
const SL = ({ children }) => /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", color: "#555", textTransform: "uppercase", marginBottom: 10 } }, children);
const Code = ({ children }) => /* @__PURE__ */ React.createElement("div", { style: { background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: "14px 16px", fontFamily: "'JetBrains Mono',monospace", fontSize: 12, lineHeight: 1.85, color: "#B0C4DE", whiteSpace: "pre-wrap", overflowX: "auto" } }, children);
function Spinner({ color = "#D9B36C" }) {
  return /* @__PURE__ */ React.createElement("div", { className: "spin", style: { width: 20, height: 20, borderRadius: "50%", border: `2px solid ${color}33`, borderTop: `2px solid ${color}`, display: "inline-block" } });
}
function MD({ text, color }) {
  if (!text) return null;
  const html = text.replace(/\*\*(.*?)\*\*/g, '<strong style="color:#fff;font-weight:700">$1</strong>').replace(/`(.*?)`/g, '<code style="background:rgba(255,255,255,0.08);padding:2px 6px;border-radius:4px;font-family:JetBrains Mono,monospace;font-size:11px">$1</code>');
  return /* @__PURE__ */ React.createElement("div", null, html.split("\n\n").map((para, i) => {
    const p = para.trim();
    if (!p) return null;
    if (p.startsWith("---")) return /* @__PURE__ */ React.createElement("hr", { key: i, style: { border: "none", borderTop: "1px solid rgba(255,255,255,0.07)", margin: "18px 0" } });
    if (p.startsWith(">")) return /* @__PURE__ */ React.createElement("blockquote", { key: i, style: { borderLeft: `3px solid ${color}`, paddingLeft: 16, margin: "14px 0", color: "#D0D0E0", fontStyle: "italic", fontSize: 14, lineHeight: 1.7 } }, /* @__PURE__ */ React.createElement("span", { dangerouslySetInnerHTML: { __html: p.slice(1).trim() } }));
    if (p.startsWith("# ")) return /* @__PURE__ */ React.createElement("h2", { key: i, style: { fontFamily: "'Playfair Display',serif", fontSize: 22, color: "#fff", margin: "20px 0 10px" }, dangerouslySetInnerHTML: { __html: p.slice(2) } });
    if (p.startsWith("## ")) return /* @__PURE__ */ React.createElement("h3", { key: i, style: { fontFamily: "'Playfair Display',serif", fontSize: 17, color: "#fff", margin: "16px 0 8px" }, dangerouslySetInnerHTML: { __html: p.slice(3) } });
    const lines = p.split("\n");
    const firstItem = lines.findIndex((l) => /^[-•] /.test(l.trim()));
    if (firstItem !== -1 && lines.slice(firstItem).every((l) => /^[-•] /.test(l.trim()))) {
      const lead = lines.slice(0, firstItem).join(" ").trim();
      return /* @__PURE__ */ React.createElement("div", { key: i, style: { margin: "6px 0 12px" } }, lead && /* @__PURE__ */ React.createElement("p", { style: { fontSize: 14, lineHeight: 1.9, color: "#C0C0D0", margin: "0 0 6px" }, dangerouslySetInnerHTML: { __html: lead } }), /* @__PURE__ */ React.createElement("ul", { style: { margin: 0, paddingLeft: 20, display: "grid", gap: 6 } }, lines.slice(firstItem).map((l, j) => /* @__PURE__ */ React.createElement("li", { key: j, style: { fontSize: 14, lineHeight: 1.75, color: "#C0C0D0" }, dangerouslySetInnerHTML: { __html: l.trim().slice(2) } }))));
    }
    return /* @__PURE__ */ React.createElement("p", { key: i, style: { fontSize: 14, lineHeight: 1.9, color: "#C0C0D0", marginBottom: 10 }, dangerouslySetInnerHTML: { __html: p.split("\n").join("<br/>") } });
  }));
}
function LiveChat({ color, ctx }) {
  const [msgs, setMsgs] = useState([]);
  const [inp, setInp] = useState("");
  const [loading, setLoading] = useState(false);
  const bot = useRef();
  useEffect(() => {
    var _a;
    (_a = bot.current) == null ? void 0 : _a.scrollIntoView({ behavior: "smooth" });
  }, [msgs, loading]);
  const send = async () => {
    if (!inp.trim() || loading) return;
    const um = { role: "user", content: inp };
    const all = [...msgs, um];
    setMsgs(all);
    setInp("");
    setLoading(true);
    try {
      const txt = await askClaude(
        `You are a warm, expert AI tutor coaching the learner on prompt engineering. Context: ${ctx}. Keep responses under 180 words. When she writes a prompt, respond naturally AND give one brief coaching tip to improve it. Always warm. End with encouragement or a small follow-up question.`,
        inp,
        700
      );
      setMsgs([...all, { role: "assistant", content: txt }]);
    } catch (e) {
      const msg = e.message === "NO_KEY" ? "The preview coach is resting. Try again in a moment." : "Connection hiccup, please try again. (" + e.message + ")";
      setMsgs([...all, { role: "assistant", content: msg }]);
    }
    setLoading(false);
  };
  return /* @__PURE__ */ React.createElement("div", { style: { marginTop: 24 } }, /* @__PURE__ */ React.createElement("div", { style: { background: "rgba(0,0,0,0.25)", border: `1px solid ${color}28`, borderRadius: 14, overflow: "hidden" } }, /* @__PURE__ */ React.createElement("div", { style: { padding: "10px 14px", borderBottom: `1px solid ${color}18`, display: "flex", alignItems: "center", gap: 8 } }, /* @__PURE__ */ React.createElement("div", { style: { width: 7, height: 7, borderRadius: "50%", background: color, animation: "pulse 2s infinite" } }), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color } }, "LIVE AI PRACTICE"), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10, color: "#333", marginLeft: "auto" } }, "powered by Claude")), /* @__PURE__ */ React.createElement("div", { style: { minHeight: 90, maxHeight: 280, overflowY: "auto", padding: 14, display: "flex", flexDirection: "column", gap: 10 } }, msgs.length === 0 && /* @__PURE__ */ React.createElement("div", { style: { color: "#444", fontSize: 13, textAlign: "center", padding: "12px 0" } }, " Practice here, type any prompt and your AI tutor will respond and coach you."), msgs.map((m, i) => /* @__PURE__ */ React.createElement("div", { key: i, style: { display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" } }, /* @__PURE__ */ React.createElement("div", { style: { maxWidth: "85%", padding: "9px 13px", borderRadius: 10, background: m.role === "user" ? color + "28" : "rgba(255,255,255,0.04)", border: `1px solid ${m.role === "user" ? color + "38" : "rgba(255,255,255,0.06)"}`, fontSize: 13, lineHeight: 1.7, color: m.role === "user" ? "#fff" : "#D0D0D0", whiteSpace: "pre-wrap" } }, m.role === "assistant" && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 9, color, fontWeight: 700, marginBottom: 5, letterSpacing: "0.12em" } }, " AI TUTOR"), m.content))), loading && /* @__PURE__ */ React.createElement("div", { style: { display: "flex" } }, /* @__PURE__ */ React.createElement("div", { style: { padding: "9px 13px", borderRadius: 10, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 9, color, fontWeight: 700, marginBottom: 6, letterSpacing: "0.12em" } }, " AI TUTOR"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 4 } }, [0, 1, 2].map((j) => /* @__PURE__ */ React.createElement("div", { key: j, style: { width: 5, height: 5, borderRadius: "50%", background: color, animation: `pulse 1.2s ${j * 0.2}s infinite` } }))))), /* @__PURE__ */ React.createElement("div", { ref: bot })), /* @__PURE__ */ React.createElement("div", { style: { padding: "10px 14px", borderTop: "1px solid rgba(255,255,255,0.04)", display: "flex", gap: 10 } }, /* @__PURE__ */ React.createElement("input", { value: inp, onChange: (e) => setInp(e.target.value), onKeyDown: (e) => e.key === "Enter" && !e.shiftKey && send(), placeholder: "Type a prompt to practise... press Enter to send", style: { flex: 1, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 8, padding: "9px 12px", color: "#fff", fontSize: 12, outline: "none", fontFamily: "'Plus Jakarta Sans',sans-serif" } }), /* @__PURE__ */ React.createElement(Btn, { onClick: send, disabled: loading || !inp.trim(), color, small: true }, "→"))));
}
function AIContentLesson({ lesson, color, onSave, saved, cacheKey, passed, onPass }) {
  var _a;
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [ans, setAns] = useState(saved || "");
  const loaded = useRef(false);
  useEffect(() => {
    setAns(saved || "");
    loaded.current = false;
    setContent("");
    setErr("");
  }, [cacheKey]);
  useEffect(() => {
    if (loaded.current) return;
    loaded.current = true;
    setLoading(true);
    setErr("");
    askClaude(
      `You are writing lesson content for an AI & Prompt Engineering course designed specifically for the learner, a beginner based in Ghana. Voice: warm, humanised, encouraging, relatable, never condescending. Use concrete African/Ghanaian examples where relevant. Format with bold headers using ** **, use > for key callouts, use --- for section breaks. Include a practical reflection question at the end marked with ##  Reflection Exercise
[question here]`,
      lesson.topic,
      1e3,
      cacheKey
    ).then((txt) => {
      setContent(txt);
      setLoading(false);
    }).catch((e) => {
      setContent(fallbackLesson(lesson.topic));
      setErr(e.message === "NO_KEY" ? "no_key" : e.message);
      setLoading(false);
    });
  }, [cacheKey]);
  const parts = content.split("##  Reflection Exercise");
  const mainContent = parts[0] || "";
  const reflectionQ = ((_a = parts[1]) == null ? void 0 : _a.trim()) || "What is one thing from this lesson you'll try in the next 7 days?";
  return /* @__PURE__ */ React.createElement("div", { className: "fu" }, loading ? /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 12, padding: "40px 20px", color: "#555" } }, /* @__PURE__ */ React.createElement(Spinner, { color }), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 14 } }, "Loading lesson content...")) : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(MD, { text: mainContent, color }), /* @__PURE__ */ React.createElement(LessonExtras, { key: lesson.id, lessonId: lesson.id, color, passed, onPass }), /* @__PURE__ */ React.createElement(Card, { style: { marginTop: 20, borderColor: color + "30" } }, /* @__PURE__ */ React.createElement(SL, null, " Reflection Exercise"), /* @__PURE__ */ React.createElement("p", { style: { fontSize: 14, color: "#D0D0D0", marginBottom: 12, lineHeight: 1.7 } }, reflectionQ), /* @__PURE__ */ React.createElement("textarea", { value: ans, onChange: (e) => setAns(e.target.value), placeholder: "Write your reflection here, there are no wrong answers...", rows: 5, style: { width: "100%", background: "rgba(0,0,0,0.2)", border: `1px solid ${ans ? color + "44" : "rgba(255,255,255,0.07)"}`, borderRadius: 8, padding: "12px 14px", color: "#fff", fontSize: 13, lineHeight: 1.7, resize: "vertical", outline: "none", fontFamily: "inherit" } }), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 10, display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement(Btn, { color, onClick: () => onSave(ans), disabled: !ans.trim() }, "Save Reflection"), saved && /* @__PURE__ */ React.createElement(Tag, { color: "#00C9A7", small: true }, "✓ Saved")))), /* @__PURE__ */ React.createElement(LiveChat, { color, ctx: lesson.title }));
}
function PlatformsOverview({ color }) {
  const [cat, setCat] = useState("text");
  const catColors = { text: "#10A37F", image: "#D9B36C", video: "#00D2D3", audio: "#FF6B9D", code: "#10A37F", automation: "#FF6B35", agents: "#D9B36C" };
  const catLabels = { text: " Text AI", image: " Image AI", video: " Video AI", audio: " Audio AI", code: " Code AI", automation: " Automation", agents: " Agents" };
  return /* @__PURE__ */ React.createElement("div", { className: "fu" }, /* @__PURE__ */ React.createElement("p", { style: { fontSize: 14, color: "#888", marginBottom: 18, lineHeight: 1.7 } }, "All AI tools fall into 7 categories. Explore each, click any card to visit the platform directly."), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 18 } }, Object.entries(catLabels).map(([k, v]) => /* @__PURE__ */ React.createElement("button", { key: k, onClick: () => setCat(k), style: { background: cat === k ? catColors[k] : "rgba(255,255,255,0.04)", border: `1px solid ${cat === k ? catColors[k] : "rgba(255,255,255,0.07)"}`, borderRadius: 8, padding: "6px 13px", cursor: "pointer", color: cat === k ? "#0B0C0E" : "#666", fontSize: 11, fontWeight: 700, fontFamily: "inherit", transition: "all 0.15s" } }, v))), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 10 } }, (PLATFORMS[cat] || []).map((p, i) => /* @__PURE__ */ React.createElement("a", { key: i, href: p.url, target: "_blank", rel: "noopener noreferrer", style: { textDecoration: "none" } }, /* @__PURE__ */ React.createElement(Card, { style: { borderColor: p.c + "28", transition: "all 0.2s", cursor: "pointer" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10, marginBottom: 8 } }, /* @__PURE__ */ React.createElement("div", { style: { width: 34, height: 34, borderRadius: 8, background: p.c + "18", border: `1px solid ${p.c}38`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, flexShrink: 0 } }, p.e), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontWeight: 700, color: "#fff", fontSize: 13 } }, p.n), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 9, color: p.c, letterSpacing: "0.08em", fontWeight: 700 } }, "CLICK TO VISIT →"))), /* @__PURE__ */ React.createElement("p", { style: { fontSize: 11, color: "#666", lineHeight: 1.5 } }, p.d))))));
}
function PlatformsSection({ lesson, color }) {
  const plats = PLATFORMS[lesson.category] || [];
  return /* @__PURE__ */ React.createElement("div", { className: "fu" }, /* @__PURE__ */ React.createElement("p", { style: { fontSize: 14, color: "#C0C0D0", marginBottom: 16, lineHeight: 1.7 } }, "Top platforms for this category. Click to visit. Try the practice suggestions below to apply what you just learned."), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 10, marginBottom: 20 } }, plats.map((p, i) => /* @__PURE__ */ React.createElement("a", { key: i, href: p.url, target: "_blank", rel: "noopener noreferrer", style: { textDecoration: "none" } }, /* @__PURE__ */ React.createElement(Card, { style: { borderColor: p.c + "28", transition: "all 0.2s" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10, marginBottom: 8 } }, /* @__PURE__ */ React.createElement("div", { style: { width: 32, height: 32, borderRadius: 8, background: p.c + "18", border: `1px solid ${p.c}35`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 } }, p.e), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontWeight: 700, color: "#fff", fontSize: 13 } }, p.n), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 9, color: p.c, letterSpacing: "0.08em", fontWeight: 700 } }, "VISIT →"))), /* @__PURE__ */ React.createElement("p", { style: { fontSize: 11, color: "#666", lineHeight: 1.4 } }, p.d))))), lesson.tips && /* @__PURE__ */ React.createElement(Card, { style: { borderColor: color + "28" } }, /* @__PURE__ */ React.createElement(SL, null, " Practice These Right Now"), lesson.tips.map((tip, i) => /* @__PURE__ */ React.createElement("div", { key: i, style: { display: "flex", gap: 10, marginBottom: 10 } }, /* @__PURE__ */ React.createElement("div", { style: { width: 22, height: 22, borderRadius: "50%", background: color + "18", border: `1px solid ${color}35`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color, flexShrink: 0 } }, i + 1), /* @__PURE__ */ React.createElement("p", { style: { fontSize: 13, color: "#C0C0D0", lineHeight: 1.6 } }, tip)))), /* @__PURE__ */ React.createElement(LiveChat, { color, ctx: `${lesson.category} AI tools practice` }));
}
function TechniquesLesson({ lesson, color, onSave, saved, cacheKey }) {
  const [sel, setSel] = useState(null);
  const [tab, setTab] = useState("learn");
  const [content, setContent] = useState({});
  const [loading, setLoading] = useState(false);
  const [ans, setAns] = useState(saved || "");
  useEffect(() => {
    setAns(saved || "");
  }, [cacheKey]);
  const loadTechnique = async (idx) => {
    if (content[idx]) return;
    setLoading(true);
    const t = TECHNIQUE_NAMES[idx];
    try {
      const txt = await askClaude(
        "You are writing a lesson for the learner learning prompt engineering. Be warm, practical, concrete. Use Ghanaian/African examples where relevant.",
        `Teach the "${t.name}" prompting technique. Include: 1) What it is (2-3 sentences), 2) When to use it (2-3 sentences), 3) A weak prompt example (labelled BAD:), 4) A strong prompt using this technique (labelled GOOD:, make it detailed and realistic for an African professional), 5) A pro tip (1-2 sentences). Format clearly with bold labels.`,
        600,
        `technique_${idx}_v1`
      );
      setContent((prev) => ({ ...prev, [idx]: txt }));
    } catch (e) {
      setContent((prev) => ({ ...prev, [idx]: fallbackTechnique(t.name) }));
    }
    setLoading(false);
  };
  const handleSelect = (i) => {
    setSel(sel === i ? null : i);
    setTab("learn");
    if (sel !== i) loadTechnique(i);
  };
  const tc = TECHNIQUE_NAMES[sel];
  const tc_content = content[sel] || "";
  let badPrompt = "", goodPrompt = "";
  if (tc_content) {
    const badMatch = tc_content.match(/BAD:([\s\S]*?)(?=GOOD:|$)/i);
    const goodMatch = tc_content.match(/GOOD:([\s\S]*?)(?=\n[A-Z]|$)/i);
    badPrompt = badMatch ? badMatch[1].trim() : "";
    goodPrompt = goodMatch ? goodMatch[1].trim() : "";
  }
  return /* @__PURE__ */ React.createElement("div", { className: "fu" }, /* @__PURE__ */ React.createElement("p", { style: { fontSize: 13, color: "#666", marginBottom: 18, lineHeight: 1.7 } }, "8 essential techniques. Click any card to deep-dive, see what it is, compare weak vs strong examples, then practise it."), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))", gap: 10, marginBottom: 20 } }, TECHNIQUE_NAMES.map((t, i) => /* @__PURE__ */ React.createElement("div", { key: i, onClick: () => handleSelect(i), style: { background: sel === i ? color + "10" : "rgba(255,255,255,0.03)", border: `1px solid ${sel === i ? color + "40" : "rgba(255,255,255,0.07)"}`, borderRadius: 12, padding: 14, cursor: "pointer", transition: "all 0.2s" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 22, marginBottom: 8 } }, t.emoji), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, fontWeight: 700, color: sel === i ? color : "#D0D0D0", lineHeight: 1.3 } }, t.name)))), sel !== null && /* @__PURE__ */ React.createElement(Card, { style: { borderColor: color + "38", animation: "fadeUp 0.3s ease" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" } }, ["learn", "compare", "practice"].map((tb) => /* @__PURE__ */ React.createElement("button", { key: tb, onClick: () => setTab(tb), style: { background: tab === tb ? color : "transparent", border: `1px solid ${tab === tb ? color : "rgba(255,255,255,0.1)"}`, borderRadius: 7, padding: "6px 14px", cursor: "pointer", color: tab === tb ? "#0B0C0E" : "#777", fontSize: 11, fontWeight: 700, fontFamily: "inherit", transition: "all 0.2s" } }, tb === "learn" ? " Learn" : tb === "compare" ? " Compare" : " Practice"))), tab === "learn" && (loading ? /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 10, alignItems: "center", color: "#555", padding: "20px 0" } }, /* @__PURE__ */ React.createElement(Spinner, { color }), /* @__PURE__ */ React.createElement("span", null, "Loading technique...")) : /* @__PURE__ */ React.createElement(MD, { text: tc_content.split("BAD:")[0].split("GOOD:")[0], color })), tab === "compare" && (loading ? /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 10, alignItems: "center", color: "#555", padding: "20px 0" } }, /* @__PURE__ */ React.createElement(Spinner, { color }), /* @__PURE__ */ React.createElement("span", null, "Loading examples...")) : /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 14 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: "#FF6B6B", fontWeight: 700, letterSpacing: "0.1em", marginBottom: 8 } }, "✗ WEAK PROMPT (without this technique)"), /* @__PURE__ */ React.createElement(Code, null, badPrompt || "Example loading...")), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: "#00C9A7", fontWeight: 700, letterSpacing: "0.1em", marginBottom: 8 } }, "✓ STRONG PROMPT (with this technique applied)"), /* @__PURE__ */ React.createElement(Code, null, goodPrompt || "Example loading...")))), tab === "practice" && /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { style: { fontSize: 14, color: "#C0C0D0", lineHeight: 1.7, marginBottom: 14 } }, "Now use the ", /* @__PURE__ */ React.createElement("strong", { style: { color: "#fff" } }, tc == null ? void 0 : tc.name), " technique for a real task in your own life or work."), /* @__PURE__ */ React.createElement("textarea", { value: ans, onChange: (e) => setAns(e.target.value), placeholder: `Write your own prompt using ${tc == null ? void 0 : tc.name}...`, rows: 6, style: { width: "100%", background: "rgba(0,0,0,0.2)", border: `1px solid ${color}38`, borderRadius: 8, padding: "12px 14px", color: "#fff", fontSize: 13, lineHeight: 1.7, resize: "vertical", outline: "none", fontFamily: "inherit" } }), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 10, display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement(Btn, { color, onClick: () => onSave(ans), disabled: !ans.trim() }, "Save Practice"), saved && /* @__PURE__ */ React.createElement(Tag, { color: "#00C9A7", small: true }, "✓ Saved")))), /* @__PURE__ */ React.createElement(LiveChat, { color, ctx: "Prompting Techniques" }));
}
const TEMPLATE_CATS = [
  { name: " Professional", key: "professional" },
  { name: " Learning", key: "learning" },
  { name: " Creative", key: "creative" },
  { name: " Analysis", key: "analysis" }
];
const TEMPLATE_PROMPTS = {
  professional: [
    { title: "Professional Email", prompt: `You are a professional communications expert.

Write a [TONE: formal/friendly/firm] email from [YOUR NAME] to [RECIPIENT & ROLE] about [SUBJECT].

Key points to cover:
- [POINT 1]
- [POINT 2]
- [POINT 3]

Desired outcome: [WHAT YOU WANT TO HAPPEN]
Length: [SHORT / MEDIUM / LONG]
Do NOT include: [ANYTHING TO AVOID]` },
    { title: "Meeting Preparation", prompt: `You are a senior consultant preparing me for an important meeting.

Meeting with: [WHO, role, company, what they care about]
My goal: [WHAT I WANT TO ACHIEVE]
My concerns: [WHAT WORRIES ME]
Background: [CONTEXT]

Give me:
1. 5 smart questions I should ask
2. 3 likely objections + how to handle each
3. The one key message I must land
4. How to open the first 30 seconds` },
    { title: "Performance Review Prep", prompt: `Act as my career coach helping me prepare for my annual performance review.

My role: [JOB TITLE]
Key achievements this year: [LIST THEM]
Challenges I faced: [HONEST LIST]
What I want: [PAY RISE / PROMOTION / MORE RESPONSIBILITY]
My manager's style: [DESCRIBE THEM]

Help me:
1. Frame achievements powerfully (with metrics)
2. Address challenges constructively
3. Make my case for [WHAT I WANT]
4. Anticipate what my manager will push back on` },
    { title: "Salary Negotiation Script", prompt: `You are an expert negotiation coach. Help me prepare for a salary negotiation.

Current salary: [AMOUNT]
Salary I want: [TARGET AMOUNT]
My achievements this year: [LIST]
Market rate for my role in [CITY/COUNTRY]: [AMOUNT if known]
My leverage: [ANY OFFERS, SKILLS, ACHIEVEMENTS]

Give me:
1. The exact opening words to use
2. How to respond if they say "we don't have budget"
3. What to do if they offer less than I want
4. Non-salary benefits to negotiate if salary is stuck` }
  ],
  learning: [
    { title: "Explain Any Concept", prompt: `You are a brilliant teacher who makes complex things simple.

Concept: [TOPIC]
My background: [WHAT I ALREADY KNOW]
Why I need to understand it: [CONTEXT]

Explain using:
1. A simple 3-sentence overview
2. One real-world analogy relevant to [MY CONTEXT]
3. A practical example in action
4. The 3 most important things to remember
5. One common misconception` },
    { title: "Personal Study Plan", prompt: `Create a personalised study plan.

Subject: [TOPIC]
Current level: [BEGINNER / INTERMEDIATE / ADVANCED]
Available time: [HOURS PER WEEK]
Timeline: [HOW LONG I HAVE]
Goal: [WHAT I WANT TO BE ABLE TO DO]

Create a week-by-week plan:
- What to study each week
- Free resources to use
- Practical exercise per week
- How to measure progress` },
    { title: "Research Deep Dive", prompt: `You are a senior research analyst. I need to understand [TOPIC] deeply.

Context: [WHY YOU NEED THIS]
My current knowledge: [WHAT I KNOW]

Provide:
1. Overview (3 clear paragraphs)
2. The 5 most important things to know
3. Common misconceptions
4. Key debates or unresolved questions
5. Best resources to go deeper (books, articles, courses)
6. 3 questions worth researching further` }
  ],
  creative: [
    { title: "Social Media Calendar", prompt: `You are a social media strategist for [INDUSTRY].

Brand: [NAME]
Audience: [DESCRIBE YOUR AUDIENCE IN DETAIL]
Brand voice: [ADJECTIVES, e.g. warm, professional, bold]
Platform: [INSTAGRAM / LINKEDIN / TWITTER]
Frequency: [HOW OFTEN]

Create a 2-week content calendar:
- Topic/angle per day
- Caption (ready to post)
- Content type (photo/reel/carousel)
- Best time to post
- Hashtags

Don't repeat similar themes in the same week.` },
    { title: "Brand Story (3 Versions)", prompt: `You are a master storyteller and brand strategist.

My brand: [DESCRIPTION]
My journey: [HOW YOU GOT HERE, the real story]
Problem I solve: [BE SPECIFIC]
Ideal customer: [DESCRIBE IN DETAIL]
What makes me different: [YOUR HONEST ANSWER]

Write 3 versions:
1. 60-second spoken intro (for networking events)
2. LinkedIn About section (300 words)
3. Instagram bio (under 150 chars + 3 highlights)` },
    { title: "Content Repurposing Engine", prompt: `I have written this content: [PASTE ARTICLE / BLOG / REPORT]

Repurpose it into ALL of the following:
1. LinkedIn article (800 words, professional tone)
2. Instagram carousel (10 slides: heading + 2 sentences each)
3. Twitter/X thread (10 tweets, each under 280 characters)
4. Email newsletter (400 words + subject line)
5. WhatsApp message for client list (under 200 chars)
6. YouTube video script intro (60 seconds)
7. 3 pull quotes for graphics

Maintain my voice and key messages throughout.` }
  ],
  analysis: [
    { title: "Data Analysis", prompt: `You are a data analyst and business strategist.

Here is my data: [PASTE DATA OR DESCRIBE IT]

Please:
1. Summarise findings in plain English (no jargon)
2. Identify top 3 positive indicators
3. Flag top 3 concerns
4. Identify patterns or trends
5. Give 3 actionable recommendations
6. Note anything missing I should investigate

Flag anything you're uncertain about clearly.` },
    { title: "Competitor Analysis", prompt: `You are a senior market research analyst.

My business: [DESCRIBE WHAT YOU DO]
Market: [LOCATION / SECTOR]
My target customer: [DESCRIBE]

Research for me:
1. Top 5 direct competitors with pricing
2. Their key strengths and weaknesses
3. Gaps in the market I could fill
4. 3 things they do better than me
5. 3 things I could do better than them
6. A simple positioning recommendation` },
    { title: "Decision Analysis", prompt: `Help me make an important decision using structured analysis.

Decision: [WHAT YOU'RE DECIDING]
Option A: [DESCRIBE FULLY]
Option B: [DESCRIBE FULLY]
My constraints: [TIME / MONEY / RISK TOLERANCE / VALUES]
What matters most to me: [YOUR PRIORITIES]

Analyse step by step:
1. Pros and cons of each option
2. Short-term vs long-term implications
3. Risk assessment for each
4. What am I not considering?
5. Final recommendation with clear reasoning` }
  ]
};
function TemplatesLesson({ color }) {
  const [cat, setCat] = useState(0);
  const [open, setOpen] = useState(null);
  const [copied, setCopied] = useState(null);
  const copy = (i, text) => {
    navigator.clipboard.writeText(text);
    setCopied(i);
    setTimeout(() => setCopied(null), 2e3);
  };
  const c = TEMPLATE_CATS[cat];
  const templates = TEMPLATE_PROMPTS[c.key] || [];
  return /* @__PURE__ */ React.createElement("div", { className: "fu" }, /* @__PURE__ */ React.createElement("p", { style: { fontSize: 13, color: "#888", marginBottom: 18, lineHeight: 1.7 } }, "Ready-to-use prompt templates, click to expand, then copy and fill in the [BRACKETS] with your own details."), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, marginBottom: 18, flexWrap: "wrap" } }, TEMPLATE_CATS.map((ca, i) => /* @__PURE__ */ React.createElement("button", { key: i, onClick: () => {
    setCat(i);
    setOpen(null);
  }, style: { background: cat === i ? color : "rgba(255,255,255,0.04)", border: `1px solid ${cat === i ? color : "rgba(255,255,255,0.08)"}`, borderRadius: 8, padding: "6px 14px", cursor: "pointer", color: cat === i ? "#0B0C0E" : "#777", fontSize: 11, fontWeight: 700, fontFamily: "inherit", transition: "all 0.2s" } }, ca.name))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 10 } }, templates.map((t, i) => /* @__PURE__ */ React.createElement(Card, { key: i, style: { borderColor: open === i ? color + "40" : "rgba(255,255,255,0.07)", transition: "all 0.2s" } }, /* @__PURE__ */ React.createElement("div", { onClick: () => setOpen(open === i ? null : i), style: { display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" } }, /* @__PURE__ */ React.createElement("div", { style: { fontWeight: 700, color: "#fff", fontSize: 14 } }, t.title), /* @__PURE__ */ React.createElement("span", { style: { color: "#444", fontSize: 12 } }, open === i ? "▲" : "▼")), open === i && /* @__PURE__ */ React.createElement("div", { style: { marginTop: 14, animation: "fadeUp 0.25s ease" } }, /* @__PURE__ */ React.createElement(SL, null, "Prompt Template, fill in the [BRACKETS]"), /* @__PURE__ */ React.createElement(Code, null, t.prompt), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement(Btn, { color, small: true, onClick: () => copy(i, t.prompt) }, copied === i ? "✓ Copied!" : " Copy Template"), /* @__PURE__ */ React.createElement("a", { href: "https://chat.openai.com", target: "_blank", rel: "noopener noreferrer" }, /* @__PURE__ */ React.createElement(Btn, { outline: true, color: "#10A37F", small: true }, "Try on ChatGPT →")), /* @__PURE__ */ React.createElement("a", { href: "https://claude.ai", target: "_blank", rel: "noopener noreferrer" }, /* @__PURE__ */ React.createElement(Btn, { outline: true, color: "#CC785C", small: true }, "Try on Claude →"))))))), /* @__PURE__ */ React.createElement(LiveChat, { color, ctx: "Prompt Templates, ask for help customising any template" }));
}
function IndustryLesson({ lesson, color, cacheKey }) {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(null);
  const [copied, setCopied] = useState(null);
  const loaded = useRef(false);
  useEffect(() => {
    loaded.current = false;
    setTemplates([]);
  }, [cacheKey]);
  useEffect(() => {
    if (loaded.current) return;
    loaded.current = true;
    setLoading(true);
    askClaude(
      "You generate professional prompt templates. Return ONLY valid JSON, no markdown, no explanation, just the JSON array.",
      `Create ${lesson.tasks.length} professional prompt templates for ${lesson.industry} professionals. For each task in this list: ${lesson.tasks.join(", ")}.

Return JSON array: [{"task":"task name","prompt":"full prompt template with [BRACKETS] for customisation, detailed, professional, 100-200 words each"}]`,
      1200,
      cacheKey
    ).then((txt) => {
      try {
        const clean = txt.replace(/```json|```/g, "").trim();
        const data = JSON.parse(clean);
        setTemplates(data);
      } catch {
        setTemplates(fallbackIndustry(lesson));
      }
      setLoading(false);
    }).catch(() => {
      setTemplates(fallbackIndustry(lesson));
      setLoading(false);
    });
  }, [cacheKey]);
  const copy = (i, text) => {
    navigator.clipboard.writeText(text);
    setCopied(i);
    setTimeout(() => setCopied(null), 2e3);
  };
  return /* @__PURE__ */ React.createElement("div", { className: "fu" }, /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 18, padding: 14, background: color + "10", border: `1px solid ${color}28`, borderRadius: 12 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, fontWeight: 700, color, marginBottom: 5, letterSpacing: "0.1em" } }, lesson.industry.toUpperCase()), /* @__PURE__ */ React.createElement("p", { style: { fontSize: 13, color: "#C0C0D0", lineHeight: 1.6 } }, "Ready-to-use professional templates. Click to expand and copy.")), loading ? /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 12, padding: "30px 0", color: "#555" } }, /* @__PURE__ */ React.createElement(Spinner, { color }), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 14 } }, "Generating professional templates for ", lesson.industry, "...")) : /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 10 } }, templates.map((t, i) => /* @__PURE__ */ React.createElement(Card, { key: i, style: { borderColor: open === i ? color + "40" : "rgba(255,255,255,0.07)", transition: "all 0.2s" } }, /* @__PURE__ */ React.createElement("div", { onClick: () => setOpen(open === i ? null : i), style: { display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" } }, /* @__PURE__ */ React.createElement("div", { style: { fontWeight: 700, color: "#fff", fontSize: 14 } }, t.task), /* @__PURE__ */ React.createElement("span", { style: { color: "#444", fontSize: 12 } }, open === i ? "▲" : "▼")), open === i && /* @__PURE__ */ React.createElement("div", { style: { marginTop: 14, animation: "fadeUp 0.25s ease" } }, /* @__PURE__ */ React.createElement(SL, null, "Full Prompt Template"), /* @__PURE__ */ React.createElement(Code, null, t.prompt), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement(Btn, { color, small: true, onClick: () => copy(i, t.prompt) }, copied === i ? "✓ Copied!" : " Copy Template"), /* @__PURE__ */ React.createElement("a", { href: "https://chat.openai.com", target: "_blank", rel: "noopener noreferrer" }, /* @__PURE__ */ React.createElement(Btn, { outline: true, color: "#10A37F", small: true }, "Use on ChatGPT →")), /* @__PURE__ */ React.createElement("a", { href: "https://claude.ai", target: "_blank", rel: "noopener noreferrer" }, /* @__PURE__ */ React.createElement(Btn, { outline: true, color: "#CC785C", small: true }, "Use on Claude →"))))))), /* @__PURE__ */ React.createElement(LiveChat, { color, ctx: `${lesson.industry} professional AI applications` }));
}
function FinalLesson({ lesson, color, onSave, saved, onDone, cacheKey }) {
  const [ans, setAns] = useState(saved || "");
  useEffect(() => {
    setAns(saved || "");
  }, [cacheKey]);
  const ok = ans.trim().length >= (lesson.minLen || 100);
  return /* @__PURE__ */ React.createElement("div", { className: "fu" }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, marginBottom: 18, flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement(Tag, { color }, "Final Project"), /* @__PURE__ */ React.createElement(Tag, { color: "#D9B36C" }, "Capstone")), /* @__PURE__ */ React.createElement(Card, { style: { borderColor: color + "28", marginBottom: 18 } }, /* @__PURE__ */ React.createElement(SL, null, " Instructions"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, lineHeight: 1.9, color: "#C0C0D0", whiteSpace: "pre-wrap" } }, lesson.instructions)), /* @__PURE__ */ React.createElement("textarea", { value: ans, onChange: (e) => setAns(e.target.value), placeholder: lesson.placeholder, rows: 14, style: { width: "100%", background: "rgba(0,0,0,0.2)", border: `1px solid ${ans ? color + "40" : "rgba(255,255,255,0.07)"}`, borderRadius: 10, padding: "14px 16px", color: "#fff", fontSize: 13, lineHeight: 1.7, resize: "vertical", outline: "none", fontFamily: "'Plus Jakarta Sans',sans-serif" } }), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 6, fontSize: 11, color: ok ? "#00C9A7" : "#555" } }, ans.trim().length, " / ", lesson.minLen || 100, " characters minimum"), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 14, display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement(Btn, { color, onClick: () => {
    onSave(ans);
    onDone();
  }, disabled: !ok }, "✓ Submit This Part"), saved && /* @__PURE__ */ React.createElement(Tag, { color: "#00C9A7", small: true }, "✓ Submitted")), /* @__PURE__ */ React.createElement(LiveChat, { color, ctx: "Final project, ask for feedback on any part of your work" }));
}
function Certificate({ onBack }) {
  const d = (/* @__PURE__ */ new Date()).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  const corners = [{ top: 18, left: 18, borderTop: "2px solid rgba(217,179,108,0.4)", borderLeft: "2px solid rgba(217,179,108,0.4)" }, { top: 18, right: 18, borderTop: "2px solid rgba(217,179,108,0.4)", borderRight: "2px solid rgba(217,179,108,0.4)" }, { bottom: 18, left: 18, borderBottom: "2px solid rgba(217,179,108,0.4)", borderLeft: "2px solid rgba(217,179,108,0.4)" }, { bottom: 18, right: 18, borderBottom: "2px solid rgba(217,179,108,0.4)", borderRight: "2px solid rgba(217,179,108,0.4)" }];
  return /* @__PURE__ */ React.createElement("div", { style: { minHeight: "100vh", background: "#0B0C0E", display: "flex", alignItems: "center", justifyContent: "center", padding: 40, fontFamily: "'Plus Jakarta Sans',sans-serif" } }, /* @__PURE__ */ React.createElement("div", { style: { maxWidth: 700, width: "100%" } }, /* @__PURE__ */ React.createElement("div", { style: { background: "#111215", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 28, padding: 60, textAlign: "center", position: "relative", overflow: "hidden", animation: "celebrate 0.8s cubic-bezier(0.34,1.56,0.64,1)", boxShadow: "0 0 100px rgba(217,179,108,0.3)" } }, corners.map((c, i) => /* @__PURE__ */ React.createElement("div", { key: i, style: { position: "absolute", ...c, width: 44, height: 44 } })), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 60, marginBottom: 16, animation: "float 3s ease-in-out infinite" } }), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, letterSpacing: "0.35em", color: "#D9B36C", fontWeight: 700, marginBottom: 16 } }, "CERTIFICATE OF COMPLETION"), /* @__PURE__ */ React.createElement("p", { style: { fontFamily: "'Playfair Display',serif", fontSize: 15, color: "#555", fontStyle: "italic", marginBottom: 8 } }, "This proudly certifies that"), /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "'Playfair Display',serif", fontSize: 50, fontWeight: 800, background: "#D9B36C", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: 10, lineHeight: 1.15 } }, NAME), /* @__PURE__ */ React.createElement("p", { style: { fontFamily: "'Playfair Display',serif", fontSize: 15, color: "#555", fontStyle: "italic", marginBottom: 6 } }, "has successfully mastered"), /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "'Playfair Display',serif", fontSize: 26, color: "#fff", fontWeight: 700, marginBottom: 6 } }, "AI & Prompt Engineering"), /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "'Playfair Display',serif", fontSize: 17, color: "#D9B36C", fontStyle: "italic", marginBottom: 32 } }, "The Complete Masterclass"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "center", gap: 8, flexWrap: "wrap", marginBottom: 30 } }, ["12 Units", "40+ Lessons", "Text · Image · Video · Audio", "Code · Automation · Agents", "RAG & Knowledge Bases", "Industry Templates", "AI Ethics & Safety", "Career Development"].map((b) => /* @__PURE__ */ React.createElement("span", { key: b, style: { padding: "4px 12px", borderRadius: 20, background: "rgba(217,179,108,0.1)", border: "1px solid rgba(217,179,108,0.2)", fontSize: 10, color: "#D9B36C", fontWeight: 600 } }, b))), /* @__PURE__ */ React.createElement("div", { style: { borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 22, display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 28, flexWrap: "wrap", gap: 14 } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "'Playfair Display',serif", fontSize: 18, color: "#fff", fontStyle: "italic", marginBottom: 2 } }, "Claude AI"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: "#333", letterSpacing: "0.1em" } }, "COURSE INSTRUCTOR")), /* @__PURE__ */ React.createElement("div", { style: { textAlign: "right" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, color: "#777", marginBottom: 2 } }, d), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: "#333", letterSpacing: "0.1em" } }, "DATE COMPLETED"))), /* @__PURE__ */ React.createElement("div", { style: { padding: 22, background: "rgba(255,255,255,0.02)", borderRadius: 14, border: "1px solid rgba(255,255,255,0.05)" } }, /* @__PURE__ */ React.createElement("p", { style: { fontFamily: "'Playfair Display',serif", fontSize: 14, color: "#C0C0D0", lineHeight: 1.85, fontStyle: "italic" } }, '"', NAME, ', you came into this course as a beginner and leave as someone who genuinely understands AI across every domain: text, image, video, audio, code, automation, agents, ethics, and career. That is remarkable. More importantly, you know HOW to think about AI, critically, responsibly, and strategically. The world needs more people like you using this technology thoughtfully. Go build something extraordinary. The tools are in your hands. "'))), /* @__PURE__ */ React.createElement("div", { style: { textAlign: "center", marginTop: 24, display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement(Btn, { color: "#D9B36C", onClick: () => window.print() }, " Print / Save as PDF"), /* @__PURE__ */ React.createElement(Btn, { outline: true, color: "#D9B36C", onClick: onBack }, "← Back to course"))));
}
function Welcome({ onStart, hasProgress, progress }) {
  return /* @__PURE__ */ React.createElement("div", { style: { minHeight: "100vh", background: "#0B0C0E", display: "flex", alignItems: "center", justifyContent: "center", padding: 40, fontFamily: "'Plus Jakarta Sans',sans-serif" } }, /* @__PURE__ */ React.createElement("div", { style: { maxWidth: 640, textAlign: "center" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 64, marginBottom: 20, animation: "float 3s ease-in-out infinite" } }), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, letterSpacing: "0.32em", color: "#D9B36C", fontWeight: 700, marginBottom: 16 } }, "PERSONALISED MASTERCLASS"), /* @__PURE__ */ React.createElement("h1", { style: { fontFamily: "'Playfair Display',serif", fontSize: 50, fontWeight: 800, color: "#fff", lineHeight: 1.15, marginBottom: 10 } }, "AI & Prompt", /* @__PURE__ */ React.createElement("br", null), "Engineering"), /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "'Playfair Display',serif", fontSize: 20, color: "#D9B36C", fontStyle: "italic", marginBottom: 24 } }, "Designed for ", NAME), /* @__PURE__ */ React.createElement("p", { style: { fontSize: 15, color: "#888", lineHeight: 1.9, marginBottom: 36, maxWidth: 500, margin: "0 auto 36px" } }, "Hey ", NAME, "!  This is your complete AI course, from absolute zero to full mastery. Every lesson is warm and practical, with practice in every unit. No jargon. No rushing."), hasProgress && /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 30, padding: 18, background: "rgba(217,179,108,0.08)", border: "1px solid rgba(217,179,108,0.3)", borderRadius: 14 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "#D9B36C", fontWeight: 700, letterSpacing: "0.12em", marginBottom: 8 } }, " WELCOME BACK"), /* @__PURE__ */ React.createElement("p", { style: { fontSize: 14, color: "#D0D0E0", lineHeight: 1.6, marginBottom: 14 } }, "You've completed ", /* @__PURE__ */ React.createElement("strong", { style: { color: "#fff" } }, progress.doneCount), " of ", /* @__PURE__ */ React.createElement("strong", { style: { color: "#fff" } }, progress.totalL), " lessons. Your progress is saved, pick up exactly where you left off."), /* @__PURE__ */ React.createElement("button", { onClick: () => onStart(true), style: { background: "#D9B36C", border: "none", borderRadius: 12, padding: "12px 32px", color: "#0B0C0E", fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: "inherit" } }, "▶ Resume where I left off")), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 36, maxWidth: 480, margin: "0 auto 36px" } }, [["12", "Units"], ["40+", "Lessons"], ["7", "AI Types"], ["1", "Certificate"]].map(([n, l]) => /* @__PURE__ */ React.createElement("div", { key: l, style: { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "14px 8px" } }, /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "'Playfair Display',serif", fontSize: 28, fontWeight: 800, color: "#D9B36C" } }, n), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: "#666", fontWeight: 600, letterSpacing: "0.06em" } }, l)))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", marginBottom: 36 } }, ["Text Prompting", "Image Generation", "Video AI", "Voice & Music", "Code AI", "Automation", "AI Agents", "RAG", "Ethics", "Career", "Industry Templates", "Certificate"].map((t) => /* @__PURE__ */ React.createElement(Tag, { key: t, color: "#D9B36C" }, t))), /* @__PURE__ */ React.createElement("button", { onClick: () => onStart(false), style: { background: "#D9B36C", border: "none", borderRadius: 14, padding: "14px 42px", color: "#0B0C0E", fontSize: 15, fontWeight: 800, letterSpacing: "0.04em", cursor: "pointer", fontFamily: "'Plus Jakarta Sans',sans-serif", boxShadow: "0 0 50px rgba(217,179,108,0.4)" } }, hasProgress ? " Start again from unit 1" : ` Start unit 1, ${NAME} →`), /* @__PURE__ */ React.createElement("p", { style: { marginTop: 14, fontSize: 11, color: "#444" } }, "~6–10 hours total · Go at your own pace · Progress saved automatically to this browser")));
}
function ApiKeyModal({ onClose }) {
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
  return /* @__PURE__ */ React.createElement("div", { style: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 } }, /* @__PURE__ */ React.createElement("div", { style: { maxWidth: 500, width: "100%", background: "#111215", border: "1px solid rgba(217,179,108,0.3)", borderRadius: 16, padding: 28 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10, marginBottom: 14 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 24 } }), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h3", { style: { fontFamily: "'Playfair Display',serif", fontSize: 20, color: "#fff", margin: 0 } }, "Anthropic API Key"), /* @__PURE__ */ React.createElement("p", { style: { fontSize: 11, color: "#666", margin: "2px 0 0" } }, "For live AI-generated lessons and chat tutor"))), /* @__PURE__ */ React.createElement("p", { style: { fontSize: 13, color: "#C0C0D0", lineHeight: 1.7, marginBottom: 14 } }, "To unlock AI-generated lesson content and the live tutor chat, paste your Anthropic API key below. It is stored ", /* @__PURE__ */ React.createElement("strong", { style: { color: "#fff" } }, "only in this browser"), " (localStorage) and sent only to Anthropic's API."), /* @__PURE__ */ React.createElement("p", { style: { fontSize: 12, color: "#888", lineHeight: 1.6, marginBottom: 14 } }, "Don't have one? Get a key at ", /* @__PURE__ */ React.createElement("a", { href: "https://console.anthropic.com/settings/keys", target: "_blank", rel: "noopener", style: { color: "#D9B36C" } }, "console.anthropic.com"), ". Without a key, the course still works, you just see placeholder content for AI-generated lessons."), /* @__PURE__ */ React.createElement("div", { style: { position: "relative", marginBottom: 12 } }, /* @__PURE__ */ React.createElement(
    "input",
    {
      type: show ? "text" : "password",
      value: val,
      onChange: (e) => setVal(e.target.value),
      placeholder: "sk-ant-api03-...",
      style: { width: "100%", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "12px 50px 12px 14px", color: "#fff", fontSize: 13, fontFamily: "'JetBrains Mono',monospace", outline: "none" }
    }
  ), /* @__PURE__ */ React.createElement("button", { onClick: () => setShow(!show), style: { position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", background: "transparent", border: "none", color: "#888", cursor: "pointer", padding: 6, fontSize: 11 } }, show ? "" : "")), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 10, flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement(Btn, { color: "#D9B36C", onClick: save }, " Save Key"), localStorage.getItem(KEY_KEY) && /* @__PURE__ */ React.createElement(Btn, { outline: true, color: "#FF6B6B", onClick: remove, small: true }, "Remove Key"), /* @__PURE__ */ React.createElement(Btn, { outline: true, color: "#666", onClick: onClose, small: true }, "Cancel")), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 16, padding: 12, background: "rgba(255,193,18,0.08)", border: "1px solid rgba(255,193,18,0.2)", borderRadius: 10, fontSize: 11, color: "#FFC312", lineHeight: 1.6 } }, "Keys typed into a browser are vulnerable to browser extensions. Use a key with usage limits set in your Anthropic console.")));
}
function SettingsModal({ onClose, onReset }) {
  const fileRef = useRef();
  const exportData = () => {
    const data = {
      progress: loadStore(),
      cache: loadCache(),
      exportedAt: (/* @__PURE__ */ new Date()).toISOString(),
      version: 2
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `masterclass-backup-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.json`;
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
  return /* @__PURE__ */ React.createElement("div", { style: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 } }, /* @__PURE__ */ React.createElement("div", { style: { maxWidth: 500, width: "100%", background: "#111215", border: "1px solid rgba(217,179,108,0.3)", borderRadius: 16, padding: 28 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10, marginBottom: 18 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 24 } }), /* @__PURE__ */ React.createElement("h3", { style: { fontFamily: "'Playfair Display',serif", fontSize: 20, color: "#fff", margin: 0 } }, "Progress Settings")), /* @__PURE__ */ React.createElement(Card, { style: { marginBottom: 12 } }, /* @__PURE__ */ React.createElement(SL, null, " Backup Your Progress"), /* @__PURE__ */ React.createElement("p", { style: { fontSize: 12, color: "#999", lineHeight: 1.6, marginBottom: 10 } }, "Download a JSON file with all your reflections, completed lessons, and cached lesson content."), /* @__PURE__ */ React.createElement(Btn, { color: "#D9B36C", small: true, onClick: exportData }, " Export Backup")), /* @__PURE__ */ React.createElement(Card, { style: { marginBottom: 12 } }, /* @__PURE__ */ React.createElement(SL, null, " Restore from Backup"), /* @__PURE__ */ React.createElement("p", { style: { fontSize: 12, color: "#999", lineHeight: 1.6, marginBottom: 10 } }, "Restore from a previously exported backup file. This will replace your current progress."), /* @__PURE__ */ React.createElement("input", { type: "file", accept: ".json", ref: fileRef, onChange: importData, style: { display: "none" } }), /* @__PURE__ */ React.createElement(Btn, { outline: true, color: "#00C9A7", small: true, onClick: () => fileRef.current.click() }, " Choose Backup File")), /* @__PURE__ */ React.createElement(Card, { style: { marginBottom: 18, borderColor: "rgba(255,107,107,0.2)" } }, /* @__PURE__ */ React.createElement(SL, null, " Reset Everything"), /* @__PURE__ */ React.createElement("p", { style: { fontSize: 12, color: "#999", lineHeight: 1.6, marginBottom: 10 } }, "Delete all your saved progress, reflections, and cached content. This cannot be undone."), /* @__PURE__ */ React.createElement(Btn, { outline: true, color: "#FF6B6B", small: true, onClick: reset }, " Reset All Progress")), /* @__PURE__ */ React.createElement("div", { style: { textAlign: "right" } }, /* @__PURE__ */ React.createElement(Btn, { outline: true, color: "#666", small: true, onClick: onClose }, "Close"))));
}
function App() {
  const [state, setState] = usePersistedState({
    screen: "welcome",
    uIdx: 0,
    lIdx: 0,
    saved: {},
    done: [],
    checks: {}
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [tick, setTick] = useState(0);
  const mainRef = useRef(null);
  const { screen, uIdx, lIdx, saved, done } = state;
  const checks = state.checks || {};
  const doneSet = useMemo(() => new Set(done), [done]);
  useEffect(() => {
    if (mainRef.current) mainRef.current.scrollTop = 0;
    window.scrollTo(0, 0);
  }, [uIdx, lIdx, screen]);
  const unit = UNITS[uIdx];
  const lesson = unit == null ? void 0 : unit.lessons[lIdx];
  const totalL = UNITS.reduce((s, u) => s + u.lessons.length, 0);
  const doneCount = doneSet.size;
  const hasProgress = doneCount > 0 || Object.keys(saved).length > 0;
  const markDone = useCallback(() => {
    const k2 = `${uIdx}-${lIdx}`;
    if (!doneSet.has(k2)) {
      setState((s) => ({ ...s, done: [.../* @__PURE__ */ new Set([...s.done, k2])] }));
    }
  }, [uIdx, lIdx, doneSet, setState]);
  const save = useCallback((k2, v) => {
    setState((s) => ({ ...s, saved: { ...s.saved, [k2]: v } }));
  }, [setState]);
  const goto = useCallback((newUIdx, newLIdx) => {
    setState((s) => ({ ...s, uIdx: newUIdx, lIdx: newLIdx }));
    setSidebarOpen(false);
  }, [setState]);
  const next = () => {
    markDone();
    if (lIdx < unit.lessons.length - 1) setState((s) => ({ ...s, lIdx: s.lIdx + 1 }));
    else if (uIdx < UNITS.length - 1) setState((s) => ({ ...s, uIdx: s.uIdx + 1, lIdx: 0 }));
    else setState((s) => ({ ...s, screen: "certificate" }));
  };
  const back = () => {
    if (lIdx > 0) setState((s) => ({ ...s, lIdx: s.lIdx - 1 }));
    else if (uIdx > 0) setState((s) => ({ ...s, uIdx: s.uIdx - 1, lIdx: UNITS[uIdx - 1].lessons.length - 1 }));
  };
  const onReset = () => {
    setShowSettings(false);
    setState({ screen: "welcome", uIdx: 0, lIdx: 0, saved: {}, done: [], checks: {} });
    setTick((t) => t + 1);
  };
  if (screen === "certificate") {
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("style", null, CSS), /* @__PURE__ */ React.createElement(Certificate, { onBack: () => setState((s) => ({ ...s, screen: "course" })) }));
  }
  if (screen === "welcome") {
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("style", null, CSS), /* @__PURE__ */ React.createElement(
      Welcome,
      {
        hasProgress,
        progress: { doneCount, totalL },
        onStart: (resume) => {
          if (!resume) setState({ screen: "course", uIdx: 0, lIdx: 0, saved: {}, done: [], checks: {} });
          else setState((s) => ({ ...s, screen: "course" }));
        }
      }
    ), /* @__PURE__ */ React.createElement("div", { style: { position: "fixed", top: 16, right: 16, background: "rgba(217,179,108,0.12)", border: "1px solid rgba(217,179,108,0.3)", borderRadius: 8, padding: "7px 14px", color: "#EBD9B0", fontSize: 11, fontWeight: 700, fontFamily: "inherit" } }, "Preview build"));
  }
  const allDone = doneCount >= totalL;
  const k = `${uIdx}-${lIdx}`;
  const sv = saved[k];
  const onSave = (v) => save(k, v);
  const cacheKey = `lesson_${unit.id}_${lesson.id}_v1`;
  const hasCheck = !!(typeof EXTRAS !== "undefined" && EXTRAS[lesson.id] && EXTRAS[lesson.id].check);
  const passed = !!checks[k] || doneSet.has(k);
  const locked = hasCheck && !passed;
  const onPass = () => setState((s) => ({ ...s, checks: { ...s.checks || {}, [k]: true } }));
  const renderLesson = () => {
    const props = { lesson, color: unit.color, onSave, saved: sv, cacheKey, passed, onPass };
    switch (lesson.type) {
      case "platforms":
        return /* @__PURE__ */ React.createElement(PlatformsOverview, { ...props });
      case "platforms_section":
        return /* @__PURE__ */ React.createElement(PlatformsSection, { ...props });
      case "techniques":
        return /* @__PURE__ */ React.createElement(TechniquesLesson, { ...props });
      case "templates":
        return /* @__PURE__ */ React.createElement(TemplatesLesson, { ...props });
      case "industry_templates":
        return /* @__PURE__ */ React.createElement(IndustryLesson, { ...props });
      case "final":
        return /* @__PURE__ */ React.createElement(FinalLesson, { ...props, onDone: markDone });
      default:
        return /* @__PURE__ */ React.createElement(AIContentLesson, { ...props });
    }
  };
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("style", null, CSS), /* @__PURE__ */ React.createElement("div", { key: tick, className: "shell", style: { display: "flex", height: "100dvh", overflow: "hidden", background: "#0B0C0E", fontFamily: "'Plus Jakarta Sans',sans-serif", color: "#fff" } }, sidebarOpen && /* @__PURE__ */ React.createElement("div", { className: "sidebar-backdrop", onClick: () => setSidebarOpen(false) }), /* @__PURE__ */ React.createElement("nav", { "aria-label": "Course contents", className: `sidebar ${sidebarOpen ? "open" : ""}`, style: { width: 268, minWidth: 268, height: "100%", borderRight: "1px solid rgba(255,255,255,0.05)", display: "flex", flexDirection: "column", background: "#0E0F12", overflowY: "auto", flexShrink: 0 } }, /* @__PURE__ */ React.createElement("div", { style: { padding: "16px 14px", borderBottom: "1px solid rgba(255,255,255,0.05)" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 9, marginBottom: 12 } }, /* @__PURE__ */ React.createElement("div", { style: { width: 28, height: 28, borderRadius: 7, background: "rgba(217,179,108,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#D9B36C" } }, "M"), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, fontWeight: 700, color: "#fff" } }, "AI Masterclass"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 9, color: "#666" } }, NAME))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", marginBottom: 5 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 9, color: "#555", letterSpacing: "0.1em" } }, "PROGRESS"), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 9, color: "#D9B36C", fontWeight: 700 } }, Math.round(doneCount / totalL * 100), "%")), /* @__PURE__ */ React.createElement("div", { style: { height: 3, background: "rgba(255,255,255,0.05)", borderRadius: 2, overflow: "hidden" } }, /* @__PURE__ */ React.createElement("div", { style: { height: "100%", width: `${doneCount / totalL * 100}%`, background: "#D9B36C", borderRadius: 2, transition: "width 0.8s ease" } })), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 9, color: "#555", marginTop: 4 } }, doneCount, "/", totalL, " lessons done ·  auto-saved")), /* @__PURE__ */ React.createElement("div", { style: { padding: "8px 6px", flex: 1 } }, UNITS.map((u, ui) => {
    const uDone = u.lessons.every((_, li) => doneSet.has(`${ui}-${li}`));
    const active = uIdx === ui;
    return /* @__PURE__ */ React.createElement("div", { key: u.id, style: { marginBottom: 2 } }, /* @__PURE__ */ React.createElement("button", { onClick: () => goto(ui, 0), style: { width: "100%", textAlign: "left", background: active ? u.color + "14" : "transparent", border: `1px solid ${active ? u.color + "28" : "transparent"}`, borderRadius: 7, padding: "7px 9px", cursor: "pointer", display: "flex", alignItems: "center", gap: 7, color: active ? "#fff" : "#888", transition: "all 0.15s", fontFamily: "inherit" } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 13, flexShrink: 0 } }, u.emoji), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10, fontWeight: 600, flex: 1, lineHeight: 1.3 } }, u.title), uDone && /* @__PURE__ */ React.createElement("span", { style: { fontSize: 9, color: "#00C9A7", flexShrink: 0 } }, "✓")), active && /* @__PURE__ */ React.createElement("div", { style: { paddingLeft: 6, paddingBottom: 2 } }, u.lessons.map((l, li) => {
      const lDone = doneSet.has(`${ui}-${li}`);
      return /* @__PURE__ */ React.createElement("button", { key: l.id, onClick: () => goto(ui, li), style: { width: "100%", textAlign: "left", background: lIdx === li ? u.color + "0E" : "transparent", border: `1px solid ${lIdx === li ? u.color + "20" : "transparent"}`, borderRadius: 5, padding: "5px 8px", cursor: "pointer", display: "flex", alignItems: "center", gap: 5, color: lIdx === li ? "#fff" : lDone ? "#888" : "#555", fontSize: 10, fontFamily: "inherit", transition: "all 0.15s" } }, /* @__PURE__ */ React.createElement("span", { style: { flexShrink: 0, fontSize: 9 } }, lDone ? "✓" : "○"), /* @__PURE__ */ React.createElement("span", { style: { lineHeight: 1.3 } }, l.title));
    })));
  })), /* @__PURE__ */ React.createElement("div", { style: { padding: 10, borderTop: "1px solid rgba(255,255,255,0.05)", display: "flex", flexDirection: "column", gap: 6 } }, allDone && /* @__PURE__ */ React.createElement("button", { onClick: () => setState((s) => ({ ...s, screen: "certificate" })), style: { width: "100%", background: "#D9B36C", border: "none", borderRadius: 9, padding: 10, color: "#0B0C0E", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" } }, " Get My Certificate"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6 } }, /* @__PURE__ */ React.createElement("button", { onClick: () => setShowSettings(true), title: "Backup / Reset", style: { flex: 1, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 7, padding: "7px 8px", color: "#888", fontSize: 10, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" } }, " Save")))), /* @__PURE__ */ React.createElement("main", { ref: mainRef, style: { flex: 1, height: "100%", overflowY: "auto", minWidth: 0, scrollBehavior: "auto" } }, /* @__PURE__ */ React.createElement("div", { className: "topbar" }, /* @__PURE__ */ React.createElement("button", { className: "menu-btn", onClick: () => setSidebarOpen(true), "aria-label": "Open course contents" }, "☰ Lessons"), /* @__PURE__ */ React.createElement("div", { className: "topbar-text" }, /* @__PURE__ */ React.createElement("span", { style: { color: unit.color } }, "Unit ", unit.id), " · Lesson ", lIdx + 1, " of ", unit.lessons.length, /* @__PURE__ */ React.createElement("span", { className: "topbar-title" }, " · ", lesson.title)), /* @__PURE__ */ React.createElement(Narration, { lessonId: lesson.id, color: unit.color }), /* @__PURE__ */ React.createElement("div", { className: "topbar-pct" }, Math.round(doneCount / totalL * 100), "%"), /* @__PURE__ */ React.createElement("div", { className: "topbar-bar", role: "progressbar", "aria-label": "Course progress", "aria-valuemin": 0, "aria-valuemax": totalL, "aria-valuenow": doneCount }, /* @__PURE__ */ React.createElement("span", { style: { width: `${doneCount / totalL * 100}%`, background: unit.color } }))), /* @__PURE__ */ React.createElement("div", { className: "main-pad", style: { maxWidth: 800, margin: "0 auto", padding: "36px 36px 80px" }, key: `${uIdx}-${lIdx}` }, lIdx === 0 && /* @__PURE__ */ React.createElement("div", { className: "fu hero", style: { marginBottom: 28, padding: 24, borderRadius: 16, background: `linear-gradient(135deg,${unit.dark},rgba(11,12,14,0.5))`, border: `1px solid ${unit.color}28` } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "flex-start", gap: 14 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 42, flexShrink: 0 } }, unit.emoji), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(Tag, { color: unit.color, small: true }, "Unit ", unit.id, " of ", UNITS.length), /* @__PURE__ */ React.createElement("h1", { className: "hero-title", style: { fontFamily: "'Playfair Display',serif", fontSize: 26, fontWeight: 800, color: "#fff", margin: "8px 0 5px", lineHeight: 1.2 } }, unit.title), /* @__PURE__ */ React.createElement("p", { style: { fontSize: 13, color: unit.color, fontStyle: "italic" } }, unit.tagline)))), /* @__PURE__ */ React.createElement("div", { className: "fu", style: { marginBottom: 22 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, marginBottom: 8, flexWrap: "wrap", alignItems: "center" } }, /* @__PURE__ */ React.createElement(Tag, { color: unit.color, small: true }, "Lesson ", lIdx + 1, " of ", unit.lessons.length), doneSet.has(`${uIdx}-${lIdx}`) && /* @__PURE__ */ React.createElement(Tag, { color: "#00C9A7", small: true }, "✓ Completed"), sv && /* @__PURE__ */ React.createElement(Tag, { color: "#D9B36C", small: true }, " Reflection saved")), /* @__PURE__ */ React.createElement("h2", { className: "lesson-title", style: { fontFamily: "'Playfair Display',serif", fontSize: 26, fontWeight: 700, color: "#fff", lineHeight: 1.3 } }, lesson.title)), renderLesson(), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 38, paddingTop: 22, borderTop: "1px solid rgba(255,255,255,0.05)", flexWrap: "wrap", gap: 12 } }, /* @__PURE__ */ React.createElement(Btn, { outline: true, color: "#666", small: true, onClick: back, disabled: uIdx === 0 && lIdx === 0 }, "← Back"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 4, alignItems: "center" } }, unit.lessons.map((_, li) => /* @__PURE__ */ React.createElement("div", { key: li, onClick: () => setState((s) => ({ ...s, lIdx: li })), style: { width: li === lIdx ? 18 : 6, height: 6, borderRadius: 3, cursor: "pointer", background: li === lIdx ? unit.color : doneSet.has(`${uIdx}-${li}`) ? unit.color + "55" : "rgba(255,255,255,0.07)", transition: "all 0.3s" } }))), locked && /* @__PURE__ */ React.createElement("span", { style: { fontSize: 12, color: "#9A9A9A" } }, "Answer the quick check to continue"), /* @__PURE__ */ React.createElement(Btn, { color: unit.color, onClick: next, disabled: locked }, uIdx === UNITS.length - 1 && lIdx === unit.lessons.length - 1 ? " Complete & Get Certificate" : lIdx === unit.lessons.length - 1 ? `Next: Unit ${uIdx + 2} →` : "Next Lesson →"))))), showSettings && /* @__PURE__ */ React.createElement(SettingsModal, { onClose: () => setShowSettings(false), onReset }));
}
const FIG_TEXT = "#E8E6E1", FIG_MUTED = "#8A8A8A", FIG_LINE = "rgba(255,255,255,0.14)";
function Figure({ alt, caption, children, color }) {
  return /* @__PURE__ */ React.createElement("figure", { style: { margin: "22px 0", padding: 18, borderRadius: 14, background: "rgba(255,255,255,0.025)", border: `1px solid ${color}26` } }, /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 640 240", role: "img", "aria-label": alt, style: { width: "100%", height: "auto", display: "block" } }, /* @__PURE__ */ React.createElement("title", null, alt), children), caption && /* @__PURE__ */ React.createElement("figcaption", { style: { marginTop: 10, fontSize: 12, color: FIG_MUTED, lineHeight: 1.6 } }, caption));
}
const Box = ({ x, y, w, h, label, sub, color, filled }) => /* @__PURE__ */ React.createElement("g", null, /* @__PURE__ */ React.createElement("rect", { x, y, width: w, height: h, rx: "12", fill: filled ? color + "26" : "rgba(255,255,255,0.03)", stroke: filled ? color : FIG_LINE }), /* @__PURE__ */ React.createElement("text", { x: x + w / 2, y: y + h / 2 + (sub ? -4 : 5), textAnchor: "middle", fill: FIG_TEXT, fontSize: "14", fontWeight: "700" }, label), sub && /* @__PURE__ */ React.createElement("text", { x: x + w / 2, y: y + h / 2 + 15, textAnchor: "middle", fill: FIG_MUTED, fontSize: "11" }, sub));
const Arrow = ({ x1, y1, x2, y2, color }) => /* @__PURE__ */ React.createElement("g", { stroke: color, strokeWidth: "2", fill: "none" }, /* @__PURE__ */ React.createElement("line", { x1, y1, x2, y2 }), /* @__PURE__ */ React.createElement("path", { d: `M${x2 - 8} ${y2 - 5} L${x2} ${y2} L${x2 - 8} ${y2 + 5}` }));
const FIGURES = {
  prediction: (c) => /* @__PURE__ */ React.createElement(Figure, { color: c, alt: "Diagram: the words 'Write a warm welcome for' go into an AI model, which ranks possible next words by likelihood: 'our' 62 percent, 'new' 21 percent, 'the' 11 percent, 'customers' 6 percent.", caption: "AI writes by predicting the most likely next word, again and again. Your prompt decides which words look likely." }, /* @__PURE__ */ React.createElement(Box, { x: 20, y: 88, w: 190, h: 64, label: "Your prompt", sub: "“Write a warm welcome for…”", color: c }), /* @__PURE__ */ React.createElement(Arrow, { x1: 214, y1: 120, x2: 262, y2: 120, color: c }), /* @__PURE__ */ React.createElement(Box, { x: 266, y: 80, w: 120, h: 80, label: "AI model", sub: "patterns from text", color: c, filled: true }), /* @__PURE__ */ React.createElement(Arrow, { x1: 390, y1: 120, x2: 430, y2: 120, color: c }), [["our", 62], ["new", 21], ["the", 11], ["customers", 6]].map(([w, p], i) => /* @__PURE__ */ React.createElement("g", { key: w }, /* @__PURE__ */ React.createElement("text", { x: 440, y: 62 + i * 40, fill: FIG_TEXT, fontSize: "13" }, w), /* @__PURE__ */ React.createElement("rect", { x: 520, y: 50 + i * 40, width: 100, height: 14, rx: "7", fill: "rgba(255,255,255,0.06)" }), /* @__PURE__ */ React.createElement("rect", { x: 520, y: 50 + i * 40, width: p, height: 14, rx: "7", fill: c, opacity: 1 - i * 0.2 }), /* @__PURE__ */ React.createElement("text", { x: 620, y: 62 + i * 40, textAnchor: "end", fill: FIG_MUTED, fontSize: "10" }, p, "%")))),
  ingredients: (c) => /* @__PURE__ */ React.createElement(Figure, { color: c, alt: "Diagram: six prompt ingredients in a row, Role, Task, Context, Format, Tone and Constraints, combining into one complete prompt.", caption: "The six ingredients. Task is the only one you always need; each extra one makes the answer more yours." }, ["Role", "Task", "Context", "Format", "Tone", "Limits"].map((t, i) => /* @__PURE__ */ React.createElement(Box, { key: t, x: 14 + i * 104, y: 40, w: 92, h: 56, label: t, color: c, filled: t === "Task" })), [0, 1, 2, 3, 4, 5].map((i) => /* @__PURE__ */ React.createElement("line", { key: i, x1: 60 + i * 104, y1: 100, x2: 320, y2: 160, stroke: FIG_LINE })), /* @__PURE__ */ React.createElement(Box, { x: 200, y: 160, w: 240, h: 56, label: "A prompt that works", sub: "specific, shaped, on brand", color: c, filled: true })),
  imageFormula: (c) => /* @__PURE__ */ React.createElement(Figure, { color: c, alt: "Diagram: the image prompt formula as six blocks, Subject, Style, Setting, Lighting, Mood and Technical specs, each with an example.", caption: "Fill each block and the image stops being random." }, [["Subject", "a straw handbag"], ["Style", "editorial"], ["Setting", "cream linen"], ["Lighting", "soft morning"], ["Mood", "calm, premium"], ["Specs", "4:5, sharp"]].map(([t, e], i) => /* @__PURE__ */ React.createElement(Box, { key: t, x: 10 + i * 105, y: 80, w: 95, h: 72, label: t, sub: e, color: c, filled: i === 0 }))),
  automation: (c) => /* @__PURE__ */ React.createElement(Figure, { color: c, alt: "Diagram: an automation in three steps. A trigger, a new form submission, starts an AI step that scores and summarises it, which leads to an action, adding a row to a sheet and alerting you.", caption: "Every automation is a trigger, an AI step and an action." }, /* @__PURE__ */ React.createElement(Box, { x: 20, y: 84, w: 170, h: 72, label: "Trigger", sub: "a form is submitted", color: c }), /* @__PURE__ */ React.createElement(Arrow, { x1: 194, y1: 120, x2: 232, y2: 120, color: c }), /* @__PURE__ */ React.createElement(Box, { x: 236, y: 84, w: 170, h: 72, label: "AI step", sub: "score + summarise (JSON)", color: c, filled: true }), /* @__PURE__ */ React.createElement(Arrow, { x1: 410, y1: 120, x2: 448, y2: 120, color: c }), /* @__PURE__ */ React.createElement(Box, { x: 452, y: 84, w: 170, h: 72, label: "Action", sub: "add to sheet, alert you", color: c })),
  agentLoop: (c) => /* @__PURE__ */ React.createElement(Figure, { color: c, alt: "Diagram: the agent loop. A goal leads to a plan, the agent acts with tools, checks the result, and loops back to plan again until the goal is met, then reports back.", caption: "A chatbot answers once. An agent loops: plan, act, check, until the goal is met." }, /* @__PURE__ */ React.createElement(Box, { x: 14, y: 90, w: 110, h: 60, label: "Goal", color: c }), /* @__PURE__ */ React.createElement(Arrow, { x1: 128, y1: 120, x2: 168, y2: 120, color: c }), /* @__PURE__ */ React.createElement(Box, { x: 172, y: 40, w: 120, h: 56, label: "Plan", color: c, filled: true }), /* @__PURE__ */ React.createElement(Box, { x: 332, y: 40, w: 130, h: 56, label: "Act", sub: "search, email, book", color: c, filled: true }), /* @__PURE__ */ React.createElement(Box, { x: 252, y: 150, w: 130, h: 56, label: "Check", sub: "is it done?", color: c, filled: true }), /* @__PURE__ */ React.createElement(Arrow, { x1: 296, y1: 68, x2: 328, y2: 68, color: c }), /* @__PURE__ */ React.createElement(Arrow, { x1: 400, y1: 100, x2: 360, y2: 146, color: c }), /* @__PURE__ */ React.createElement(Arrow, { x1: 252, y1: 170, x2: 230, y2: 100, color: c }), /* @__PURE__ */ React.createElement(Arrow, { x1: 386, y1: 178, x2: 500, y2: 178, color: c }), /* @__PURE__ */ React.createElement(Box, { x: 504, y: 150, w: 120, h: 56, label: "Report back", color: c })),
  rag: (c) => /* @__PURE__ */ React.createElement(Figure, { color: c, alt: "Diagram: retrieval augmented generation. A question searches your own documents, the most relevant passages are passed to the AI, and it answers using only those passages, with sources.", caption: "RAG is an open-book exam: the AI answers from your documents, and can show which page it used." }, /* @__PURE__ */ React.createElement(Box, { x: 10, y: 90, w: 120, h: 60, label: "Question", color: c }), /* @__PURE__ */ React.createElement(Arrow, { x1: 134, y1: 120, x2: 164, y2: 120, color: c }), /* @__PURE__ */ React.createElement(Box, { x: 168, y: 70, w: 140, h: 100, label: "Your files", sub: "search, find 3 passages", color: c }), /* @__PURE__ */ React.createElement(Arrow, { x1: 312, y1: 120, x2: 342, y2: 120, color: c }), /* @__PURE__ */ React.createElement(Box, { x: 346, y: 80, w: 120, h: 80, label: "AI", sub: "reads the passages", color: c, filled: true }), /* @__PURE__ */ React.createElement(Arrow, { x1: 470, y1: 120, x2: 500, y2: 120, color: c }), /* @__PURE__ */ React.createElement(Box, { x: 504, y: 80, w: 126, h: 80, label: "Answer", sub: "with its sources", color: c })),
  verify: (c) => /* @__PURE__ */ React.createElement(Figure, { color: c, alt: "Diagram: the verification habit. AI draft, then check facts, numbers and names against a source, then publish. A warning marks skipping the check.", caption: "Draft with AI. Check anything you will publish, send or act on. Then ship." }, /* @__PURE__ */ React.createElement(Box, { x: 20, y: 90, w: 160, h: 64, label: "AI draft", color: c }), /* @__PURE__ */ React.createElement(Arrow, { x1: 184, y1: 122, x2: 232, y2: 122, color: c }), /* @__PURE__ */ React.createElement(Box, { x: 236, y: 80, w: 170, h: 84, label: "You check", sub: "facts · numbers · names", color: c, filled: true }), /* @__PURE__ */ React.createElement(Arrow, { x1: 410, y1: 122, x2: 458, y2: 122, color: c }), /* @__PURE__ */ React.createElement(Box, { x: 462, y: 90, w: 160, h: 64, label: "Publish", color: c }))
};
const choiceBtn = (on, color) => ({
  background: on ? color + "22" : "rgba(255,255,255,0.03)",
  border: `1px solid ${on ? color : "rgba(255,255,255,0.1)"}`,
  borderRadius: 10,
  padding: "10px 14px",
  color: "#EDEDED",
  fontSize: 13,
  cursor: "pointer",
  textAlign: "left",
  fontFamily: "inherit",
  transition: "background .2s, border-color .2s, transform .2s"
});
function FlipCards({ data, color, onDone }) {
  const [seen, setSeen] = useState(/* @__PURE__ */ new Set());
  const flip = (i) => setSeen((s) => {
    const n = new Set(s);
    n.add(i);
    if (n.size === data.cards.length) onDone();
    return n;
  });
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { style: { fontSize: 13, color: "#9A9A9A", marginBottom: 12 } }, data.intro, " ", /* @__PURE__ */ React.createElement("span", { style: { color } }, seen.size, "/", data.cards.length, " turned")), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(170px,1fr))", gap: 10 } }, data.cards.map(([front, back], i) => /* @__PURE__ */ React.createElement("button", { key: front, type: "button", onClick: () => flip(i), "aria-pressed": seen.has(i), className: "flip", style: { ...choiceBtn(seen.has(i), color), minHeight: 108, display: "flex", flexDirection: "column", justifyContent: "center" } }, /* @__PURE__ */ React.createElement("span", { style: { fontWeight: 700, fontSize: 14, color: seen.has(i) ? color : "#fff" } }, front), /* @__PURE__ */ React.createElement("span", { style: { marginTop: 6, fontSize: 12, lineHeight: 1.5, color: "#C9C9C9", display: seen.has(i) ? "block" : "none" } }, back), !seen.has(i) && /* @__PURE__ */ React.createElement("span", { style: { marginTop: 6, fontSize: 11, color: "#666" } }, "tap to turn")))));
}
function Builder({ data, color, onDone }) {
  const [added, setAdded] = useState([]);
  const add = (i) => setAdded((a) => {
    if (a.includes(i)) return a;
    const n = [...a, i];
    if (n.length === data.parts.length) onDone();
    return n;
  });
  const prompt = data.parts.filter((_, i) => added.includes(i)).map((p) => p[1]).join(" ");
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { style: { fontSize: 13, color: "#9A9A9A", marginBottom: 12 } }, data.intro), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: 8 } }, data.parts.map(([label], i) => /* @__PURE__ */ React.createElement("button", { key: label, type: "button", onClick: () => add(i), disabled: added.includes(i), style: { ...choiceBtn(added.includes(i), color), opacity: added.includes(i) ? 0.6 : 1 } }, added.includes(i) ? "✓ " : "+ ", label))), /* @__PURE__ */ React.createElement("div", { "aria-live": "polite", style: { marginTop: 14, minHeight: 84, padding: 14, borderRadius: 10, background: "rgba(0,0,0,0.25)", border: "1px dashed rgba(255,255,255,0.12)", fontSize: 13.5, lineHeight: 1.7, color: prompt ? "#EDEDED" : "#666" } }, prompt || "Your prompt builds here as you add ingredients."), added.length === data.parts.length && /* @__PURE__ */ React.createElement("p", { style: { marginTop: 10, fontSize: 13, color } }, data.done));
}
function Sorter({ data, color, onDone }) {
  const [placed, setPlaced] = useState({});
  const [note, setNote] = useState("");
  const pick = (i, g) => {
    const [, right, why] = data.items[i];
    if (g !== right) {
      setNote(`Not quite: ${why}`);
      return;
    }
    setNote(`Right: ${why}`);
    setPlaced((p) => {
      const n = { ...p, [i]: g };
      if (Object.keys(n).length === data.items.length) onDone();
      return n;
    });
  };
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { style: { fontSize: 13, color: "#9A9A9A", marginBottom: 12 } }, data.intro, " ", /* @__PURE__ */ React.createElement("span", { style: { color } }, Object.keys(placed).length, "/", data.items.length, " sorted")), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gap: 8 } }, data.items.map(([text], i) => /* @__PURE__ */ React.createElement("div", { key: text, style: { display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", padding: "10px 12px", borderRadius: 10, background: "rgba(255,255,255,0.025)", border: `1px solid ${placed[i] !== void 0 ? color + "55" : "rgba(255,255,255,0.08)"}` } }, /* @__PURE__ */ React.createElement("span", { style: { flex: "1 1 240px", fontSize: 13.5, color: "#E5E5E5" } }, text), placed[i] !== void 0 ? /* @__PURE__ */ React.createElement("span", { style: { fontSize: 12, color, fontWeight: 700 } }, "✓ ", data.groups[placed[i]]) : data.groups.map((g, gi) => /* @__PURE__ */ React.createElement("button", { key: g, type: "button", onClick: () => pick(i, gi), style: { ...choiceBtn(false, color), padding: "6px 10px", fontSize: 12 } }, g))))), /* @__PURE__ */ React.createElement("p", { "aria-live": "polite", style: { marginTop: 10, fontSize: 13, color: note.startsWith("Right") ? color : "#E8A87C", minHeight: 20 } }, note));
}
function Sequence({ data, color, onDone }) {
  const [order, setOrder] = useState([]);
  const [note, setNote] = useState("");
  const shuffled = useMemo(() => data.steps.map((s, i) => [s, i]).sort((a, b) => (a[1] * 7 + 3) % data.steps.length - (b[1] * 7 + 3) % data.steps.length), [data]);
  const tap = (i) => {
    if (order.includes(i)) return;
    if (i !== order.length) {
      setNote(`Not yet: think about what has to happen first.`);
      return;
    }
    const n = [...order, i];
    setOrder(n);
    setNote("");
    if (n.length === data.steps.length) {
      setNote(data.done);
      onDone();
    }
  };
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { style: { fontSize: 13, color: "#9A9A9A", marginBottom: 12 } }, data.intro), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: 8 } }, shuffled.map(([s, i]) => /* @__PURE__ */ React.createElement("button", { key: s, type: "button", onClick: () => tap(i), disabled: order.includes(i), style: { ...choiceBtn(order.includes(i), color) } }, order.includes(i) ? `${order.indexOf(i) + 1}. ` : "", s))), /* @__PURE__ */ React.createElement("p", { "aria-live": "polite", style: { marginTop: 10, fontSize: 13, color: order.length === data.steps.length ? color : "#E8A87C", minHeight: 20 } }, note));
}
const ACTIVITIES = { flip: FlipCards, build: Builder, sort: Sorter, sequence: Sequence };
function QuickCheck({ check, color, passed, onPass }) {
  const [pick, setPick] = useState(passed ? check.answer : null);
  const right = pick === check.answer;
  return /* @__PURE__ */ React.createElement("div", { style: { marginTop: 22, padding: 18, borderRadius: 14, background: "rgba(255,255,255,0.025)", border: `1px solid ${right ? color : color + "30"}` } }, /* @__PURE__ */ React.createElement("p", { style: { fontSize: 10, letterSpacing: "0.14em", color, fontWeight: 700, margin: 0 } }, "QUICK CHECK · ANSWER TO UNLOCK THE NEXT LESSON"), /* @__PURE__ */ React.createElement("p", { style: { fontSize: 15, color: "#fff", margin: "8px 0 12px", lineHeight: 1.5, fontWeight: 600 } }, check.q), /* @__PURE__ */ React.createElement("div", { role: "radiogroup", "aria-label": check.q, style: { display: "grid", gap: 8 } }, check.options.map((o, i) => {
    const chosen = pick === i;
    const state = chosen ? i === check.answer ? color : "#E8A87C" : null;
    return /* @__PURE__ */ React.createElement(
      "button",
      {
        key: o,
        type: "button",
        role: "radio",
        "aria-checked": chosen,
        onClick: () => {
          setPick(i);
          if (i === check.answer) onPass();
        },
        style: { ...choiceBtn(chosen, state || color), borderColor: state || "rgba(255,255,255,0.1)" }
      },
      o
    );
  })), pick !== null && /* @__PURE__ */ React.createElement("p", { "aria-live": "polite", style: { marginTop: 12, fontSize: 13, lineHeight: 1.6, color: right ? color : "#E8A87C" } }, right ? `Correct. ${check.why}` : "Not quite. Have another look at the lesson and try again."));
}
function LessonExtras({ lessonId, color, passed, onPass }) {
  const ex = EXTRAS[lessonId];
  const [activityDone, setActivityDone] = useState(passed);
  if (!ex) return null;
  const Act = ex.activity && ACTIVITIES[ex.activity.type];
  return /* @__PURE__ */ React.createElement("div", null, ex.figure && FIGURES[ex.figure](color), Act && /* @__PURE__ */ React.createElement("div", { style: { marginTop: 22, padding: 18, borderRadius: 14, background: "rgba(255,255,255,0.02)", border: `1px solid ${activityDone ? color + "66" : "rgba(255,255,255,0.08)"}` } }, /* @__PURE__ */ React.createElement("p", { style: { fontSize: 10, letterSpacing: "0.14em", color, fontWeight: 700, margin: "0 0 8px" } }, "TRY IT", activityDone ? " · DONE ✓" : ""), /* @__PURE__ */ React.createElement("p", { style: { fontSize: 16, color: "#fff", margin: "0 0 4px", fontWeight: 700 } }, ex.activity.title), /* @__PURE__ */ React.createElement(Act, { data: ex.activity, color, onDone: () => setActivityDone(true) })), ex.check && /* @__PURE__ */ React.createElement(QuickCheck, { check: ex.check, color, passed, onPass }));
}
const EXTRAS = {
  "1a": {
    figure: "prediction",
    activity: { type: "flip", title: "Meet the seven kinds of AI", intro: "Turn each card to see what it does and one way to use it.", cards: [
      ["Text", "Chat assistants like Claude and ChatGPT. Draft emails, summarise reports, brainstorm."],
      ["Image", "Pictures from a description. Product shots, social posts, presentation art."],
      ["Video", "Short clips from text or a photo. Adverts, explainers, social shorts."],
      ["Audio", "Natural voiceovers and music. Narrate lessons, podcast intros, jingles."],
      ["Code", "Formulas, scripts and small apps, described in plain words."],
      ["Agents", "AI that takes several steps on its own toward a goal, using tools."],
      ["Automation", "AI wired into your apps so routine work happens by itself."]
    ] },
    check: { q: "What is an AI chat assistant actually doing when it writes an answer?", options: ["Looking the answer up in a database of facts", "Predicting the words most likely to make a good answer, based on patterns it learned", "Copying the closest web page it can find", "Thinking about the question the way a person does"], answer: 1, why: "It predicts from patterns. That is why your wording steers the answer, and why you still check facts." }
  },
  "1c": {
    activity: { type: "sequence", title: "Put a first conversation in order", intro: "Tap the steps in the order you would do them.", steps: ["Say who you are and your situation", "Ask for one clear thing", "Read the answer and give feedback", "Save the version that works"], done: "That's the loop: context, one clear ask, feedback, save." },
    check: { q: "The first answer is close but too formal. What is the best next move?", options: ["Start a new chat and ask the same thing again", "Accept it and edit it yourself", "Tell it what worked and what to change, for example: keep the structure, make it warmer", "Ask a different AI tool"], answer: 2, why: "Feedback in the same conversation keeps all the context and usually fixes it in one turn." }
  },
  "2a": {
    figure: "ingredients",
    activity: { type: "build", title: "Build a prompt, one ingredient at a time", intro: "Add each ingredient and watch a vague request become a usable one.", parts: [
      ["Role", "You are an experienced events planner in Accra."],
      ["Task", "Plan a two-hour product launch"],
      ["Context", "for 40 guests at a small fashion brand, with a budget of GHS 15,000."],
      ["Format", "Give a timeline table with times, activities and who is responsible,"],
      ["Tone", "in a warm, professional voice,"],
      ["Constraints", "and keep it to one page with no more than eight rows."]
    ], done: "Same request, six ingredients: now the AI knows who to be, what to make, for whom, in what shape and within what limits." },
    check: { q: "Which ingredient tells the AI what shape the answer should take, like a table, bullet points or a one-paragraph email?", options: ["Role", "Context", "Format", "Tone"], answer: 2, why: "Format shapes the output. Ask for a table and you get a table instead of an essay." }
  },
  "2d": {
    check: { q: "You need AI's help with a decision but worry it will just agree with you. Which technique fits?", options: ["Prompt chaining", "Devil's advocate prompting", "Persona stacking", "Contextual memory refresh"], answer: 1, why: "Asking it to argue against your plan surfaces the weaknesses it would otherwise be too agreeable to mention." }
  },
  "3a": {
    figure: "imageFormula",
    activity: { type: "build", title: "Build an image prompt", intro: "Add each block of the formula and see the prompt sharpen.", parts: [
      ["Subject", "A woven straw handbag"],
      ["Style", "in a minimal editorial photography style,"],
      ["Setting", "resting on a cream linen surface,"],
      ["Lighting", "soft morning window light,"],
      ["Mood", "calm and premium,"],
      ["Technical specs", "4:5 aspect ratio, sharp focus, high detail."]
    ], done: "Every block removes a guess. That's the difference between a random picture and a usable product shot." },
    check: { q: "In the image formula, where does “soft morning window light” belong?", options: ["Subject", "Style", "Lighting", "Technical specs"], answer: 2, why: "Lighting changes the whole feel of an image, so it gets its own place in the prompt." }
  },
  "3b": {
    check: { q: "Before you publish an AI image for a client, what should you always check?", options: ["The file size", "Hands, any text in the image, and logos", "That it was made with the newest model", "Nothing, if the prompt was detailed"], answer: 1, why: "Hands, lettering and logos are where image AI still slips, so check them every time." }
  },
  "4a": {
    check: { q: "Which part of a video prompt does “slow push-in” describe?", options: ["Style", "Camera movement", "Lighting", "Pacing"], answer: 1, why: "Push-in, pan, tilt and orbit are camera moves. Naming one makes clips feel directed, not random." }
  },
  "5a": {
    activity: { type: "sort", title: "Written for the eye, or for the ear?", intro: "Voice AI reads exactly what you write. Sort each line.", groups: ["For the ear", "For the eye"], items: [
      ["“Here's the good news: it takes five minutes.”", 0, "short, spoken rhythm, easy to say aloud."],
      ["“Refer to Table 3 (p. 14) for the full breakdown.”", 1, "brackets and page numbers make sense on paper, not out loud."],
      ["“First, open the app. Then, tap the plus.”", 0, "clear steps with natural pauses."],
      ["“Q3 rev. ↑ 12% YoY (see appx).”", 1, "abbreviations and symbols get read out awkwardly or not at all."]
    ] },
    check: { q: "When is it acceptable to clone someone's voice?", options: ["When the recording is public online", "When it's only for a demo", "Only your own voice, or with that person's clear written permission", "When you credit them in the description"], answer: 2, why: "A voice is personal. Use your own, or get written permission." }
  },
  "5b": {
    check: { q: "Which of these belongs in a music prompt's formula?", options: ["Your file name", "Tempo, like 105 BPM", "The platform's price", "The video's length in pixels"], answer: 1, why: "Genre, mood, instruments, vocal style, tempo and theme: tempo sets the energy." }
  },
  "6a": {
    check: { q: "You've got a spreadsheet formula from AI. What should you do before using it on your real data?", options: ["Use it straight away, AI code is always tested", "Test it on a copy of your data first", "Ask a second AI if it's right", "Delete your backup to save space"], answer: 1, why: "Always test on a copy. If something goes wrong, your real data is safe." }
  },
  "6b": {
    check: { q: "AI summarised your sales table and says revenue rose 18%. You'll present that to your manager. What now?", options: ["Present it, AI is good at maths", "Check the number against the table yourself first", "Round it to 20% to be safe", "Ask the AI if it's sure"], answer: 1, why: "AI can miscount or misread a table. Check any number you will act on." }
  },
  "7a": {
    figure: "automation",
    activity: { type: "sequence", title: "Assemble an automation", intro: "A customer fills in your order form. Tap the steps in the order the automation runs.", steps: ["Trigger: a new form submission arrives", "AI step: read it and return the order as structured data", "Action: add a row to your sheet", "Action: send you a WhatsApp alert"], done: "Trigger, AI step, action. That shape runs almost every automation you'll build." },
    check: { q: "Why ask the AI step for structured output, like JSON with named fields?", options: ["It looks more professional", "The next app can read each field reliably instead of guessing from a paragraph", "It makes the AI faster", "It's required by law"], answer: 1, why: "Apps need predictable fields. Structured output turns AI text into data the next step can use." }
  },
  "8a": {
    figure: "agentLoop",
    activity: { type: "sort", title: "Chatbot or agent?", intro: "Decide which one each task needs.", groups: ["Chatbot", "Agent"], items: [
      ["Explain what a VAT invoice is", 0, "one question, one answer: a chatbot is enough."],
      ["Find three venues, check prices and email the shortlist", 1, "several steps and tools toward a goal: that's an agent."],
      ["Rewrite this paragraph to sound friendlier", 0, "a single transformation of your text."],
      ["Watch my inbox and file every invoice into the right folder", 1, "ongoing action with tools: an agent's job."]
    ] },
    check: { q: "Which belongs in a good agent prompt but rarely in a chat prompt?", options: ["A polite greeting", "Guardrails: what it must never do without asking you", "A request for emojis", "Your favourite colour"], answer: 1, why: "Agents act, so they need limits: spending, sending and deleting should wait for your OK." }
  },
  "8b": {
    figure: "rag",
    check: { q: "What does RAG add to an AI assistant?", options: ["It makes the model bigger", "It lets the AI answer from your own documents, and show which ones", "It removes the need for prompts", "It makes answers longer"], answer: 1, why: "Retrieval finds the relevant passages in your files, and the AI answers from them: an open-book exam." }
  },
  "10a": {
    figure: "verify",
    check: { q: "An AI answer includes a confident statistic with a source name. What's the professional move?", options: ["Trust it, it named a source", "Check the statistic and the source yourself before using it", "Remove the source and keep the number", "Ask the AI to make it sound more confident"], answer: 1, why: "AI can invent convincing facts and sources. Verify anything you publish, send or act on." }
  },
  "10b": {
    activity: { type: "sort", title: "Safe to paste, or never?", intro: "Apply the public notice board test to each item.", groups: ["Fine to paste", "Never paste"], items: [
      ["A customer's full name, phone number and order history", 1, "personal data about someone else: anonymise it first."],
      ["A blog post you've already published", 0, "it's public already."],
      ["Your bank login or a one-time PIN", 1, "never share credentials with any tool."],
      ["A sales table with names replaced by Customer A, B and C", 0, "anonymised data keeps the insight and drops the risk."]
    ] },
    check: { q: "What's the quickest test for whether something is safe to paste into AI?", options: ["Is it under 1,000 words?", "Would I pin it on a public notice board?", "Did I write it myself?", "Is it in English?"], answer: 1, why: "If you wouldn't pin it up in public, don't paste it." }
  },
  "10c": {
    check: { q: "AI drafted a decision about which staff get a bonus. What should happen next?", options: ["Send it, the AI is neutral", "A person reviews it for fairness and makes the final call", "Ask the AI to pick again", "Share it so staff can complain"], answer: 1, why: "Decisions about people need a human in charge. AI can be biased in ways that are hard to see." }
  },
  "11a": {
    check: { q: "What does “AI skills are additive” mean for your career?", options: ["You must leave your field to work in AI", "AI adds to the expertise you already have, making you more valuable in your own field", "Only programmers benefit", "You need a new degree first"], answer: 1, why: "A nurse, accountant or teacher who uses AI well is worth more in their own field." }
  },
  "11b": {
    check: { q: "Which portfolio piece proves the most to an employer?", options: ["A list of AI tools you've heard of", "A case study: the problem, what you did and a result with a number", "A screenshot of a chat", "Your course enrolment email"], answer: 1, why: "A result with a number, like 'saved four hours a week', turns a claim into evidence." }
  },
  "11c": {
    check: { q: "What's the practice-first rule?", options: ["Read every AI newsletter daily", "For every hour reading about AI, spend two using it", "Only use one AI tool", "Wait for tools to mature before trying them"], answer: 1, why: "Using AI builds the skill. Reading only builds the vocabulary." }
  }
};
let MANIFEST = null;
const manifestReady = fetch("audio/manifest.json").then((r) => r.ok ? r.json() : null).then((m) => MANIFEST = m).catch(() => null);
const fmtT = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
function Narration({ lessonId, color }) {
  const [ready, setReady] = useState(!!MANIFEST);
  const [playing, setPlaying] = useState(false);
  const [t, setT] = useState(0);
  const [rate, setRate] = useState(1);
  const audio = useRef(null);
  useEffect(() => {
    manifestReady.then(() => setReady(true));
  }, []);
  useEffect(() => {
    setPlaying(false);
    setT(0);
  }, [lessonId]);
  const dur = MANIFEST && MANIFEST.durations && MANIFEST.durations.masterclass ? MANIFEST.durations.masterclass[lessonId] : null;
  if (!ready || !dur) return null;
  const toggle = () => {
    const a = audio.current;
    if (!a) return;
    if (a.paused) {
      a.playbackRate = rate;
      a.play().catch(() => {
      });
    } else a.pause();
  };
  const cycle = () => {
    const r = rate === 1 ? 1.25 : rate === 1.25 ? 1.5 : rate === 1.5 ? 0.85 : 1;
    setRate(r);
    if (audio.current) audio.current.playbackRate = r;
  };
  return /* @__PURE__ */ React.createElement("div", { className: "narr", title: "Narrated by Kokoro-82M, an open-source voice model (Apache 2.0)" }, /* @__PURE__ */ React.createElement(
    "audio",
    {
      ref: audio,
      key: lessonId,
      src: `audio/masterclass/${lessonId}.mp3`,
      preload: "none",
      onPlay: () => setPlaying(true),
      onPause: () => setPlaying(false),
      onEnded: () => {
        setPlaying(false);
        setT(0);
      },
      onTimeUpdate: (e) => setT(e.currentTarget.currentTime)
    }
  ), /* @__PURE__ */ React.createElement("button", { type: "button", onClick: toggle, "aria-label": playing ? "Pause narration" : "Listen to this lesson", className: "narr-btn", style: { borderColor: color + "66", color } }, playing ? "❚❚ Pause" : "▶ Listen"), /* @__PURE__ */ React.createElement("span", { className: "narr-time" }, fmtT(t), " / ", fmtT(dur)), /* @__PURE__ */ React.createElement("button", { type: "button", onClick: cycle, className: "narr-rate", "aria-label": `Playback speed ${rate} times` }, rate, "×"), /* @__PURE__ */ React.createElement("span", { className: "narr-bar", "aria-hidden": "true" }, /* @__PURE__ */ React.createElement("span", { style: { width: `${Math.min(100, t / dur * 100)}%`, background: color } })));
}
ReactDOM.createRoot(document.getElementById("root")).render(/* @__PURE__ */ React.createElement(App, null));
