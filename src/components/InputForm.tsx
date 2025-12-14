import React, { useState } from 'react';
import { MortgageInputs } from '../utils/mortgageCalculations';
import './InputForm.css';

interface InputFormProps {
  inputs: MortgageInputs;
  onChange: (inputs: MortgageInputs) => void;
}

export const InputForm: React.FC<InputFormProps> = ({ inputs, onChange }) => {
  const handleChange = (field: keyof MortgageInputs, value: number) => {
    onChange({
      ...inputs,
      [field]: value,
    });
  };

  return (
    <div className="input-form">
      <h2>Mortgage & Investment Parameters</h2>
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="remainingPrincipal">
            Remaining Principal ($)
          </label>
          <input
            id="remainingPrincipal"
            type="number"
            value={inputs.remainingPrincipal}
            onChange={(e) => handleChange('remainingPrincipal', parseFloat(e.target.value) || 0)}
            min="0"
            step="1000"
          />
        </div>

        <div className="form-group">
          <label htmlFor="yearsLeft">
            Years Left
          </label>
          <input
            id="yearsLeft"
            type="number"
            value={inputs.yearsLeft}
            onChange={(e) => handleChange('yearsLeft', parseFloat(e.target.value) || 0)}
            min="0"
            step="0.5"
          />
        </div>

        <div className="form-group">
          <label htmlFor="interestRate">
            Annual Interest Rate (%)
          </label>
          <input
            id="interestRate"
            type="number"
            value={inputs.interestRate}
            onChange={(e) => handleChange('interestRate', parseFloat(e.target.value) || 0)}
            min="0"
            max="100"
            step="0.01"
          />
        </div>

        <div className="form-group">
          <label htmlFor="monthlyPayment">
            Current Monthly Payment ($)
          </label>
          <input
            id="monthlyPayment"
            type="number"
            value={inputs.monthlyPayment}
            onChange={(e) => handleChange('monthlyPayment', parseFloat(e.target.value) || 0)}
            min="0"
            step="100"
          />
        </div>

        <div className="form-group">
          <label htmlFor="taxRebatePercentage">
            Tax Rebate on Interest (%)
          </label>
          <input
            id="taxRebatePercentage"
            type="number"
            value={inputs.taxRebatePercentage}
            onChange={(e) => handleChange('taxRebatePercentage', parseFloat(e.target.value) || 0)}
            min="0"
            max="100"
            step="0.1"
          />
        </div>

        <div className="form-group">
          <label htmlFor="investmentReturnRate">
            Annual Investment Return Rate (%)
          </label>
          <input
            id="investmentReturnRate"
            type="number"
            value={inputs.investmentReturnRate}
            onChange={(e) => handleChange('investmentReturnRate', parseFloat(e.target.value) || 0)}
            min="0"
            max="100"
            step="0.01"
          />
        </div>

        <div className="form-group">
          <label htmlFor="totalMoneyInHand">
            Total Money Available for Lump Sum ($)
          </label>
          <input
            id="totalMoneyInHand"
            type="number"
            value={inputs.totalMoneyInHand}
            onChange={(e) => handleChange('totalMoneyInHand', parseFloat(e.target.value) || 0)}
            min="0"
            step="1000"
          />
        </div>

        <div className="form-group">
          <label htmlFor="houseValue">
            House Value ($)
          </label>
          <input
            id="houseValue"
            type="number"
            value={inputs.houseValue}
            onChange={(e) => handleChange('houseValue', parseFloat(e.target.value) || 0)}
            min="0"
            step="1000"
          />
        </div>
      </div>
    </div>
  );
};

