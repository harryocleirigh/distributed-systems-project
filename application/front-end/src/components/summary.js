import React from "react";
import { useState, useEffect } from 'react';

const Summary = ({fetchedQuotes}) => {

    const [summaryData, setSummaryData] = useState([]);

    const dummy_data = [
        {
            providerName: 'Allied Irish Bank',
            linkToImage: 'https://pbs.twimg.com/profile_images/1277622308715343872/TcUC4R0S_400x400.jpg',
            totalPayment: 1120,
            interestRate: 0.08,
            monthlyPayment: 93.33333333333333,
        },
        {
            providerName: 'Allied Irish Bank',
            linkToImage: 'https://pbs.twimg.com/profile_images/1277622308715343872/TcUC4R0S_400x400.jpg',
            totalPayment: 1120,
            interestRate: 0.08,
            monthlyPayment: 93.33333333333333,
        },
        {
            providerName: 'Allied Irish Bank',
            linkToImage: 'https://pbs.twimg.com/profile_images/1277622308715343872/TcUC4R0S_400x400.jpg',
            totalPayment: 1120,
            interestRate: 0.08,
            monthlyPayment: 93.33333333333333,
        }
    ]

    useEffect(() => {

        // setFetchedQuoteData(dummy_data);
        if (fetchedQuotes && fetchedQuotes.length > 0) {
            const data = fetchedQuotes.map((quote, index) => (
                <div key={index} className="quote-item">
                    <div className="quote-item-image-holder">
                        <img src={quote.linkToImage} alt={quote.providerName} className="quote-item-image" />
                    </div>
                    <div>
                        <p>Name: {quote.providerName}</p>
                        <p>Loan Amount: {quote.totalPayment}</p>
                        <p>Interest Rate: {quote.interestRate * 100}%</p>
                        <p>Monthly Payments: €{Number(quote.monthlyPayment).toFixed(2)}</p>
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
            {summaryData.length > 0 ? summaryData : <p>No quotes available.</p>}
        </div>
    );
}

export default Summary;
