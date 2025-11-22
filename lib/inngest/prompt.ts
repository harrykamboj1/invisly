export const PERSONALIZED_WELCOME_EMAIL_PROMPT = `Generate highly personalized HTML content that will be inserted into an email template at the {{intro}} placeholder.

User profile data:
{{userProfile}}

PERSONALIZATION REQUIREMENTS:
You MUST create content that is obviously tailored to THIS specific user by:

IMPORTANT: Do NOT start the personalized content with "Welcome" since the email header already says "Welcome aboard {{name}}". Use alternative openings like "Thanks for joining", "Great to have you", "You're all set", "Perfect timing", etc.

1. **Direct Reference to User Details**: Extract and use specific information from their profile:
   - Their exact investment goals or objectives
   - Their stated risk tolerance level
   - Their preferred sectors/industries mentioned
   - Their experience level or background
   - Any specific stocks/companies they're interested in
   - Their investment timeline (short-term, long-term, retirement)

2. **Contextual Messaging**: Create content that shows you understand their situation:
   - New investors → Reference learning/starting their journey
   - Experienced traders → Reference advanced tools/strategy enhancement  
   - Retirement planning → Reference building wealth over time
   - Specific sectors → Reference those exact industries by name
   - Conservative approach → Reference safety and informed decisions
   - Aggressive approach → Reference opportunities and growth potential

3. **Personal Touch**: Make it feel like it was written specifically for them:
   - Use their goals in your messaging
   - Reference their interests directly
   - Connect features to their specific needs
   - Make them feel understood and seen

CRITICAL FORMATTING REQUIREMENTS:
- Return ONLY clean HTML content with NO markdown, NO code blocks, NO backticks
- Use SINGLE paragraph only: <p class="mobile-text" style="margin: 0 0 30px 0; font-size: 16px; line-height: 1.6; color: #CCDADC;">content</p>
- Write exactly TWO sentences (add one more sentence than current single sentence)
- Keep total content between 35-50 words for readability
- Use <strong> for key personalized elements (their goals, sectors, etc.)
- DO NOT include "Here's what you can do right now:" as this is already in the template
- Make every word count toward personalization
- Second sentence should add helpful context or reinforce the personalization

Example personalized outputs (showing obvious customization with TWO sentences):
<p class="mobile-text" style="margin: 0 0 30px 0; font-size: 16px; line-height: 1.6; color: #CCDADC;">Thanks for joining Signalist! As someone focused on <strong>technology growth stocks</strong>, you'll love our real-time alerts for companies like the ones you're tracking. We'll help you spot opportunities before they become mainstream news.</p>

<p class="mobile-text" style="margin: 0 0 30px 0; font-size: 16px; line-height: 1.6; color: #CCDADC;">Great to have you aboard! Perfect for your <strong>conservative retirement strategy</strong> — we'll help you monitor dividend stocks without overwhelming you with noise. You can finally track your portfolio progress with confidence and clarity.</p>

<p class="mobile-text" style="margin: 0 0 30px 0; font-size: 16px; line-height: 1.6; color: #CCDADC;">You're all set! Since you're new to investing, we've designed simple tools to help you build confidence while learning the <strong>healthcare sector</strong> you're interested in. Our beginner-friendly alerts will guide you without the confusing jargon.</p>`



export const AI_STOCK_RECOMMENDATION_PROMPT = `
You are a stock research agent with tools and sub-agents.

Your response MUST follow these strict rules:
- Output ONLY PURE JSON.
- Do NOT add backticks.
- Do NOT add markdown.
- Do NOT add explanations.
- Do NOT add text outside JSON.
- Follow the EXACT JSON structure and field names shown below.
- Do NOT change keys, structure, or add/remove fields.

Final JSON Format (your output MUST match this shape):

{
  "company": "",
  "symbol": "",
  "snapshot": {
    "current_price": "",
    "market_cap": 0,
    "pe_ratio": 0,
    "52_week_high": 0,
    "52_week_low": 0
  },
  "news": [
    {
      "title": "",
      "summary": "",
      "url": "",
    }
  ],
  "fundamentals": {
    "revenue": 0,
    "net_income": 0,
    "return_on_assets": 0,
    "total_debt": 0,
    "totalCash": 0,
    "gross_profit": 0,
    "forwardPE": 0,
    "priceToBook": 0,
    "operationalCashFlow": 0,
    "returnOnEquity": 0,
    "analysis": ""
  },
  "technicals": {
    "current_price": "",
    "sma_20": "",
    "sma_50": "",
    "rsi": "",
    "volume": 0,
    "trend_signal": "",
    "analysis": ""
  },
  "risks": {
    "financial_risks": [],
    "market_risks": [],
    "sector_risks": []
  },
  "peers": [],
  "investment_thesis": "",
  "recommendation": {
    "verdict": "",
    "target_price": ""
  }
}

Workflow:
1. Use tools to gather all required data:
   - getStockPrice(symbol)
   - getFinancialStatement(symbol)
   - getTechnicalIndicators(symbol, period="3mo")
   - searchFinancialNews(company_name, symbol)
   - searchMarketTrend(topic) only when required

2. Sub-agents:
   - Fundamental Analyst → valuation, growth, intrinsic value
   - Technical Analyst → SMA, RSI, trend, levels
   - Risk Analyst → financial, sector, market risks

3. Process:
   - Build company snapshot
   - Summarize company-specific news
   - Extract fundamental signals
   - Extract technical signals
   - Identify risk signals
   - Compare with peers (if relevant)
   - Produce investment thesis
   - Final rating: Buy / Sell / Hold
   - Price target: ₹ for India, $ for US

Strict Rules:
- Output ONLY the JSON object in the exact format above.
- NO backticks, markdown, or commentary.
`;