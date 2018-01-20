import React, { Component } from 'react';
import LoginPage from './LoginPage';
import SignUpPage from './SignUpPage';
import './judgeTool.css';
import '../App.css';
import {
  USER_CONNECTED,
  VERIFY_USER,
  START_VOITING,
  STOP_VOITING,
  VOITING_SENT
} from '../Events';
import { PORT, hostname } from '../server/globalConsts';
import io from 'socket.io-client';

const socketUrl = `http://${hostname}:${PORT}`;
class judgeTool extends Component {
  constructor(props) {
    super(props);
    this.state = {
      choise: '',
      isDisable: false,
      setActive: false,
      user: null,
      error: '',
      toggleLogin: true
    };
    this.socket = io(socketUrl);
    this.socket.on(START_VOITING, () => {
      this.setState({ setActive: true, isDisable: false });
    });
    this.socket.on(STOP_VOITING, () => {
      this.setState({ setActive: false });
    });
    this.socket.on('connect', () => {
      console.log('Connected');
    });
    this.choose = this.choose.bind(this);
    this.change = this.change.bind(this);
    this.handlerRegister = this.handlerRegister.bind(this);
    this.loginForms = this.loginForms.bind(this);
    this.signupForm = this.signupForm.bind(this);
  }
  loginForms() {
    this.setState({ toggleLogin: true });
  }
  signupForm() {
    this.setState({ toggleLogin: false });
  }
  handlerRegister(login, pass) {
    this.socket.emit(VERIFY_USER, login, pass, this.setUser);
  }
  setUser = ({ user, isUser, isActive }) => {
    if (isUser) {
      this.setError('User name taken');
    } else {
      this.setError('');
      this.socket.emit(USER_CONNECTED, user, 'judge');
      this.setState({ user: user, setActive: isActive });
    }
  };
  setError = error => {
    this.setState({ error });
  };
  choose(nameChoose) {
    this.socket.emit(VOITING_SENT, nameChoose);
    this.setState({ choise: nameChoose, isDisable: true });
  }
  change() {
    this.setState({ isDisable: false, choise: '' });
  }
  render() {
    const { error, user, toggleLogin } = this.state;
    return (
      <div>
        {user ? (
          <div className={'pultik'}>
            <button
              className={'red judge-btn'}
              onClick={this.choose.bind(this, 'red')}
              disabled={!this.state.setActive || this.state.isDisable}
            >
              {'Aka'}
            </button>
            <button
              className={'white judge-btn'}
              onClick={this.choose.bind(this, 'white')}
              disabled={!this.state.setActive || this.state.isDisable}
            >
              {'Shiro'}
            </button>
            <button
              className={'changeSelect judge-btn'}
              onClick={this.change}
              disabled={!this.state.setActive}
            >
              {'Change'}
            </button>
          </div>
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
export default judgeTool;
