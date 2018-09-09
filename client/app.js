import React from 'react';
import Chat from './chat';
import Home from './home';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

class App extends React.Component {

  render() {
    return (
      <Router>
        <div className="container">
          <h2>Letz chat</h2>
          <Switch>
            <Route exact path="/room/:roomName" component={Chat} />
            <Route component={Home} />
          </Switch>
          <div className="github">
            <a href="https://github.com/vaibhawj/ws-chat" target="_blank"
              rel="noopener noreferrer">
              <img src="/github.png" className="githubImg" alt="github" />
            </a>
          </div>
        </div>
      </Router>
    )
  }
}

module.exports = App;