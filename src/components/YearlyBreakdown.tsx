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
      totalInterestPaid: number;
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
          totalInterestPaid: snapshot.interestPaid,
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
              <th>Total Interest Paid</th>
              <th>Total Tax Rebate</th>
              <th>Investment Value</th>
              <th>Total Contributions</th>
              <th>Net Worth</th>
            </tr>
          </thead>
          <tbody>
            {investAndPayYearly.map((data) => {
              const principalValue = data.principal !== 0 ? -data.principal : 0;
              const contributionsValue = data.totalContributions !== 0 ? -data.totalContributions : 0;
              const interestPaidValue = data.totalInterestPaid !== 0 ? -data.totalInterestPaid : 0;
              return (
                <tr key={data.year}>
                  <td className="year-cell">{data.year}</td>
                  <td>{formatCurrency(houseValue)}</td>
                  <td className={data.principal !== 0 ? 'negative' : ''}>
                    {formatCurrency(principalValue)}
                  </td>
                  <td className={data.totalInterestPaid !== 0 ? 'negative' : ''}>
                    {formatCurrency(interestPaidValue)}
                  </td>
                  <td className={data.taxRebate > 0 ? 'positive' : ''}>
                    {formatCurrency(data.taxRebate)}
                  </td>
                  <td className={data.investmentValue > 0 ? 'positive' : ''}>
                    {formatCurrency(data.investmentValue)}
                  </td>
                  <td className={data.totalContributions !== 0 ? 'negative' : ''}>
                    {formatCurrency(contributionsValue)}
                  </td>
                  <td className={data.netWorth > 0 ? 'positive' : data.netWorth < 0 ? 'negative' : ''}>
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

