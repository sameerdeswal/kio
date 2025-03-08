function initialiseBot(data) {
    setTimeout(() => {
        console.log(data);
        addStylesheets("http://" + data.bot_endpoint);
        addSocketJs();
        setTimeout(() => {
            addAppJs("http://" + data.bot_endpoint);
            window.addChatWindow = function () {
                addChatWindowInternal(data);
            };
            window.chatbotServer = data.bot_endpoint
            window.chatbotData = data
        }, 1000);

    }, 2000);
};

function addAppJs(url) {
    const appScript = document.createElement('script');
    appScript.src = url + '/js/app.min.js';
    appScript.defer = "";
    document.body.appendChild(appScript);
}

function addSocketJs() {
    const socketJs = document.createElement('script');
    socketJs.src = 'https://cdnjs.cloudflare.com/ajax/libs/socket.io/4.3.2/socket.io.js';
    document.body.appendChild(socketJs);
}

function addStylesheets(url) {
    // Create and append Font Awesome stylesheet
    const fontAwesomeLink = document.createElement('link');
    fontAwesomeLink.rel = 'stylesheet';
    fontAwesomeLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css';
    document.head.appendChild(fontAwesomeLink);

    // Create and append Google Fonts stylesheet
    const googleFontsLink = document.createElement('link');
    googleFontsLink.rel = 'stylesheet';
    googleFontsLink.href = 'https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&display=swap';
    document.head.appendChild(googleFontsLink);

    const chatbotStyleLing = document.createElement('link');
    chatbotStyleLing.rel = 'stylesheet';
    chatbotStyleLing.href = url + '/css/style.css';
    document.head.appendChild(chatbotStyleLing);
}

function addChatWindowInternal(data) {
    const chatBtn = document.createElement('button');
    chatBtn.classList.add('chat-btn', 'open');
    if (data.pulsating) {
        chatBtn.classList.add('pulse');
    }
    chatBtn.classList.add(data.position || "bottom-left")
    chatBtn.id = 'chatBtn';

    const icon = document.createElement('i');
    icon.classList.add('fa-solid', 'fa-robot');
    chatBtn.appendChild(icon);

    const chatWindow = document.createElement('div');
    chatWindow.id = 'chatWindow';
    chatWindow.classList.add('chat-window');
    chatWindow.classList.add(data.position || "bottom-left")

    window.changeBotPosition = function (position) {
        chatBtn.classList.remove("bottom-left");
        chatBtn.classList.remove("top-left");
        chatBtn.classList.remove("bottom-right");
        chatBtn.classList.remove("top-right");

        chatWindow.classList.remove("bottom-left");
        chatWindow.classList.remove("top-left");
        chatWindow.classList.remove("bottom-right");
        chatWindow.classList.remove("top-right");

        chatBtn.classList.add(position);
        chatWindow.classList.add(position);

    }

    const chatHeader = document.createElement('div');
    chatHeader.classList.add('chat-header');

    const chatAgent = document.createElement('div');
    chatAgent.classList.add('chat-agent');

    const icon1 = document.createElement('i');
    icon1.classList.add('fa-solid', 'fa-robot');
    chatAgent.appendChild(icon1);

    const statusDiv = document.createElement('div');
    statusDiv.id = 'botStatus';
    statusDiv.classList.add('status-div');
    chatAgent.appendChild(statusDiv);
    const agentDetails = document.createElement('div');
    agentDetails.classList.add('chat-agent-details');

    const agentName = document.createElement('div');
    agentName.textContent = data.name || 'Assistant Bot';
    agentDetails.appendChild(agentName);

    chatAgent.appendChild(agentDetails);
    chatHeader.appendChild(chatAgent);

    const closeBtn = document.createElement('button');
    closeBtn.id = 'closeChat';
    closeBtn.classList.add('close-btn');
    closeBtn.innerHTML = '<i class="fas fa-times"></i>';  // Font Awesome icon

    const headerRightDiv = document.createElement('div');
    // const heartIcon = document.createElement('div');
    // heartIcon.classList.add('heart-icon');
    // sizeBtn.innerHTML = '<i class="fa-regular fa-heart"></i>';
    // heartIcon.title = "Made with ❤️ by Sameer Deswal"
    headerRightDiv.classList.add('header-right');


    const heartIcon = document.createElement('button');
    heartIcon.classList.add('heart-icon');
    heartIcon.title = "Made with ❤️ by Sameer Deswal"
    heartIcon.innerHTML = '<i class="fas fa-heart fa-beat-fade"></i>';



    const sizeBtn = document.createElement('button');
    sizeBtn.id = 'sizeBtn';
    sizeBtn.classList.add('close-btn');
    sizeBtn.innerHTML = '<i class="fa-regular fa-window-maximize"></i>';

    headerRightDiv.appendChild(heartIcon)
    headerRightDiv.appendChild(sizeBtn)
    headerRightDiv.appendChild(closeBtn)

    chatHeader.appendChild(headerRightDiv);

    chatWindow.appendChild(chatHeader);

    const chatBody = document.createElement('div');
    chatBody.classList.add('chat-body');
    chatBody.id = 'chatContent';
    chatWindow.appendChild(chatBody);

    const chatFooter = document.createElement('div');
    chatFooter.classList.add('chat-footer');

    const chatInput = document.createElement('input');
    chatInput.type = 'text';
    chatInput.id = 'chatInput';
    chatInput.placeholder = 'Type here...';
    chatInput.autocomplete = "off";
    chatInput.maxLength = 100;
    chatFooter.appendChild(chatInput);

    const sendMessageBtn = document.createElement('button');
    sendMessageBtn.id = 'sendMessage';
    sendMessageBtn.innerHTML = '<i class="fas fa-paper-plane"></i>';  // Font Awesome icon
    chatFooter.appendChild(sendMessageBtn);

    chatWindow.appendChild(chatFooter);

    // const branding = document.createElement('div');
    // branding.classList.add('branding');
    // branding.textContent = 'Made with ❤️ by Sameer Deswal';
    // chatWindow.appendChild(branding);

    document.body.appendChild(chatBtn);
    document.body.appendChild(chatWindow);
}

window.initialiseBot = initialiseBot