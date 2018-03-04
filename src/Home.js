import React, { Component } from 'react';
import './App.css';
import CreateCompMenu from './Components/CreateCompMenu.js';
import Store from './Components/Store.js';
import MenuHeader from './Components/MenuHeader.js';
import Provider from './context/Provider.js';
import ListCompetitors from './Components/ListCompetitors.js';
import ListTournirs from './Components/ListTournirs';
import Rounds from './Components/Rounds';
import NoTournirs from './Components/NoTournirs';
import LoginPage from './Components/LoginPage';
import SignUpPage from './Components/SignUpPage';
import io from 'socket.io-client';
import { PORT, hostname } from './server/globalConsts';

import { USER_CONNECTED, LOGOUT, VERIFY_USER } from './Events';

const socketUrl = `http://${hostname}:${PORT}`;

class Home extends Component {
  constructor() {
    super();
    this.setUser = this.setUser.bind(this);
    this.socket = io(socketUrl, {
      forceNew: false,
      transports: ['websocket'],
      reconnection: false
    });
    this.socket.on('reconnect_attempt', () => {
      this.socket.io.opts.transports = ['polling', 'websocket'];
    });
    this.store = null;
    this.state = {
      page: 'CreateCompMenu',
      socket: null,
      user: sessionStorage.getItem('socketUserName') || null,
      logout: false,
      closeMenuCompetitors: false,
      error: '',
      title: '',
      date: null,
      toggleLogin: true
    };
    this.activeTournir = null;
    if (this.state.user !== null) {
      this.store = new Store();
      if (this.store.tournirs.length > 0)
        this.activeTournir = this.store.tournirs[0];
    }
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
      },
      NoTournirs: {
        component: NoTournirs
      }
    };
    this.socket.on('connect', () => {
      console.log('Connected');
    });
    this.changeactiveTournir = this.changeactiveTournir.bind(this);
    this.changeDataCompetition = this.changeDataCompetition.bind(this);
    this.handlerRegister = this.handlerRegister.bind(this);
    this.loginForms = this.loginForms.bind(this);
    this.signupForm = this.signupForm.bind(this);
  }
  handlerRegister(login, pass) {
    this.socket.emit(VERIFY_USER, login, pass, this.setUser);
  }

  changeDataCompetition(title_, date_) {
    this.setState({ title: title_, date: date_ });
  }
  /*
  * Sets the user in state
  * @param user {id:number, name:string}
  */
  setUser = ({ user, isUser }) => {
    console.log(user, isUser);
    if (isUser) {
      this.setError('Неверный логин или пароль.');
    } else {
      this.setError('');
      this.store = new Store();
      if (this.store.tournirs.length > 0)
        this.activeTournir = this.store.tournirs[0];
      this.socket.emit(USER_CONNECTED, user, 'main');
      this.setState({
        page: 'CreateCompMenu',
        user: user,
        title: this.store.competition.title,
        date: this.store.competition.date
      });
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
        if (this.activeTournir !== null) this.setState({ page: 'Rounds' });
        else this.setState({ page: 'NoTournirs' });
        break;
      case 'Выход':
        this.logout();
        break;
      default:
        this.setState({ page: 'Rounds' });
    }
  }
  componentWillMount() {
    if (sessionStorage.getItem('socketUserName')) {
      this.socket.emit(
        VERIFY_USER,
        sessionStorage.getItem('socketUserName'),
        'password',
        this.setUser
      );
    }
  }
  changeactiveTournir(newTournir) {
    this.activeTournir = newTournir;
  }
  toggleMenuCompetitors(click) {
    this.setState({ closeMenuCompetitors: click });
  }
  loginForms() {
    this.setState({ toggleLogin: true });
  }
  signupForm() {
    this.setState({ toggleLogin: false });
  }
  render() {
    const config = this.routes[this.state.page];
    const PageComponent = config.component;
    const { user, title, date, error, toggleLogin } = this.state;
    return (
      <div onContextMenu={this.toggleMenuCompetitors.bind(this, true)}>
        {user ? (
          <Provider store={this.store}>
            <div className="App">
              <MenuHeader
                date={date}
                title={title}
                changeShow={this.changeShow.bind(this)}
                logout={this.logout}
              />
              <main className={'main-container main'}>
                <PageComponent
                  changeDataCompetition={this.changeDataCompetition}
                  socket={this.socket}
                  user={user}
                  activeTournir={this.activeTournir}
                  changeactiveTournir={this.changeactiveTournir}
                />
              </main>
            </div>
          </Provider>
        ) : (
          <main className={'main-container main'}>
            <div className={'login-signin'}>
              <ul className="tab-group">
                <li
                  className={
                    'login-signup-li ' + (toggleLogin ? 'active-li' : '')
                  }
                  onClick={this.loginForms}
                >
                  <a className={'login-signup-a'} href={'#login'}>
                    Log In
                  </a>
                </li>
                <li
                  className={
                    'login-signup-li ' + (!toggleLogin ? 'active-li' : '')
                  }
                  onClick={this.signupForm}
                >
                  <a className={'login-signup-a'} href={'#signup'}>
                    Sign Up
                  </a>
                </li>
              </ul>
              {toggleLogin ? (
                <LoginPage
                  handlerRegister={this.handlerRegister}
                  error={error}
                />
              ) : (
                <SignUpPage
                  handlerRegister={this.handlerRegister}
                  error={error}
                />
              )}
            </div>
          </main>
        )}
      </div>
    );
  }
}

export default Home;
