var firebaseConfig = {
    apiKey: "AIzaSyDNcl2cBBmOHjj8QrDuBwGwdxTEiSwwUAo",
    authDomain: "conversatio-chat.firebaseapp.com",
    databaseURL: "https://conversatio-chat-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "conversatio-chat",
    storageBucket: "conversatio-chat.appspot.com",
    messagingSenderId: "493205864943",
    appId: "1:493205864943:web:1799d50cdb76b5c945361a",
    measurementId: "G-P6W9TSFFPD"
};

firebase.initializeApp(firebaseConfig);

function resendPasswordResetEmail(email) {
    auth.sendPasswordResetEmail(email)
    .then(() => {
        console.log('Password reset email sent successfully');
    })
    .catch((error) => {
        console.error('Error sending password reset email:', error.message);
    });
}

function getQueryParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

function handleButtonClick() {
    const userEmail = getQueryParam('email');

    if (userEmail) {
        resendPasswordResetEmail(userEmail);
    } else {
        console.error('Email parameter is missing in the URL');
    }
}

const resendButton = document.getElementById('resend-password-reset-button');
resendButton.addEventListener('click', handleButtonClick);
