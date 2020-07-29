// index.js
window.onload = () => {
    // connect to socket server through WebSocket API
    const socketConnection = new WebSocket('ws://www.localhost:3000/');
    // when connection opens, log it to the console
    socketConnection.onopen = (connectionEvent) => {
        console.log('websocket connection is open', connectionEvent);
    };

    // when a message is received from the socket connection,
    // the message will contain the id of a button that the other player clicked
    socketConnection.onmessage = (messageObject) => {
        console.log(messageObject.data);
        //   // if the button is unclicked, changes its text to "O", and disable the button
        //   const buttonClicked = document.getElementById(messageObject.data);
        //   if (buttonClicked.innerHTML === '-') {
        //     buttonClicked.innerHTML = 'O';
        //     buttonClicked.disabled = true;
        //   }
    };

    // an event listener to log any errors with the socket connection.
    socketConnection.onerror = (error) => {
        console.log('socket error: ', error);
    };

    // put an event listener on every button that changes the text to "X",
    // disables the button, and sends a message through the socket connection
    // with the id of the clicked button
    const collectionOfButtons = document.querySelectorAll('button');
    collectionOfButtons.forEach((buttonElement) => {
        buttonElement.addEventListener('click', (event) => {
            // set the target's value to "X" and disable the button
            event.target.innerHTML = 'X';
            event.target.disabled = true;

            // send message (of the clicked button's id) through the socket connection
            socketConnection.send(event.target.id);
        });
    });
};