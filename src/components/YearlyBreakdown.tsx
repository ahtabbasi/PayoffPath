import React from 'react';
import { ScenarioResult } from '../utils/mortgageCalculations';
import './YearlyBreakdown.css';

interface YearlyBreakdownProps {
  investAndPay: ScenarioResult;
  yearsLeft: number;
  houseValue: number;
}

export const YearlyBreakdown: React.FC<YearlyBreakdownProps> = ({
  investAndPay,
  yearsLeft,
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

  // Group monthly snapshots by year
  const getYearlyData = (snapshots: ScenarioResult['monthlySnapshots']) => {
    const yearlyData: Array<{
      year: number;
      netWorth: number;
      totalPaid: number;
      investmentValue: number;
      totalContributions: number;
      principal: number;
      taxRebate: number;
    }> = [];

    for (let year = 1; year <= yearsLeft; year++) {
      const monthIndex = year * 12 - 1; // Last month of the year
      if (monthIndex < snapshots.length) {
        const snapshot = snapshots[monthIndex];
        yearlyData.push({
          year,
          netWorth: snapshot.netWorth,
          totalPaid: snapshot.totalPaid,
          investmentValue: snapshot.investmentValue,
          totalContributions: snapshot.totalContributions,
          principal: snapshot.principal,
          taxRebate: snapshot.taxRebate,
        });
      }
    }

    return yearlyData;
  };

  const investAndPayYearly = getYearlyData(investAndPay.monthlySnapshots);

  return (
    <div className="yearly-breakdown">
      <h2>Year-by-Year Breakdown</h2>
      <div className="breakdown-table-container">
        <table className="breakdown-table">
          <thead>
            <tr>
              <th>Year</th>
              <th>House Value</th>
              <th>Current Principal</th>
              <th>Investment Value</th>
              <th>Total Tax Rebate</th>
              <th>Total Contributions</th>
              <th>Net Worth</th>
            </tr>
          </thead>
          <tbody>
            {investAndPayYearly.map((data) => {
              const principalValue = -data.principal;
              const contributionsValue = -data.totalContributions;
              return (
                <tr key={data.year}>
                  <td className="year-cell">{data.year}</td>
                  <td>{formatCurrency(houseValue)}</td>
                  <td className={data.principal !== 0 ? 'negative' : ''}>
                    {formatCurrency(principalValue)}
                  </td>
                  <td className="positive">{formatCurrency(data.investmentValue)}</td>
                  <td className="positive">{formatCurrency(data.taxRebate)}</td>
                  <td className={data.totalContributions !== 0 ? 'negative' : ''}>
                    {formatCurrency(contributionsValue)}
                  </td>
                  <td className={data.netWorth >= 0 ? 'positive' : 'negative'}>
                    {formatCurrency(data.netWorth)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

