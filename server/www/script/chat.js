let textcontent;
let send;
window.addEventListener('load', () => {
    textcontent = document.querySelector('#textcontent');
    send = document.querySelector('#send');
    const valueListener = () => {
        let v = textcontent.value;
        v = (v || '').trim();
        if (v && v.length > 0) {
            send.classList.add('ready');
        }
        else
            send.classList.remove('ready');
    };
    const sendListener = () => {
        let v = textcontent.value;
        v = (v || '').trim();
        if (v && v.length > 0) {
            sendMessage(v);
            textcontent.value = '';
            valueListener();
        }
    };
    textcontent.addEventListener('input', valueListener);
    textcontent.addEventListener('change', valueListener);
    textcontent.addEventListener('keydown', (ev) => {
        if (ev.key === 'Enter') {
            if (!ev.shiftKey && ev.key === 'Enter') {
                ev.preventDefault();
                sendListener();
            }
        }
    });
    send.addEventListener('click', sendListener);
    let chatbox = document.querySelector('div.chatbox');
    chatbox.addEventListener('wheel', () => {
        let childrenHeight = 0;
        let childrenCount = chatbox.childElementCount;
        for (let i = 0; i < childrenCount; i++) {
            let child = chatbox.children.item(i);
            if (child) {
                childrenHeight += child.getBoundingClientRect().height + 16; // plus margin-top
            }
        }
        _potentialScrollTop = childrenHeight - chatbox.getBoundingClientRect().height - chatbox.scrollTop;
    });
});
let _socket = new WebSocket('ws://' + location.host + '/');
let _clientID = '';
let match = location.search.match(/(?:name=)([a-z_][a-z\d_-]{1,18}[a-z\d_])/i);
let _clientName = match ? match[1] : 'unknown';
if (_clientName === 'unknown')
    location.href = '/';
let _messageTemp = '';
_socket.addEventListener('open', () => {
    console.log('socket ready');
});
_socket.addEventListener('message', (ev) => {
    let d = ev.data;
    if (!d)
        return void 0;
    let data = JSON.parse(d);
    if (data.control === 0) {
        // receive new message
        let m = data.message;
        let n = data.clientName;
        let i = data.clientID;
        incomingMessage(n, m, i);
        if (_potentialScrollTop === 0) {
            scrollToChatBottom();
        }
    }
    if (data.control === 1) {
        _clientID = data.clientID;
        _socket.send(JSON.stringify({
            control: 2,
            clientName: _clientName
        }));
    }
    if (data.control === 2) {
        _clientName = data.clientName;
        systemMessage('Welcome to the new session, ' + _clientName);
        scrollToChatBottom();
        document.querySelector('#textcontent').removeAttribute('disabled');
    }
    if (data.control === 3) {
        outgoingMessage(_clientName, _messageTemp, _clientID);
        _messageTemp = '';
        scrollToChatBottom();
    }
    if (data.control === 4) {
        let name = data.clientName;
        systemMessage(`${name} joins the chat`);
        if (_potentialScrollTop === 0) {
            scrollToChatBottom();
        }
    }
    if (data.control === 5) {
        // someone left the chat
        let name = data.clientName;
        systemMessage(`${name} left the chat`);
        if (_potentialScrollTop === 0)
            scrollToChatBottom();
    }
});
function sendMessage(v) {
    if (_socket.readyState === WebSocket.OPEN) {
        _messageTemp = v;
        _socket.send(JSON.stringify({
            control: 0,
            from: _clientID,
            message: v
        }));
    }
}
let _potentialScrollTop = 0;
function incomingMessage(name, msg, id) {
    /**
     * .message-line.incoming(data-sender='abcd3f22')
                        .message
                            image.avatar(data-avatar='1' src='/asset/home.png')
                            .content
                                p Hello
                                p This is David
     */
    let message_line = document.createElement('div');
    message_line.classList.add('message-line', 'incoming');
    message_line.setAttribute('data-sender', id);
    let message = document.createElement('div');
    message.classList.add('message');
    let image = document.createElement('img');
    image.classList.add('avatar');
    image.setAttribute('data-avatar', '1');
    image.setAttribute('src', '/asset/avatar.png');
    message.appendChild(image);
    let n = document.createElement('span');
    n.classList.add('name');
    n.textContent = name;
    message.appendChild(n);
    let content = document.createElement('div');
    content.classList.add('content');
    let ps = msg.split('\n');
    ps.map(p => {
        let pg = document.createElement('p');
        pg.textContent = p;
        content.appendChild(pg);
    });
    message.appendChild(content);
    message_line.appendChild(message);
    document.querySelector('main section.chat div.chatbox').appendChild(message_line);
}
function outgoingMessage(name, msg, id) {
    /**
     * .message-line.incoming(data-sender='abcd3f22')
                        .message
                            image.avatar(data-avatar='1' src='/asset/home.png')
                            .content
                                p Hello
                                p This is David
     */
    let message_line = document.createElement('div');
    message_line.classList.add('message-line', 'outgoing');
    message_line.setAttribute('data-sender', id);
    let message = document.createElement('div');
    message.classList.add('message');
    let image = document.createElement('img');
    image.classList.add('avatar');
    image.setAttribute('data-avatar', '1');
    image.setAttribute('src', '/asset/avatar.png');
    message.appendChild(image);
    let n = document.createElement('span');
    n.classList.add('name');
    n.textContent = name;
    message.appendChild(n);
    let content = document.createElement('div');
    content.classList.add('content');
    let ps = msg.split('\n');
    ps.map(p => {
        let pg = document.createElement('p');
        pg.textContent = p;
        content.appendChild(pg);
    });
    message.appendChild(content);
    message_line.appendChild(message);
    document.querySelector('main section.chat div.chatbox').appendChild(message_line);
}
function systemMessage(info) {
    let message_line = document.createElement('div');
    message_line.classList.add('message-line', 'info');
    let infospan = document.createElement('span');
    infospan.textContent = info;
    message_line.appendChild(infospan);
    document.querySelector('main section.chat div.chatbox').appendChild(message_line);
}
function scrollToChatBottom() {
    // should be optmised if there are thounds of messages.
    let chatbox = document.querySelector('div.chatbox');
    let childrenHeight = 0;
    let childrenCount = chatbox.childElementCount;
    for (let i = 0; i < childrenCount; i++) {
        let child = chatbox.children.item(i);
        if (child) {
            childrenHeight += child.getBoundingClientRect().height + 16; // plus margin-top
        }
    }
    if (childrenHeight > chatbox.getBoundingClientRect().height && chatbox.scrollTop < childrenHeight) {
        let scrollHeight = childrenHeight - chatbox.getBoundingClientRect().height - chatbox.scrollTop;
        _potentialScrollTop = scrollHeight;
        let scrollBy = .75;
        let scrolled = 0;
        let animationFrameValues = new Array(0);
        while (scrolled <= scrollHeight * 0.75) {
            scrollBy = scrollBy * 1.22;
            let frameValue = Math.floor(scrollBy);
            animationFrameValues.push(frameValue);
            scrolled += frameValue;
        }
        while (scrolled < scrollHeight) {
            scrollBy = scrollBy / 1.18;
            scrollBy = scrollBy < 1 ? 1 : scrollBy;
            let frameValue = Math.floor(scrollBy);
            animationFrameValues.push(frameValue);
            scrolled += frameValue;
        }
        let scrollAnimation = (index) => {
            window.requestAnimationFrame(() => {
                chatbox.scrollBy(0, animationFrameValues[index]);
                scrollAnimation(index + 1);
            });
        };
        scrollAnimation(0);
        _potentialScrollTop = 0;
    }
}
