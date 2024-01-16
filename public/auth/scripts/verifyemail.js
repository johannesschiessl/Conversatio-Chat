const firebaseConfig = {
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

function onEmailVerified() {
    console.log('Email is verified.');
    window.location.href = 'https://conversatio-chat.web.app/';
}

firebase.auth().onAuthStateChanged((user) => {
    if (user && user.emailVerified) {
        onEmailVerified();
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const user = firebase.auth().currentUser;

    if (user && user.emailVerified) {
        onEmailVerified();
    }
});

function resendVerificationEmail() {
    const user = firebase.auth().currentUser;

    if (user) {
        user.sendEmailVerification()
            .then(() => {
                console.log("Verification email sent successfully.");
                alert("Verification email sent successfully. Please check your inbox.");
            })
            .catch((error) => {
                console.error("Error sending verification email:", error);
                alert("Error sending verification email. Please try again.");
            });
    } else {
        console.error("No user is currently signed in.");
        alert("No user is currently signed in. Please log in first.");
    }
}

document.getElementById("resend-verification-button").addEventListener("click", function () {
    resendVerificationEmail();
});
