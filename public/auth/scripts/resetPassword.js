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

  function resetPasswordAndRedirect() {
    const emailInput = document.getElementById('email');
    const email = emailInput.value;

    if (!isValidEmail(email)) {
      console.error('Invalid email format');
      return;
    }

  firebase.auth().sendPasswordResetEmail(email)
    .then(() => {
      console.log('Password reset email sent successfully');
      window.location.href = "passwordresetconfirmation.html"
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error('Password reset error:', errorCode, errorMessage);
      alert("Something has gone wrong. Please try again.")
    });
  }

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

const resetPasswordForm = document.querySelector('.reset-password-form');
  if (resetPasswordForm) {
    resetPasswordForm.addEventListener('submit', function (event) {
      event.preventDefault();
      resetPasswordAndRedirect();
    });
  } else {
    console.error("Form element not found");
  }
