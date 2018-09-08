import React from 'react';
import {
  Button, FormGroup, FormControl, ButtonToolbar, ToggleButton,
  ToggleButtonGroup, Glyphicon, InputGroup, Alert, Collapse
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
        <div>
          <ul style={{ listStyle: 'none' }}>
            {
              this.state.messages.map((m, id) => <li key={id}>{m}</li>)
            }
          </ul>
        </div>
        <div>
          <div className="row">
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
                <InputGroup.Addon onClick={this.handleSendClick} style={{cursor: "pointer"}}><Glyphicon glyph="send" /></InputGroup.Addon>
              </InputGroup>
            </FormGroup>
          </div>

          <div>

          </div>
        </div>
      </div>
    )
  }
}
module.exports = Chat;