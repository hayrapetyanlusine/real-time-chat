document.addEventListener("DOMContentLoaded", () => {
    const chatMessages = document.getElementById('chat-messages');
    const messageInput = document.getElementById('message-input');
    const form = document.querySelector("form");

    const ws = new WebSocket('ws://localhost:3000');

    ws.addEventListener('open', () => {
        console.log('Connected to WebSocket server');
    });

    ws.addEventListener('error', (error) => {
        console.error('WebSocket Error:', error);
    });

    ws.addEventListener('message', (event) => {
        if (event.data instanceof Blob) {
            reader = new FileReader();

            reader.onload = () => {
                const parseData = JSON.parse(reader.result);

                addMessage(parseData);
            };

            reader.readAsText(event.data);
        } else {
            const parseData = JSON.parse(event.data);

            addMessage(parseData);
        }
    });

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const message = messageInput.value.trim();

        if (message !== "") {
            const messageObject = {
                message,
                time: new Date(),
                isOwnMessage: true
            };

            ws.send(JSON.stringify(messageObject));
            messageInput.value = "";
        }
    });

    function addMessage(data) {
        chatMessages.innerHTML += `<div
            class=${data.isOwnMessage ? "own-message" : "new-message"}>
            ${data.message}
        </div>`;
    }
});
