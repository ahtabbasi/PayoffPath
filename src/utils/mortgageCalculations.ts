export interface MortgageInputs {
  remainingPrincipal: number;
  yearsLeft: number;
  interestRate: number; // Annual percentage
  taxRebatePercentage: number; // Percentage of interest returned as tax rebate
  investmentReturnRate: number; // Annual percentage
  totalMoneyInHand: number; // Lump sum available
  houseValue: number; // Current value of the house
}

export interface MonthlySnapshot {
  month: number;
  principal: number;
  interestPaid: number;
  taxRebate: number;
  investmentValue: number;
  totalPaid: number;
  totalContributions: number;
  netWorth: number;
}

export interface ScenarioResult {
  monthlySnapshots: MonthlySnapshot[];
  totalInterestPaid: number;
  totalTaxRebate: number;
  totalPayments: number;
  totalContributions: number;
  finalInvestmentValue: number;
  finalNetWorth: number;
}

/**
 * Calculate monthly interest rate from annual rate
 */
function monthlyRate(annualRate: number): number {
  return annualRate / 100 / 12;
}

/**
 * Calculate monthly payment from principal, interest rate, and term
 * Uses annuity formula: PMT = P * [r / (1 - (1 + r)^-n)]
 */
function calculateMonthlyPayment(
  principal: number,
  annualInterestRate: number,
  years: number
): number {
  if (principal <= 0 || years <= 0) return 0;
  
  const monthlyIntRate = monthlyRate(annualInterestRate);
  const totalMonths = years * 12;
  
  // Annuity formula: P = PMT * [(1 - (1 + r)^-n) / r]
  // Solving for PMT: PMT = P * [r / (1 - (1 + r)^-n)]
  const denominator = 1 - Math.pow(1 + monthlyIntRate, -totalMonths);
  if (denominator === 0) return principal / totalMonths;
  
  return principal * (monthlyIntRate / denominator);
}

/**
 * Calculate remaining principal after a lump sum payment
 * and recalculate the new monthly payment for the remaining term
 */
function recalculatePaymentAfterLumpSum(
  currentPrincipal: number,
  lumpSum: number,
  monthlyRate: number,
  remainingMonths: number
): number {
  const newPrincipal = Math.max(0, currentPrincipal - lumpSum);
  if (newPrincipal <= 0 || remainingMonths <= 0) return 0;
  
  // Annuity formula: P = PMT * [(1 - (1 + r)^-n) / r]
  // Solving for PMT: PMT = P * [r / (1 - (1 + r)^-n)]
  const denominator = 1 - Math.pow(1 + monthlyRate, -remainingMonths);
  if (denominator === 0) return newPrincipal / remainingMonths;
  
  return newPrincipal * (monthlyRate / denominator);
}

/**
 * Calculate investment value with monthly compounding
 */
function calculateInvestmentValue(
  principal: number,
  monthlyRate: number,
  months: number
): number {
  return principal * Math.pow(1 + monthlyRate, months);
}

/**
 * Scenario A: Pay off mortgage early with lump sum
 */
export function calculatePayOffEarlyScenario(inputs: MortgageInputs): ScenarioResult {
  const monthlyIntRate = monthlyRate(inputs.interestRate);
  const totalMonths = inputs.yearsLeft * 12;
  const snapshots: MonthlySnapshot[] = [];
  
  let currentPrincipal = inputs.remainingPrincipal;
  let totalInterestPaid = 0;
  let totalTaxRebate = 0;
  let totalPayments = 0;
  
  // Apply lump sum payment at the start
  const lumpSumApplied = Math.min(inputs.totalMoneyInHand, currentPrincipal);
  currentPrincipal -= lumpSumApplied;
  totalPayments += lumpSumApplied;
  
  // Recalculate monthly payment after lump sum
  const remainingMonths = totalMonths;
  let monthlyPayment = recalculatePaymentAfterLumpSum(
    inputs.remainingPrincipal,
    lumpSumApplied,
    monthlyIntRate,
    remainingMonths
  );
  
  // If principal is fully paid, set payment to 0
  if (currentPrincipal <= 0) {
    monthlyPayment = 0;
  }
  
  // Simulate month by month
  for (let month = 1; month <= totalMonths; month++) {
    if (currentPrincipal <= 0) {
      // Mortgage is paid off
      snapshots.push({
        month,
        principal: 0,
        interestPaid: 0,
        taxRebate: 0,
        investmentValue: 0,
        totalPaid: totalPayments,
        totalContributions: 0,
        netWorth: inputs.houseValue + totalTaxRebate, // House value + tax rebates
      });
      continue;
    }
    
    const interestForMonth = currentPrincipal * monthlyIntRate;
    const principalPayment = Math.min(monthlyPayment - interestForMonth, currentPrincipal);
    const actualPayment = interestForMonth + principalPayment;
    
    currentPrincipal -= principalPayment;
    totalInterestPaid += interestForMonth;
    totalPayments += actualPayment;
    
    const taxRebate = interestForMonth * (inputs.taxRebatePercentage / 100);
    totalTaxRebate += taxRebate;
    
    // Net worth = House value - remaining principal + investment + tax rebates
    snapshots.push({
      month,
      principal: currentPrincipal,
      interestPaid: totalInterestPaid,
      taxRebate: totalTaxRebate,
      investmentValue: 0, // No investment in this scenario
      totalPaid: totalPayments,
      totalContributions: 0,
      netWorth: inputs.houseValue - currentPrincipal + totalTaxRebate,
    });
  }
  
  return {
    monthlySnapshots: snapshots,
    totalInterestPaid,
    totalTaxRebate,
    totalPayments,
    totalContributions: 0, // No contributions in pay-off-early scenario
    finalInvestmentValue: 0,
    finalNetWorth: inputs.houseValue - currentPrincipal + totalTaxRebate,
  };
}

