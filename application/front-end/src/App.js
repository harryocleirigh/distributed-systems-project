import React, { useEffect, useState } from 'react';
import Form from './components/form';
import Summary from './components/summary';
import './App.css';

function App() {

  // Setters for quote data
  const [fetchedQuotes, setFetchedQuotes] = useState([]);
  const [hasGottenQuote, setHasGottenQuote] = useState(false);

  // General UseStates for UI Display
  const [loanTypeForSummary, setLoanTypeForSummary] = useState('');
  const [loanValueForSummary, setLoanValueForSummary] = useState(0);
  const [loanMonthsForSummary, setLoanMonthsForSummary] = useState(0);

  return (
    <div className="App">
      {hasGottenQuote ? (
        <Summary 
          fetchedQuotes={fetchedQuotes}
          loanType={loanTypeForSummary}
          loanValue={loanValueForSummary}
          loanMonths={loanMonthsForSummary}
        />
      ) : (
        <Form 
          fetchedQuotes={fetchedQuotes}
          setFetchedQuotes={setFetchedQuotes}
          setHasGottenQuote={setHasGottenQuote}
          setLoanTypeForSummary={setLoanTypeForSummary}
          setLoanValueForSummary={setLoanValueForSummary}
          setLoanMonthsForSummary={setLoanMonthsForSummary}
        />        
      )}
    </div>
  );
}

export default App;