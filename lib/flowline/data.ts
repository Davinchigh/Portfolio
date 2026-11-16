import type { Example } from "./classifier"

/** Labelled support messages the classifier learns from. Written by hand for this demo. */
export const TRAINING: Example[] = [
  // billing
  { label: "billing", text: "I was charged twice for my subscription this month" },
  { label: "billing", text: "My invoice shows the wrong amount, please correct it" },
  { label: "billing", text: "Why did you take 250 cedis from my momo wallet" },
  { label: "billing", text: "I need a refund, the payment went through two times" },
  { label: "billing", text: "The receipt you sent does not match what I paid" },
  { label: "billing", text: "Please cancel my plan and refund the last charge" },
  { label: "billing", text: "My card was declined but the money still left my account" },
  { label: "billing", text: "Can I get a VAT invoice for my payment last week" },
  { label: "billing", text: "I paid by mobile money but my plan still says unpaid" },
  { label: "billing", text: "You billed me after I cancelled, I want my money back" },
  { label: "billing", text: "How do I change the card used for my monthly payment" },
  { label: "billing", text: "The price on my bill is higher than the price on your website" },
  { label: "billing", text: "Overcharged on my last invoice, need a refund please" },
  { label: "billing", text: "Payment failed three times with my visa card" },
  // technical
  { label: "technical", text: "The app crashes every time I open the sales report" },
  { label: "technical", text: "I get an error message when I try to save a product" },
  { label: "technical", text: "The page keeps loading and never shows my dashboard" },
  { label: "technical", text: "Export to excel is broken, the file is empty" },
  { label: "technical", text: "The barcode scanner stopped working after the update" },
  { label: "technical", text: "Sync is not working, my stock numbers are different on my phone" },
  { label: "technical", text: "I found a bug, the total is wrong when I add a discount" },
  { label: "technical", text: "The app is very slow and freezes when I search" },
  { label: "technical", text: "Printing receipts gives a blank page since yesterday" },
  { label: "technical", text: "Error 500 when uploading my product list" },
  { label: "technical", text: "The button to add a sale does nothing when I tap it" },
  { label: "technical", text: "Reports show yesterday's data, it is not updating" },
  { label: "technical", text: "The app closes by itself on my android phone" },
  { label: "technical", text: "Search is broken and shows no results for items I have" },
  // account
  { label: "account", text: "I forgot my password and the reset email never arrives" },
  { label: "account", text: "Please change the email address on my account" },
  { label: "account", text: "I cannot log in, it says my account is locked" },
  { label: "account", text: "How do I add my shop assistant as a second user" },
  { label: "account", text: "I want to delete my account and all my data" },
  { label: "account", text: "The verification code is not coming to my phone" },
  { label: "account", text: "Someone logged in to my account from another device" },
  { label: "account", text: "Change my phone number, I have a new sim card" },
  { label: "account", text: "I need to reset my pin, I do not remember it" },
  { label: "account", text: "How can I remove a staff member's access to my shop" },
  { label: "account", text: "My login stopped working after I changed my password" },
  { label: "account", text: "Please update the name of my business on my profile" },
  { label: "account", text: "Two factor code keeps saying invalid when I sign in" },
  { label: "account", text: "I signed up with the wrong email, can you fix my account" },
  // sales
  { label: "sales", text: "How much does the premium plan cost for five shops" },
  { label: "sales", text: "Do you offer a discount for paying yearly" },
  { label: "sales", text: "I would like a demo for my team before we buy" },
  { label: "sales", text: "Can your product handle a supermarket with 4000 items" },
  { label: "sales", text: "What is the difference between the basic and pro plans" },
  { label: "sales", text: "We are comparing you with another tool, do you have pricing for schools" },
  { label: "sales", text: "Is there a free trial I can start today" },
  { label: "sales", text: "I want to upgrade to the bigger plan, what do I get" },
  { label: "sales", text: "Do you have a plan for wholesalers with many branches" },
  { label: "sales", text: "Please send me a quote for 20 users" },
  { label: "sales", text: "Interested in your product, can someone call me about pricing" },
  { label: "sales", text: "Can I pay for the pro plan with mobile money, and what does it cost" },
  { label: "sales", text: "Do you give nonprofits a cheaper price" },
  { label: "sales", text: "Looking to buy licences for our three stores, need a quote" },
  // delivery
  { label: "delivery", text: "My order has not arrived and it has been two weeks" },
  { label: "delivery", text: "Where is my package, the tracking has not moved" },
  { label: "delivery", text: "The courier delivered the wrong item to my shop" },
  { label: "delivery", text: "My receipt printer arrived damaged, the box was open" },
  { label: "delivery", text: "Can I change the delivery address for my order" },
  { label: "delivery", text: "The rider says he came but nobody delivered anything" },
  { label: "delivery", text: "How long does shipping to Kumasi take" },
  { label: "delivery", text: "I received only one of the two scanners I ordered" },
  { label: "delivery", text: "Tracking says delivered but I have not received my parcel" },
  { label: "delivery", text: "Please cancel my order before it ships" },
  { label: "delivery", text: "The delivery is late, I needed the printer for market day" },
  { label: "delivery", text: "Can you ship my order to Tamale instead of Accra" },
  { label: "delivery", text: "The package arrived but the charger is missing from the box" },
  { label: "delivery", text: "When will my order be dispatched from the warehouse" },
]

