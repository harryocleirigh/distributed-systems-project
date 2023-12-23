import React, { useEffect, useState } from 'react';
import Form from './components/form';
import Summary from './components/summary';
import './App.css';

function App() {

  // Setters for quote data
  const [fetchedQuotes, setFetchedQuotes] = useState([]);
  const [hasGottenQuote, setHasGottenQuote] = useState(false);

  return (
    <div className="App">
      {hasGottenQuote ? (
        <Summary 
        fetchedQuotes={fetchedQuotes}
        />
      ) : (
        <Form 
          fetchedQuotes={fetchedQuotes}
          setFetchedQuotes={setFetchedQuotes}
          setHasGottenQuote={setHasGottenQuote}
        />        
      )}
    </div>
  );
}

export default App;