// Israeli Tax Configuration - 2025/2026
// All tax constants in one place for easy yearly updates

export const TAX_YEAR = '2025/2026';

// ─── Income Tax Brackets (annual) ───────────────────────────────
export const TAX_BRACKETS = [
  { limit: 84120, rate: 0.10 },
  { limit: 120720, rate: 0.14 },
  { limit: 193800, rate: 0.20 },
  { limit: 269280, rate: 0.31 },
  { limit: 560280, rate: 0.35 },
  { limit: 721560, rate: 0.47 },
  { limit: Infinity, rate: 0.50 },
];

// ─── National Insurance - Freelancer (annual) ───────────────────
export const NI_FREELANCER = {
  threshold1: 7703 * 12,        // 92,436 - 60% of average wage
  maxNI: 622920,                // maximum insurable income
  rateNI_low: 0.0447,
  rateNI_high: 0.1283,
  rateHealth_low: 0.0323,
  rateHealth_high: 0.0517,
};

// ─── National Insurance - Employee (monthly) ────────────────────
export const NI_EMPLOYEE = {
  threshold1_monthly: 7703,
  threshold2_monthly: 51910,
  employeeNI_low: 0.035,
  employeeNI_high: 0.12,
  employerNI_low: 0.0451,
  employerNI_high: 0.076,
};

// ─── Credit Points ──────────────────────────────────────────────
export const CREDIT_POINT_VALUE = 2904;

// ─── Pension & Education Fund (max tax-benefit values) ──────────
export const ANNUAL_PENSION = 45642;
export const ANNUAL_HISTALMUT = 20520;
export const PENSION_DEDUCTION_CAP_INCOME = 232800;
export const HISHTALMUT_DEDUCTION_CAP_INCOME = 293397;

// ─── Deduction & Credit Rates ───────────────────────────────────
export const PENSION_DEDUCTION_RATE = 0.11;
export const PENSION_CREDIT_RATE = 0.055;
export const PENSION_CREDIT_MULTIPLIER = 0.35;
export const HISHTALMUT_DEDUCTION_RATE = 0.045;
export const NI_DEDUCTION_RATE = 0.52;
export const PENSION_INSURED_DIVISOR = 0.16;

// ─── Spouse Employment Constants ────────────────────────────────
export const SPOUSE = {
  travelAllowance: 1571,        // דמי נסיעה
  socialBenefitsRate: 0.1483,   // הפרשות סוציאליות מעסיק
  pensionEmployeeRate: 0.06,    // הפרשת פנסיה עובד
  totalPensionRate: 0.2083,     // סה"כ הפרשות פנסיה (עובד + מעסיק)
  histalmutAnnual: 18854,       // קרן השתלמות שנתית שכיר
  microBizTaxableRatio: 0.7,    // חלק חייב במס מעוסק זעיר
  travelAllowanceTaxRate: 0.025,// מס על דמי נסיעה
};

// ─── Default Input Values ───────────────────────────────────────
export const DEFAULT_INPUTS = {
  monthlyInvoice: 51000,
  monthlyExpenses: 4000,
  creditPointsFreelancer: 5.75,
  spouseGrossSalary: 21134,
  creditPointsSpouse: 7.25,
  spouseMicroBizIncome: 1000,
};

// ─── Input Constraints (UI + engine validation) ──────────────────
export const INPUT_CONSTRAINTS = {
  monthlyInvoice: { min: 10000, max: 100000 },
  monthlyExpenses: { min: 0, max: 20000 },
  creditPointsFreelancer: { min: 0, max: 10 },
  spouseGrossSalary: { min: 0, max: 50000 },
  creditPointsSpouse: { min: 0, max: 10 },
  spouseMicroBizIncome: { min: 0, max: 10000 },
};
