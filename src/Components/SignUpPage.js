import React, { Component } from 'react';
import './LoginPage.css';
class SignUpPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      login: '',
      pass: '',
      confirmpass: '',
      name: '',
      surname: '',
      patronomics: ''
    };
    this.changeInput = this.changeInput.bind(this);
  }
  changeInput(name, event) {
    this.setState({
      [name]: event.target.value
    });
  }
  render() {
    const { login, pass, confirmpass, name, surname, patronomics } = this.state;
    const error = pass === confirmpass ? '' : 'пароли не совпадают';
    return (
      <div className="container-login">
        <form id={'signup'} className={'form-login'}>
          <label className="container-label-login">Регистрация</label>
          <div className={'form-groups-inputs'}>
            <div className={'group-input-signup'}>
              <input
                className="container-input-login"
                type="text"
                name="name"
                placeholder="Имя"
                required
                defaultValue={name}
                onInput={this.changeInput.bind(this, 'name')}
              />
              <input
                className="container-input-login"
                type="text"
                name="surname"
                placeholder="Фамилия"
                required
                defaultValue={surname}
                onInput={this.changeInput.bind(this, 'surname')}
              />
              <input
                className="container-input-login"
                type="text"
                name="patronomics"
                placeholder="Отчество"
                defaultValue={patronomics}
                onInput={this.changeInput.bind(this, 'patronomics')}
              />
            </div>
            <div className={'group-input-signup'}>
              <input
                className="container-input-login"
                type="text"
                name="login"
                placeholder="username"
                required
                defaultValue={login}
                onInput={this.changeInput.bind(this, 'login')}
              />
              <input
                className="container-input-login"
                type="password"
                name="pass"
                placeholder="пароль"
                required
                defaultValue={pass}
                onInput={this.changeInput.bind(this, 'pass')}
              />
              <input
                className="container-input-login"
                type="password"
                name="confirmpass"
                placeholder="подтверждение пароля"
                required
                defaultValue={confirmpass}
                onInput={this.changeInput.bind(this, 'confirmpass')}
              />
            </div>
          </div>
          <div className={'error'}>{error ? error : null}</div>
          <button
            className="container-input-login submit-btn-login login-btns"
            type={'submit'}
          >
            Зарегистрироваться
          </button>
        </form>
      </div>
    );
  }
}

export default SignUpPage;
