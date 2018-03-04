import React, { Component } from 'react';
import PropTypes from 'prop-types';
import connectDecorator from '../context/connectDecorator';
import './Lists.css';
import './ListForms.css';
import { cutStr } from '../Factories';

class ListCompetitors extends Component {
  constructor(props) {
    super(props);
    this.state = {
      surname: '',
      name: '',
      patronomics: '',
      age: '',
      qiu: '',
      mass: '',
      competitors: this.props.competitors
    };
    this.textInput = null;
    this.focus = this.focus.bind(this);
    this.handleAddCompetitor = this.handleAddCompetitor.bind(this);
    this.handleDestroy = this.handleDestroy.bind(this);
    this.changeInput = this.changeInput.bind(this);
  }
  componentWillReceiveProps(newProps) {
    this.setState({
      competitors: newProps.competitors
    });
  }
  focus() {
    this.textInput.focus();
  }
  changeInput(name, event) {
    this.setState({
      [name]: event.target.value
    });
  }
  handleAddCompetitor(event) {
    event.preventDefault();
    this.props.addCompetitor(
      this.state.name,
      this.state.surname,
      this.state.patronomics,
      this.state.qiu,
      this.state.age,
      this.state.mass
    );
    this.setState({
      surname: '',
      name: '',
      patronomics: '',
      age: '',
      qiu: '',
      mass: '',
      competitors: this.state.competitors
    });
    this.focus();
  }
  handleDestroy(id) {
    this.props.destroyCompetitor(id);
    this.setState({
      competitors: this.state.competitors
    });
  }
  render() {
    const { competitors } = this.state;
    return (
      <div className={'baseDiv'}>
        <form className={'formInput'} onSubmit={this.handleAddCompetitor}>
          <h1 className={'formInput-h1'}>Добавить участника</h1>
          <div className={'left-input'}>
            <div className={'group_input'}>
              <input
                className={'group_input-input'}
                type={'text'}
                value={this.state.surname}
                onInput={this.changeInput.bind(this, 'surname')}
                required
                placeholder={'Фамилия'}
                ref={input => {
                  this.textInput = input;
                }}
              />
            </div>
            <div className={'group_input'}>
              <input
                className={'group_input-input'}
                type={'text'}
                value={this.state.name}
                onInput={this.changeInput.bind(this, 'name')}
                required
                placeholder={'Имя'}
              />
            </div>
            <div className={'group_input'}>
              <input
                className={'group_input-input'}
                type={'text'}
                value={this.state.patronomics}
                onInput={this.changeInput.bind(this, 'patronomics')}
                required
                placeholder={'Отчество'}
              />
            </div>
          </div>
          <div className={'right-input'}>
            <div className={'group_input short'}>
              <label className={'group_input-label'}>Ранг:</label>
              <input
                className={'group_input-input short-input'}
                type={'number'}
                value={this.state.qiu}
                min={-10}
                max={10}
                onInput={this.changeInput.bind(this, 'qiu')}
                required
              />
            </div>
            <div className={'group_input short'}>
              <label className={'group_input-label'}>Возраст:</label>
              <input
                className={'group_input-input short-input'}
                type={'number'}
                value={this.state.age}
                min={1}
                max={150}
                onInput={this.changeInput.bind(this, 'age')}
                required
              />
            </div>
            <div className={'group_input short'}>
              <label className={'group_input-label'}>Вес:</label>
              <input
                className={'group_input-input short-input'}
                type={'number'}
                value={this.state.mass}
                min={1}
                max={150}
                onInput={this.changeInput.bind(this, 'mass')}
                required
              />
            </div>
          </div>
          <br />
          <input
            className={'submit-button-input'}
            type={'submit'}
            value={'Добавить'}
          />
        </form>
        <div className="table-title">
          <h3 className={'h3-title'}>Соревнующиеся</h3>
        </div>
        <table className={'table-fill'}>
          <tbody>
            <tr className={'tr-table'}>
              <th className={'th-tablse'}>№</th>
              <th className={'th-tablse'}>Фамилия</th>
              <th className={'th-tablse'}>Имя</th>
              <th className={'th-tablse'}>Отчество</th>
              <th className={'th-tablse'}>Возраст</th>
              <th className={'th-tablse'}>Ранг</th>
              <th className={'th-tablse'}>Вес</th>
              <th className={'th-tablse'} />
            </tr>
            {competitors.map((competitor, i) => (
              <tr className={'tr-table'} key={i}>
                <td className={'td-table'}>{i}</td>
                <td className={'td-table'}>{cutStr(competitor.surname)}</td>
                <td className={'td-table'}>{cutStr(competitor.name)}</td>
                <td className={'td-table'}>{cutStr(competitor.patronomics)}</td>
                <td className={'td-table'}>{competitor.age}</td>
                <td className={'td-table'}>{competitor.qiu}</td>
                <td className={'td-table'}>{competitor.mass} </td>
                <td className={'td-table'}>
                  <svg
                    className={'btnDestroy'}
                    onClick={this.handleDestroy.bind(this, competitor.id)}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 138.03 138.03"
                  >
                    <path
                      d="M138.92,121.51l-114-114C14-3.42-3,13.55,7.95,24.49l114,114c10.94,10.94,27.91-6,17-17Z"
                      transform="translate(-4.41 -3.98)"
                      fill="#ff0000"
                    />
                    <path
                      d="M121.95,7.51l-114,114c-10.94,10.94,6,27.91,17,17l114-114c10.94-10.94-6-27.91-17-17Z"
                      transform="translate(-4.41 -3.98)"
                      fill="#ff0000"
                    />
                  </svg>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default connectDecorator(
  ListCompetitors,
  ['addCompetitor', 'destroyCompetitor'],
  store => ({
    competitors: store.competitors
  })
);

ListCompetitors.propTypes = {
  competitors: PropTypes.array,
  addCompetitor: PropTypes.func,
  destroyCompetitor: PropTypes.func
};
