import React from 'react';
import {
  FormGroup, FormControl, Glyphicon, InputGroup
} from 'react-bootstrap';

class Home extends React.Component {

  constructor() {
    super();
    this.state = {
      room: ""
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleChange(e) {
    this.setState({
      room: e.target.value
    })
  }

  handleClick() {
    const room = this.state.room.trim();
    if(!room) return;
    this.setState({
      room: ""
    });
    this.props.history.push(`/room/${room}`)
  }

  render() {
    return (
      <div>
        <FormGroup>
          <InputGroup>
            <FormControl type="text" value={this.state.room}
              onChange={this.handleChange}
              onKeyDown={e => {
                if (e.which == 13 || e.keyCode == 13) {
                  this.handleClick();
                }
              }}
              placeholder="Join or create a room"
              autoFocus={true}>
            </FormControl>
            <InputGroup.Addon onClick={this.handleClick} className="handCursor"><Glyphicon glyph="log-in" /></InputGroup.Addon>
          </InputGroup>
        </FormGroup>
      </div>
    )
  }
}

export default Home;