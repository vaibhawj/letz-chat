import React from 'react';
import Chat from './chat';
import Home from './home';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

class App extends React.Component {

  render() {
    return (
      <Router>
        <div>
          Chat App
        <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/room/:roomName" component={Chat} />
          </Switch>
        </div>
      </Router>
    )
  }
}

module.exports = App;