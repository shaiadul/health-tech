import { FinancialService } from "@/types/service"

export const FINANCIAL_SERVICES: FinancialService[] = [
  {
    id: "srv_invest_01",
    slug: "investment-planning",
    title: "Investment Planning",
    shortDescription:
      "Build a tailored wealth generation strategy aligned with your risk tolerance, liquidity horizon, and goals.",
    fullDescription:
      "Our fiduciary investment advisors conduct a holistic portfolio audit to optimize capital allocation across equities, fixed income, treasury notes, and alternative assets. We emphasize tax-advantaged compounding, downside protection, and automated rebalancing.",
    category: "wealth",
    durationMinutes: 45,
    feeDisplay: "Free Initial Audit",
    iconName: "TrendingUp",
    popular: true,
    badge: "Most Popular",
    benefits: [
      "Customized asset allocation tailored to personal risk profile",
      "Fee-only fiduciary guidance with zero product sales pressure",
      "Downside volatility mitigation and hedging strategies",
      "Quarterly performance reporting and automated rebalancing models",
    ],
    process: [
      {
        step: "01",
        title: "Capital & Risk Profiling",
        description: "Review current holdings, debt obligations, and liquidity timelines.",
      },
      {
        step: "02",
        title: "Asset Allocation Model",
        description: "Formulate a personalized multi-asset portfolio blueprint.",
      },
      {
        step: "03",
        title: "Implementation Plan",
        description: "Streamline fund execution across tax-sheltered and brokerage accounts.",
      },
      {
        step: "04",
        title: "Ongoing Monitoring",
        description: "Periodic reviews with your dedicated senior investment advisor.",
      },
    ],
    requirements: [
      "Recent brokerage or investment account statements (optional)",
      "Outline of major upcoming liquidity milestones (1–5 years)",
      "Estimated risk tolerance questionnaire (provided before call)",
    ],
    faqs: [
      {
        question: "How is Finora different from a robo-advisor?",
        answer:
          "Finora pairs algorithmic portfolio analytics with human fiduciary specialists who understand tax nuances, career changes, and unique personal situations.",
      },
      {
        question: "Is the initial 45-minute consultation really free?",
        answer:
          "Yes. Your initial consultation includes a comprehensive portfolio health check and personalized strategic roadmap at no cost.",
      },
    ],
  },
  {
    id: "srv_personal_02",
    slug: "personal-finance",
    title: "Personal Finance & Cashflow",
    shortDescription:
      "Master your cashflow velocity, eliminate high-interest liabilities, and build automated emergency liquidity.",
    fullDescription:
      "Gain full command over your monthly disposable income. We analyze spending leaks, structure high-yield savings reserves, and install automated behavioral money management systems that safeguard your peace of mind.",
    category: "planning",
    durationMinutes: 30,
    feeDisplay: "Complimentary",
    iconName: "Wallet",
    popular: true,
    benefits: [
      "Zero-based cashflow blueprint customized to your lifestyle",
      "High-interest debt elimination avalanche/snowball planning",
      "Automated savings rules that sweep idle checking capital",
      "Credit score enhancement and optimization protocols",
    ],
    process: [
      {
        step: "01",
        title: "Income & Outflow Audit",
        description: "Categorize historical spending and identify optimization zones.",
      },
      {
        step: "02",
        title: "Emergency Vault Sizing",
        description: "Calibrate 3–6 months of essential liquidity in high-yield reserves.",
      },
      {
        step: "03",
        title: "Automated Rules Setup",
        description: "Configure direct deposits, split accounts, and automated investments.",
      },
      {
        step: "04",
        title: "Quarterly Check-In",
        description: "Track progress and adjust parameters as income expands.",
      },
    ],
    requirements: [
      "Summary of monthly recurring expenses",
      "List of outstanding consumer liabilities or loans",
    ],
    faqs: [
      {
        question: "Do I need to disclose all my bank passwords?",
        answer:
          "Never. We never ask for banking credentials or account passwords. We operate strictly on aggregate numbers and statements you choose to share.",
      },
    ],
  },
  {
    id: "srv_retire_03",
    slug: "retirement-planning",
    title: "Retirement Planning",
    shortDescription:
      "Engineer your financial independence timeline with tax-efficient withdrawal and pension strategies.",
    fullDescription:
      "Whether you are targeting early retirement (FIRE) or planning traditional pension distributions, our retirement specialists project your portfolio longevity under Monte Carlo stress simulations and health-cost contingencies.",
    category: "retirement",
    durationMinutes: 45,
    feeDisplay: "Free Consultation",
    iconName: "ShieldAlert",
    benefits: [
      "Monte Carlo simulations modeling 1,000+ market cycles",
      "Roth conversion ladder and tax-bracket arbitrage strategies",
      "Social Security and pension claim timing optimization",
      "Healthcare, Medicare, and long-term care contingency reserves",
    ],
    process: [
      {
        step: "01",
        title: "Retirement Vision Definition",
        description: "Clarify expected retirement age, annual spend, and lifestyle goals.",
      },
      {
        step: "02",
        title: "Projection & Gap Analysis",
        description: "Evaluate current compounding rates against retirement target capital.",
      },
      {
        step: "03",
        title: "Tax Optimization Strategy",
        description: "Minimize lifetime taxation across pre-tax, Roth, and taxable buckets.",
      },
      {
        step: "04",
        title: "Distribution Scheduling",
        description: "Set up sustainable annual withdrawal rate protocols.",
      },
    ],
    requirements: [
      "Current balances in 401(k), IRA, pensions, or provident funds",
      "Estimated target retirement age and annual living budget",
    ],
    faqs: [
      {
        question: "Can you help if I want to retire in my 40s or 50s?",
        answer:
          "Yes. We specialize in early retirement structuring, including early penalty-free withdrawal strategies and bridge funding models.",
      },
    ],
  },
  {
    id: "srv_tax_04",
    slug: "tax-consultation",
    title: "Tax Strategy & Optimization",
    shortDescription:
      "Legally minimize your income, capital gains, and business tax burden through proactive structuring.",
    fullDescription:
      "Taxes are the single largest drag on lifetime wealth creation. Our licensed tax strategists identify deductions, entity classifications, cross-border considerations, and tax-loss harvesting opportunities before year-end.",
    category: "tax",
    durationMinutes: 40,
    feeDisplay: "Complimentary Strategy",
    iconName: "Receipt",
    badge: "High Impact",
    benefits: [
      "Proactive year-end tax loss and gain harvesting plans",
      "Entity structuring (LLC, S-Corp, Holding) for self-employed and founders",
      "Stock option and equity compensation (RSU, ISO, NSO) tax mitigation",
      "Charitable giving and donor-advised fund tax shelters",
    ],
    process: [
      {
        step: "01",
        title: "Prior Return Review",
        description: "Analyze previous tax filings for missed deductions and carryforwards.",
      },
      {
        step: "02",
        title: "Income Timing Strategy",
        description: "Structure salary, distributions, and bonuses to manage brackets.",
      },
      {
        step: "03",
        title: "Deduction Maximization",
        description: "Implement retirement, HSA, business, and real estate write-offs.",
      },
      {
        step: "04",
        title: "Filing Roadmap",
        description: "Coordinate with your CPA for seamless compliance execution.",
      },
    ],
    requirements: [
      "Previous year's tax return summary",
      "Overview of all active income sources and corporate entities",
    ],
    faqs: [
      {
        question: "Do you prepare and file my tax return?",
        answer:
          "We specialize in strategic tax advisory and optimization roadmaps. We provide turnkey instructions you or your CPA can execute directly.",
      },
    ],
  },
  {
    id: "srv_biz_05",
    slug: "business-finance",
    title: "Business Finance & Treasury",
    shortDescription:
      "Optimize enterprise working capital, debt structures, runway management, and commercial credit lines.",
    fullDescription:
      "Designed for startup founders, small-medium business owners, and corporate executives. We help optimize treasury cash yield, model burn runways, prepare financing packages, and establish corporate governance.",
    category: "business",
    durationMinutes: 45,
    feeDisplay: "Free Discovery Session",
    iconName: "Briefcase",
    benefits: [
      "Treasury cash management earning top institutional yields",
      "Working capital optimization and vendor payment term negotiation",
      "Debt vs equity financing evaluation and debt-service coverage modeling",
      "Fractional CFO insights without enterprise overhead",
    ],
    process: [
      {
        step: "01",
        title: "Cashflow & Runway Audit",
        description: "Model historical burn rate, unit economics, and liquidity cushions.",
      },
      {
        step: "02",
        title: "Treasury Allocation",
        description: "Deploy operating reserves into insured short-term yield instruments.",
      },
      {
        step: "03",
        title: "Capital Structure Optimization",
        description: "Calibrate revolving credit, equipment leases, or venture facilities.",
      },
      {
        step: "04",
        title: "Executive Reporting",
        description: "Automate investor and board financial dashboard metrics.",
      },
    ],
    requirements: [
      "Estimated monthly revenue and burn run-rate",
      "Overview of current banking relationships and credit facilities",
    ],
    faqs: [
      {
        question: "What company stages do you support?",
        answer:
          "We consult with businesses ranging from early-stage bootstrapped teams to venture-backed startups and established operating companies.",
      },
    ],
  },
  {
    id: "srv_insure_06",
    slug: "insurance-planning",
    title: "Asset & Insurance Planning",
    shortDescription:
      "Safeguard your family and enterprise balance sheet against catastrophic health, disability, and liability risks.",
    fullDescription:
      "Comprehensive wealth preservation requires robust defensive perimeter planning. We review your existing coverage to eliminate duplicate premiums while closing critical coverage blind spots in umbrella, life, and key-person policies.",
    category: "insurance",
    durationMinutes: 30,
    feeDisplay: "Free Policy Audit",
    iconName: "ShieldCheck",
    benefits: [
      "Independent audit of existing term, disability, and umbrella policies",
      "Identification of expensive, low-value whole-life riders to eliminate",
      "Key-person and buy-sell agreement insurance for business partners",
      "Estate asset insulation through irrevocable protective structures",
    ],
    process: [
      {
        step: "01",
        title: "Vulnerability Scan",
        description: "Assess exposure across liability, disability, health, and mortality.",
      },
      {
        step: "02",
        title: "Policy Benchmarking",
        description: "Compare your current premium costs against competitive market tiers.",
      },
      {
        step: "03",
        title: "Coverage Rationalization",
        description: "Drop unnecessary riders and expand high-limit umbrella shields.",
      },
      {
        step: "04",
        title: "Annual Protection Review",
        description: "Recalibrate limits as family net worth and asset bases expand.",
      },
    ],
    requirements: [
      "Summary of existing insurance policies and death/disability benefit amounts",
    ],
    faqs: [
      {
        question: "Do you earn commissions on insurance policies you recommend?",
        answer:
          "No. Our specialists provide independent fiduciary analysis. We do not sell proprietary policies or accept hidden carrier kickbacks.",
      },
    ],
  },
  {
    id: "srv_health_07",
    slug: "financial-health-check",
    title: "Financial Health Diagnostic",
    shortDescription:
      "A fast, 360-degree diagnostic benchmarking your savings rate, debt ratio, and net worth trajectory.",
    fullDescription:
      "Ideal for anyone wanting clarity on where they stand financially. In a focused 30-minute session, we evaluate your financial vital signs, assign an actionable health score, and deliver 3 high-impact immediate moves.",
    category: "planning",
    durationMinutes: 30,
    feeDisplay: "100% Free",
    iconName: "Activity",
    popular: true,
    badge: "Quick Start",
    benefits: [
      "Comprehensive 20-point financial diagnostic score",
      "Comparison against peer benchmarks for your age and income cohort",
      "Identification of the top 3 high-leverage immediate financial moves",
      "Customized 1-page Financial Vital Signs scorecard",
    ],
    process: [
      {
        step: "01",
        title: "Quick 5-Min Pre-Quiz",
        description: "Submit basic income, debt, and savings estimates.",
      },
      {
        step: "02",
        title: "Diagnostic Session",
        description: "Review your Financial Health Score live with a specialist.",
      },
      {
        step: "03",
        title: "Action Roadmap",
        description: "Walk away with 3 high-impact action steps for the next 30 days.",
      },
    ],
    requirements: [
      "No paperwork required! Just rough estimates of your monthly finances.",
    ],
    faqs: [
      {
        question: "Is this suitable for beginners?",
        answer:
          "Absolutely. It is specifically designed to be friendly, jargon-free, and actionable regardless of your current net worth.",
      },
    ],
  },
]
