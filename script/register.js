import { userData } from '../data/data.js';


document.addEventListener('DOMContentLoaded', function() {
    

    // Registration form submission handler
    const regForm = document.querySelector('#js-register-form');
    if (regForm) { // Check if regForm exists
        regForm.addEventListener('submit', handleRegSubmit);
    } else {
        console.error('Registration form not found');
    }
});



function handleRegSubmit(event) {
    event.preventDefault(); // Prevent form submission
    
    const userName = document.querySelector('.username').value;
    const userEmail = document.querySelector('.useremail').value;
    const userPass = document.querySelector('.userpass').value;
    const errorMsg = document.querySelector('.error-msg');
    
    // Find if the user with the provided email already exists
    const currUser = userData.find(user => user.email === userEmail);
    
    if (!currUser) {
        // User with the provided email does not exist, proceed with registration
        // Add the new user to the userData array
        userData.push({
            id: userData.length + 1,
            name: userName,
            email: userEmail,
            password: userPass
        });
        console.log(userData);
      
        // Redirect to the login page after successful registration
        window.location.href = `../index.html?userid=${userData.length}`;
    } else {
        // User with the provided email already exists
        errorMsg.innerText = 'User already registered';
    } 
}


