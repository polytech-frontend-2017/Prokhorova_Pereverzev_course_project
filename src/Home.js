import React, { Component } from 'react';

import './App.css';
import CreateCompMenu from './Components/CreateCompMenu.js';
import Store from './Components/Store.js';
import MenuHeader from './Components/MenuHeader.js';
import Provider from './context/Provider.js';
import ListCompetitors from './Components/ListCompetitors.js';
import ListTournirs from './Components/ListTournirs';
import Rounds from './Components/Rounds';
import io from 'socket.io-client'
import { USER_CONNECTED, LOGOUT, VERIFY_USER } from './Events'

const socketUrl = "http://93.100.173.116:3231";
class Home extends Component {
    constructor(){
        super();
        this.store = new Store();
        this.state={
            page:'CreateCompMenu',
            socket:null,
            user:null,
            login:'',
            pass:'',
            error:'',
            logout:false,
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
    handlerRegister(e){
        e.preventDefault();
        const socket = io(socketUrl);
        socket.on('connect',()=>{
            console.log("Connected")
        });
        this.setState({socket})
        const {login} = this.state;
        socket.emit(VERIFY_USER,login,this.setUser);

    }
    initSocket=()=>{
        const socket = io(socketUrl);
        socket.on('connect',()=>{
            console.log("Connected")
        });
        this.setState({socket})
    };
    /*
    *Sets the user in state
    * @param user {id:number, name:string}
     */
    setUser=({user,isUser})=> {
        console.log(user,isUser);
        if (isUser) {
            this.setError("User name taken")

        }else{
            const socket = this.state.socket;
            socket.emit(USER_CONNECTED,user);
            this.setState({user:user})
            this.setError("")
        }
    };
    setError=(error)=>{
        this.setState({error})
    };
    logout=()=>{
        const { socket } = this.state;
        socket.emit(LOGOUT);
        this.setState({user:null})

    };
    changeShow(num){
        switch (num){
            case 'Соревнующиеся': this.setState({page:'ListCompetitors'}); break;
            case 'Турниры': this.setState({page:'ListTournirs'}); break;
            case 'Соревнование': this.setState({page:'CreateCompMenu'}); break;
            case 'Раунды': this.setState({page:'Rounds'}); break;
            default: this.setState({page:'Rounds'});
        }
    }
    handleLoginChange(e){
        this.setState({login:e.target.value});
    }
    handlePassChange(e){
        this.setState({pass:e.target.value});
    }
  render() {
        let config = this.routes[this.state.page];
        let PageComponent = config.component;
        const {login, error, user, socket } = this.state;
    return (
		<div>
            {user?
			<Provider store={this.store}>
				<div className="App">
					<MenuHeader changeShow={this.changeShow.bind(this)}/>
					<main className={'main-container'}>
						<PageComponent socket={socket} socketUrl={socketUrl} user={user}/>
					</main>
				</div>
			</Provider>
            :
            <div className="container">
                <form onSubmit={this.handlerRegister.bind(this)}>
                    <label className='container-label'>Регистрация</label>
                    <input className='container-input' size={15.2}
                           type="text" name="login" placeholder="nickname" required
                           defaultValue={this.state.login}
                           onInput={this.handleLoginChange.bind(this)}/>
                    <input className='container-input' size={this.state.pass}
                           type="text" name="pass" placeholder="password" required
                           defaultValue={this.state.pass}
                           onInput={this.handlePassChange.bind(this)}/>
                    <div className={'error'}>{ error ? error : null}</div>
                    <button className='container-input submit-btn' type={"submit"} >Войти</button>
                </form>
            </div>
            }
		</div>
    );
  }
}

export default Home;