const webSocked = new WebSocket('wss://echo-ws-service.herokuapp.com');
let connection = false;

const feldNode = document.querySelector('.feld-chat');
const messageNode = document.querySelector('.message');
const sendNode = document.querySelector('.send');
const geoNode = document.querySelector('.geo');

webSocked.onopen = function(evt) {
  const connect = document.createElement('div');
  connect.innerHTML = 'Соединение с сервером установлено';
  connect.classList.add('connect');
  feldNode.appendChild(connect);
  connection = true;  
}

webSocked.onclose = function(evt) {
  const closeconnect = document.createElement('div');
  closeconnect.innerHTML = 'Сединение с сервером закрыто';
  closeconnect.classList.add('closeconnect');
  feldNode.appendChild(closeconnect);
  connection = false;
}

webSocked.onerror = function(evt) {
  const errorConnect = document.createElement('div');
  errorConnect.innerHTML = 'Ошибка соединения';
  errorConnect.classList.add('errorConnect');
  feldNode.appendChild(errorConnect);
  connection = false;
}

function addMessage(msg, from){
    const divMsg = document.createElement('div');
    const message = `<p class="msg">${msg}</p>`;
    divMsg.classList.className = '';
    divMsg.classList.add(from);
    divMsg.innerHTML = message;
    feldNode.appendChild(divMsg);
    // feldNode.scrollTop = feldNode.scrollHeight;
}

webSocked.onmessage = function(evt){
    if (!evt.data.startsWith('https://www.openstreetmap.org')) {
        addMessage(evt.data, 'server');
    }
};

sendNode.addEventListener('click', () => {
    const textInput = messageNode.value;
    if (textInput){
        addMessage(textInput, 'client');
        document.querySelector('.message').value = '';
        webSocked.send(textInput);
    }
});

geoNode.addEventListener('click', () => {    
    if (connection) {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
                const {coords} = position;
                const geoLink = `https://www.openstreetmap.org/#map=14/${coords.latitude}/${coords.longitude}`;
                const geoLinkMessage = `<a href="${geoLink}">Гео-локация</a>`;
                addMessage(geoLinkMessage, 'client');
                webSocked.send('Широта: ' + coords.latitude + ',' + '\n Долгота: ' + coords.longitude)
                console.log(position)
            })
        }
    }
});