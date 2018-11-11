import React from 'react';
import Popup from "reactjs-popup";
import { withCookies } from 'react-cookie';
import {
  FormGroup, FormControl, Glyphicon, InputGroup
} from 'react-bootstrap';

class UserNameModal extends React.Component {

  constructor() {
    super();
    this.state = {
      uname: ""
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleChange(e) {
    this.setState({
      uname: e.target.value
    })
  }

  handleClick() {
    const uname = this.state.uname.trim();
    if (!uname) return;

    this.props.cookies.set('uname', uname);
  }

  render() {
    return (
      <Popup
        open={!this.props.cookies.get('uname')}
        modal
        closeOnDocumentClick
      >
        <div>
          <FormGroup>
            <InputGroup>
              <FormControl type="text" value={this.state.uname}
                onChange={this.handleChange}
                onKeyDown={e => {
                  if (e.which == 13 || e.keyCode == 13) {
                    this.handleClick();
                  }
                }}
                placeholder="Enter your name.."
                autoFocus={true}>
              </FormControl>
              <InputGroup.Addon onClick={this.handleClick} className="handCursor"><Glyphicon glyph="log-in" /></InputGroup.Addon>
            </InputGroup>
          </FormGroup>
        </div>
      </Popup>
    )
  }
}

export default withCookies(UserNameModal);