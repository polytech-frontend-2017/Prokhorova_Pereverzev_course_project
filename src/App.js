import React, { Component } from 'react';
//import logo from './logo.svg';
import './App.css';
import StartMenu from './js/StartMenu.js';
import Store from './js/Store.js';
import Provider from './context/Provider.js';


var script = document.createElement('script');
script.src = 'http://code.jquery.com/jquery-1.11.0.min.js';
script.type = 'text/javascript';
document.getElementsByTagName('head')[0].appendChild(script);

//var store = new Store();
class App extends Component {
    constructor(){
        super();
        this.store = new Store();
    }
  render() {
      /*<CompetitionChart data={getGraphData(this.props.store, this.state.currentTournamentId)}/>*/
    return (
        <Provider store={this.store}>
            <div className="App">
                <header className="App-header">
                  <h1 className="App-title">Welcome to Competition Manager</h1>
                </header>
                <StartMenu ></StartMenu>
            </div>
        </Provider>
    );
  }
}

export default App;

/*<img src={logo} className="App-logo" alt="logo" />*/