cases = [
    ("who-is-likely-to-quit", "Who's Likely to Quit", "Predict which employees are likely to quit before they resign", "who-is-likely-to-quit"),
    ("predicting-customer-response-to-discounts", "Predicting Customer Response to Discounts", "Find out which customers respond to discount campaigns", "predicting-customer-response-discounts"),
    ("when-good-cars-lose-value", "When Good Cars Lose Value", "Learn which car features hold value best over time", "when-good-cars-lose-value"),
    ("grow-smarter-not-bigger", "Grow Smarter, Not Bigger", "Find out if hiring more employees actually increases revenue", "grow-smarter"),
    ("do-dollars-drive-decisions", "Do Dollars Drive Decisions?", "Discover how income levels influence customer buying decisions", "do-dollar-drive-decisions"),
    ("what-causes-product-returns", "What Causes Product Returns", "Discover what price factors trigger the most product returns", "what-causes-product-returns"),
    ("cash-or-credit-card", "Cash or Credit Card", "Discover whether cash or credit card users spend more", "cash-or-credit-card"),
    ("did-you-sleep-well-last-night", "Did You Sleep Well Last Night?", "Explore what hotel factors contribute to better guest sleep quality", "hotel-sleep-analysis"),
    ("connected-or-disconnected", "Connected or Disconnected?", "Learn if social media usage strengthens or weakens relationships", "connected-or-disconnected"),
    ("nasi-lemak-vs-kopi-o-preference", "Nasi Lemak vs Kopi-O Preference Analysis", "Discover cultural preferences between nasi lemak and kopi-o choices", "nasi-lemak-kopi-o"),
    ("hidden-patterns-malaysian-real-estate", "The Hidden Patterns in Malaysian Real Estate", "Uncover hidden patterns that drive Malaysian real estate success", "hidden-patterns-malaysian-real-estate"),
    ("from-clicks-to-check-ins", "From Clicks to Check-Ins", "Transform hotel search traffic into confirmed bookings", "from-clicks-to-check-ins"),
    ("what-men-and-women-buy", "What Men and Women Buy", "Gender-based product preference analysis", "what-men-and-women-buy"),
    ("not-all-shoppers-are-equal", "Not All Shoppers Are Equal", "Learn what customer spending patterns reveal", "not-all-shoppers-are-equal"),
    ("hidden-power-of-affiliates", "The Hidden Power of Affiliates", "Uncover the hidden power of affiliate marketing partnerships", "hidden-power-of-affliate"),
    ("predicting-product-sales", "Predicting Product Sales", "Find out which advertising channels deliver the most sales per dollar", "predict-product-sales"),
    ("beyond-the-buzzwords", "Beyond the Buzzwords", "Discover which jewelry keywords actually deliver clicks and sales", "beyond-the-buzzwords"),
    ("boost-sales-restocking-efficiency", "Boost Sales and Restocking Efficiency", "Learn the best times to restock vending machines for maximum sales", "maximizing-vending-machine-sales-by-time"),
    ("fruit-sales-forecast-october-2024", "Fruit Sales Forecast - October 2024", "Predict seasonal fruit demand to maximize sales", "fruit-sales-forecast-october-2024"),
    ("ron95-fuel-price-volatility", "RON95 Fuel Price Volatility Analysis", "Forecast RON95 fuel prices to anticipate market volatility and costs", "ron95"),
    ("too-hot-to-harvest", "Too Hot to Harvest", "Discover how climate patterns impact crop yields", "too-hot-to-harvest"),
    ("trend-or-trap", "Trend or Trap?", "Decode Google's price moves to spot real trends", "trend-or-trap"),
]

template = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{title} | Pau Analytics</title>
  <link rel="canonical" href="https://www.pauanalytics.com/case-study/{filename}" />
  <meta name="description" content="{description}" />

  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap" rel="stylesheet" />

  <style>
    * {{
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }}

    html, body {{
      height: 100%;
      margin: 0;
      font-family: 'Poppins', sans-serif;
      background-color: #FCF9F2;
      color: #333;
    }}

    body {{
      display: flex;
      flex-direction: column;
    }}

    .navbar {{
      position: sticky;
      top: 0;
      z-index: 1100;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: #FCF9F2;
      padding: 1rem 2rem;
      border-bottom: 1px solid #e0ddd3;
      box-shadow: 0 2px 6px rgba(0,0,0,0.04);
    }}

    .navbar .brand {{
      font-size: 1.2rem;
      font-weight: 600;
      color: #403B36;
      text-decoration: none;
    }}

    .navbar nav a {{
      margin-left: 1.5rem;
      text-decoration: none;
      color: #403B36;
      font-weight: 500;
    }}

    .navbar nav a:hover {{
      color: #CBA135;
    }}

    .case-study-header {{
      background: linear-gradient(to bottom right, #FCF9F2, #fff9e7);
      padding: 4rem 2rem 3rem;
      text-align: center;
    }}

    .case-study-header h1 {{
      color: #403B36;
      font-size: 2.5rem;
      margin-bottom: 1rem;
    }}

    .case-study-header .subtitle {{
      font-size: 1.2rem;
      color: #555;
      margin-bottom: 2rem;
    }}

    .content-section {{
      max-width: 1000px;
      margin: 3rem auto;
      padding: 0 2rem;
      flex: 1;
    }}

    .content-section h2 {{
      color: #403B36;
      border-bottom: 2px solid #CBA135;
      padding-bottom: 0.5rem;
      margin-bottom: 1.5rem;
    }}

    .content-section p {{
      line-height: 1.8;
      margin-bottom: 1rem;
    }}

    .cta-section {{
      background: #403B36;
      color: white;
      padding: 3rem 2rem;
      text-align: center;
      border-radius: 10px;
      margin: 3rem auto;
      max-width: 800px;
    }}

    .cta-section h3 {{
      margin-top: 0;
      color: white;
    }}

    .cta-button {{
      display: inline-block;
      background-color: #CBA135;
      color: white;
      text-decoration: none;
      padding: 12px 30px;
      border-radius: 6px;
      font-weight: 600;
      font-size: 1rem;
      transition: background-color 0.3s ease;
      margin-right: 1rem;
    }}

    .cta-button:hover {{
      background-color: #b08e2e;
    }}

    .cta-button.secondary {{
      background: transparent;
      border: 2px solid white;
    }}

    footer {{
      background-color: #403B36;
      color: white;
      text-align: center;
      padding: 1.5rem;
      font-size: 0.9rem;
      margin-top: auto;
    }}

    footer a {{
      color: #CBA135;
      text-decoration: none;
    }}

    footer a:hover {{
      text-decoration: underline;
    }}

    @media (max-width: 768px) {{
      .navbar {{
        flex-direction: column;
        align-items: flex-start;
      }}

      .navbar nav {{
        margin-top: 0.5rem;
      }}

      .navbar nav a {{
        margin-left: 0;
        margin-right: 1rem;
      }}

      .case-study-header h1 {{
        font-size: 2rem;
      }}
    }}
  </style>
</head>
<body>

  <div class="navbar">
    <a href="../index.html" class="brand">Pau Analytics</a>
    <nav>
      <a href="../index.html">Home</a>
      <a href="../data-analytics.html">Data Analytics</a>
      <a href="../ai-solutions.html">AI Solutions</a>
      <a href="../pricing.html">Pricing</a>
      <a href="../about.html">About</a>
      <a href="../contact.html">Contact</a>
    </nav>
  </div>

  <div class="case-study-header">
    <h1>{title}</h1>
    <p class="subtitle">{description}</p>
  </div>

  <div class="content-section">
    <h2>Coming Soon</h2>
    <p>This case study is currently being prepared. Check back soon for detailed insights.</p>

    <p>In the meantime, explore the full case study on our portfolio site:</p>
    <p><a href="https://lyven81.github.io/data-analyst-portfolio/case-studies/{portfolio_file}.html" style="color: #CBA135; font-weight: 500;">View Full Case Study →</a></p>
  </div>

  <div class="cta-section">
    <h3>Want Similar Insights for Your Business?</h3>
    <p>Let us help you turn your data into direction and build solutions that work for your business.</p>
    <div style="margin-top: 2rem;">
      <a href="../contact.html" class="cta-button">Get Started</a>
      <a href="https://wa.me/60149207099" class="cta-button secondary">WhatsApp Us</a>
    </div>
  </div>

  <footer>
    <p>© 2025 Pau Analytics | <a href="../privacy-policy.html">Privacy Policy</a></p>
  </footer>

</body>
</html>"""

for filename, title, description, portfolio_file in cases:
    html_content = template.format(
        filename=filename,
        title=title,
        description=description,
        portfolio_file=portfolio_file
    )
    with open(f"{filename}.html", "w", encoding="utf-8") as f:
        f.write(html_content)
    print(f"Created {filename}.html")

print("\nCreated 22 case study files successfully")