import React, { Component } from 'react';
import PropTypes from 'prop-types';
import connectDecorator from '../context/connectDecorator';
import './CreateCompMenu.css';

class CreateCompMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      size: 15.2,
      title: '',
      date: ''
    };
  }
  handleTitleChange(e) {
    this.setState({ title: e.target.value });
  }
  handleDateChange(e) {
    this.setState({ date: e.target.value });
  }
  handlerCreateCompetition(e) {
    e.preventDefault();
    console.log(this.state.title + ' ' + this.state.date);
    this.props.createCompetition(this.state.title, this.state.date);
    this.props.changeDataCompetition(this.state.title, this.state.date);
  }
  render() {
    return (
      <div className={'create-comp-menu'}>
        <header className="App-header">
          <h1 className="App-title">Менеджер Соревнований</h1>
        </header>
        <form
          onSubmit={this.handlerCreateCompetition.bind(this)}
          className={'create-competition-form'}
        >
          <label className="container-label">Соревнование</label>
          <input
            className="container-input"
            size={this.state.size}
            type="text"
            name="title"
            placeholder="Наименование"
            required
            defaultValue={this.state.title}
            onInput={this.handleTitleChange.bind(this)}
          />
          <input
            className="container-input"
            size={this.state.size}
            type="date"
            name="date"
            required
            defaultValue={this.state.date}
            onInput={this.handleDateChange.bind(this)}
          />
          <button className="container-input submit-btn" type={'submit'}>
            Создать
          </button>
        </form>
      </div>
    );
  }
}

export default connectDecorator(
  CreateCompMenu,
  ['createCompetition'],
  store => ({
    tournirsCount: store.tournirs.length
  })
);

CreateCompMenu.propTypes = {
  tournirsCount: PropTypes.number,
  createCompetition: PropTypes.func,
  changeDataCompetition: PropTypes.func
};
