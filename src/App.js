import React, { Component } from 'react';

import './App.css';
import CreateCompMenu from './Components/CreateCompMenu.js';
import Store from './Components/Store.js';
import MenuHeader from './Components/MenuHeader.js';
import Provider from './context/Provider.js';
import ListCompetitors from './Components/ListCompetitors.js';
import ListTournirs from './Components/ListTournirs';

/*
import logo from './logo.svg';
let script = document.createElement('script');
script.src = 'http://code.jquery.com/jquery-1.11.0.min.Components';
script.type = 'text/javascript';
document.getElementsByTagName('head')[0].appendChild(script);*/

//var store = new Store();
class App extends Component {
    constructor(){
        super();
        this.store = new Store();
        this.state={
            page:'CreateCompMenu',
        };
        this.routes = {
            'ListCompetitors': {
                component: ListCompetitors,
            },
            'ListTournirs': {
                component: ListTournirs,
            },
            'CreateCompMenu': {
                component: CreateCompMenu,
            },
        };
    }
    changeShow(num){
        switch (num){
            case 'Соревнующиеся': this.setState({page:'ListCompetitors'}); break;
            case 'Турниры': this.setState({page:'ListTournirs'}); break;
            case 'Соревнование': this.setState({page:'CreateCompMenu'}); break;
            case 'Раунды': break;
        }
    }
  render() {
        let config = this.routes[this.state.page];
        let PageComponent = config.component;
    return (
        <Provider store={this.store}>
            <div className="App">
                <MenuHeader changeShow={this.changeShow.bind(this)}/>
                <main className={'main-container'}>
                    <PageComponent/>
                </main>
            </div>
        </Provider>
    );
  }
}

export default App;

/*<img src={logo} className="App-logo" alt="logo" />
<CompetitionChart data={getGraphData(this.props.store, this.state.currentTournamentId)}/>*/