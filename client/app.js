
function apiCall(url, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');

    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(JSON.parse(xhr.responseText));
        } else {
          reject(xhr.statusText);
        }
      }
    };

    xhr.onerror = () => reject(xhr.statusText);

    if (data) {
      xhr.send(JSON.stringify(data));
    } else {
      xhr.send();
    }
  });
}

function getAPIUrl() {
  return "http://" + window.chatbotServer + "/api/bot/eligibility?clientId=" + window.chatbotData.client_id + "&botId=" + window.chatbotData.bot_id;

}

function checkBotEligibility() {
  apiCall(getAPIUrl(), 'GET').then((response) => {
    if (response.status === "200") {
      window.addChatWindow();
      setTimeout(() => {
        initBot();
      }, 300);
    } else {
      console.log("Bot not eligible to chat:", response);
    }
  }).catch((error) => {
    console.log("Error:", error);
  });
}


let socket;
let chatBtn, chatWindow, closeChat, chatInput, sendMessage, chatContent, sizeBtn, botStatus;


function initBot() {
  chatBtn = document.getElementById("chatBtn");
  chatWindow = document.getElementById("chatWindow");
  sizeBtn = document.getElementById("sizeBtn");
  closeChat = document.getElementById("closeChat");
  chatInput = document.getElementById("chatInput");
  sendMessage = document.getElementById("sendMessage");
  chatContent = document.getElementById("chatContent");
  chatContent = document.getElementById("chatContent");
  botStatus = document.getElementById("botStatus");


  sizeBtn.addEventListener("click", (event) => {
    chatWindow.classList.toggle("fullscreen");

    if (event.currentTarget.getElementsByTagName("i")[0].classList.contains("fa-window-maximize")) {
      event.currentTarget.getElementsByTagName("i")[0].classList.remove("fa-window-maximize")
      event.currentTarget.getElementsByTagName("i")[0].classList.add("fa-window-minimize")
    } else {
      event.currentTarget.getElementsByTagName("i")[0].classList.add("fa-window-maximize")
      event.currentTarget.getElementsByTagName("i")[0].classList.remove("fa-window-minimize")
    }
  });

  chatBtn.addEventListener("click", () => {
    if (!chatWindow.classList.contains("open")) {
      socket = io("ws://" + window.chatbotServer);
      chatWindow.classList.add("open");
      chatBtn.classList.remove("open");
      chatBtn.classList.remove('pulse');
      attachSocketEvents(socket);
    } else {
      closeChatWindow();
    }

  });

  closeChat.addEventListener("click", closeChatWindow);

  sendMessage.addEventListener("click", () => {
    const message = chatInput.value.trim();
    if (message.trim()) {
      addMessage(message, 'user');
      chatInput.value = "";
      botMessageLoader(false);
      socket.emit("room", { userMessage: message });
    }
  });

  chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && chatInput.value.trim()) {
      sendMessage.click();
    }
  });
}

function attachSocketEvents() {
  socket.on("connect", () => {
    console.log("Socket connected successfully");
    if (socket.botSocketConnected) {
      addMessage("I'm back! Thanks for your patience.", 'system');
    }
    socket.emit("auth", { botId: window.chatbotData.bot_id, clientId: window.chatbotData.client_id, reconnect: socket.botSocketConnected, kb: window.kb }, (response) => {
      if (response.status === "success") {
        console.log("Authentication successful");
        socket.botSocketConnected = true;
        chatContent.innerHTML = "";
        botStatus.classList.remove('offline');
        botStatus.classList.add('online');
        botMessageLoader(true);
      } else {
        console.log("Authentication failed:", response);
        addMessage("Not able to help you right now!", 'system');
        socket.close();
      }
    })
  });

  socket.on("reconnect", () => {
    console.log("Socket reconnect");
  });


  socket.on("disconnect", () => {
    console.log("Socket disconnected");
    botStatus.classList.add('offline');
    botStatus.classList.remove('online');
    addMessage("Sorry, I am having trouble connecting. Retrying now, please wait.", 'system');
  });

  socket.on("error", (error) => {
    console.log("Socket error:", error);
  });

  socket.on("systemMessage", (reply) => {
    botMessageLoader(true);
    console.log("System message:", reply);
    addMessage(reply.botMessage, 'system', reply.options);
  });
}

function botMessageLoader(hide) {
  if (hide) {

    const loader = document.querySelector(".bot-message-loading");
    if (loader) {
      loader.parentElement.remove();
    }
  } else {
    const messageContainer = document.createElement("div");
    messageContainer.classList.add("message", `system-message`);

    const loaderDiv = document.createElement("div");
    loaderDiv.classList.add("bot-message-loading");

    messageContainer.appendChild(loaderDiv);

    chatContent.appendChild(messageContainer);
    chatContent.scrollTop = chatContent.scrollHeight;
  }
}

function addMessage(message, sender, options) {
  const messageContainer = document.createElement("div");
  messageContainer.classList.add("message", `${sender}-message`);
  // if (sender === "system") {
  //   messageContainer.classList.add("typewriter");
  // }

  const messageText = document.createElement("div");
  messageText.classList.add("message-text");
  messageText.textContent = message;
  messageContainer.appendChild(messageText);
  if (options) {
    const optionsContainer = document.createElement("div");
    optionsContainer.classList.add("options-container");

    options.forEach(option => {
      const optionBtn = document.createElement("button");
      optionBtn.classList.add("option-btn");
      optionBtn.textContent = option.label;
      optionBtn.addEventListener("click", () => {
        addMessage(option.label, 'user');
        botMessageLoader(false);
        socket.emit("room", { userMessage: option.value });
      }, { once: true });

      optionsContainer.appendChild(optionBtn);
    });
    messageContainer.appendChild(optionsContainer);
  }



  chatContent.appendChild(messageContainer);
  chatContent.scrollTop = chatContent.scrollHeight;
}

function closeChatWindow() {
  chatWindow.classList.remove("open");
  chatWindow.classList.remove("fullscreen");
  chatContent.innerHTML = "";
  chatBtn.classList.add("open");
  chatBtn.classList.add('pulse');

  socket.close();
}


checkBotEligibility();




