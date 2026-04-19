# Loan Calculator Application

A comprehensive, client-side loan calculator built with React and Vite. Goes well beyond a simple monthly payment tool — it generates full amortization schedules, compares loan scenarios side by side, models the impact of extra payments, assesses affordability based on income and debt ratios, and visualizes how money flows between principal and interest over the life of a loan.

Built as a fintech portfolio project demonstrating modern frontend development with React, Tailwind CSS, and data visualization.

---

## Features

### 1. Core Loan Calculator
Computes monthly payments in real time as inputs change. Handles zero-interest loans as an edge case. Supports loan term entry in either years or months. Slider controls alongside number inputs for loan amount, rate, and term make it easy to explore scenarios quickly.

### 2. Full Amortization Schedule
Month-by-month breakdown of every payment: date, payment amount, principal portion, interest portion, extra payment (if any), and remaining balance. Rows are grouped by year and collapse or expand on click. Running totals appear in the table footer.

### 3. Summary Statistics
Prominent cards showing monthly payment, total amount paid over the life of the loan, total interest paid, interest-to-principal ratio, and projected payoff date. When extra payments are active, additional cards display interest saved and time saved in months.

### 4. Extra Payment Analysis
Enter an additional monthly payment, a one-time lump sum, or both. The application recalculates the full schedule with extra payments applied and shows a side-by-side comparison: interest saved, months eliminated from the term, and the new payoff date.

### 5. Loan Comparison Mode
Set up two or three loan scenarios simultaneously, each with its own amount, rate, term, and loan type. A comparison table ranks each scenario by monthly payment, total interest, total paid, and payoff date, with the best value per metric highlighted automatically. A winner summary card identifies the overall best scenario.

### 6. Visual Charts
- Principal vs. interest donut chart with a centre label showing the principal percentage
- Amortization area chart showing how each payment splits between principal and interest over time
- Remaining balance line chart, with an optional overlay showing balance reduction under extra payments
- Grouped bar chart for comparing monthly payment, total interest, and total paid across scenarios

### 7. Multiple Loan Types
- **Fixed-Rate**: constant rate and payment throughout the loan term
- **Adjustable-Rate (ARM)**: fixed for an initial period, then re-amortized at a new rate for the remaining term
- **Interest-Only**: flat interest payments for an initial period, then full amortization of the remaining balance
- **Balloon Payment**: monthly payments based on a longer amortization period, with the remaining balance due as a lump sum at the actual term end

### 8. Affordability Calculator
Enter gross monthly income, existing monthly debt obligations, desired interest rate, loan term, and down payment. The calculator determines the maximum affordable loan amount using the standard 28% front-end and 36% back-end DTI thresholds. A visual semicircle gauge shows where the debt-to-income ratio falls across safe, caution, and risky zones.

### 9. Currency and Locale Support
Choose from ten currencies including KES (default), USD, EUR, GBP, JPY, INR, ZAR, NGN, CAD, and AUD. All monetary values are formatted using the JavaScript built-in `Intl.NumberFormat` API — currency symbol, decimal separators, and thousand separators adjust automatically. The preference is saved to localStorage and restored on the next visit.

### 10. PDF and CSV Export
Export the full amortization schedule and loan summary as a PDF document (using jsPDF and jsPDF-AutoTable) or as a CSV file (using Papaparse). Export buttons are available on both the Calculator page and the Comparison page.

---

## Tech Stack

| Layer           | Technology                         |
|-----------------|------------------------------------|
| Frontend        | React 18 with Vite                 |
| Styling         | Tailwind CSS                       |
| Routing         | React Router                       |
| Charts          | Recharts                           |
| PDF Export      | jsPDF + jsPDF-AutoTable            |
| CSV Export      | Papaparse                          |
| Form Handling   | React Hook Form                    |
| Icons           | Lucide React                       |
| Number Format   | Intl.NumberFormat (built-in JS)    |
| State           | React Context + useReducer         |

This is a fully client-side application. There is no backend, no database, no server, and no external API calls. All calculations run entirely in the browser.

---

## Prerequisites

- Node.js 18 or higher
- npm 9 or higher

---

## Installation and Setup

```bash
# Clone the repository
git clone https://github.com/Martin888Maina/Loan-Calculator-Application.git
cd Loan-Calculator-Application

# Install dependencies
npm install

# Start the development server
npm run dev
```

Then open your browser and navigate to `http://localhost:5173`.

To build for production:

```bash
npm run build
```

The compiled output will be placed in the `dist/` folder. Because this is a single-page application, configure your web server to serve `index.html` for all routes.

---

## Usage Guide

### Calculator Page (`/calculator`)
1. Enter your loan amount using the number input or the slider beneath it.
2. Set the annual interest rate. A value of 0% is valid for interest-free loans.
3. Choose the loan term in years or months.
4. Select a start date — payment dates in the amortization schedule are generated from this month forward.
5. Select a loan type. ARM, interest-only, and balloon types reveal additional input fields.
6. Optionally enter an extra monthly payment or a one-time lump sum to model accelerated payoff.
7. Results, charts, and the amortization table update in real time as inputs change.
8. Use the PDF or CSV export buttons above the amortization table to download the schedule.

### Comparison Page (`/compare`)
1. Fill in the inputs for Scenario A and Scenario B.
2. Click "Add Scenario" to include a third scenario.
3. The comparison table and charts populate automatically once a scenario has valid inputs.
4. The best value in each metric row is highlighted. The winner summary card identifies which scenario saves the most overall.
5. Export the comparison as PDF or CSV using the buttons above the table.

