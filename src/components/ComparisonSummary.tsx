import React from 'react';
import { ScenarioResult } from '../utils/mortgageCalculations';
import './ComparisonSummary.css';

interface ComparisonSummaryProps {
  onlyMonthlyPayments: ScenarioResult;
  payOffEarly: ScenarioResult;
  investAndPay: ScenarioResult;
  bestScenario: string;
  houseValue: number;
}

export const ComparisonSummary: React.FC<ComparisonSummaryProps> = ({
  onlyMonthlyPayments,
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

  const calculateDifference = (value1: number, value2: number) => {
    return value1 - value2;
  };

  const getBetterWorse = (value1: number, value2: number, higherIsBetter: boolean = true) => {
    const diff = value1 - value2;
    if (diff === 0) return 'equal';
    const isBetter = higherIsBetter ? diff > 0 : diff < 0;
    return isBetter ? 'better' : 'worse';
  };

  const comparisonRows = [
    {
      label: 'House Value',
      onlyMonthly: houseValue,
      payOff: houseValue,
      invest: houseValue,
      higherIsBetter: true,
      category: 'benefits',
    },
    {
      label: 'Total Interest Paid',
      onlyMonthly: onlyMonthlyPayments.totalInterestPaid,
      payOff: payOffEarly.totalInterestPaid,
      invest: investAndPay.totalInterestPaid,
      higherIsBetter: false,
      category: 'costs',
    },
    {
      label: 'Total Tax Rebate',
      onlyMonthly: onlyMonthlyPayments.totalTaxRebate,
      payOff: payOffEarly.totalTaxRebate,
      invest: investAndPay.totalTaxRebate,
      higherIsBetter: true,
      category: 'benefits',
    },
    {
      label: 'Final Investment Value',
      onlyMonthly: onlyMonthlyPayments.finalInvestmentValue,
      payOff: payOffEarly.finalInvestmentValue,
      invest: investAndPay.finalInvestmentValue,
      higherIsBetter: true,
      category: 'benefits',
    },
    {
      label: 'Total Contributions',
      onlyMonthly: onlyMonthlyPayments.totalContributions,
      payOff: payOffEarly.totalContributions,
      invest: investAndPay.totalContributions,
      higherIsBetter: false,
      category: 'costs',
    },
  ];

  return (
    <div className="comparison-summary">
      <div className="comparison-table-container">
        <h2>Comparison Summary</h2>
        <br></br>
        <table className="comparison-table">
          <thead>
            <tr>
              <th className="metric-column">Metric</th>
              <th className={`scenario-column ${bestScenario === 'onlyMonthlyPayments' ? 'best' : ''}`}>
                <div className="scenario-header">
                  <span>Only Monthly Payments</span>
                  {bestScenario === 'onlyMonthlyPayments' && <span className="best-indicator">✓ Best</span>}
                </div>
              </th>
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
            </tr>
          </thead>
          <tbody>
            {comparisonRows.map((row, index) => {
              return (
                <tr key={index} className={`comparison-row ${row.category} ${bestScenario === 'onlyMonthlyPayments' ? 'best-column-monthly' : ''} ${bestScenario === 'payOffEarly' ? 'best-column-payoff' : ''} ${bestScenario === 'investAndPay' ? 'best-column-invest' : ''}`}>
                  <td className="metric-label">{row.label}</td>
                  <td className="scenario-value">{formatCurrency(row.onlyMonthly)}</td>
                  <td className="scenario-value">{formatCurrency(row.payOff)}</td>
                  <td className="scenario-value">{formatCurrency(row.invest)}</td>
                </tr>
              );
            })}
            <tr className={`comparison-row total-row ${bestScenario === 'onlyMonthlyPayments' ? 'best-column-monthly' : ''} ${bestScenario === 'payOffEarly' ? 'best-column-payoff' : ''} ${bestScenario === 'investAndPay' ? 'best-column-invest' : ''}`}>
              <td className="metric-label total-label">
                <strong>Final Net Worth</strong>
              </td>
              <td className="scenario-value total-value">
                <strong>{formatCurrency(onlyMonthlyPayments.finalNetWorth)}</strong>
              </td>
              <td className="scenario-value total-value">
                <strong>{formatCurrency(payOffEarly.finalNetWorth)}</strong>
              </td>
              <td className="scenario-value total-value">
                <strong>{formatCurrency(investAndPay.finalNetWorth)}</strong>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

