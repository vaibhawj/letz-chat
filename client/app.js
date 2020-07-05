import React from 'react';
import { FaGithub } from 'react-icons/fa';

import Chat from './chat';
import Home from './home';
import UserNameModal from './userNameModal';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

const hoc = (Component) => (props) => {
  return (<Component {...props} />);
}

class App extends React.Component {

  render() {
    return (
      <Router>
        <div className="container">
          <div style={{ display: "flex" }}>
            <h2>Letz chat</h2>
            <a style={{ marginTop: "2rem", color: "inherit" }} href="https://github.com/vaibhawj/letz-chat" target="_blank"><FaGithub /></a>
          </div>
          <UserNameModal />
          <Switch>
            <Route exact path="/room/:roomName" component={hoc(Chat)} />
            <Route component={hoc(Home)} />
          </Switch>
        </div>
      </Router>
    )
  }
}

export default App;