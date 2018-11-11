import React from 'react';
import {
  FormGroup, FormControl, Glyphicon, InputGroup
} from 'react-bootstrap';
import Notify from 'notifyjs';
import { withCookies } from 'react-cookie';

const setHeight = () => {
  const windowHeight = window.innerHeight;
  $('.viewMsg').css('min-height', windowHeight - 180);
  $('.viewMsg').css('max-height', windowHeight - 180);
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
      var receivedMsg = JSON.parse(evt.data);
      if (receivedMsg.hasOwnProperty('ping')) {
        return;
      }
      if (receivedMsg.hasOwnProperty('population')) {
        this.setState({ population: receivedMsg.population })
        return;
      }
      const currentMessages = this.state.messages;
      receivedMsg = JSON.parse(receivedMsg)
      currentMessages.push(receivedMsg);
      this.setState({
        messages: currentMessages
      });
      $('.viewMsg').animate({ scrollTop: $('.viewMsg').prop("scrollHeight") });

      if (this.props.cookies.get('uname') !== receivedMsg.sender) {
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
    const value = e.target.value === "\n" ? "" : e.target.value
    this.setState({
      typedMessage: value
    })
  }

  handleSendClick() {
    const message = this.state.typedMessage.trim();
    if (!message) return;
    const sender = this.props.cookies.get('uname') ? this.props.cookies.get('uname') : 'Anon'; 
    this.ws.send(JSON.stringify({ message, sender }));
    this.setState({
      typedMessage: ""
    });
  }

  render() {
    return (
      <div>
        <p className="population"><i className="fas fa-users"></i> {this.state.population}</p>
        <ul className="viewMsg list-group">
          {
            this.state.messages.map((m, id) => {
              return <span key={id}>{m.sender}: <pre className="msg"><li className="well well-sm">{m.message}</li></pre></span>
            })
          }
        </ul>
        <div>
          <FormGroup>
            <InputGroup>
              <FormControl type="text" value={this.state.typedMessage}
                componentClass="textarea"
                onChange={this.handleTypedMessageChange}
                onKeyDown={e => {
                  if (e.which == 13 || e.keyCode == 13) {
                    if (this.state.typedMessage.trim() && !e.shiftKey) {
                      this.handleSendClick();
                    }
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
export default withCookies(Chat);