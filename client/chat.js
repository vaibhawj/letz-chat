import React from 'react';
import {
  FormGroup, FormControl, Glyphicon, InputGroup
} from 'react-bootstrap';
import uuid from 'uuid';

const setHeight = () => {
  const windowHeight = window.innerHeight;
  $('.viewMsg').css('min-height', windowHeight - 150);
  $('.viewMsg').css('max-height', windowHeight - 150);
};

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
      myMessages: []
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
      const currentMessages = this.state.messages;
      currentMessages.push(receivedMsg);
      this.setState({
        messages: currentMessages
      });
      $('.viewMsg').animate({ scrollTop: $('.viewMsg').prop("scrollHeight") });
    };

    this.ws.onclose = (evt) => {
      setTimeout(this.setupWebSocket, 1000);
    };
  }

  componentDidMount() {
    this.setupWebSocket();
    setHeight();
    window.onresize = () => setHeight();
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
module.exports = Chat;