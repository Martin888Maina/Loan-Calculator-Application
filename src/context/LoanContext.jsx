import { createContext, useContext, useReducer } from 'react';

const initialState = {
  inputs: {
    loanAmount: '',
    annualRate: '',
    termYears: '',
    termMonths: '',
    termUnit: 'years',
    startDate: new Date().toISOString().slice(0, 7), // YYYY-MM
    loanType: 'fixed',
    // ARM fields
    armInitialPeriod: '',
    armNewRate: '',
    // interest-only fields
    interestOnlyPeriod: '',
    // balloon fields
    balloonAmortYears: '',
    // extra payments
    extraMonthly: '',
    lumpSumAmount: '',
    lumpSumMonth: '',
  },
  results: null,
  extraResults: null,
};

function loanReducer(state, action) {
  switch (action.type) {
    case 'SET_INPUT':
      return {
        ...state,
        inputs: { ...state.inputs, [action.field]: action.value },
      };
    case 'SET_RESULTS':
      return { ...state, results: action.results };
    case 'SET_EXTRA_RESULTS':
      return { ...state, extraResults: action.results };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

const LoanContext = createContext(null);

export function LoanProvider({ children }) {
  const [state, dispatch] = useReducer(loanReducer, initialState);

  const setInput = (field, value) => dispatch({ type: 'SET_INPUT', field, value });
  const setResults = (results) => dispatch({ type: 'SET_RESULTS', results });
  const setExtraResults = (results) => dispatch({ type: 'SET_EXTRA_RESULTS', results });
  const reset = () => dispatch({ type: 'RESET' });

  return (
    <LoanContext.Provider value={{ state, setInput, setResults, setExtraResults, reset }}>
      {children}
    </LoanContext.Provider>
  );
}

export function useLoan() {
  const ctx = useContext(LoanContext);
  if (!ctx) throw new Error('useLoan must be used inside LoanProvider');
  return ctx;
}
