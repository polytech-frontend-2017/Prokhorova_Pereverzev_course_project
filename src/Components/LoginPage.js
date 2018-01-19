import React, { Component } from 'react';
import './LoginPage.css';
class RegisterMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      login: '',
      pass: '',
      error: this.props.error
    };
    this.handleLoginChange = this.handleLoginChange.bind(this);
    this.handlePassChange = this.handlePassChange.bind(this);
  }
  componentWillReceiveProps(newProps) {
    this.setState({
      error: newProps.error
    });
  }
  handleLoginChange(e) {
    this.setState({ login: e.target.value });
  }
  handlePassChange(e) {
    this.setState({ pass: e.target.value });
  }
  handlerRegister(e) {
    e.preventDefault();
    const { login, pass } = this.state;
    this.props.handlerRegister(login, pass);
  }
  render() {
    const { login, pass, error } = this.state;
    return (
      <div className="container-login">
        <form
          id={'login'}
          action="/"
          method="post"
          onSubmit={this.handlerRegister.bind(this)}
          className={'form-login'}
        >
          <label className="container-label-login">Вход</label>
          <input
            className="container-input-login"
            size={15.2}
            type="text"
            name="login"
            placeholder="логин"
            required
            defaultValue={login}
            onInput={this.handleLoginChange.bind(this)}
          />
          <input
            className="container-input-login"
            size={pass}
            type="password"
            name="pass"
            placeholder="пароль"
            required
            defaultValue={pass}
            onInput={this.handlePassChange.bind(this)}
          />
          <div className={'error'}>{error ? error : null}</div>
          <button
            className="container-input-login submit-btn-login login-btns"
            type={'submit'}
          >
            Войти
          </button>
        </form>
      </div>
    );
  }
}

export default RegisterMenu;
