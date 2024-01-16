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

function signup() {
    const name = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            console.log('User signed in successfully.');
            const user = userCredential.user;

            user.sendEmailVerification()
                .then(() => {
                    console.log('Verification email sent successfully.');
                    alert('Verification email sent successfully. Please check your inbox.');
                })
                .catch((error) => {
                    console.error('Error sending verification email:', error);
                    alert('Error sending verification email. Please try again.');
                });

            user.updateProfile({
                displayName: name
            }).then(() => {
                console.log('Display name set successfully:', name);

                window.location.href = "verifyemail.html";
            }).catch((error) => {
                console.error('Error setting display name:', error);
            });

        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error('Signup error:', errorCode, errorMessage);
            alert('Something has gone wrong. Please try again.');
        });
}

document.querySelector('.signup-form').addEventListener('submit', function (event) {
    event.preventDefault();
    signup();
});

