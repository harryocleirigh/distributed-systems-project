import React from "react";
import { useState, useEffect } from 'react';

const Summary = ({fetchedQuotes, loanType, loanValue, loanMonths}) => {

    const [summaryData, setSummaryData] = useState([]);

    useEffect(() => {

        if (fetchedQuotes && fetchedQuotes.length > 0) {
            const data = fetchedQuotes.map((quote, index) => (
                <div key={index} className="quote-item">
                    <div className="quote-item-image-holder">
                        <img src={quote.linkToImage} alt={quote.providerName} className="quote-item-image" />
                    </div>
                    <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 2fr)'}}>
                        <p>Name: <strong>{quote.providerName}</strong></p>
                        <p>Total Repayment Value: <strong>€{quote.totalPayment.toFixed(2)}</strong></p>
                        <p>Interest Rate: <strong>{(quote.interestRate * 100).toFixed(2)}%</strong></p>
                        <p>Monthly Payments: <strong>€{Number(quote.monthlyPayment).toFixed(2)}</strong></p>
                    </div>
                </div>
            ));
            setSummaryData(data);
        } else {
            console.log('No data or empty data received');
        }
    }, [fetchedQuotes]);

    return (
        <div className="summary-holder">
            <div style={{width: '100%', display: 'flex', flexDirection: 'column', marginLeft: '24px'}}>
                <h2>Summary</h2>
                <p>You requested a {loanType} loan for €{loanValue} over {loanMonths} months</p>
                <h4>Quotes received from partnered Vendors</h4>
            </div>
            {summaryData.length > 0 ? summaryData : <p>No quotes available.</p>}
        </div>
    );
}

export default Summary;
