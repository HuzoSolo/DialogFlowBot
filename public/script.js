document.addEventListener('DOMContentLoaded', () => {
    const promptButtons = document.querySelectorAll('.prompt-btn');
    const chatMessages = document.getElementById('chatMessages');
    const userInput = document.getElementById('userInput');
    const sendButton = document.getElementById('sendButton');
    const dfMessenger = document.querySelector('df-messenger');
    
    // Handle prompt buttons
    promptButtons.forEach(button => {
        button.addEventListener('click', () => {
            const prompt = button.getAttribute('data-prompt');
            sendMessage(prompt);
        });
    });

    // Handle user input
    userInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            const message = userInput.value.trim();
            if (message) {
                sendMessage(message);
                userInput.value = '';
            }
        }
    });

    sendButton.addEventListener('click', () => {
        const message = userInput.value.trim();
        if (message) {
            sendMessage(message);
            userInput.value = '';
        }
    });

    // Auto-resize textarea
    userInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
    });

    // Listen for bot responses
    dfMessenger.addEventListener('df-response-received', (event) => {
        const botMessage = event.detail.response.queryResult.fulfillmentText;
        addMessage(botMessage, 'bot');
    });

    function sendMessage(text) {
        // Add user message to UI
        addMessage(text, 'user');
        
        // Send to Dialogflow
        const event = new CustomEvent('df-messenger-send-text', {
            detail: text
        });
        dfMessenger.dispatchEvent(event);
    }

    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        
        const botAvatar = sender === 'bot' ? `
            <div class="bot-avatar">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z"/>
                </svg>
            </div>
        ` : '';
        
        messageDiv.innerHTML = `
            <div class="message-content">
                ${botAvatar}
                <p>${text}</p>
            </div>
        `;
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Add initial bot message
    addMessage('Merhaba! Size nasıl yardımcı olabilirim?', 'bot');
});document.addEventListener('DOMContentLoaded', () => {
    const promptButtons = document.querySelectorAll('.prompt-btn');
    const chatMessages = document.getElementById('chatMessages');
    const userInput = document.getElementById('userInput');
    const sendButton = document.getElementById('sendButton');
    
    // Handle prompt buttons
    promptButtons.forEach(button => {
        button.addEventListener('click', () => {
            const prompt = button.getAttribute('data-prompt');
            sendMessage(prompt);
        });
    });

    // Handle user input
    userInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            const message = userInput.value.trim();
            if (message) {
                sendMessage(message);
                userInput.value = '';
            }
        }
    });

    sendButton.addEventListener('click', () => {
        const message = userInput.value.trim();
        if (message) {
            sendMessage(message);
            userInput.value = '';
        }
    });

    // Auto-resize textarea
    userInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
    });

    function sendMessage(text) {
        // Add user message to UI
        addMessage(text, 'user');
        
        // Send to backend
        fetch('/send-message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: text }),
        })
        .then(response => response.json())
        .then(data => {
            // Add bot response to UI
            addMessage(data.fulfillmentText, 'bot');
        })
        .catch(error => {
            console.error('Error sending message to backend:', error);
        });
    }

    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        
        const botAvatar = sender === 'bot' ? `
            <div class="bot-avatar">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z"/>
                </svg>
            </div>
        ` : '';
        
        messageDiv.innerHTML = `
            <div class="message-content">
                ${botAvatar}
                <p>${text}</p>
            </div>
        `;
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Add initial bot message
    addMessage('Merhaba! Size nasıl yardımcı olabilirim?', 'bot');
});
