// Israeli Freelancer Tax Calculator Engine - 2025/2026
// All constants imported from taxConfig.js

import {
  TAX_BRACKETS,
  NI_FREELANCER,
  NI_EMPLOYEE,
  CREDIT_POINT_VALUE,
  ANNUAL_PENSION,
  ANNUAL_HISTALMUT,
  PENSION_DEDUCTION_CAP_INCOME,
  HISHTALMUT_DEDUCTION_CAP_INCOME,
  PENSION_DEDUCTION_RATE,
  PENSION_CREDIT_RATE,
  PENSION_CREDIT_MULTIPLIER,
  HISHTALMUT_DEDUCTION_RATE,
  NI_DEDUCTION_RATE,
  PENSION_INSURED_DIVISOR,
  SPOUSE,
} from './taxConfig.js';
import { sanitizeAllInputs } from './inputSanitization.js';

export function calculate(inputs) {
  const sanitizedInputs = sanitizeAllInputs(inputs);
  const {
    monthlyInvoice,
    monthlyExpenses,
    creditPointsFreelancer,
    spouseGrossSalary,
    creditPointsSpouse,
    spouseMicroBizIncome,
  } = sanitizedInputs;

  const annualPension = ANNUAL_PENSION;
  const annualHistalmut = ANNUAL_HISTALMUT;

  // Section A: Annual income
  const annualInvoice = monthlyInvoice * 12;
  const spouseEmployerNI = calcSpouseEmployerNI(spouseGrossSalary);
  const spouseEmployeeNI = calcSpouseEmployeeNI(spouseGrossSalary);
  const spouseEmployerCost = spouseGrossSalary + SPOUSE.travelAllowance + spouseGrossSalary * SPOUSE.socialBenefitsRate + spouseEmployerNI;
  const annualExpenses = (monthlyExpenses + spouseEmployerCost) * 12;

  // Section B: Taxable income
  const taxableIncomeBeforeDeductions = annualInvoice - annualExpenses;
  const totalSocialContributions = annualPension + annualHistalmut;
  const taxableIncomeForNI = taxableIncomeBeforeDeductions - totalSocialContributions;

  // National insurance (freelancer)
  const niAnnual = calcNI(taxableIncomeForNI);
  const healthAnnual = calcHealth(taxableIncomeForNI);

  // Deductions
  const pensionDeduction = Math.min(taxableIncomeBeforeDeductions * PENSION_DEDUCTION_RATE, PENSION_DEDUCTION_CAP_INCOME * PENSION_DEDUCTION_RATE);
  const hishtalmutDeduction = Math.min(taxableIncomeBeforeDeductions * HISHTALMUT_DEDUCTION_RATE, HISHTALMUT_DEDUCTION_CAP_INCOME * HISHTALMUT_DEDUCTION_RATE);
  const niDeduction = niAnnual * NI_DEDUCTION_RATE;
  const taxableIncomeAfterDeductions = taxableIncomeBeforeDeductions - pensionDeduction - hishtalmutDeduction - niDeduction;

  // Income tax (freelancer)
  const grossTax = calcProgressiveTax(taxableIncomeAfterDeductions);
  const creditPointsDeduction = creditPointsFreelancer * CREDIT_POINT_VALUE;
  const pensionCredit = Math.min(taxableIncomeBeforeDeductions * PENSION_CREDIT_RATE, PENSION_DEDUCTION_CAP_INCOME * PENSION_CREDIT_RATE) * PENSION_CREDIT_MULTIPLIER;
  const freelancerIncomeTax = Math.max(grossTax - creditPointsDeduction - pensionCredit, 0);

  // Spouse income tax
  const spouseAnnualIncome = (spouseGrossSalary + spouseMicroBizIncome * SPOUSE.microBizTaxableRatio) * 12;
  const spouseCreditDeduction = creditPointsSpouse * CREDIT_POINT_VALUE;
  const spouseIncomeTax = Math.max(calcProgressiveTax(spouseAnnualIncome) - spouseCreditDeduction, 0);

  const totalIncomeTax = freelancerIncomeTax + spouseIncomeTax;

  // Spouse net
  const spouseNetMonthly = spouseGrossSalary + spouseMicroBizIncome - (spouseIncomeTax / 12) - SPOUSE.travelAllowance * SPOUSE.travelAllowanceTaxRate - spouseGrossSalary * SPOUSE.pensionEmployeeRate - spouseEmployeeNI;

  // Total NI (freelancer annual + spouse monthly * 12)
  const totalNI = niAnnual + healthAnnual + (spouseEmployeeNI + spouseEmployerNI) * 12;

  // Education funds
  const totalHistalmut = SPOUSE.histalmutAnnual + annualHistalmut * 2;

  // Pensions
  const spousePensionAnnual = spouseGrossSalary * 12 * SPOUSE.totalPensionRate;
  const totalPensions = annualPension + spousePensionAnnual;

  // Micro business income
  const microBizAnnual = spouseMicroBizIncome * 12;

  // Summary
  const netForLiving = annualInvoice + microBizAnnual - totalIncomeTax - totalNI - totalHistalmut - totalPensions;
  const netEconomic = annualInvoice + microBizAnnual - totalIncomeTax - totalNI;

  // Pension insured salary
  const pensionInsuredSalary = annualPension / 12 / PENSION_INSURED_DIVISOR;

  // Max pension deduction/credit
  const maxPensionDeduction = PENSION_DEDUCTION_CAP_INCOME * PENSION_DEDUCTION_RATE;
  const maxPensionCredit = (PENSION_DEDUCTION_CAP_INCOME * PENSION_CREDIT_RATE) * PENSION_CREDIT_MULTIPLIER;

  return {
    // Inputs echo
    monthlyInvoice,
    monthlyExpenses,
    creditPointsFreelancer,
    spouseGrossSalary,
    creditPointsSpouse,
    spouseMicroBizIncome,
    annualPension,
    annualHistalmut,

    // Calculated
    annualInvoice,
    annualExpenses,
    taxableIncomeBeforeDeductions,
    totalSocialContributions,
    taxableIncomeForNI,
    pensionDeduction,
    hishtalmutDeduction,
    niDeduction,
    taxableIncomeAfterDeductions,
    grossTax,
    creditPointsDeduction,
    pensionCredit,
    freelancerIncomeTax,
    spouseAnnualIncome,
    spouseIncomeTax,
    totalIncomeTax,
    niAnnual,
    healthAnnual,
    totalNI,
    totalHistalmut,
    totalPensions,
    microBizAnnual,
    netForLiving,
    netEconomic,
    spouseNetMonthly,
    spouseEmployerCost,
    pensionInsuredSalary,
    maxPensionDeduction,
    maxPensionCredit,

    // Monthly equivalents
    monthlyNetForLiving: netForLiving / 12,
    monthlyNetEconomic: netEconomic / 12,
    monthlyIncomeTax: totalIncomeTax / 12,
    monthlyNI: totalNI / 12,
    monthlyFreelancerTax: freelancerIncomeTax / 12,
    monthlySpouseTax: spouseIncomeTax / 12,
  };
}

