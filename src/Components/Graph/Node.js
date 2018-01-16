import React, { Component } from 'react';
import './Node.css';

class Node extends Component {
  constructor(props) {
    super(props);
    let Name_1 = '',
      Name_2 = '';
    if (props.pair.name1 && props.pair.name2) {
      props.pair.name1.name
        ? (Name_1 = props.pair.name1.name.substr(0, 1) + '.')
        : '';
      props.pair.name2.name
        ? (Name_2 = props.pair.name2.name.substr(0, 1) + '.')
        : '';
      Name_1 = props.pair.name1.surname + ' ' + Name_1;
      Name_2 = props.pair.name2.surname + ' ' + Name_2;
    }
    this.state = {
      widthRectComp: this.props.width - 30,
      heightRectComp: this.props.height / 2 - 15,
      firstName: Name_1,
      secondName: Name_2,
      win1: props.pair.win1,
      win2: props.pair.win2
    };
    this.changeNameFirst = this.changeNameFirst.bind(this);
    this.changeNameSecond = this.changeNameSecond.bind(this);
    this.showChoose = this.showChoose.bind(this);
  }

  componentWillReceiveProps(newProps) {
    let Name_1 = '',
      Name_2 = '';
    if (newProps.pair.name1 && newProps.pair.name2) {
      newProps.pair.name1.name
        ? (Name_1 = newProps.pair.name1.name.substr(0, 1) + '.')
        : '';
      newProps.pair.name2.name
        ? (Name_2 = newProps.pair.name2.name.substr(0, 1) + '.')
        : '';
      Name_1 = newProps.pair.name1.surname + ' ' + Name_1;
      Name_2 = newProps.pair.name2.surname + ' ' + Name_2;
    }
    this.setState({
      firstName: Name_1,
      secondName: Name_2,
      win1: newProps.pair.win1,
      win2: newProps.pair.win2
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
    const active = this.props.activePair === this.props.id;
    const x = this.props.x,
      y = this.props.y;
    let translate = 'translate(' + x + ',' + (y - this.props.height / 2) + ')';
    let label = 'Group ' + this.props.index;
    return (
      <g
        transform={translate}
        className={'node' + (active ? ' activePair' : '')}
        onClick={() => {
          this.props.setActivePairInGraph(this.props.id);
        }}
      >
        <g
          className={'inner-g red-node'}
          onContextMenu={this.showChoose.bind(this, 1)}
        >
          <rect
            width={this.state.widthRectComp}
            height={this.state.heightRectComp}
            className={'rectComp'}
            transform="translate(0, 20)"
          />
          <text
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
            {this.state.win1}
          </text>
        </g>
        <g
          className={'inner-g wite-node'}
          onContextMenu={this.showChoose.bind(this, 2)}
        >
          <rect
            width={this.state.widthRectComp}
            height={this.state.heightRectComp}
            className={'rectComp'}
            transform={'translate(0, ' + (this.state.heightRectComp + 25) + ')'}
          />
          <text
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
            {this.state.win2}
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
