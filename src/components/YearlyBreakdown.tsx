import React from 'react';
import { ScenarioResult } from '../utils/mortgageCalculations';
import './YearlyBreakdown.css';

interface YearlyBreakdownProps {
  payOffEarly: ScenarioResult;
  investAndPay: ScenarioResult;
  yearsLeft: number;
}

export const YearlyBreakdown: React.FC<YearlyBreakdownProps> = ({
  payOffEarly,
  investAndPay,
  yearsLeft,
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
        });
      }
    }

    return yearlyData;
  };

  const payOffEarlyYearly = getYearlyData(payOffEarly.monthlySnapshots);
  const investAndPayYearly = getYearlyData(investAndPay.monthlySnapshots);

  return (
    <div className="yearly-breakdown">
      <h2>Year-by-Year Breakdown</h2>
      <div className="breakdown-table-container">
        <table className="breakdown-table">
          <thead>
            <tr>
              <th>Year</th>
              <th colSpan={3}>Pay Off Early</th>
              <th colSpan={3}>Invest & Pay from Investment</th>
            </tr>
            <tr className="sub-header">
              <th></th>
              <th>Net Worth</th>
              <th>Total Paid</th>
              <th>Investment</th>
              <th>Net Worth</th>
              <th>Total Paid</th>
              <th>Investment</th>
            </tr>
          </thead>
          <tbody>
            {payOffEarlyYearly.map((payOffData, index) => {
              const investAndPayData = investAndPayYearly[index];
              return (
                <tr key={payOffData.year}>
                  <td className="year-cell">{payOffData.year}</td>
                  <td className={payOffData.netWorth >= 0 ? 'positive' : 'negative'}>
                    {formatCurrency(payOffData.netWorth)}
                  </td>
                  <td>{formatCurrency(payOffData.totalPaid)}</td>
                  <td>{formatCurrency(payOffData.investmentValue)}</td>
                  <td className={investAndPayData.netWorth >= 0 ? 'positive' : 'negative'}>
                    {formatCurrency(investAndPayData.netWorth)}
                  </td>
                  <td>{formatCurrency(investAndPayData.totalPaid)}</td>
                  <td className="positive">{formatCurrency(investAndPayData.investmentValue)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

