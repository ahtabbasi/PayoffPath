import { useState, useMemo, useEffect } from 'react';
import { MortgageInputs, calculateComparison } from './utils/mortgageCalculations';
import { InputForm } from './components/InputForm';
import { ComparisonSummary } from './components/ComparisonSummary';
import { YearlyBreakdown } from './components/YearlyBreakdown';
import { Charts } from './components/Charts';
import './App.css';

const defaultInputs: MortgageInputs = {
  remainingPrincipal: 300000,
  yearsLeft: 30,
  interestRate: 4,
  taxRebatePercentage: 37,
  investmentReturnRate: 5,
  totalMoneyInHand: 300000,
  houseValue: 300000,
};

const STORAGE_KEY = 'mortgageCalculatorInputs';

function App() {
  // Load inputs from localStorage on mount, fallback to defaults
  const [inputs, setInputs] = useState<MortgageInputs>(() => {
    try {
      const savedInputs = localStorage.getItem(STORAGE_KEY);
      if (savedInputs) {
        return JSON.parse(savedInputs);
      }
    } catch (error) {
      console.error('Error loading saved inputs:', error);
    }
    return defaultInputs;
  });

  // Save inputs to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(inputs));
    } catch (error) {
      console.error('Error saving inputs to localStorage:', error);
    }
  }, [inputs]);

  const comparison = useMemo(() => {
    return calculateComparison(inputs);
  }, [inputs]);

  return (
    <div className="app">
      <header className="app-header">
        <h1>Mortgage Payoff vs Investment Calculator</h1>
        <p className="subtitle">
          Compare paying off your mortgage early versus investing and paying from that investment
        </p>
      </header>

      <main className="app-main">
        <InputForm inputs={inputs} onChange={setInputs} />
        
        <ComparisonSummary
          payOffEarly={comparison.payOffEarly}
          investAndPay={comparison.investAndPay}
          bestScenario={comparison.bestScenario}
          houseValue={inputs.houseValue}
        />

        <Charts
          payOffEarly={comparison.payOffEarly}
          investAndPay={comparison.investAndPay}
          yearsLeft={inputs.yearsLeft}
        />

        <YearlyBreakdown
          investAndPay={comparison.investAndPay}
          yearsLeft={inputs.yearsLeft}
          houseValue={inputs.houseValue}
        />
      </main>
    </div>
  );
}

export default App;

