/**
 * 
 * A function to determine the loan type of a response
 * Responses come from the service registry(ies)
 * 
 * @param {*} response 
 * @returns the type of loan response
 */

function determineServiceProvider(response) {

    if (response.loanType == 'student') {
        return 'student-loan';
    } else if (response.loanType == 'home') {
        return 'home-loan';
    } else if (response.loanType == 'auto') {
        return 'car-loan';
    } else if (response.loanType == 'personal') {
        return 'personal-loan';
    }
}

module.exports = determineServiceProvider