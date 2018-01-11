import React, { Component } from 'react';

import './App.css';
import CreateCompMenu from './Components/CreateCompMenu.js';
import Store from './Components/Store.js';
import MenuHeader from './Components/MenuHeader.js';
import Provider from './context/Provider.js';
import ListCompetitors from './Components/ListCompetitors.js';
import ListTournirs from './Components/ListTournirs';
import Rounds from './Components/Rounds';



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
            'Rounds': {
                component: Rounds,
            },
        };
    }
    changeShow(num){
        switch (num){
            case 'Соревнующиеся': this.setState({page:'ListCompetitors'}); break;
            case 'Турниры': this.setState({page:'ListTournirs'}); break;
            case 'Соревнование': this.setState({page:'CreateCompMenu'}); break;
            case 'Раунды': this.setState({page:'Rounds'}); break;
        }
    }
  render() {
        let config = this.routes[this.state.page];
        let PageComponent = config.component;
    return (
		<div>
			<Provider store={this.store}>
				<div className="App">
					<MenuHeader changeShow={this.changeShow.bind(this)}/>
					<main className={'main-container'}>
						<PageComponent/>
					</main>
				</div>
			</Provider>
		</div>
    );
  }
}

export default App;