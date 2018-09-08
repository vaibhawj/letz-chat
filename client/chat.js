import React from 'react';

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
        <div className="viewMsg row">
          <ul style={{ listStyle: 'none' }}>
            {
              this.state.messages.map((m, id) => <li key={id}>{m}</li>)
            }
          </ul>
        </div>
        <div className="sendMsg row">
          <div className="col-sm-10">
            <input type="text" value={this.state.typedMessage} onChange={this.handleTypedMessageChange} className="myText"></input>
          </div>
          <div className="col-sm-2 sendBtn">
            <a href="#" onClick={this.handleSendClick}>
              <span className="glyphicon glyphicon-send"></span>
            </a>
          </div>
        </div>
      </div>
    )
  }
}
module.exports = Chat;