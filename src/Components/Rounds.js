import React, { Component } from 'react';
import io from 'socket.io-client';
import connectDecorator from '../context/connectDecorator';
import './Rounds.css';
import Graph from './Graph';
import MenuCompetitors from './Graph/MenuCompetitors';
import { VOITING_SENT, VOICE_RECIEVED, COMMUNITY_VOITING } from '../Events.js';
import * as d3 from 'd3';

function createEmptyDataTree(levels, parent, levelBuild) {
  if (levels === levelBuild)
    return [
      {
        name: parent + '-1',
        parent: parent,
        deep: levelBuild
      },
      {
        name: parent + '-2',
        parent: parent,
        deep: levelBuild
      }
    ];
  if (levelBuild === 0) {
    return [
      {
        name: levelBuild + '-TOP',
        parent: null,
        children: createEmptyDataTree(
          levels,
          levelBuild + '-TOP',
          levelBuild + 1
        ),
        deep: levelBuild
      }
    ];
  } else {
    let levelTree = [];
    levelTree.push({
      name: parent + '-1',
      parent: parent,
      children: createEmptyDataTree(levels, parent + '-1', levelBuild + 1),
      deep: levelBuild
    });
    levelTree.push({
      name: parent + '-2',
      parent: parent,
      children: createEmptyDataTree(levels, parent + '-2', levelBuild + 1),
      deep: levelBuild
    });
    return levelTree;
  }
}
class Rounds extends Component {
  constructor(props) {
    super(props);
    this.currentCompetitors = this.filterCompetitors(this.props.tournirs[0]);
    this.state = {
      user: null,
      currentTournir: this.props.tournirs[0],
      currentCompetitors: this.currentCompetitors,
      isVoiting: true,
      userVoices: null,
      showMenu: false,
      xMenu: 50,
      yMenu: 50
    };
    this.numberName = null;
    this.props.setActiveTournir(this.props.tournirs[0]);
    //graphData
    this.d3tree = d3.tree();
    this.line = d3.line();
    this.root = [];
    this.nodes = [];
    this.links = [];
    this.DataNodes = [];
    this.currentPairs = [];
    this.SelectedNodeId = '';
    this.createDataNodes = this.createDataNodes.bind(this);
    this.createPairs = this.createPairs.bind(this);
    this.updateD3 = this.updateD3.bind(this);
    this.updatePairs = this.updatePairs.bind(this);
    this.createEmptyCompetitor = this.createEmptyCompetitor.bind(this);

    this.toggleMenu = this.toggleMenu.bind(this);
    this.HideMenu = this.HideMenu.bind(this);
    this.menuSelect = this.menuSelect.bind(this);

    this.currentSets = this.currentSets.bind(this);
    this.filterCompetitors = this.filterCompetitors.bind(this);
    this.countDeepLevelTree = this.countDeepLevelTree.bind(this);
    this.getSocketData = this.getSocketData.bind(this);
    this.currentCompetitors.length !== 0
      ? (this.levels = Math.ceil(
          Math.log2(Math.ceil(this.currentCompetitors.length / 2))
        ))
      : (this.levels = 0);
    this.updateD3(props);
  }
  componentWillReceiveProps(newProps) {
    //this.updateD3(newProps);
  }
  createDataNodes() {
    if (this.levels === -1) return false;
    this.DataNodes = createEmptyDataTree(this.levels, null, 0);
    return true;
  }
  updateD3(props) {
    if (this.levels === 0) this.links = [];
    if (this.createDataNodes()) {
      this.root = d3.hierarchy(this.DataNodes[0], function(d) {
        return d.children;
      });
      const widthGraph = this.levels * 300,
        heightGraph = 2 ** this.levels * 150;
      this.root.x0 = heightGraph / 2;
      this.root.y0 = 0;
      this.d3tree.size([heightGraph, widthGraph]);
      let treeData = this.d3tree(this.root);
      this.nodes = treeData.descendants();
      this.links = treeData.descendants().slice(1);

      this.updatePairs(props);
      console.log(this.nodes);
    }
  }
  updatePairs() {
    //if (this.state.currentTournir.groups.filter(pair => pair.depth === this.levels).length === 0)
    this.createPairs();
    /*else {
            this.currentPairs = this.state.currentTournir.groups;
        }*/
  }
  toggleMenu(x, y, SelectedNodeId, NumberName) {
    if (SelectedNodeId !== '') {
      this.numberName = NumberName;
      this.SelectedNodeId = SelectedNodeId;
    }
    this.setState({
      showMenu: true,
      xMenu: x,
      yMenu: y
    });
  }
  HideMenu() {
    this.setState({
      showMenu: false
    });
  }
  menuSelect(selectValue) {
    this.HideMenu();
    let nod = this.nodes.find(node => node.data.name === this.SelectedNodeId);
    let node = this.nodes.find(node => node.pair.id === this.SelectedNodeId);
    switch (this.numberName) {
      case 1:
        if (selectValue && selectValue.value.id !== node.pair.name2.id)
          node.pair.name1 = selectValue.value;
        break;
      default:
        if (selectValue && node.pair.name1.id !== selectValue.value.id)
          node.pair.name2 = selectValue.value;
    }

    /** ...change pair */
    this.props.destroyGroup(node.pair.id);
    this.props.addGroup(node.pair);
    nod.data.name = this.SelectedNodeId;
    console.log(this.nodes[1]);
    //this.updateD3(this.props);
  }
  createPairs() {
    this.props.destroyAllGroups();
    let arrPairs = [];
    let arrIdPairs = this.nodes.filter(node => node.depth === this.levels);
    for (
      let i = 0, ind = 0;
      i < this.currentCompetitors.length;
      i += 2, ind++
    ) {
      let pair = {
        name1: this.currentCompetitors[i],
        name2: this.currentCompetitors[i + 1],
        win1: 0,
        win2: 0,
        depth: this.levels,
        id: arrIdPairs[ind].data.name
      };
      arrIdPairs[ind].pair = pair; //!!!!!!!!!!!!!!!!!!!!!
      arrPairs.push(pair);
    }
    if (this.currentCompetitors.length % 2 !== 0)
      arrIdPairs[arrIdPairs.length - 1].pair.name2 = 'no';

    this.nodes.map(node => {
      if (!node.pair) {
        const Pair = {
          name1: this.createEmptyCompetitor(),
          name2: this.createEmptyCompetitor(),
          win1: 0,
          win2: 0,
          depth: node.depth,
          id: node.data.name
        };
        node.pair = Pair;
        this.props.addGroup(Pair);
        arrPairs.push(Pair);
      }
    });
    arrIdPairs.forEach(node => this.props.addGroup(node.pair));
    this.currentPairs = arrPairs;
  }
  createEmptyCompetitor() {
    return {
      surname: 'no',
      name: '',
      patronomics: '',
      age: 0,
      qiu: 10,
      mass: 0
    };
  }

