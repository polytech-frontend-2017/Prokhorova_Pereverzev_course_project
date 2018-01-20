import React, { Component } from 'react';
import logo from '../logoAikido.svg';
import './MenuHeader.css';
import connectDecorator from '../context/connectDecorator';

function classNames(conditions) {
  const classNames = Object.keys(conditions); // ['header-li', 'selected', 'other']
  const enabledClassNames = classNames.filter(
    className => conditions[className]
  ); // ['header-li', 'other']
  return enabledClassNames.join(' '); // 'header-li other'
}

class MenuHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeMenu: 'Соревнование',
      title: this.props.title,
      date: this.props.date
    };
    this.ShowOrHideForm = this.ShowOrHideForm.bind(this);
    this.menu = [
      { name: 'Соревнующиеся' },
      { name: 'Турниры' },
      { name: 'Раунды' },
      { name: 'Соревнование' },
      { name: 'Выход' }
    ];
  }
  componentWillReceiveProps(newProps) {
    this.setState({
      title: newProps.title,
      date: newProps.date
    });
  }
  ShowOrHideForm(name) {
    this.setState({ activeMenu: name });
    this.props.changeShow(name);
  }
  render() {
    const { title, date } = this.state;
    let Title = title + ' / ' + date;
    if (Title.length > 20) {
      Title = Title.slice(0, 16) + '...';
    }
    return (
      <div className={'divStyle'}>
        <img src={logo} className={'Applogo'} alt="logo" />
        <div className={'titletext'} title={title + ' / ' + date}>
          {Title}
        </div>
        <ul className={'header-ul'}>
          {this.menu.map((menuItem, i) => {
            return (
              <div className={'container-li'} key={i}>
                <div className={'verticalLine'} />
                <li
                  className={classNames({
                    selected: menuItem.name === this.state.activeMenu,
                    'header-li': true
                  })}
                  onClick={this.ShowOrHideForm.bind(this, menuItem.name)}
                >
                  <a className={'header-a'} href={'#' + escape(menuItem.name)}>
                    {menuItem.name}
                  </a>
                </li>
              </div>
            );
          })}
        </ul>
      </div>
    );
  }
}
export default connectDecorator(MenuHeader, [], store => ({}));
