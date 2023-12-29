import React from "react";
import { useState, useEffect } from 'react';

const Form = ({fetchedQuotes, setFetchedQuotes, setHasGottenQuote, setLoanTypeForSummary, setLoanValueForSummary, setLoanMonthsForSummary}) => {

  const [isQuoteDataFetched, setIsQuoteDataFetched] = useState(false);

      // Setters for form data
  const [name, setName] = useState("");
  const [dob, setDob] = useState("1990-01-01");
  const [loanType, setLoanType] = useState("personal");
  const [loanAmount, setLoanAmount] = useState(0);
  const [loanTermLength, setLoanTermLength] = useState(0);
  const [employmentStatus, setEmploymentStatus] = useState("employed");
  const [industry, setIndustry] = useState("agriculture");
  const [annualIncome, setAnnualIncome] = useState(0);
  const [missedPaymentsFrequency, setMissedPaymentsFrequency] = useState("never");
  const [creditUtilisation, setCreditUtilisation] = useState(0);
  const [creditUseLength, setCreditUseLength] = useState(0);
  const [newCredit, setNewCredit] = useState("no");
  const [debtToIncomeRatio, setDebtToIncomeRatio] = useState(0);
  const [currentDebt, setCurrentDebt] = useState(0);

  // Setters for credit accounts
  const [creditAccounts, setCreditAccounts] = useState({
    creditCards: false,
    mortgages: false,
    studentLoans: false,
    carLoans: false
  });

  const handleInputChange = (event) => {
    setCreditAccounts({ ...creditAccounts, [event.target.value]: event.target.checked});
  };

  // Very simple random session ID generator for demo purposes
  const calculateRandomSessionID = () => { 
    let sessionID = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for ( let i = 0; i < 32; i++ ) {
      sessionID += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return sessionID;
  }

  const submitApplication = async (e) => {
    e.preventDefault();
  
    const data = {
      sessionID: calculateRandomSessionID(),
      name,
      dob,
      loanType,
      loanAmount,
      loanTermLength,
      employmentStatus,
      industry,
      annualIncome,
      missedPaymentsFrequency,
      creditUtilisation,
      creditUseLength,
      newCredit,
      creditAccounts,
      debtToIncomeRatio,
      currentDebt
    };
  
    console.log(data);
  
    try {
      const response = await fetch('http://localhost:8000/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const quoteData = await response.json();
      console.log('Success:', quoteData);
      
      setFetchedQuotes(quoteData);
      setIsQuoteDataFetched(true);

    } catch (error) {
      console.error('Error:', error);
    }
  }

  useEffect(() => {
    if (isQuoteDataFetched) {
      setHasGottenQuote(true);
      console.log("Binary in Use Effect on Form:", isQuoteDataFetched);
      console.log("Quotes in Use Effect on Form:", fetchedQuotes);
    }
  }, [isQuoteDataFetched]);

  const handleLoanTypeChange = (e) => {
    const value = e.target.value;
    setLoanType(value);
    setLoanTypeForSummary(value);
  };
  
  const handleLoanValueChange = (e) => {
    const value = e.target.value;
    setLoanAmount(value);
    setLoanValueForSummary(value);
  }

  const handleLoanTermLengthChange = (e) => {
    const value = e.target.value;
    setLoanTermLength(value);
    setLoanMonthsForSummary(value);
  }


    return(
    <div className='application-form-container'>
        <div className='application-header-container'>
          <h1 style={{margin: 0}}>Loan Application</h1>
          <p>Please fill out the form below to apply for a loan.</p>
        </div>
        <form className='application-form'>
          <h3 className='loan-form-header'> Personal Information </h3>
          <label className='label-header'>
            Name:
            <input className="label-form" type="text" name="name" onChange={e => setName(e.target.value)}/>
          </label>
          <label className='label-header'>
            Date of Birth:
            <input className="label-form"type="date" name="dob" onChange={e => setDob(e.target.value)}/>
          </label>
          <h3 className='loan-form-header'> Loan Information</h3>
          <label className='label-header'>
            Loan Type:
            <select className="label-form" name="loanType" onChange={handleLoanTypeChange}>
              <option value="personal">Personal</option>
              <option value="home">Home</option>
              <option value="car">Car</option>
              <option value="student">Student</option>
            </select>
          </label>
          <label className='label-header'>
            Loan Amount:
            <input className="label-form" type="number" name="loanAmount" onChange={handleLoanValueChange}/>
          </label>
          <label className='label-header'>
            Loan Term Length (in months):
            <input className="label-form" type="number" name="loanTermLength" onChange={handleLoanTermLengthChange}/>
          </label>
          <h3 className='loan-form-header'> Employment Information</h3>
          <label className='label-header'>
            Employment Status:
            <select className="label-form" name="employmentStatus" onChange={e => setEmploymentStatus(e.target.value)}>
              <option value="employed">Employed</option>
              <option value="self-employed">Self-Employed</option>
              <option value="unemployed">Unemployed</option>
              <option value="student">Student</option>
              <option value="retired">Retired</option>
            </select>
          </label>
          <label className='label-header'>
            Industry:
            <select className="label-form" name="industry" onChange={e => setIndustry(e.target.value)}>
              <option value="agriculture">Agriculture</option>
              <option value="construction">Construction</option>
              <option value="education">Education</option>
              <option value="finance">Finance</option>
              <option value="healthcare">Healthcare</option>
              <option value="hospitality">Hospitality</option>
              <option value="tech">Technology</option>
              <option value="manufacturing">Manufacturing</option>
              <option value="retail">Retail</option>
              <option value="transportation">Transportation</option>
            </select>
          </label>
          <label className='label-header'>
            Annual Income:
            <input className="label-form" type="number" name="annualIncome" onChange={e => setAnnualIncome(e.target.value)}/>
          </label>
          <h3 className='loan-form-header'> Credit History</h3>
          <label className='label-header'>
            Have you ever missed loan or credit card payments? If yes, how frequently:
            <select className="label-form" name="missedPaymentsFrequency" onChange={e => setMissedPaymentsFrequency(e.target.value)}>
              <option value="never">Never</option>
              <option value="rarely">Rarely</option>
              <option value="sometimes">Sometimes</option>
              <option value="often">Often</option>
              <option value="always">Always</option>
            </select>
          </label>
          <label className='label-header'>
            What percentage of your available credit card limit do you typically utilise:
            <input className="label-form" type="number" name="creditUtilisation" min="0" max="100" onChange={e => setCreditUtilisation(e.target.value)}/>
          </label>
          <label className='label-header'>
            How many years have you been using credit:
            <input className="label-form" type="number" name="creditUseLength" min="0" max="100" onChange={e => setCreditUseLength(e.target.value)}/>
          </label>
          <label className='label-header'>
            Have you applied for any new credit or loans in the past 12 months:
            <select className="label-form" name="newCredit" onChange={e => setNewCredit(e.target.value)}>
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
          </label>
          <label className='label-header'>
            What types of credit accounts do you currently have:
            <label>
              <input type="checkbox" name="creditAccounts" value="creditCards" checked={creditAccounts.creditCards} onChange={handleInputChange} />
              <span style={{marginLeft: '12px', fontWeight: 400}}>Credit Cards</span>
            </label>
            <label>
              <input type="checkbox" name="creditAccounts" value="mortgages" checked={creditAccounts.mortgages} onChange={handleInputChange} />
              <span style={{marginLeft: '12px', fontWeight: 400}}>Mortgages</span>
            </label>
            <label>
              <input type="checkbox" name="creditAccounts" value="studentLoans" checked={creditAccounts.studentLoans} onChange={handleInputChange} />
              <span style={{marginLeft: '12px', fontWeight: 400}}>Student Loans</span>
            </label>
            <label>
              <input type="checkbox" name="creditAccounts" value="carLoans" checked={creditAccounts.carLoans} onChange={handleInputChange} />
              <span style={{marginLeft: '12px', fontWeight: 400}}>Car Loans</span>
            </label>
          </label>
          <label className='label-header'>
            What is your total monthly debt payment as a percentage of your monthly income:
            <input className="label-form" type="number" name="debtToIncomeRatio" min="0" max="100" onChange={e => setDebtToIncomeRatio(e.target.value)} />
          </label>
          <label className='label-header'>
            What is the total amount of your current debts, including loans and credit cards:
            <input className="label-form" type="number" name="currentDebt" min="0" max="10000000" onChange={e => setCurrentDebt(e.target.value)}/>
          </label>
          <button button onClick={submitApplication} className='cta-button'> Submit Application</button>
        </form>
      </div>
    )   
}

export default Form;