/** Held out: the classifier never sees these while training. Used to measure accuracy. */
export const HELD_OUT: Example[] = [
  { label: "billing", text: "You charged my card twice, please refund one payment" },
  { label: "billing", text: "My invoice total is wrong" },
  { label: "billing", text: "Money left my momo wallet but the plan is still unpaid" },
  { label: "billing", text: "I want my money back for last month's bill" },
  { label: "billing", text: "Why was I billed a higher price than the website shows" },
  { label: "technical", text: "The app crashes when I open reports" },
  { label: "technical", text: "I keep getting an error when saving a sale" },
  { label: "technical", text: "The export file is empty and the page freezes" },
  { label: "technical", text: "Scanner stopped working after the last update" },
  { label: "technical", text: "My stock numbers are not updating on my phone" },
  { label: "account", text: "I cannot log in and the password reset email is not arriving" },
  { label: "account", text: "Please change the phone number on my account" },
  { label: "account", text: "My account is locked after I changed my pin" },
  { label: "account", text: "How do I give a staff member access to my shop" },
  { label: "account", text: "The verification code says invalid when I sign in" },
  { label: "sales", text: "What does the pro plan cost for three shops" },
  { label: "sales", text: "Can I get a demo and a quote for my team" },
  { label: "sales", text: "Is there a discount if we pay yearly" },
  { label: "sales", text: "Do you have a free trial for wholesalers" },
  { label: "sales", text: "We want to buy licences for 20 users, what is the pricing" },
  { label: "delivery", text: "My order still has not arrived" },
  { label: "delivery", text: "Tracking says delivered but I received nothing" },
  { label: "delivery", text: "The printer arrived damaged and a cable is missing from the box" },
  { label: "delivery", text: "Can you change the delivery address to Kumasi" },
  { label: "delivery", text: "How long until my package ships from the warehouse" },
]

export const TEAMS: Record<string, { team: string; slaHours: number }> = {
  billing: { team: "billing", slaHours: 8 },
  technical: { team: "support engineering", slaHours: 4 },
  account: { team: "accounts and access", slaHours: 4 },
  sales: { team: "sales", slaHours: 24 },
  delivery: { team: "logistics", slaHours: 12 },
}

/** A stand-in customer directory. In a real deployment this step would call a CRM. */
export const CUSTOMERS: Record<string, { name: string; plan: "free" | "pro" | "business"; since: number; openTickets: number }> = {
  "ama@adomstores.com": { name: "Ama Owusu", plan: "business", since: 2023, openTickets: 2 },
  "kojo@kmart.gh": { name: "Kojo Mensah", plan: "pro", since: 2024, openTickets: 0 },
  "efua.b@gmail.com": { name: "Efua Boateng", plan: "free", since: 2026, openTickets: 0 },
}

/** Invoice numbers already paid, for the duplicate check. */
export const PAID_INVOICES = ["INV-2041", "INV-2077", "INV-2102"]

export const SAMPLE_MESSAGES = [
  {
    label: "double charge, business customer",
    text: "Hello, this is Ama from Adom Stores (ama@adomstores.com). I was charged twice for my subscription this month, GH₵ 480 each time, on 3 Nov. This is the third time I am writing and it is urgent. Please refund one payment today. Order ref #48213.",
  },
  {
    label: "app crash",
    text: "Hi team, the app crashes every time I open the sales report on my phone. It started after yesterday's update. I get an error and it closes. kojo@kmart.gh",
  },
  {
    label: "pricing question",
    text: "Good afternoon. How much does the pro plan cost for three shops, and is there a discount if we pay yearly? You can call me on 024 555 0142. Thanks, Efua (efua.b@gmail.com)",
  },
  {
    label: "missing parcel",
    text: "My order #51877 has not arrived and tracking says delivered. I needed the receipt printer for market day tomorrow!! Please help asap.",
  },
]

export const SAMPLE_INVOICES = [
  {
    label: "clean invoice",
    text: `INVOICE INV-2118
Vendor: Kasapa Packaging Ltd
Date: 2026-11-10
Due: 2026-11-24

Paper bags (large) 400 x 0.85
Receipt rolls 60 x 4.50
Delivery 1 x 35.00

Subtotal: 645.00
Tax: 96.75
Total: 741.75`,
  },
  {
    label: "totals do not add up",
    text: `INVOICE INV-2119
Vendor: BrightSpark Electricals
Date: 2026-11-11
Due: 2026-11-25

LED shop lights 12 x 85.00
Installation 1 x 300.00

Subtotal: 1320.00
Tax: 198.00
Total: 1618.00`,
  },
  {
    label: "already paid",
    text: `INVOICE INV-2077
Vendor: Kasapa Packaging Ltd
Date: 2026-10-02
Due: 2026-10-16

Paper bags (small) 600 x 0.40

Subtotal: 240.00
Tax: 36.00
Total: 276.00`,
  },
  {
    label: "large, needs sign-off",
    text: `INVOICE INV-2120
Vendor: ColdChain Refrigeration
Date: 2026-11-12
Due: 2026-12-12

Display fridge 2 x 3200.00
Delivery and setup 1 x 450.00

Subtotal: 6850.00
Tax: 1027.50
Total: 7877.50`,
  },
]
