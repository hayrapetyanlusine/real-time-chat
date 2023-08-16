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
        console.log(event);
    });

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        ws.send(JSON.stringify({
            message: messageInput.value,
            time: new Date()
        }));

        messageInput.value = "";
    });

});
