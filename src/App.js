import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'
import JudgeTool from './Components/judgeTool';
import Home from './Home';

const App = () => (
  <Router>
    <div>
      <Route exact path="/" component={Home}/>
      <Route path="/pultik" component={JudgeTool}/>
    </div>
  </Router>
)

export default App