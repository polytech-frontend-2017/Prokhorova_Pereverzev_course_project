import React, { Component } from 'react';
import './judgeTool.css';
import '../App.css';
import { USER_CONNECTED, LOGOUT, VERIFY_USER } from '../Events';
import io from 'socket.io-client';
const socketUrl = 'http://93.100.173.116:3231';
class judgeTool extends Component {
  constructor(props) {
    super(props);
    this.state = {
      choise: '',
      isDisable: false,
      setActive: true,
      user: null,
      login: '',
      pass: '',
      error: '',
      logout: false
    };
    this.socket = io(socketUrl);
    this.socket.on('connect', () => {
      console.log('Connected');
    });
    this.choose = this.choose.bind(this);
    this.change = this.change.bind(this);
  }
  handlerRegister(e) {
    e.preventDefault();
    const { login } = this.state;
    this.socket.emit(VERIFY_USER, login, this.setUser);
  }
  setUser = ({ user, isUser }) => {
    console.log(user, isUser);
    if (isUser) {
      this.setError('User name taken');
    } else {
      this.socket.emit(USER_CONNECTED, user);
      this.setState({ user: user });
      this.setError('');
    }
  };
  setError = error => {
    this.setState({ error });
  };
  logout = () => {
    this.socket.emit(LOGOUT);
    this.setState({ user: null });
  };
  setActiveBtn = () => {
    this.setState({ setActive: true });
  };
  setPassiveBtn = () => {
    this.setState({ setActive: false });
  };
  handleLoginChange(e) {
    this.setState({ login: e.target.value });
  }
  handlePassChange(e) {
    this.setState({ pass: e.target.value });
  }
  choose(nameChoose) {
    this.setState({ choise: nameChoose, isDisable: true });
    console.log(nameChoose);
  }
  change() {
    this.setState({ isDisable: false, choise: '' });
    console.log(this.state.isDisable);
  }
  render() {
    const { login, error, user } = this.state;
    return (
      <div>
        {user ? (
          <div className={'pultik'}>
            <button
              className={'red'}
              onClick={this.choose.bind(this, 'red')}
              disabled={!this.state.setActive || this.state.isDisable}
            >
              {'Aka'}
            </button>
            <button
              className={'blue'}
              onClick={this.choose.bind(this, 'blue')}
              disabled={!this.state.setActive || this.state.isDisable}
            >
              {'Shiro'}
            </button>
            <button
              className={'changeSelect'}
              onClick={this.change}
              disabled={!this.state.setActive}
            >
              {'Change'}
            </button>
          </div>
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
                defaultValue={this.state.login}
                onInput={this.handleLoginChange.bind(this)}
              />
              <input
                className="container-input"
                size={this.state.pass}
                type="text"
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
export default judgeTool;
