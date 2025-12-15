import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { ScenarioResult } from '../utils/mortgageCalculations';
import './Charts.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface ChartsProps {
  onlyMonthlyPayments: ScenarioResult;
  payOffEarly: ScenarioResult;
  investAndPay: ScenarioResult;
  yearsLeft: number;
}

export const Charts: React.FC<ChartsProps> = ({ onlyMonthlyPayments, payOffEarly, investAndPay, yearsLeft }) => {
  // Prepare data for line chart (net worth over time)
  const getYearlyLabels = () => {
    return Array.from({ length: yearsLeft }, (_, i) => `Year ${i + 1}`);
  };

  const getYearlyNetWorth = (snapshots: ScenarioResult['monthlySnapshots']) => {
    const yearlyNetWorth: number[] = [];
    for (let year = 1; year <= yearsLeft; year++) {
      const monthIndex = year * 12 - 1;
      if (monthIndex < snapshots.length) {
        yearlyNetWorth.push(snapshots[monthIndex].netWorth);
      }
    }
    return yearlyNetWorth;
  };

  const labels = getYearlyLabels();
  const onlyMonthlyPaymentsNetWorth = getYearlyNetWorth(onlyMonthlyPayments.monthlySnapshots);
  const payOffEarlyNetWorth = getYearlyNetWorth(payOffEarly.monthlySnapshots);
  const investAndPayNetWorth = getYearlyNetWorth(investAndPay.monthlySnapshots);

  const lineChartData = {
    labels,
    datasets: [
      {
        label: 'Only Monthly Payments - Net Worth',
        data: onlyMonthlyPaymentsNetWorth,
        borderColor: 'rgb(46, 204, 113)',
        backgroundColor: 'rgba(46, 204, 113, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Pay Off Early - Net Worth',
        data: payOffEarlyNetWorth,
        borderColor: 'rgb(231, 76, 60)',
        backgroundColor: 'rgba(231, 76, 60, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Invest & Pay from Investment - Net Worth',
        data: investAndPayNetWorth,
        borderColor: 'rgb(52, 152, 219)',
        backgroundColor: 'rgba(52, 152, 219, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Net Worth Over Time',
        font: {
          size: 16,
        },
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            return `${context.dataset.label}: $${context.parsed.y.toLocaleString('en-US', {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        ticks: {
          callback: function (value: any) {
            return '$' + value.toLocaleString('en-US');
          },
        },
      },
    },
  };

  // Prepare data for bar chart (totals comparison)
  const barChartData = {
    labels: ['Total Payments', 'Total Interest', 'Tax Rebate', 'Final Investment', 'Contributions', 'Final Net Worth'],
    datasets: [
      {
        label: 'Only Monthly Payments',
        data: [
          onlyMonthlyPayments.totalPayments,
          onlyMonthlyPayments.totalInterestPaid,
          onlyMonthlyPayments.totalTaxRebate,
          onlyMonthlyPayments.finalInvestmentValue,
          onlyMonthlyPayments.totalContributions,
          onlyMonthlyPayments.finalNetWorth,
        ],
        backgroundColor: 'rgba(46, 204, 113, 0.7)',
      },
      {
        label: 'Pay Off Early',
        data: [
          payOffEarly.totalPayments,
          payOffEarly.totalInterestPaid,
          payOffEarly.totalTaxRebate,
          0,
          payOffEarly.totalContributions,
          payOffEarly.finalNetWorth,
        ],
        backgroundColor: 'rgba(231, 76, 60, 0.7)',
      },
      {
        label: 'Invest & Pay from Investment',
        data: [
          investAndPay.totalPayments,
          investAndPay.totalInterestPaid,
          investAndPay.totalTaxRebate,
          investAndPay.finalInvestmentValue,
          investAndPay.totalContributions,
          investAndPay.finalNetWorth,
        ],
        backgroundColor: 'rgba(52, 152, 219, 0.7)',
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Total Comparison',
        font: {
          size: 16,
        },
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            return `${context.dataset.label}: $${context.parsed.y.toLocaleString('en-US', {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        ticks: {
          callback: function (value: any) {
            return '$' + value.toLocaleString('en-US');
          },
        },
      },
    },
  };

  return (
    <div className="charts-container">
      <h2>Visualizations</h2>
      <div className="charts-grid">
        <div className="chart-wrapper">
          <Line data={lineChartData} options={lineChartOptions} />
        </div>
        <div className="chart-wrapper">
          <Bar data={barChartData} options={barChartOptions} />
        </div>
      </div>
    </div>
  );
};

