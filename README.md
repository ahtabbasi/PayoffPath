# Mortgage Payoff vs Investment Calculator

A single-page web application that compares paying off your mortgage early versus investing that money in an interest-generating investment.

## Features

- **Configurable Inputs**: Adjust all mortgage and investment parameters
- **Two Scenarios Comparison**:
  - **Pay Off Early**: Use lump sum to pay down mortgage
  - **Invest Instead**: Keep mortgage and invest the lump sum
- **Comprehensive Analysis**:
  - Total net savings/cost difference
  - Year-by-year breakdown
  - Net worth comparison over time
  - Visual charts and graphs

## Input Parameters

- **Remaining Principal**: Current mortgage balance
- **Years Left**: Remaining mortgage term
- **Annual Interest Rate**: Mortgage interest rate (percentage)
- **Current Monthly Payment**: Your current monthly mortgage payment
- **Tax Rebate Percentage**: Percentage of mortgage interest returned as tax rebate
- **Annual Investment Return Rate**: Expected annual return on investment (percentage)
- **Total Money in Hand**: Lump sum available for payment or investment

## Calculations

- **Mortgage Type**: Annuity mortgage with fixed monthly payments
- **Investment Compounding**: Monthly compounding
- **Tax Treatment**: Investment returns are not taxed
- **Time Horizon**: Comparison over the remaining mortgage term only
- **Inflation**: Not accounted for (nominal values)

## Getting Started

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Technology Stack

- **React 18** with TypeScript
- **Vite** for build tooling
- **Chart.js** with react-chartjs-2 for visualizations
- **CSS** for styling

## Project Structure

```
src/
  components/          # React components
    InputForm.tsx      # Input form for parameters
    ComparisonSummary.tsx  # Summary cards
    YearlyBreakdown.tsx    # Year-by-year table
    Charts.tsx         # Line and bar charts
  utils/
    mortgageCalculations.ts  # Core calculation logic
  App.tsx             # Main application component
  main.tsx            # Application entry point
```

