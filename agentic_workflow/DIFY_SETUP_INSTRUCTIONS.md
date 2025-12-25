# Dify.AI Setup Instructions for Pau Analytics Chatbot (Jason)

This document provides step-by-step instructions to connect your Jason chatbot widget to Dify.AI.

---

## Overview

**Current Status:** The chatbot widget is installed and running in **demo mode**. It shows example conversations but doesn't use real AI yet.

**Next Step:** Set up Dify.AI to power Jason with real conversational AI using Gemini.

---

## Prerequisites

Before starting, make sure you have:
- [ ] A Google Cloud account (for Gemini API)
- [ ] Access to the Pau Analytics GitHub repository
- [ ] Admin email: admin@pauanalytics.com
- [ ] The blueprint document: `Pau Analytics AI Sales Customer Agent Building Blueprint.md`

---

## Part 1: Set Up Gemini API (Free/Low-Cost LLM)

### Step 1: Create Google Cloud Account
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Accept terms of service

### Step 2: Get Gemini API Key
1. Click "Get API Key"
2. Create a new API key
3. **IMPORTANT:** Copy and save the key securely (you'll need it for Dify)
4. Note: Gemini offers a generous free tier for testing

### Step 3: Test Your API Key (Optional)
```bash
curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=YOUR_API_KEY" \
  -H 'Content-Type: application/json' \
  -d '{"contents":[{"parts":[{"text":"Hello"}]}]}'
```

If successful, you'll get a response from Gemini.

---

## Part 2: Set Up Dify.AI

### Step 1: Create Dify Account

**Option A: Cloud Version (Easiest, Recommended for Beginners)**
1. Go to [Dify.AI Cloud](https://cloud.dify.ai)
2. Sign up with your admin@pauanalytics.com email
3. Verify your email
4. Free tier: 200 messages/month (upgrade later if needed)

**Option B: Self-Hosted (Advanced, Free but Requires Server)**
1. See [Dify Self-Hosting Guide](https://docs.dify.ai/getting-started/install-self-hosted)
2. Requires Docker and basic server knowledge
3. Fully free, no message limits

### Step 2: Configure Gemini in Dify
1. Login to Dify dashboard
2. Go to **Settings** → **Model Provider**
3. Click **"+ Add Model Provider"**
4. Select **"Google Gemini"**
5. Enter your Gemini API key from Part 1
6. Test the connection
7. Click **Save**

### Step 3: Create Jason Agent

1. In Dify dashboard, click **"Studio"** → **"Create Application"**
2. Select **"Chatbot"** type
3. Name: `Jason - Pau Analytics Consultant`
4. Choose model: **Gemini 1.5 Flash** (faster, cheaper) or **Gemini 1.5 Pro** (smarter)

### Step 4: Configure Jason's Personality (System Prompt)

Copy and paste this into the **"Instructions"** or **"System Prompt"** field:

```
You are Jason, a Data Insights Consultant for Pau Analytics. Your role is to help Malaysian SME owners discover opportunities hiding in their business data through warm, consultative conversations.

PERSONALITY:
- Curious & Inquisitive - Ask thoughtful questions to understand challenges
- Patient Educator - Explain data concepts in simple, jargon-free language
- Empathetic Listener - Understand SME owners wear many hats and face resource constraints
- Practical & Down-to-earth - Focus on real business impact, not technical terms
- Encouraging - Celebrate when business owners recognize problems worth solving

COMMUNICATION STYLE:
- Use Malaysian context examples (retail shops, F&B, kopitiam)
- Speak conversationally, like a friendly consultant over teh tarik
- Ask open-ended questions instead of yes/no questions
- Share micro-insights casually to demonstrate expertise
- Never use jargon without explanation

YOUR GOAL:
Help prospects discover they have a problem worth solving, then naturally show how Pau Analytics can help. You are an educator first, salesperson second.

CONVERSATION APPROACH:
1. Greet warmly based on page context
2. Ask discovery questions to understand their business (SPIN method)
3. Identify specific problems they're facing
4. Share relevant case study that matches their situation
5. Offer package options only after problem is clear
6. Handle objections calmly with empathy
7. Guide toward free consultation call as next step

WHAT YOU COMMONLY SAY:
- "That's a great question! Let me help you think through this..."
- "Many businesses I've worked with face similar challenges..."
- "Based on what you're sharing, I see 2-3 areas where data could help..."
- "Let me share a quick insight: Did you know [statistic]?"
- "Would a free 15-minute chat with our team help? No commitments, just exploring."

WHAT YOU NEVER SAY:
- Never use unexplained jargon (regression, correlation, ML)
- Never make business owners feel ignorant ("Obviously...", "You should know...")
- Never hard-sell packages ("You need Premium now!")
- Never dismiss concerns ("That's not a real problem")
- Never guarantee specific outcomes ("We'll increase revenue by 30%")
- Never rush the conversation ("Let's skip to pricing")

KEY INFORMATION TO COMMUNICATE ACCURATELY:
- Target market: Malaysian SMEs
- Delivery timeline: 2-3 weeks for all packages
- Packages: Insight (RM750), Standard (RM1,500), Premium (RM2,250), Project (RM3,500)
- Contact: admin@pauanalytics.com, WhatsApp +6014-920 7099
- Free consultation offered before purchase

Remember: You're a trusted advisor helping businesses make better decisions, not a pushy salesperson. Build trust through education, empathy, and genuine helpfulness.
```

### Step 5: Upload Knowledge Base

1. In your Jason chatbot settings, go to **"Knowledge"** section
2. Click **"+ Add Knowledge"**
3. Create a new dataset: `Pau Analytics Knowledge Base`
4. Upload the following documents (create them from the blueprint):

**Document 1: Service Packages** (Copy from Blueprint Step 2, Section 1)
```
Monthly Insight (RM750/month)
- Includes: Analyst Report only
- Setup: 2-3 weeks
- Best for: First-time users wanting basic insights
- Annual option: RM8,000/year (saves RM1,000)

[... rest of package details from blueprint ...]
```

**Document 2: Case Study Index** (Copy from Blueprint Step 2, Section 2)
```
[37 case studies organized by category]
```

**Document 3: Objection Handling** (Copy from Blueprint Step 2, Section 7)
```
[All 5 objection response scripts]
```

**Document 4: Business Problems Mapping** (Copy from Blueprint Step 2, Section 3)
```
[Problem → Solution → Case Study mappings]
```

5. Click **"Save and Process"**
6. Wait for Dify to index the documents (1-2 minutes)

### Step 6: Test Jason in Dify
1. Click **"Preview"** button in Dify
2. Test conversation:
   - You: "I run a retail shop"
   - Jason should respond with discovery questions
3. Verify Jason uses the knowledge base correctly
4. Refine prompts if needed

### Step 7: Get API Credentials

**For Cloud Version:**
1. Go to chatbot settings → **"API Access"**
2. Copy your **API Endpoint URL**
3. Copy your **API Key**

**For Self-Hosted:**
1. Your API endpoint will be: `http://your-server-ip:port/v1/chat-messages`
2. Generate API key in Dify settings

---

## Part 3: Connect Widget to Dify

### Step 1: Update Widget Configuration

1. Open file: `assets/js/chatbot-widget.js`
2. Find the `DIFY_CONFIG` section at the top:

```javascript
const DIFY_CONFIG = {
    enabled: false, // Change to true
    apiUrl: 'YOUR_DIFY_API_URL_HERE', // Paste your Dify API endpoint
    apiKey: 'YOUR_DIFY_API_KEY_HERE', // Paste your Dify API key
    conversationId: null
};
```

3. Update it to:

```javascript
const DIFY_CONFIG = {
    enabled: true, // ← Changed to true
    apiUrl: 'https://api.dify.ai/v1/chat-messages', // ← Your actual Dify URL
    apiKey: 'app-xxxxxxxxxxxxxxxxxxxxxxxx', // ← Your actual Dify API key
    conversationId: null
};
```

4. Save the file

### Step 2: Commit and Push Changes

```bash
cd /c/Users/Lenovo/pinnacles-learning-website
git add assets/js/chatbot-widget.js
git commit -m "Enable Dify.AI connection for Jason chatbot"
git push origin main
```

### Step 3: Test Live Chatbot

1. Wait 1-2 minutes for GitHub Pages to deploy
2. Visit https://www.pauanalytics.com
3. Chatbot should appear in bottom-right corner after 10 seconds
4. Click to open and test:
   - Send: "I run a gym"
   - Jason should respond with real AI (not demo responses)
   - Verify case study recommendations work

---

## Part 4: Monitor and Optimize

### Track Conversations in Dify

1. Go to Dify dashboard → **"Logs"**
2. See all conversations in real-time
3. Review:
   - What questions visitors ask
   - How Jason responds
   - Where conversations drop off

### Weekly Optimization (Every Monday)

1. Export conversation logs from Dify
2. Fill in Google Sheets tracking template (see Blueprint Step 6)
3. Calculate metrics:
   - Total conversations
   - Consultation bookings
   - Common objections
4. Identify improvements needed
5. Update Jason's prompts in Dify
6. Test changes

### A/B Testing Jason's Personality

1. In Dify, duplicate Jason chatbot
2. Create Version A (formal tone) and Version B (casual tone)
3. Split traffic 50/50 for 2 weeks
4. Compare consultation booking rates
5. Keep the better-performing version

---

## Part 5: Scaling Up

### When Traffic Grows (500+ conversations/month)

**Monitor Costs:**
- Gemini Flash: ~RM0.10 per 1M tokens (very cheap)
- Gemini Pro: ~RM1.25 per 1M tokens
- Dify Cloud: Free up to 200 messages, then $20/month

**Optimization Tips:**
1. Use Gemini Flash for most conversations (90% cheaper)
2. Switch to Gemini Pro only for complex questions
3. Implement response caching in Dify (reuse similar answers)
4. Consider self-hosting Dify if costs exceed RM200/month

### Add Advanced Features

**Lead Capture Form:**
1. In Dify, add "Form" node to conversation flow
2. Collect: Name, Email, Phone, Industry
3. Send to Google Sheets via webhook

**Email Follow-up:**
1. Use Zapier free tier (100 tasks/month)
2. Trigger: New conversation in Dify
3. Action: Send email summary to admin@pauanalytics.com

**WhatsApp Integration:**
1. Get conversation summary from Dify
2. Generate WhatsApp pre-filled link
3. Hand off to human sales team

---

## Troubleshooting

### Chatbot Not Showing Up
- Check browser console for errors (F12 → Console tab)
- Verify files loaded: `chatbot-widget.css`, `chatbot-widget.js`, `chatbot-config.js`
- Clear browser cache and refresh

### Jason Not Responding / Demo Mode Still Active
- Check `DIFY_CONFIG.enabled` is set to `true`
- Verify API URL and API Key are correct
- Check Dify dashboard → Logs for error messages
- Test API endpoint manually with curl/Postman

### Jason Gives Wrong Answers
- Review conversation in Dify Logs
- Check if knowledge base documents uploaded correctly
- Refine system prompt for clearer instructions
- Add more examples to knowledge base

### Gemini API Errors
- Check quota limits in Google Cloud Console
- Verify API key is valid and not expired
- Ensure billing is enabled (even for free tier)

### Conversations Not Tracked in Google Sheets
- Verify webhook is set up in Dify
- Check Zapier/automation connection
- Test webhook URL manually

---

## Support Resources

**Dify Documentation:**
- [Official Docs](https://docs.dify.ai)
- [Community Forum](https://community.dify.ai)

**Gemini API:**
- [API Reference](https://ai.google.dev/docs)
- [Pricing](https://ai.google.dev/pricing)

**Need Help?**
- Email: admin@pauanalytics.com
- Refer to: `Pau Analytics AI Sales Customer Agent Building Blueprint.md`

---

## Quick Reference

**Key Files:**
- Widget CSS: `/assets/css/chatbot-widget.css`
- Widget JS: `/assets/js/chatbot-widget.js`
- Config: `/assets/js/chatbot-config.js`
- Blueprint: `Pau Analytics AI Sales Customer Agent Building Blueprint.md`

**Live Chatbot URLs:**
- Homepage: https://www.pauanalytics.com
- Data Analytics: https://www.pauanalytics.com/data-analytics.html
- Pricing: https://www.pauanalytics.com/pricing.html

**Key Contacts:**
- Email: admin@pauanalytics.com
- WhatsApp: +6014-920 7099

---

**Last Updated:** December 25, 2025
**Version:** 1.0
