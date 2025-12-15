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

  const formatDifference = (value: number) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${formatCurrency(value)}`;
  };

  const calculateDifference = (invest: number, payOff: number) => {
    return invest - payOff;
  };

  const getBetterWorse = (invest: number, payOff: number, higherIsBetter: boolean = true) => {
    const diff = invest - payOff;
    if (diff === 0) return 'equal';
    const isBetter = higherIsBetter ? diff > 0 : diff < 0;
    return isBetter ? 'better' : 'worse';
  };

  const comparisonRows = [
    {
      label: 'House Value',
      payOff: houseValue,
      invest: houseValue,
      higherIsBetter: true,
      category: 'benefits',
    },
    {
      label: 'Total Interest Paid',
      payOff: payOffEarly.totalInterestPaid,
      invest: investAndPay.totalInterestPaid,
      higherIsBetter: false,
      category: 'costs',
    },
    {
      label: 'Total Tax Rebate',
      payOff: payOffEarly.totalTaxRebate,
      invest: investAndPay.totalTaxRebate,
      higherIsBetter: true,
      category: 'benefits',
    },
    {
      label: 'Final Investment Value',
      payOff: payOffEarly.finalInvestmentValue,
      invest: investAndPay.finalInvestmentValue,
      higherIsBetter: true,
      category: 'benefits',
    },
    {
      label: 'Total Contributions',
      payOff: payOffEarly.totalContributions,
      invest: investAndPay.totalContributions,
      higherIsBetter: false,
      category: 'costs',
    },
  ];

  const netWorthDiff = calculateDifference(investAndPay.finalNetWorth, payOffEarly.finalNetWorth);

  return (
    <div className="comparison-summary">
      <div className="comparison-table-container">
        <h2>Comparison Summary</h2>
        <br></br>
        <table className="comparison-table">
          <thead>
            <tr>
              <th className="metric-column">Metric</th>
              <th className={`scenario-column ${bestScenario === 'payOffEarly' ? 'best' : ''}`}>
                <div className="scenario-header">
                  <span>Pay Off Early</span>
                  {bestScenario === 'payOffEarly' && <span className="best-indicator">✓ Best</span>}
                </div>
              </th>
              <th className={`scenario-column ${bestScenario === 'investAndPay' ? 'best' : ''}`}>
                <div className="scenario-header">
                  <span>Invest & Pay</span>
                  {bestScenario === 'investAndPay' && <span className="best-indicator">✓ Best</span>}
                </div>
              </th>
              <th className="difference-column">Difference</th>
            </tr>
          </thead>
          <tbody>
            {comparisonRows.map((row, index) => {
              const diff = calculateDifference(row.invest, row.payOff);
              const comparison = getBetterWorse(row.invest, row.payOff, row.higherIsBetter);
              
              return (
                <tr key={index} className={`comparison-row ${row.category} ${bestScenario === 'payOffEarly' ? 'best-column-payoff' : ''} ${bestScenario === 'investAndPay' ? 'best-column-invest' : ''}`}>
                  <td className="metric-label">{row.label}</td>
                  <td className="scenario-value">{formatCurrency(row.payOff)}</td>
                  <td className="scenario-value">{formatCurrency(row.invest)}</td>
                  <td className={`difference-value ${comparison}`}>
                    <span className="diff-amount">
                      {formatDifference(diff)}
                      {comparison !== 'equal' && (
                        <span className={`diff-indicator ${comparison}`}>
                          {' '}{comparison === 'better' ? '↑' : '↓'}
                        </span>
                      )}
                    </span>
                  </td>
                </tr>
              );
            })}
            <tr className={`comparison-row total-row ${bestScenario === 'payOffEarly' ? 'best-column-payoff' : ''} ${bestScenario === 'investAndPay' ? 'best-column-invest' : ''}`}>
              <td className="metric-label total-label">
                <strong>Final Net Worth</strong>
              </td>
              <td className="scenario-value total-value">
                <strong>{formatCurrency(payOffEarly.finalNetWorth)}</strong>
              </td>
              <td className="scenario-value total-value">
                <strong>{formatCurrency(investAndPay.finalNetWorth)}</strong>
              </td>
              <td className={`difference-value total-diff ${netWorthDiff > 0 ? 'better' : netWorthDiff < 0 ? 'worse' : 'equal'}`}>
                <strong className="diff-amount">
                  {formatDifference(netWorthDiff)}
                  {netWorthDiff !== 0 && (
                    <span className={`diff-indicator ${netWorthDiff > 0 ? 'better' : 'worse'}`}>
                      {' '}{netWorthDiff > 0 ? '↑' : '↓'}
                    </span>
                  )}
                </strong>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

