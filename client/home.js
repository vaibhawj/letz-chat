import React from 'react';

class Home extends React.Component {

  constructor(){
    super();
    this.state = {
      room: ""
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleChange(e){
    this.setState({
      room: e.target.value
    })
  }

  handleClick(){
    const room = this.state.room;
    this.setState({
      room: ""
    });
    this.props.history.push(`/room/${room}`)
  }

  render() {
    return (
      <div>
        <input type="text" onChange={this.handleChange} value={this.state.room}></input><button onClick={this.handleClick}>Join or create a room</button>
      </div>
    )
  }
}

module.exports = Home;