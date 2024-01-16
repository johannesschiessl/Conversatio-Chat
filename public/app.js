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

var db = firebase.firestore();

let currentUser;
let currentChatId;

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        currentUser = user;
        if (currentUser.emailVerified) {
            console.log("User is logged in:", currentUser.displayName);
            console.log("User's email:", currentUser.email);

            var profile_letter = getFirstLetter(currentUser.displayName)

            var profile_image = '<i class="fa-solid fa-' + profile_letter.toLowerCase() + '"></i>'
            var displayName = currentUser.displayName;


            document.getElementById('settings-button').innerHTML = profile_image + ' ' + displayName;
            document.getElementById('name').value = currentUser.displayName;
            document.getElementById('settings_email').value = currentUser.email;

            loadMessages();
        } else {
            window.location.href = "auth/verifyemail.html";
        }
    } else {
        window.location.href = "auth/welcome.html";
    }
});

function getFirstLetter(str) {
    if (typeof str === 'string' && str.length > 0) {
        return str[0];
    } else {
        return 'Invalid input. Please provide a non-empty string.';
    }
}

function getRandomColor() {
    const colors = ['#007BA7', '#FF6F61', '#98FF98', '#DAA520', '#967BB6', '#36454F', '#E2725B', '#40E0D0', '#FF66CC', '#6A5ACD'];
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
}

function loadChats() {
    const db = firebase.firestore();
    const chatsCollection = db.collection('chats');
    const chatsList = document.getElementById('chats');

    chatsCollection.get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const chatData = doc.data();

            var chat_letter = getFirstLetter(chatData.name);

            const chatImage = document.createElement('i');
            chatImage.classList.add('fas', 'fa-solid', 'fa-' + chat_letter.toLowerCase());

            const listItem = document.createElement('li');

            chatImage.style.backgroundColor = chatData.color;

            listItem.appendChild(chatImage);
            listItem.appendChild(document.createTextNode(` ${chatData.name}`));
            listItem.setAttribute('data-chat-id', doc.id);

            listItem.onclick = function() {
                updateSelectedChat(doc.id);
                loadMessages(doc.id);
            };

            chatsList.appendChild(listItem);
        });
    })
    .catch((error) => {
        console.error("Error loading chats: ", error);
    });
}


function loadMessages(chatId) {
    console.log("Loading messages for chat:", chatId);
    currentChatId = chatId;

    var messagesContainer = document.getElementById("messages");
    messagesContainer.innerHTML = '';

    var messagesCollection = db.collection("chats").doc(chatId).collection("messages");

    messagesCollection
        .orderBy("timestamp")
        .get()
        .then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
                var messageData = doc.data();
                var timestamp = messageData.timestamp instanceof firebase.firestore.Timestamp ?
                    messageData.timestamp.toDate() : new Date();

                var li = createMessageElement(messageData, timestamp);
                messagesContainer.appendChild(li);
            });
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        })
        .catch(function (error) {
            console.error("Error loading messages: ", error);
        });
}

function updateSelectedChat(newChatId) {
    const chatsList = document.getElementById('chats');

    const previousSelectedChat = chatsList.querySelector('.selected-chat');
    if (previousSelectedChat) {
        previousSelectedChat.classList.remove('selected-chat');
    }

    const newlySelectedChat = chatsList.querySelector(`[data-chat-id="${newChatId}"]`);
    if (newlySelectedChat) {
        newlySelectedChat.classList.add('selected-chat');
    }

    currentChatId = newChatId;
}

function addMessageToChat() {
    const messageInput = document.getElementById("message-input");
    const messageText = messageInput.value.trim();

    if (!chatId || !messageText || !sender) {
        console.error("Invalid parameters for adding a message.");
        return;
    }

    if (message.length > 256) {
        alert("Message is too long. Please keep it within 256 characters.");
        return;
    }

    const timestamp = firebase.firestore.FieldValue.serverTimestamp();

    const messagesCollection = db.collection("chats").doc(chatId).collection("messages");

    messagesCollection.add({
        text: messageText,
        sender: currentUser.displayName,
        timestamp: timestamp,
    })
  .then(function(docRef) {
      console.log("Message added successfully! Document ID: ", docRef.id);

      const messagesContainer = document.getElementById("messages");
      /*const li = createMessageElement({
          sender: sender,
          text: messageText,
          timestamp: timestamp,
      });
        */
      const li = `${sender}: ${messageText}`
      messagesContainer.appendChild(li);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
      loadMessages(currentChatId);
  })
  .catch(function(error) {
      console.error("Error adding message: ", error);
      alert("Failed to send message. Please try again.");
  });
}


function createMessageElement(messageData, timestamp) {
    var messageElement = document.createElement("li");
    messageElement.className = 'message';

    var messageHeader = document.createElement('div');
    messageHeader.className = 'message-header';

    var senderElement = document.createElement('div');
    senderElement.className = 'message-sender';
    senderElement.textContent = messageData.sender;

    var timeElement = document.createElement('div');
    timeElement.className = 'message-time';
    timeElement.textContent = formatTimestamp(timestamp);

    messageHeader.appendChild(senderElement);
    messageHeader.appendChild(timeElement);
    messageElement.appendChild(messageHeader);

    var contentElement = document.createElement('div');
    contentElement.className = 'message-content';
    contentElement.textContent = messageData.message;

    messageElement.appendChild(contentElement);

    return messageElement;
}

