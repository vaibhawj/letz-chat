const React = require('react');
const axios = require('axios');

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      messages: [],
      typedMessage: ""
    }
    this.ws = new WebSocket("ws://localhost:3000/chat");
    this.ws.onmessage = function (evt) {
      const received_msg = evt.data;
      const currentMessages = this.state.messages;
      currentMessages.push(received_msg);
      this.setState({
        messages: currentMessages
      })
    }.bind(this);
    this.handleSendClick = this.handleSendClick.bind(this);
    this.handleTypedMessageChange = this.handleTypedMessageChange.bind(this);
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
      <div className="container">
        <h1>Lets chat</h1>
        <section>
          <ul style={{listStyle: 'none'}}>
            {
              this.state.messages.map((m, id) => <li key={id}>{m}</li>)
            }
          </ul>
        </section>
        <section>
          <textarea value={this.state.typedMessage} onChange={this.handleTypedMessageChange} ></textarea>
          <button onClick={this.handleSendClick}>Send</button>
        </section>
      </div>
    )
  }
}
module.exports = App;