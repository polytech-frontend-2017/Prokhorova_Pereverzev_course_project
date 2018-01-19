import React, { Component } from 'react';
import './Node.css';

function getNames(pair) {
  let Name_1 = '',
    Name_2 = '';
  if (pair.name1 && pair.name2) {
    if (pair.name1.name) Name_1 = pair.name1.name.substr(0, 1) + '.';
    if (pair.name2.name) Name_2 = pair.name2.name.substr(0, 1) + '.';
    Name_1 = pair.name1.surname + ' ' + Name_1;
    Name_2 = pair.name2.surname + ' ' + Name_2;
  }
  return { Name_1, Name_2 };
}
class Node extends Component {
  constructor(props) {
    super(props);
    let Names = getNames(props.pair);
    this.state = {
      widthRectComp: this.props.width - 30,
      heightRectComp: this.props.height / 2 - 15,
      firstName: Names.Name_1,
      secondName: Names.Name_2,
      win1: props.pair.win1,
      win2: props.pair.win2,
      active: false
    };
    this.changeNameFirst = this.changeNameFirst.bind(this);
    this.changeNameSecond = this.changeNameSecond.bind(this);
    this.showChoose = this.showChoose.bind(this);
  }

  componentWillReceiveProps(newProps) {
    let Names = getNames(newProps.pair);
    let win1 = newProps.pair.win1;
    let win2 = newProps.pair.win2;
    if (this.props.judgeVoices.id === this.props.id) {
      win1 = this.props.judgeVoices.win1;
      win2 = this.props.judgeVoices.win2;
    }
    const active = newProps.activePair === newProps.id;

    this.setState({
      firstName: Names.Name_1,
      secondName: Names.Name_2,
      win1: win1,
      win2: win2,
      active: active
    });
  }
  changeNameFirst(name) {
    this.setState({ firstName: name });
  }
  changeNameSecond(name) {
    this.setState({ secondName: name });
  }
  showChoose(num, event) {
    event.preventDefault();
    let y;
    switch (num) {
      case 1:
        y = this.props.y + 10;
        break;
      default:
        y = this.props.y + this.props.height / 2;
    }
    this.props.showMenu(this.props.x, y, this.props.id, num);
  }

  render() {
    const { win1, win2, active } = this.state;
    const x = this.props.x,
      y = this.props.y;
    let translate = 'translate(' + x + ',' + (y - this.props.height / 2) + ')';
    let label = 'Group ' + this.props.index;
    return (
      <g
        transform={translate}
        className={'node' + (active ? ' activePair' : '')}
        onClick={this.props.setActivePairId.bind(this, this.props.id)}
        onContextMenu={this.props.setActivePairId.bind(this, this.props.id)}
      >
        <g className={'inner-g red-node'}>
          <rect
            onContextMenu={this.showChoose.bind(this, 1)}
            width={this.state.widthRectComp}
            height={this.state.heightRectComp}
            className={'rectComp'}
            transform="translate(0, 20)"
          />
          <text
            onContextMenu={this.showChoose.bind(this, 1)}
            x={5}
            y={this.state.heightRectComp + 10}
            className={'text-group red-node-text'}
          >
            {this.state.firstName}
          </text>
          <rect
            width={this.state.heightRectComp}
            height={this.state.heightRectComp}
            className={'rectComp '}
            transform={'translate(' + this.state.widthRectComp + ', 20)'}
          />
          <text
            x={this.state.widthRectComp - 5 + this.state.heightRectComp / 2}
            y={this.state.heightRectComp + 10}
            className={'text-group red-node-text'}
          >
            {win1}
          </text>
        </g>
        <g className={'inner-g wite-node'}>
          <rect
            onContextMenu={this.showChoose.bind(this, 2)}
            width={this.state.widthRectComp}
            height={this.state.heightRectComp}
            className={'rectComp'}
            transform={'translate(0, ' + (this.state.heightRectComp + 25) + ')'}
          />
          <text
            onContextMenu={this.showChoose.bind(this, 2)}
            x={5}
            y={this.state.heightRectComp * 2 + 15}
            className={'text-group'}
          >
            {this.state.secondName}
          </text>
          <rect
            width={this.state.heightRectComp}
            height={this.state.heightRectComp}
            className={'rectComp'}
            transform={
              'translate(' +
              this.state.widthRectComp +
              ',' +
              (this.state.heightRectComp + 25) +
              ')'
            }
          />
          <text
            x={this.state.widthRectComp - 5 + this.state.heightRectComp / 2}
            y={this.state.heightRectComp * 2 + 15}
            className={'text-group'}
          >
            {win2}
          </text>
        </g>
        <text x={5} y={17} className={'text-group'}>
          {label}
        </text>
      </g>
    );
  }
}
export default Node;
