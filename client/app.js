import React from 'react';
import Chat from './chat';
import Home from './home';
import UserNameModal from './userNameModal';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

class App extends React.Component {

  render() {
    return (
      <Router>
        <div className="container">
          <h2>Letz chat</h2>
          <UserNameModal />
          <Switch>
            <Route exact path="/room/:roomName" component={Chat} />
            <Route component={Home} />
          </Switch>
        </div>
      </Router>
    )
  }
}

export default App;