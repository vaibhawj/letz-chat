import React from 'react';
import {
  FormGroup, FormControl, ControlLabel, Glyphicon, InputGroup
} from 'react-bootstrap';

class Chat extends React.Component {
  constructor() {
    super();
    this.state = {
      messages: [],
      typedMessage: ""
    }

    this.handleSendClick = this.handleSendClick.bind(this);
    this.handleTypedMessageChange = this.handleTypedMessageChange.bind(this);
  }

  componentDidMount() {
    const roomName = window.location.pathname.split('/')[2];
    this.ws = new WebSocket(`ws://${window.location.host}/chat/${roomName}`);
    this.ws.onmessage = function (evt) {
      const received_msg = evt.data;
      const currentMessages = this.state.messages;
      currentMessages.push(received_msg);
      this.setState({
        messages: currentMessages
      })
    }.bind(this);
  }

  handleTypedMessageChange(e) {
    this.setState({
      typedMessage: e.target.value
    })
  }

  handleSendClick() {
    this.ws.send(this.state.typedMessage);
    this.setState({
      typedMessage: ""
    })
  }

  render() {
    return (
      <div>
        <ul className="list-group">
          {
            this.state.messages.map((m, id) => <li className="list-group-item" key={id}>{m}</li>)
          }
        </ul>
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
            <InputGroup.Addon onClick={this.handleSendClick} style={{ cursor: "pointer" }}><Glyphicon glyph="send" /></InputGroup.Addon>
          </InputGroup>
        </FormGroup>
      </div>
    )
  }
}
module.exports = Chat;