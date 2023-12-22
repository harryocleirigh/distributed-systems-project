import React, { useEffect, useState } from 'react';
import Form from './components/form';
import './App.css';

function App() {

  // Setters for quote data
  const [fetchedQouteData, setFetchedQuoteData] = useState([{}]);
  const [hasGottenQuote, setHasGottenQuote] = useState(false);

  return (
    <div className="App">
      {hasGottenQuote ? (
        <div>
        <Form 
          fetchedQouteData={fetchedQouteData}
          setFetchedQuoteData={setFetchedQuoteData}
          setHasGottenQuote={setHasGottenQuote}
        />        </div>
      ) : (
        <></>
      )}
    </div>
  );
}

export default App;