import React from 'react';
import { ScenarioResult } from '../utils/mortgageCalculations';
import './ComparisonSummary.css';

interface ComparisonSummaryProps {
  payOffEarly: ScenarioResult;
  investAndPay: ScenarioResult;
  bestScenario: string;
  houseValue: number;
}

export const ComparisonSummary: React.FC<ComparisonSummaryProps> = ({
  payOffEarly,
  investAndPay,
  bestScenario,
  houseValue,
}) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const renderScenarioCard = (
    result: ScenarioResult,
    title: string,
    cardClass: string,
    isBest: boolean
  ) => (
    <div className={`summary-card ${cardClass} ${isBest ? 'best-scenario' : ''}`}>
      {isBest && <div className="best-badge">Best Option</div>}
      <h3>{title}</h3>
      <div className="summary-item">
        <span className="label">Total Payments:</span>
        <span className="value">{formatCurrency(result.totalPayments)}</span>
      </div>
      <div className="summary-item">
        <span className="label">Total Interest Paid:</span>
        <span className="value">{formatCurrency(result.totalInterestPaid)}</span>
      </div>
      <div className="summary-item">
        <span className="label">Total Tax Rebate:</span>
        <span className="value positive">{formatCurrency(result.totalTaxRebate)}</span>
      </div>
      <div className="summary-item">
        <span className="label">Final Investment Value:</span>
        <span className={`value ${result.finalInvestmentValue > 0 ? 'positive' : ''}`}>
          {formatCurrency(result.finalInvestmentValue)}
        </span>
      </div>
      <div className="summary-item total">
        <span className="label">Final Net Worth:</span>
        <span className={`value ${result.finalNetWorth >= 0 ? 'positive' : 'negative'}`}>
          {formatCurrency(result.finalNetWorth)}
        </span>
      </div>
    </div>
  );

  return (
    <div className="comparison-summary">
      <h2>Comparison Summary</h2>
      <div className="house-value-note">
        <span className="label">House Value:</span>
        <span className="value">{formatCurrency(houseValue)}</span>
        <span className="note">(included in net worth calculations)</span>
      </div>
      <div className="summary-grid">
        {renderScenarioCard(
          payOffEarly,
          'Pay Off Early',
          'pay-off-card',
          bestScenario === 'payOffEarly'
        )}
        {renderScenarioCard(
          investAndPay,
          'Invest & Pay from Investment',
          'invest-pay-card',
          bestScenario === 'investAndPay'
        )}
      </div>
    </div>
  );
};

