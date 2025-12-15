import React, { useState, useMemo } from 'react';
import { MortgageInputs, calculateComparison } from './utils/mortgageCalculations';
import { InputForm } from './components/InputForm';
import { ComparisonSummary } from './components/ComparisonSummary';
import { YearlyBreakdown } from './components/YearlyBreakdown';
import { Charts } from './components/Charts';
import './App.css';

const defaultInputs: MortgageInputs = {
  remainingPrincipal: 300000,
  yearsLeft: 20,
  interestRate: 4.5,
  taxRebatePercentage: 30,
  investmentReturnRate: 7,
  totalMoneyInHand: 50000,
  houseValue: 400000,
};

function App() {
  const [inputs, setInputs] = useState<MortgageInputs>(defaultInputs);

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

