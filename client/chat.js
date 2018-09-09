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
  }

  componentDidMount() {
    const roomName = window.location.pathname.split('/')[2];
    this.ws = new WebSocket(`ws://${window.location.host}/chat/${roomName}`);
    this.ws.onmessage = function (evt) {
      const receivedMsg = JSON.parse(evt.data);
      const currentMessages = this.state.messages;
      currentMessages.push(receivedMsg);
      this.setState({
        messages: currentMessages
      });
      $('.viewMsg').animate({ scrollTop: $('.viewMsg').prop("scrollHeight") });
    }.bind(this);

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
                placeholder="Type your message...">
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