function calcProgressiveTax(income) {
  let tax = 0;
  let prev = 0;
  for (const bracket of TAX_BRACKETS) {
    const taxable = Math.max(Math.min(income, bracket.limit) - prev, 0);
    tax += taxable * bracket.rate;
    prev = bracket.limit;
  }
  return tax;
}

function calcNI(annualIncome) {
  const { threshold1, maxNI, rateNI_low, rateNI_high } = NI_FREELANCER;
  return Math.min(annualIncome, threshold1) * rateNI_low +
    Math.max(Math.min(annualIncome, maxNI) - threshold1, 0) * rateNI_high;
}

function calcHealth(annualIncome) {
  const { threshold1, maxNI, rateHealth_low, rateHealth_high } = NI_FREELANCER;
  return Math.min(annualIncome, threshold1) * rateHealth_low +
    Math.max(Math.min(annualIncome, maxNI) - threshold1, 0) * rateHealth_high;
}

function calcSpouseEmployeeNI(monthlySalary) {
  const { threshold1_monthly, threshold2_monthly, employeeNI_low, employeeNI_high } = NI_EMPLOYEE;
  return Math.min(monthlySalary, threshold1_monthly) * employeeNI_low +
    Math.max(Math.min(monthlySalary, threshold2_monthly) - threshold1_monthly, 0) * employeeNI_high;
}

function calcSpouseEmployerNI(monthlySalary) {
  const { threshold1_monthly, threshold2_monthly, employerNI_low, employerNI_high } = NI_EMPLOYEE;
  return Math.min(monthlySalary, threshold1_monthly) * employerNI_low +
    Math.max(Math.min(monthlySalary, threshold2_monthly) - threshold1_monthly, 0) * employerNI_high;
}

// Generate sensitivity data: net income for various invoice × spouse salary combinations
export function generateSensitivityData(baseInputs, invoiceRange, spouseRange) {
  const data = [];
  for (const invoice of invoiceRange) {
    const row = { invoice };
    for (const spouse of spouseRange) {
      const result = calculate({ ...baseInputs, monthlyInvoice: invoice, spouseGrossSalary: spouse });
      row[`s${spouse}`] = Math.round(result.netForLiving);
    }
    data.push(row);
  }
  return data;
}
