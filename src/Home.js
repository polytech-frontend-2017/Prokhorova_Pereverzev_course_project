import React, { Component } from 'react';
import './App.css';
import CreateCompMenu from './Components/CreateCompMenu.js';
import Store from './Components/Store.js';
import MenuHeader from './Components/MenuHeader.js';
import Provider from './context/Provider.js';
import ListCompetitors from './Components/ListCompetitors.js';
import ListTournirs from './Components/ListTournirs';
import Rounds from './Components/Rounds';
import io from 'socket.io-client';
import { USER_CONNECTED, LOGOUT, VERIFY_USER } from './Events';

const socketUrl = 'http://127.0.0.1:3231';

class Home extends Component {
  constructor() {
    super();
    this.setUser = this.setUser.bind(this);
    this.store = new Store();
    this.socket = io(socketUrl);
    this.state = {
      page: 'CreateCompMenu',
      socket: null,
      user: sessionStorage.getItem('socketUserName') || null,
      login: '',
      pass: '',
      error: '',
      logout: false,
      closeMenuCompetitors: false
    };
    this.activeTournir = this.store.tournirs[0];
    this.routes = {
      ListCompetitors: {
        component: ListCompetitors
      },
      ListTournirs: {
        component: ListTournirs
      },
      CreateCompMenu: {
        component: CreateCompMenu
      },
      Rounds: {
        component: Rounds
      }
    };
    this.socket.on('connect', () => {
      console.log('Connected');
    });
    this.changeactiveTournir = this.changeactiveTournir.bind(this);
  }
  handlerRegister(e) {
    e.preventDefault();
    const { login, pass } = this.state;
    this.socket.emit(VERIFY_USER, login, pass, this.setUser);
  }
  /*
  * Sets the user in state
  * @param user {id:number, name:string}
  */
  setUser = ({ user, isUser }) => {
    console.log(user, isUser);
    if (isUser) {
      this.setError('User name taken');
    } else {
      this.setError('');
      this.socket.emit(USER_CONNECTED, user, 'main');
      this.setState({ user: user });
      sessionStorage.setItem('socketUserName', user.name);
    }
  };
  setError = error => {
    this.setState({ error });
  };

  logout = () => {
    this.socket.emit(LOGOUT);
    this.setState({ user: null });
    console.log('logout');
    sessionStorage.removeItem('socketUserName');
  };

  changeShow(num) {
    switch (num) {
      case 'Соревнующиеся':
        this.setState({ page: 'ListCompetitors' });
        break;
      case 'Турниры':
        this.setState({ page: 'ListTournirs' });
        break;
      case 'Соревнование':
        this.setState({ page: 'CreateCompMenu' });
        break;
      case 'Раунды':
        this.setState({ page: 'Rounds' });
        break;
      case 'Выход':
        this.logout();
        break;
      default:
        this.setState({ page: 'Rounds' });
    }
  }
  handleLoginChange(e) {
    this.setState({ login: e.target.value });
  }
  handlePassChange(e) {
    this.setState({ pass: e.target.value });
  }
  componentWillMount() {
    if (sessionStorage.getItem('socketUserName'))
      this.socket.emit(
        VERIFY_USER,
        sessionStorage.getItem('socketUserName'),
        'password',
        this.setUser
      );
  }
  changeactiveTournir(newTournir) {
    this.activeTournir = newTournir;
  }
  toggleMenuCompetitors(click) {
    this.setState({ closeMenuCompetitors: click });
  }
  render() {
    const config = this.routes[this.state.page];
    const PageComponent = config.component;
    const { login, error, user } = this.state;
    return (
      <div onContextMenu={this.toggleMenuCompetitors.bind(this, true)}>
        {user ? (
          <Provider store={this.store}>
            <div className="App">
              <MenuHeader
                changeShow={this.changeShow.bind(this)}
                logout={this.logout}
              />
			  <main className={'main-container'} role={'main'}> 
                <PageComponent
                  socket={this.socket}
                  user={user}
                  activeTournir={this.activeTournir}
                  changeactiveTournir={this.changeactiveTournir}
                />
              </main>
            </div>
          </Provider>
        ) : (
          <div className="container">
            <form onSubmit={this.handlerRegister.bind(this)}>
              <label className="container-label">Регистрация</label>
              <input
                className="container-input"
                size={15.2}
                type="text"
                name="login"
                placeholder="nickname"
                required
                defaultValue={login}
                onInput={this.handleLoginChange.bind(this)}
              />
              <input
                className="container-input"
                size={this.state.pass}
                type="password"
                name="pass"
                placeholder="password"
                required
                defaultValue={this.state.pass}
                onInput={this.handlePassChange.bind(this)}
              />
              <div className={'error'}>{error ? error : null}</div>
              <button className="container-input submit-btn" type={'submit'}>
                Войти
              </button>
            </form>
          </div>
        )}
      </div>
    );
  }
}

export default Home;