function formatTimestamp(timestamp) {
    var now = new Date();

    if (isSameDay(timestamp, now)) {
        return 'Today, ' + formatTime(timestamp);
    } else if (isSameDay(timestamp, new Date(now - 864e5))) {
        return 'Yesterday, ' + formatTime(timestamp);
    } else if (timestamp.getFullYear() === now.getFullYear()) {
        var options = { month: 'numeric', day: 'numeric' };
        var datePart = timestamp.toLocaleString(undefined, options);
        var timePart = formatTime(timestamp);
        return datePart + (datePart.includes('/') ? '' : ', ') + timePart;
    } else {
        var options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' };
        return timestamp.toLocaleString(undefined, options);
    }
}

function formatTime(timestamp) {
    var options = { hour: 'numeric', minute: 'numeric' };
    return timestamp.toLocaleTimeString(undefined, options);
}

function isSameDay(date1, date2) {

    return (
        date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
    );
}


function sendMessage() {
    const messageInput = document.getElementById("message-input");
    const message = messageInput.value.trim();

    if (currentUser && currentUser.displayName && message !== "") {
        if (message.length > 256) {
            alert("Message is too long. Please keep it within 256 characters.");
            return;
        }

        const timestamp = firebase.firestore.FieldValue.serverTimestamp();

        const messagesCollection = db.collection("chats").doc(currentChatId).collection("messages");

        messagesCollection.add({
            sender: currentUser.displayName,
            message: message,
            timestamp: timestamp,
        })
        .then(function(docRef) {
            console.log("Message sent successfully! Document ID: ", docRef.id);

            const messagesContainer = document.getElementById("messages");
            const li = createMessageElement({
                sender: currentUser.displayName,
                message: message
            }, );

            messagesContainer.appendChild(li);

            messageInput.value = "";

            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        })
        .catch(function(error) {
            console.error("Error sending message: ", error);
        });
    }
}



function openNewChat() {
    document.getElementById("new-chat_overlay").style.display = "flex";
}

function closeNewChat() {
    document.getElementById("new-chat_overlay").style.display = "none";
}

function createChat() {
    const db = firebase.firestore();
    const chat_name = document.getElementById("new-chat_name").value;
    const chatsList = document.getElementById('chats');

    if (!chat_name.trim()) {
        alert("Please enter a chat name.");
        return;
    }

    const timestamp = firebase.firestore.FieldValue.serverTimestamp();
    let newChatId;
    chat_color = getRandomColor()

    db.collection("chats").add({
        name: chat_name,
        created_time: timestamp,
        created_by: currentUser.displayName,
        color: chat_color,
    })
  .then(function(docRef) {
      newChatId = docRef.id;

      console.log("Chat added successfully!", newChatId);

      const messagesCollection = db.collection("chats").doc(newChatId).collection("messages");

      messagesCollection.add({
          message: `${currentUser.displayName} created this chat.`,
          sender: "System",
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });

      var chat_letter = getFirstLetter(chat_name);

      const chatImage = document.createElement('i');
      chatImage.classList.add('fas', 'fa-solid', 'fa-' + chat_letter.toLowerCase());

      const listItem = document.createElement('li');

      chatImage.style.backgroundColor = chat_color;
      document.getElementById("new-chat_name").value = "";

      listItem.appendChild(chatImage);
      listItem.appendChild(document.createTextNode(` ${chat_name}`));
      listItem.setAttribute('data-chat-id', newChatId);

      listItem.id = newChatId
      listItem.onclick = function() {
          loadMessages(newChatId);
          updateSelectedChat(newChatId);
      };

      chatsList.appendChild(listItem);
      closeNewChat();
      loadMessages(newChatId);
      updateSelectedChat(newChatId);
  })
  .catch(function(error) {
      console.error("Error adding chat: ", error);
      alert("Something went wrong. Please try again.")
  });
}

function openSettings() {
    document.getElementById("settings_overlay").style.display = "flex";
}

function closeSettings() {
    document.getElementById("settings_overlay").style.display = "none";
}

function showSection(sectionId, ID) {
    document.getElementById('profile-section').style.display = 'none';
    document.getElementById('settings-profile-menu-item').style = 'background-color: transparent;';
    document.getElementById('authentication-section').style.display = 'none';
    document.getElementById('settings-auth-menu-item').style = 'background-color: transparent;';
    document.getElementById('theme-section').style.display = 'none';
    document.getElementById('settings-theme-menu-item').style = 'background-color: transparent;';
    document.getElementById('danger-section').style.display = 'none';
    document.getElementById('settings-danger-menu-item').style = 'background-color: transparent;';

    document.getElementById(sectionId + '-section').style.display = 'block';
    document.getElementById(ID).style = 'background-color: #ccc;';

}
function logout() {
    firebase.auth().signOut()
    .then(function () {
        console.log('User signed out');

    })
    .catch(function (error) {
        console.error('Error during logout:', error);
    });
}



window.onload = loadChats();

document.getElementById("send-button").addEventListener("click", function () {
    sendMessage();
});