/**
 * Scenario B: Invest lump sum and pay mortgage from investment
 */
export function calculateInvestAndPayFromInvestmentScenario(inputs: MortgageInputs): ScenarioResult {
  const monthlyIntRate = monthlyRate(inputs.interestRate);
  const monthlyInvestmentRate = monthlyRate(inputs.investmentReturnRate);
  const totalMonths = inputs.yearsLeft * 12;
  const snapshots: MonthlySnapshot[] = [];
  
  // Calculate the monthly payment from principal, interest rate, and term
  const monthlyPayment = calculateMonthlyPayment(
    inputs.remainingPrincipal,
    inputs.interestRate,
    inputs.yearsLeft
  );
  
  let currentPrincipal = inputs.remainingPrincipal;
  let investmentValue = inputs.totalMoneyInHand;
  let totalInterestPaid = 0;
  let totalTaxRebate = 0;
  let totalPayments = 0;
  let totalContributions = 0;
  
  // Simulate month by month
  for (let month = 1; month <= totalMonths; month++) {
    if (currentPrincipal <= 0) {
      // Mortgage is paid off, investment continues growing
      investmentValue = calculateInvestmentValue(
        investmentValue,
        monthlyInvestmentRate,
        1
      );
      
      // Net worth = House value + remaining investment + tax rebates - contributions
      snapshots.push({
        month,
        principal: 0,
        interestPaid: totalInterestPaid,
        taxRebate: totalTaxRebate,
        investmentValue,
        totalPaid: totalPayments,
        totalContributions,
        netWorth: inputs.houseValue + investmentValue + totalTaxRebate - totalContributions,
      });
      continue;
    }
    
    // First, investment grows for the month
    investmentValue = calculateInvestmentValue(
      investmentValue,
      monthlyInvestmentRate,
      1
    );
    
    // Then, mortgage payment is withdrawn from investment
    const interestForMonth = currentPrincipal * monthlyIntRate;
    const principalPayment = Math.min(monthlyPayment - interestForMonth, currentPrincipal);
    const actualPayment = interestForMonth + principalPayment;
    
    // Withdraw payment from investment first
    const paymentFromInvestment = Math.min(actualPayment, investmentValue);
    investmentValue = Math.max(0, investmentValue - paymentFromInvestment);
    
    // If investment is insufficient, make up the difference from contributions
    const remainingPaymentNeeded = actualPayment - paymentFromInvestment;
    let paymentFromContributions = 0;
    if (remainingPaymentNeeded > 0) {
      paymentFromContributions = remainingPaymentNeeded;
      totalContributions += paymentFromContributions;
    }
    
    const totalPaymentThisMonth = paymentFromInvestment + paymentFromContributions;
    
    // Apply payment to mortgage
    let interestPaidThisMonth = 0;
    if (totalPaymentThisMonth >= interestForMonth) {
      const principalPaid = Math.min(totalPaymentThisMonth - interestForMonth, currentPrincipal);
      currentPrincipal -= principalPaid;
      interestPaidThisMonth = interestForMonth;
      totalInterestPaid += interestForMonth;
    } else {
      // Can only pay interest, not principal
      interestPaidThisMonth = totalPaymentThisMonth;
      totalInterestPaid += totalPaymentThisMonth;
    }
    
    totalPayments += totalPaymentThisMonth;
    
    const taxRebate = interestPaidThisMonth * (inputs.taxRebatePercentage / 100);
    totalTaxRebate += taxRebate;
    
    // Net worth = House value - remaining principal + remaining investment + tax rebates - contributions
    // When contributions are made (investment runs out), net worth decreases because:
    // - Contributions increase (reduces net worth)
    // - Principal decreases (increases net worth)
    // Net effect: principalReduction - contributionAmount = -interestPaid (plus tax rebate)
    const calculatedNetWorth = inputs.houseValue - currentPrincipal + investmentValue + totalTaxRebate - totalContributions;
    snapshots.push({
      month,
      principal: currentPrincipal,
      interestPaid: totalInterestPaid,
      taxRebate: totalTaxRebate,
      investmentValue,
      totalPaid: totalPayments,
      totalContributions,
      netWorth: calculatedNetWorth,
    });
  }
  
  return {
    monthlySnapshots: snapshots,
    totalInterestPaid,
    totalTaxRebate,
    totalPayments,
    totalContributions,
    finalInvestmentValue: investmentValue,
    finalNetWorth: inputs.houseValue - currentPrincipal + investmentValue + totalTaxRebate - totalContributions,
  };
}

/**
 * Calculate comparison between scenarios
 */
export function calculateComparison(inputs: MortgageInputs) {
  const payOffEarly = calculatePayOffEarlyScenario(inputs);
  const investAndPay = calculateInvestAndPayFromInvestmentScenario(inputs);
  
  // Find the best scenario
  const scenarios = [
    { name: 'payOffEarly', netWorth: payOffEarly.finalNetWorth },
    { name: 'investAndPay', netWorth: investAndPay.finalNetWorth },
  ];
  
  const bestScenario = scenarios.reduce((best, current) => 
    current.netWorth > best.netWorth ? current : best
  );
  
  return {
    payOffEarly,
    investAndPay,
    bestScenario: bestScenario.name,
    difference: investAndPay.finalNetWorth - payOffEarly.finalNetWorth,
  };
}

