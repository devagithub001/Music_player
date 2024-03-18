import { userData } from '../data/data.js';

document.addEventListener('DOMContentLoaded', function() {
    // Login form submission handler
    const loginForm = document.querySelector('#js-login-form');
    if (loginForm) { // Check if loginForm exists
        loginForm.addEventListener('submit', handleLoginSubmit);
    } else {
        console.error('Login form not found');
    }



});

function handleLoginSubmit(event) {
    event.preventDefault(); // Prevent form submission
    
    const userEmail = document.querySelector('.logemail').value;
    const userPass = document.querySelector('.logpass').value;
    const errorMsg = document.querySelector('.error-msg');
  
    // Find the user with the provided email
    const currUser = userData.find(user => user.email === userEmail);
    
    if (currUser) {
        // Check if the password matches
        if (currUser.password === userPass) {
            // Redirect to another page with user ID
            console.log(1);
            window.location.href = `../index.html?userid=${currUser.id}`;
        } else {
            // Display error message for incorrect password
            errorMsg.innerText = 'Incorrect password';
        }
    } else {
        // Display error message for user not found
        errorMsg.innerText = 'User not found';
    }
}