### Affordability Page (`/affordability`)
1. Enter your gross monthly income before tax.
2. Enter your total existing monthly debt payments — car loans, student loans, credit card minimums, and any other recurring obligations.
3. Set the estimated interest rate and desired loan term.
4. Optionally enter a down payment amount to see the maximum asset price alongside the maximum loan amount.
5. The results section shows your maximum affordable loan amount, recommended monthly payment, and where your DTI ratio falls on the gauge.

### About Page (`/about`)
Covers the calculation methodology, the formulas used, how each loan type is modelled, and a disclaimer about the educational nature of the tool.

---

## Calculation Methodology

### Standard Amortization Formula

```
M = P x [r(1+r)^n] / [(1+r)^n - 1]

Where:
  M = Monthly payment
  P = Principal (loan amount)
  r = Monthly interest rate (annual rate / 12 / 100)
  n = Total number of monthly payments (term in years x 12)
```

When the interest rate is 0%, this formula produces a division by zero. In that case the monthly payment is simply `P / n`.

### Amortization Schedule Generation

Each row is computed iteratively from the previous balance:
- Interest portion = remaining balance x monthly rate
- Principal portion = monthly payment minus interest portion
- New balance = previous balance minus principal portion minus any extra payment applied that month

### Extra Payment Impact

The schedule is calculated twice — once without extra payments (baseline) and once with them applied. The difference in total interest paid and total number of payments gives the interest saved and months saved figures.

### Affordability (DTI Ratio)

The maximum monthly payment is the lower of two limits:
- Front-end limit: gross monthly income x 0.28
- Back-end limit: (gross monthly income x 0.36) minus existing monthly debts

The amortization payment formula is then inverted to solve for the maximum principal that produces a payment at or below that limit.

### Adjustable-Rate Mortgage (ARM)

The schedule runs at the initial rate for the fixed period (for example, five years). At the adjustment point, the remaining balance is re-amortized over the remaining term at the new rate.

### Interest-Only Loan

During the interest-only period, each payment equals `balance x monthly rate` and the balance does not decrease. After the interest-only period ends, the remaining balance is fully amortized over the rest of the term.

### Balloon Payment

Monthly payments are calculated as if the loan runs for the full amortization period (for example, 30 years). The schedule is then truncated at the actual term end (for example, 7 years), and the remaining balance at that point is shown as the balloon payment due.

---

## Project Structure

```
Loan-Calculator-Application/
├── public/
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── affordability/       # AffordabilityForm, AffordabilityResult, DebtRatioGauge
│   │   ├── calculator/          # LoanForm, AmortizationTable, PaymentSummaryCards
│   │   ├── charts/              # PrincipalInterestPie, AmortizationLineChart,
│   │   │                        # BalanceAreaChart, ComparisonBarChart
│   │   ├── common/              # Card, EmptyState, Tooltip, Loader
│   │   ├── comparison/          # ComparisonForm, ComparisonTable, WinnerSummary
│   │   ├── export/              # ExportButtons (PDF and CSV)
│   │   ├── extra-payments/      # ExtraPaymentImpact
│   │   └── layout/              # Navbar, PageWrapper
│   ├── context/
│   │   ├── CurrencyContext.jsx  # Currency selection and Intl.NumberFormat formatting
│   │   ├── LoanContext.jsx      # Global loan input state via useReducer
│   │   └── ThemeContext.jsx     # Dark and light mode toggle with localStorage persistence
│   ├── hooks/
│   │   ├── useAffordability.js  # DTI-based affordability calculation
│   │   ├── useComparison.js     # Multi-scenario state management
│   │   ├── useExtraPayments.js  # Extra payment impact calculation
│   │   └── useLoanCalculator.js # Core schedule calculation, routes by loan type
│   ├── pages/
│   │   ├── AboutPage.jsx
│   │   ├── AffordabilityPage.jsx
│   │   ├── CalculatorPage.jsx
│   │   ├── ComparisonPage.jsx
│   │   └── HomePage.jsx
│   ├── utils/
│   │   ├── affordabilityMath.js # DTI ratio and max loan calculations
│   │   ├── constants.js         # Default values, loan type definitions, limits
│   │   ├── exportCSV.js         # CSV generation with Papaparse
│   │   ├── exportPDF.js         # PDF generation with jsPDF and jsPDF-AutoTable
│   │   ├── extraPaymentMath.js  # Extra payment impact comparison logic
│   │   ├── loanMath.js          # Core amortization formulas and schedule builder
│   │   └── loanTypes.js         # ARM, interest-only, and balloon schedule builders
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md
```

---

## Future Enhancements

- Bi-weekly payment option (26 payments per year rather than 12)
- Refinancing calculator — model keeping the current loan versus refinancing at a new rate and term
- Multi-loan payoff planner — avalanche vs. snowball strategy across several debts simultaneously
- Save and restore loan scenarios to localStorage so users can return to previous calculations
- PWA support for offline access without an internet connection
- Shareable loan links that encode scenario parameters in the URL query string
- Animated number transitions on summary cards when inputs change
- Print-optimized CSS for directly printing the amortization schedule from the browser
- Unit tests for all math utility functions using Vitest
- WCAG 2.1 AA accessibility audit and compliance pass

---


## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
