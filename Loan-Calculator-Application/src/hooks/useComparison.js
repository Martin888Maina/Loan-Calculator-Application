import { useState, useMemo } from 'react';
import { buildAmortizationSchedule, calcSummary } from '../utils/loanMath';
import {
  buildARMSchedule,
  buildInterestOnlySchedule,
  buildBalloonSchedule,
} from '../utils/loanTypes';

const defaultScenario = (label) => ({
  label,
  loanAmount: '',
  annualRate: '',
  termYears: '',
  termUnit: 'years',
  termMonths: '',
  startDate: new Date().toISOString().slice(0, 7),
  loanType: 'fixed',
  armInitialPeriod: '5',
  armNewRate: '',
  interestOnlyPeriod: '5',
  balloonAmortYears: '30',
});

function calcScenario(s) {
  const principal = parseFloat(s.loanAmount);
  const rate = parseFloat(s.annualRate);
  const totalMonths = s.termUnit === 'months'
    ? parseInt(s.termMonths)
    : parseInt(s.termYears) * 12;

  if (!principal || isNaN(principal) || principal <= 0) return null;
  if (isNaN(rate) || rate < 0) return null;
  if (!totalMonths || isNaN(totalMonths) || totalMonths <= 0) return null;

  let schedule;
  switch (s.loanType) {
    case 'arm': {
      const initPeriod = parseFloat(s.armInitialPeriod) || 5;
      const newRate = parseFloat(s.armNewRate) || rate;
      schedule = buildARMSchedule(principal, rate, initPeriod, newRate, totalMonths / 12, s.startDate);
      break;
    }
    case 'interest-only': {
      const ioPeriod = parseFloat(s.interestOnlyPeriod) || 5;
      schedule = buildInterestOnlySchedule(principal, rate, ioPeriod, totalMonths / 12, s.startDate);
      break;
    }
    case 'balloon': {
      const amortYears = parseFloat(s.balloonAmortYears) || 30;
      schedule = buildBalloonSchedule(principal, rate, totalMonths / 12, amortYears, s.startDate);
      break;
    }
    default:
      schedule = buildAmortizationSchedule(principal, rate, totalMonths, s.startDate);
  }

  return { schedule, summary: calcSummary(schedule, principal) };
}

export function useComparison() {
  const [scenarios, setScenarios] = useState([
    defaultScenario('Scenario A'),
    defaultScenario('Scenario B'),
  ]);

  const updateScenario = (index, field, value) => {
    setScenarios(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const addScenario = () => {
    if (scenarios.length >= 3) return;
    const labels = ['Scenario A', 'Scenario B', 'Scenario C'];
    setScenarios(prev => [...prev, defaultScenario(labels[prev.length])]);
  };

  const removeScenario = (index) => {
    if (scenarios.length <= 2) return;
    setScenarios(prev => prev.filter((_, i) => i !== index));
  };

  const resetScenario = (index) => {
    const labels = ['Scenario A', 'Scenario B', 'Scenario C'];
    setScenarios(prev => {
      const updated = [...prev];
      updated[index] = defaultScenario(labels[index]);
      return updated;
    });
  };

  // compute results for all scenarios — null if inputs are incomplete
  const results = useMemo(() => scenarios.map(calcScenario), [scenarios]);

  return { scenarios, results, updateScenario, addScenario, removeScenario, resetScenario };
}