  getSocketData() {
    this.setState({ isVoiting: !this.state.isVoiting });
    this.props.socket.emit(
      COMMUNITY_VOITING,
      this.state.isVoiting,
      this.props.user
    );
  }

  countDeepLevelTree(currentCompetitors) {
    if (currentCompetitors.length !== 0)
      this.levels = Math.ceil(
        Math.log2(Math.ceil(currentCompetitors.length / 2))
      );
  }
  currentSets(event) {
    let currentTournir = this.props.tournirs.find(
      tournir => tournir.id === Number(event.target.value)
    );
    let currCompetitors = this.filterCompetitors(currentTournir);
    this.countDeepLevelTree(currCompetitors);
    this.currentCompetitors = currCompetitors;
    this.setState({
      currentCompetitors: currCompetitors,
      currentTournir: currentTournir
    });
    this.props.setActiveTournir(currentTournir);
    this.updateD3();
  }
  filterCompetitors(currentTournir) {
    return this.props.competitors.filter(
      competitor =>
        competitor.qiu <= currentTournir.qiuRange.min &&
        competitor.qiu > currentTournir.qiuRange.max &&
        competitor.age >= currentTournir.ageRange.min &&
        competitor.age < currentTournir.ageRange.max
    );
  }
  componentWillMount() {}

  render() {
    const widthGraph = this.levels * 300,
      heightGraph = 2 ** this.levels * 150;
    const { isVoiting, currentCompetitors, currentTournir } = this.state;
    return (
      <div className={'rounds-main'}>
        <div className={'container-rounds-list'}>
          <select
            className={'container-rounds'}
            onChange={this.currentSets}
            value={currentTournir.id}
          >
            {this.props.tournirs.map((tournir, i) => (
              <option key={i} value={tournir.id}>
                {tournir.id +
                  1 +
                  '. Кю: ' +
                  tournir.qiuRange.min +
                  '-' +
                  tournir.qiuRange.max +
                  '; Возраст: ' +
                  tournir.ageRange.min +
                  '-' +
                  tournir.ageRange.max}
              </option>
            ))}
          </select>
          <div>
            {currentCompetitors.map((competitor, i) => (
              <div className={'list-competitor'} key={i}>
                <span>
                  {i + 1 + '. ' + competitor.name + ' ' + competitor.surname}
                </span>
                <br />
              </div>
            ))}
          </div>
          <button
            className={'stBtn' + isVoiting ? 'startBtn' : 'stopBtn'}
            onClick={this.getSocketData}
          >
            {isVoiting ? 'START' : 'STOP'}
          </button>
        </div>

        <div ref={ref => (this.ref = ref)} className={'Graph'}>
          <div className={'inner-graph'}>
            <svg width={widthGraph + 300} height={heightGraph + 100}>
              {
                <Graph
                  nodes={this.nodes}
                  links={this.links}
                  currentPairs={this.currentPairs}
                  x={0}
                  y={0}
                  width={widthGraph}
                  height={heightGraph}
                  toggleMenu={this.toggleMenu}
                />
              }
            </svg>
          </div>
          {this.state.showMenu && (
            <MenuCompetitors
              currCompetitors={this.state.currentCompetitors}
              menuSelect={this.menuSelect}
              hideMenu={this.HideMenu}
              x={this.state.xMenu}
              y={this.state.yMenu}
            />
          )}
        </div>
      </div>
    );
  }
}

export default connectDecorator(
  Rounds,
  [
    'setActiveTournir',
    'destroyAllGroups',
    'addGroup',
    'destroyGroup',
    'addScore',
    'destroyScore'
  ],
  store => ({
    tournirs: store.tournirs,
    competitors: store.competitors,
    activeTournir: store.activeTournir
  })
);
