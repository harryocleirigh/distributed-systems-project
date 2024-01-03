/**
 * Controller for calculating loan offers
 * Takes a client information object as a request
 * Retuns a loan ofer response
 * 
 * The loan offer is calculated by combing the requested loan details with
 * Client details like credit score.
 */

const providerName = 'Vendor Finance';
const linkToImage = "https://scontent-dub4-1.xx.fbcdn.net/v/t39.30808-6/302692377_499165928880375_6378380000885824443_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=efb6e6&_nc_ohc=IWrPqcTKVr0AX-pg0tS&_nc_ht=scontent-dub4-1.xx&oh=00_AfDk5BdVUteqSiDi-ilWnRVunCISib07tA3BaQmKOCj_kw&oe=65932300";

const calculateLoan = (req, res) => {
    // Parse the JSON request body
    const { loanAmount, creditScore, loanTermLength } = req.body;
    
    if (!loanAmount || !creditScore) {
        return res.status(400).send('Invalid request');
    }

    // Calculate the interest rate
    let interestRate = 0;
    
    if (creditScore < 600) {
        interestRate = 0.1;
    } else if (creditScore < 700) {
        interestRate = 0.087;
    } else {
        interestRate = 0.72;
    }

    // Calculate the monthly payment
    const monthlyPayment = (loanAmount * (interestRate + 1)) / loanTermLength;
    const totalPayment = monthlyPayment * loanTermLength;

    console.log('Interest rate:', interestRate);
    console.log('Interest rate:', monthlyPayment);

    // Prepare the response body
    const responseBody = {
        providerName,
        linkToImage,
        totalPayment,
        monthlyPayment,
        interestRate
    };

    // Send the response
    res.json(responseBody);

    // Log the request
    console.log('Received request to calculate loan');
    console.log('Request body:', req.body);
    console.log('Response body:', responseBody);
    
}

module.exports = calculateLoan