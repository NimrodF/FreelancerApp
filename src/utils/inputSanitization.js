import { DEFAULT_INPUTS, INPUT_CONSTRAINTS } from './taxConfig.js';

export function sanitizeInputForKey(key, rawValue, fallbackValue = DEFAULT_INPUTS[key]) {
  const constraints = INPUT_CONSTRAINTS[key];
  const fallback = Number.isFinite(Number(fallbackValue)) ? Number(fallbackValue) : DEFAULT_INPUTS[key];
  if (!constraints) {
    return fallback;
  }

  const parsed = parseNumberish(rawValue);
  const candidate = Number.isFinite(parsed) ? parsed : fallback;
  return clamp(candidate, constraints.min, constraints.max);
}

export function sanitizeAllInputs(rawInputs = {}, fallbackInputs = DEFAULT_INPUTS) {
  return {
    monthlyInvoice: sanitizeInputForKey('monthlyInvoice', rawInputs.monthlyInvoice, fallbackInputs.monthlyInvoice),
    monthlyExpenses: sanitizeInputForKey('monthlyExpenses', rawInputs.monthlyExpenses, fallbackInputs.monthlyExpenses),
    creditPointsFreelancer: sanitizeInputForKey('creditPointsFreelancer', rawInputs.creditPointsFreelancer, fallbackInputs.creditPointsFreelancer),
    spouseGrossSalary: sanitizeInputForKey('spouseGrossSalary', rawInputs.spouseGrossSalary, fallbackInputs.spouseGrossSalary),
    creditPointsSpouse: sanitizeInputForKey('creditPointsSpouse', rawInputs.creditPointsSpouse, fallbackInputs.creditPointsSpouse),
    spouseMicroBizIncome: sanitizeInputForKey('spouseMicroBizIncome', rawInputs.spouseMicroBizIncome, fallbackInputs.spouseMicroBizIncome),
  };
}

function parseNumberish(rawValue) {
  if (typeof rawValue === 'number') {
    return Number.isFinite(rawValue) ? rawValue : NaN;
  }
  if (typeof rawValue === 'string') {
    const normalized = rawValue.replace(/,/g, '').trim();
    if (!normalized) {
      return NaN;
    }
    return Number(normalized);
  }
  return Number(rawValue);
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}
