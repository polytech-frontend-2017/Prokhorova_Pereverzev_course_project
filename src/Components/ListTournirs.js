import React, { Component } from 'react';
import connectDecorator from '../context/connectDecorator';
import './Lists.css';

class ListTournirs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      minAge: '',
      maxAge: '',
      minKiu: '',
      maxKiu: '',
      minMass: '',
      maxMass: ''
    };
    this.textInput = null;
    this.focus = this.focus.bind(this);
    this.handleAddTournir = this.handleAddTournir.bind(this);
    this.handleDestroy = this.handleDestroy.bind(this);
  }
  focus() {
    this.textInput.focus();
  }
  changeInput(name, event) {
    this.setState({
      [name]: event.target.value
    });
  }
  handleAddTournir(event) {
    event.preventDefault();
    this.props.addTournir(
      this.state.minAge,
      this.state.maxAge,
      this.state.minKiu,
      this.state.maxKiu,
      this.state.minMass,
      this.state.maxMass
    );
    this.setState({
      minAge: '',
      maxAge: '',
      minKiu: '',
      maxKiu: '',
      minMass: '',
      maxMass: ''
    });
    if (this.props.activeTournir === null)
      this.props.changeactiveTournir(this.props.tournirs[0]);
    this.focus();
  }
  handleDestroy(id) {
    this.props.destroyTournir(id);
  }
  render() {
    return (
      <div className={'baseDiv'}>
        <form className={'formInput'} onSubmit={this.handleAddTournir}>
          <h1 className={'formInput-h1'}>Добавить турнир</h1>
          <div className={'group_input short-tournir'}>
            <label className={'group_input-label'}>Возраст:</label>
            <input
              className={'group_input-input short-tournir-input'}
              type={'number'}
              min={1}
              max={100}
              placeholder={'от'}
              value={this.state.minAge}
              onInput={this.changeInput.bind(this, 'minAge')}
              required
              ref={input => {
                this.textInput = input;
              }}
            />&nbsp;—&nbsp;
            <input
              className={'group_input-input short-tournir-input'}
              type={'number'}
              min={1}
              max={100}
              placeholder={'до'}
              value={this.state.maxAge}
              onInput={this.changeInput.bind(this, 'maxAge')}
              required
            />
          </div>
          <div className={'group_input short-tournir'}>
            <label className={'group_input-label'}>Кю/дан:</label>
            <input
              className={'group_input-input short-tournir-input'}
              type={'number'}
              min={1}
              max={10}
              placeholder={'от'}
              value={this.state.minKiu}
              onInput={this.changeInput.bind(this, 'minKiu')}
              required
            />&nbsp;—&nbsp;
            <input
              className={'group_input-input short-tournir-input'}
              type={'number'}
              min={1}
              max={10}
              placeholder={'до'}
              value={this.state.maxKiu}
              onInput={this.changeInput.bind(this, 'maxKiu')}
              required
            />
          </div>
          <div className={'group_input short-tournir'}>
            <label className={'group_input-label'}>Вес:</label>
            <input
              className={'group_input-input short-tournir-input'}
              type={'number'}
              min={1}
              max={150}
              placeholder={'от'}
              value={this.state.minMass}
              onInput={this.changeInput.bind(this, 'minMass')}
              required
            />&nbsp;—&nbsp;
            <input
              className={'group_input-input short-tournir-input'}
              type={'number'}
              min={1}
              max={150}
              placeholder={'до'}
              value={this.state.maxMass}
              onInput={this.changeInput.bind(this, 'maxMass')}
              required
            />
          </div>
          <input
            className={'submit-button-input'}
            type="submit"
            value={'Добавить'}
          />
        </form>
        <div className="table-title">
          <h3 className={'h3-title'}>Турниры</h3>
        </div>
        <table className={'table-fill'}>
          <tbody>
            <tr className={'tr-table'}>
              <th className={'th-tablse'}>№</th>
              <th className={'th-tablse'}>Возраст</th>
              <th className={'th-tablse'}>Кю/Дан</th>
              <th className={'th-tablse'}>Вес</th>
              <th className={'th-tablse'} />
            </tr>
            {this.props.tournirs.map((tournir, i) => (
              <tr className={'tr-table'} key={i}>
                <td className={'td-table'}>{i}</td>
                <td className={'td-table'}>
                  {tournir.ageRange.min + ' - ' + tournir.ageRange.max}
                </td>
                <td className={'td-table'}>
                  {tournir.qiuRange.min + ' - ' + tournir.qiuRange.max}
                </td>
                <td className={'td-table'}>
                  {tournir.massRange.min + ' - ' + tournir.massRange.max}
                </td>
                <td className={'td-table'}>
                  <svg
                    className={'btnDestroy'}
                    onClick={this.handleDestroy.bind(this, tournir.id)}
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
  ListTournirs,
  ['addTournir', 'destroyTournir'],
  store => ({
    tournirs: store.tournirs
  })
);
