// default form values shown on first load
export const DEFAULTS = {
  loanAmount: 1000000,
  annualRate: 12,
  termYears: 3,
  startDate: new Date().toISOString().slice(0, 7),
  loanType: 'fixed',
};

// loan type options
export const LOAN_TYPES = [
  { value: 'fixed', label: 'Fixed Rate' },
  { value: 'arm', label: 'Adjustable Rate (ARM)' },
  { value: 'interest-only', label: 'Interest Only' },
  { value: 'balloon', label: 'Balloon Payment' },
];

// DTI thresholds used in affordability analysis
export const DTI_THRESHOLDS = {
  frontEnd: 0.28,
  backEnd: 0.36,
};

// max values for input validation
export const LIMITS = {
  maxLoanAmount: 999999999,
  maxRate: 100,
  maxTermYears: 50,
  maxTermMonths: 600,
};
