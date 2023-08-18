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

        if (message) {
            const messageObject = {
                message,
                isOwnMessage: true
            };

            ws.send(JSON.stringify(messageObject));
            messageInput.value = "";
        }
    });

    function addMessage(data) {
        const msgHTML = `
            <div class="flex items-end justify-evenly w-fit mb-4 ${data.isOwnMessage ? "my-message" : "others-message"}">   
                <div class="w-12 h-12 m-0 mx-3 bg-no-repeat bg-center bg-cover rounded-full bg-gray"></div> 

                <div class="msg-bubble max-w-[450px] p-[10px] rounded-[15px]">
                    <div class="flex justify-between items-center mb-[10px]">
                        <h4 class="mr-[10px] font-bold">${"Name"}</h4>
                        <div>${new Date().getHours()} : ${new Date().getMinutes()}</div>
                    </div>
            
                    <div>${data.message}</div>
                </div>
            </div>
        `;

        chatMessages.insertAdjacentHTML("beforeend", msgHTML);
        chatMessages.scrollTop += 500;
    }
});
