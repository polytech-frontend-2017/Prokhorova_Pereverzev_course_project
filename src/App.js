import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import JudgeTool from './Components/judgeTool';
import Home from './Home';
import './App.css';
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <Router>
        <div className={'router-div'}>
          <Route exact path="/" component={Home} />
          <Route path="/pultik" component={JudgeTool} />
        </div>
      </Router>
    );
  }
}
export default App;
