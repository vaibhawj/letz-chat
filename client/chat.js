import React from 'react';
import {
  FormGroup, FormControl, Glyphicon, InputGroup, Label
} from 'react-bootstrap';
import uuid from 'uuid';
import Notify from 'notifyjs';

const setHeight = () => {
  const windowHeight = window.innerHeight;
  $('.viewMsg').css('min-height', windowHeight - 165);
  $('.viewMsg').css('max-height', windowHeight - 165);
};

// const audio = new Audio('notif.mp3');

const onNotifyShow = () => {
  // audio.play();
  console.log('notifiction shown')
}

const protocol = {
  'https:': 'wss:',
  'http:': 'ws:'
}

class Chat extends React.Component {
  constructor() {
    super();
    this.state = {
      messages: [],
      typedMessage: "",
      myMessages: [],
      population: 0
    }

    this.handleSendClick = this.handleSendClick.bind(this);
    this.handleTypedMessageChange = this.handleTypedMessageChange.bind(this);
    this.setupWebSocket = this.setupWebSocket.bind(this);
  }

  setupWebSocket() {
    const roomName = window.location.pathname.split('/')[2];
    this.ws = new WebSocket(`${protocol[window.location.protocol]}//${window.location.host}/chat/${roomName}`);
    this.ws.onmessage = (evt) => {
      const receivedMsg = JSON.parse(evt.data);
      if(receivedMsg.hasOwnProperty('ping')) {
        return;
      }
      if (receivedMsg.hasOwnProperty('population')) {
        this.setState({ population: receivedMsg.population })
        return;
      }
      const currentMessages = this.state.messages;
      currentMessages.push(receivedMsg);
      this.setState({
        messages: currentMessages
      });
      $('.viewMsg').animate({ scrollTop: $('.viewMsg').prop("scrollHeight") });

      if (!this.state.myMessages.includes(receivedMsg.id)) {
        const notification = new Notify(`Room ${roomName}`, {
          body: receivedMsg.message,
          notifyShow: onNotifyShow
        });
        notification.show();
      }
    };

    this.ws.onclose = (evt) => {
      setTimeout(this.setupWebSocket, 1000);
    };
  }

  componentDidMount() {
    this.setupWebSocket();
    setHeight();
    window.onresize = () => setHeight();

    if (Notify.needsPermission && Notify.isSupported()) {
      Notify.requestPermission();
    }
  }

  handleTypedMessageChange(e) {
    this.setState({
      typedMessage: e.target.value
    })
  }

  handleSendClick() {
    const message = this.state.typedMessage.trim();
    if (!message) return;
    const id = uuid();
    this.ws.send(JSON.stringify({ message, id }));
    const selfMessageIds = this.state.myMessages;
    selfMessageIds.push(id);
    this.setState({
      typedMessage: "",
      selfMessageIds
    });
  }

  render() {
    return (
      <div>
        <p className="population"><i className="fas fa-users"></i> {this.state.population}</p>
        <ul className="viewMsg list-group">
          {
            this.state.messages.map((m, id) => {
              const align = this.state.myMessages.includes(m.id) ? 'left' : 'right';
              return <li className="well well-sm" style={{ textAlign: `${align}` }} key={id}>{m.message}</li>
            })
          }
        </ul>
        <div>
          <FormGroup>
            <InputGroup>
              <FormControl type="text" value={this.state.typedMessage}
                onChange={this.handleTypedMessageChange}
                onKeyDown={e => {
                  if (e.which == 13 || e.keyCode == 13) {
                    this.handleSendClick();
                  }
                }}
                placeholder="Type your message..."
                autoFocus={true}>
              </FormControl>
              <InputGroup.Addon onClick={this.handleSendClick} className="handCursor"><Glyphicon glyph="send" /></InputGroup.Addon>
            </InputGroup>
          </FormGroup>
        </div>
      </div>
    )
  }
}
export default Chat;