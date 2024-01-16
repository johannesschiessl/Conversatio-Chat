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


function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const user = userCredential.user;
        
            if (user.emailVerified) {
                console.log('Logged in successfully:', user);
                window.location.href = "https://conversatio-chat.web.app/";
            } else {
                console.log('Email is not verified. Please verify your email.');
                alert('Email is not verified. Please verify your email before logging in.');
                firebase.auth().signOut();
            }
        })
        .catch((error) => {
            console.error('Login error:', error);

            const errorCode = error.code || null;
            const errorMessage = error.message || 'Unknown error';

            console.error('Login error details:', errorCode, errorMessage);

            if (errorMessage.includes('INVALID_LOGIN_CREDENTIALS')) {
                alert('Incorrect email or password. Please try again.');
            } else {
                alert('Something has gone wrong. Please try again.');
            }
        });
}
