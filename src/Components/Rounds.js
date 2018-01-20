import React, { Component } from 'react';
import connectDecorator from '../context/connectDecorator';
import './Rounds.css';
import Graph from './Graph';
import MenuCompetitors from './Graph/MenuCompetitors';
import { VOICE_RECIEVED, COMMUNITY_VOITING } from '../Events.js';
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
    //this.currentTournir = this.props.activeTournir;
    //this.currentCompetitors = this.filterCompetitors(this.currentTournir);
    this.state = {
      judgeVoices: [],
      judgeVoicesCount: { win1: 0, win2: 0, id: '' },
      user: null,
      currentTournir: this.props.activeTournir,
      currentCompetitors: this.filterCompetitors(this.props.activeTournir),
      isVoiting: true,
      showMenu: false,
      xMenu: 50,
      yMenu: 50,
      fixed: this.props.activeTournir.fixed,
      numberName: null,
      line: d3.line(),
      root: [],
      nodes: [],
      links: [],
      DataNodes: [],
      activePair: '',
      levels: 0
    };
    this.d3tree = d3.tree();
    this.line = d3.line();
    this.createPairs = this.createPairs.bind(this);
    this.fixedTournir = this.fixedTournir.bind(this);
    this.createD3 = this.createD3.bind(this);
    this.newEmptyTree = this.newEmptyTree.bind(this);
    this.updateD3 = this.updateD3.bind(this);

    this.toggleMenuName = this.toggleMenuName.bind(this);
    this.HideMenu = this.HideMenu.bind(this);
    this.menuSelect = this.menuSelect.bind(this);
    this.setActivePairId = this.setActivePairId.bind(this);
    this.changeScore = this.changeScore.bind(this);

    this.currentSets = this.currentSets.bind(this);
    this.filterCompetitors = this.filterCompetitors.bind(this);
    this.countDeepLevelTree = this.countDeepLevelTree.bind(this);
    this.getSocketDataVoiting = this.getSocketDataVoiting.bind(this);

    this.props.socket.on(VOICE_RECIEVED, judgeVoices => {
      this.changeScore(judgeVoices);
    });
  }
  changeScore(judgeVoices) {
    let arrVoices = [];
    for (let key in judgeVoices) arrVoices.push(judgeVoices[key]);
    console.log(this.state.activePair);
    let Node = this.state.nodes.find(
      node => node.data.name === this.state.activePair
    );
    console.log(Node);
    console.log(judgeVoices);
    let judgeVoicesCount = this.countVoices(judgeVoices, this.state.activePair);
    if (Node) {
      Node.pair.win1 = judgeVoicesCount.win1;
      Node.pair.win2 = judgeVoicesCount.win2;
      this.props.addScore(
        Node.pair.id,
        1,
        this.state.currentTournir.id,
        judgeVoicesCount.win1
      );
      this.props.addScore(
        Node.pair.id,
        2,
        this.state.currentTournir.id,
        judgeVoicesCount.win2
      );
    }
    this.setState({
      judgeVoices: arrVoices,
      judgeVoicesCount: judgeVoicesCount
    });
  }
  countVoices(judgeVoices, idPair) {
    let win1 = 0,
      win2 = 0;
    for (let key in judgeVoices)
      judgeVoices[key].voice === 'red' ? win1++ : win2++;
    return { win1, win2, id: idPair };
  }
  createD3(level, currCompetitors, currTournir) {
    let emptyTree = this.newEmptyTree(level);
    let fillTree = this.createPairs(
      level,
      emptyTree,
      currCompetitors,
      currTournir
    );
    return fillTree;
  }
  newEmptyTree(level) {
    let DataNodes_ = createEmptyDataTree(level, null, 0);
    let root = d3.hierarchy(DataNodes_[0], function(d) {
      return d.children;
    });
    const widthGraph = level * 300,
      heightGraph = 2 ** level * 150;
    root.x0 = heightGraph / 2;
    root.y0 = 0;
    let d3Tree = this.d3tree;
    d3Tree.size([heightGraph, widthGraph]);
    let treeData = d3Tree(root);
    let nodes = treeData.descendants();
    let links = treeData.descendants().slice(1);
    if (level === 0) links = [];
    return {
      DataNodes: DataNodes_,
      root: root,
      d3tree: d3Tree,
      nodes: nodes,
      links: links
    };
  }
  updateD3(level, currCompetitors, currTournir) {
    //count number of graph competitors in last level
    let pairsLastLevel = currTournir.groups.filter(
      pair => pair.depth === this.levels
    );
    let AllCompetotors = pairsLastLevel.reduce(function(curr, pair) {
      return [...curr, pair.name1, pair.name2];
    }, []);
    AllCompetotors = AllCompetotors.filter((value, index, self) => {
      return self.indexOf(value) === index && value.surname !== 'no';
    });

    let fillTree = {};
    if (AllCompetotors.length !== currCompetitors.length && !currTournir.fixed)
      fillTree = this.createD3(level, currCompetitors, currTournir);
    else {
      fillTree = this.fillNodesByPairs(currTournir);
    }
    return fillTree;
  }
  fillNodesByPairs(currTournir) {
    let pairs = currTournir.groups;
    let Level = Math.ceil(Math.log2(pairs.length / 2 + 1) - 1);
    let emptyTree = this.newEmptyTree(Level);
    emptyTree.nodes.map(
      node => (node.pair = pairs.find(pair => pair.id === node.data.name))
    );
    return emptyTree;
  }
  toggleMenuName(x, y, activePair, NumberName) {
    this.setState({
      numberName: NumberName,
      activePair: activePair,
      showMenu: true,
      xMenu: x,
      yMenu: y
    });
  }
  setActivePairId(id) {
    this.setState({ activePair: id });
  }
  HideMenu() {
    this.setState({ showMenu: false });
  }
  menuSelect(selectValue) {
    let node = this.state.nodes.find(
      node => node.pair.id === this.state.activePair
    );
    switch (this.state.numberName) {
      case 1:
        if (selectValue && selectValue.value.id !== node.pair.name2.id)
          node.pair.name1 = selectValue.value;
        break;
      default:
        if (selectValue && node.pair.name1.id !== selectValue.value.id)
          node.pair.name2 = selectValue.value;
    }
    this.HideMenu();
    /** ...change pair */
    this.props.destroyGroup(node.pair.id, this.state.currentTournir.id);
    this.props.addGroup(node.pair, this.state.currentTournir.id);
  }
  createPairs(level, emptyTree, currCompetitors, currTournir) {
    this.props.destroyAllGroups(currTournir.id);
    let arrPairs = [];
    let nodesLastLvl = emptyTree.nodes.filter(node => node.depth === level);
    let indexNode = 0;
    for (let i = 0; i < currCompetitors.length; i += 2) {
      let pair = this.createPair(
        currCompetitors[i],
        currCompetitors[i + 1],
        0,
        0,
        level,
        nodesLastLvl[indexNode].data.name
      );
      nodesLastLvl[indexNode++].pair = pair; //!!!!!!!!!!!!!!!!!!!!!
      arrPairs.push(pair);
    }
    if (currCompetitors.length % 2 !== 0)
      nodesLastLvl[indexNode - 1].pair.name2 = this.createEmptyCompetitor();
    emptyTree.nodes.map(node => {
      if (!node.pair) {
        const Pair = this.createPair(
          this.createEmptyCompetitor(),
          this.createEmptyCompetitor(),
          0,
          0,
          node.depth,
          node.data.name
        );
        node.pair = Pair;
        this.props.addGroup(Pair, currTournir.id);
        arrPairs.push(Pair);
      }
      this.props.addGroup(node.pair, currTournir.id);
      return true;
    });
    return emptyTree;
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
  createPair(competitor1_, competitor2_, win1_, win2_, depth_, id_) {
    return {
      name1: competitor1_,
      name2: competitor2_,
      win1: win1_,
      win2: win2_,
      depth: depth_,
      id: id_
    };
  }

  getSocketDataVoiting() {
    this.setState({ isVoiting: !this.state.isVoiting });
    this.props.socket.emit(
      COMMUNITY_VOITING,
      this.state.isVoiting,
      this.props.user
    );
  }
  fixedTournir() {
    this.props.fixedTournir(this.state.currentTournir.id);
    this.setState({ fixed: !this.state.fixed });
  }
  countDeepLevelTree(currentCompetitors) {
    let level = 0;
    if (currentCompetitors.length !== 0)
      level = Math.ceil(Math.log2(Math.ceil(currentCompetitors.length / 2)));
    return level;
  }
  currentSets(event) {
    let currentTournir = this.props.tournirs.find(
      tournir => tournir.id === Number(event.target.value)
    );
    this.props.changeactiveTournir(currentTournir);
    let currCompetitors = this.filterCompetitors(currentTournir);
    let level = this.countDeepLevelTree(currCompetitors);
    let fillTree = this.updateD3(level, currCompetitors, currentTournir);
    this.setState({
      currentTournir: currentTournir,
      currentCompetitors: currCompetitors,
      levels: level,
      DataNodes: fillTree.DataNodes,
      root: fillTree.root,
      d3tree: fillTree.d3tree,
      nodes: fillTree.nodes,
      links: fillTree.links,
      fixed: currentTournir.fixed
    });
  }
  filterCompetitors(currentTournir) {
    return this.props.competitors.filter(competitor =>
      competitor.tournirsId.find(id => id === currentTournir.id)
    );
  }
  componentWillMount() {
    let currCompetitors = this.filterCompetitors(this.props.activeTournir);
    /*for (let i = 0; i < 30; i++) currCompetitors.push(currCompetitors[0]);*/
    let level = 0;
    if (currCompetitors.length !== 0)
      level = Math.ceil(Math.log2(Math.ceil(currCompetitors.length / 2)));
    let fillTree = this.updateD3(
      level,
      currCompetitors,
      this.props.activeTournir
    );
    this.setState({
      currentTournir: this.props.activeTournir,
      currentCompetitors: currCompetitors,
      levels: level,
      DataNodes: fillTree.DataNodes,
      root: fillTree.root,
      d3tree: fillTree.d3tree,
      nodes: fillTree.nodes,
      links: fillTree.links,
      activePair: fillTree.nodes[fillTree.nodes.length - 1].data.name
    });
  }
  render() {
    const {
      isVoiting,
      currentTournir,
      currentCompetitors,
      fixed,
      judgeVoices,
      activePair,
      showMenu,
      xMenu,
      yMenu,
      nodes,
      links
    } = this.state;
    let { levels } = this.state;
    if (currentTournir.fixed)
      levels = Math.ceil(Math.log2(currentTournir.groups.length / 2 + 1) - 1);
    const widthGraph = levels * 300,
      heightGraph = 2 ** levels * 130;
    const Height = window.innerHeight - 111;
    return (
      <div className={'rounds-main'}>
        <div className={'container-rounds-list'} style={{ height: Height }}>
          <select
            className={'container-rounds'}
            onChange={this.currentSets}
            value={currentTournir.id}
          >
            {this.props.tournirs.map((tournir, i) => (
              <option key={i} value={tournir.id}>
                {tournir.id +
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
          <div className={'competitors-table-rounds'}>
            <table className={'table-competitor-rounds'}>
              <tbody>
                {currentCompetitors.map((competitor, i) => (
                  <tr key={i}>
                    <td className={'list-competitor-rounds'}>
                      {i +
                        1 +
                        '. ' +
                        competitor.name +
                        ' ' +
                        competitor.surname}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div
          ref={ref => (this.ref = ref)}
          className={'Graph'}
          style={{ width: window.innerWidth - 300 + 'px' }}
        >
          <div
            className={'inner-graph'}
            style={{ height: Height + 'px' }}
            onClick={this.HideMenu}
          >
            <svg width={widthGraph + 300} height={heightGraph + 100}>
              {currentCompetitors.length > 1 && (
                <Graph
                  judgeVoices={judgeVoices}
                  fixed={fixed}
                  nodes={nodes}
                  links={links}
                  x={0}
                  y={0}
                  width={widthGraph}
                  height={heightGraph}
                  activePair={activePair}
                  setActivePairId={this.setActivePairId}
                  toggleMenuName={this.toggleMenuName}
                />
              )}
            </svg>
          </div>
          {showMenu && (
            <MenuCompetitors
              currCompetitors={currentCompetitors}
              menuSelect={this.menuSelect}
              hideMenu={this.HideMenu}
              x={xMenu}
              y={yMenu}
            />
          )}
        </div>
        <div className={'btns-div-rounds'}>
          <button
            disabled={!fixed}
            className={
              'btn-rounds btn-voiting ' + (isVoiting ? 'startBtn' : 'stopBtn')
            }
            onClick={this.getSocketDataVoiting}
          >
            {isVoiting ? 'VOTE' : 'STOP VOTE'}
          </button>
          <button
            className={
              'btn-rounds fixed-btn ' + (fixed ? 'fixed' : 'not-fixed')
            }
            onClick={this.fixedTournir}
          >
            {fixed ? 'STOP' : 'START'}
          </button>
        </div>
      </div>
    );
  }
}

export default connectDecorator(
  Rounds,
  [
    'destroyAllGroups',
    'addGroup',
    'destroyGroup',
    'fixedTournir',
    'addScore',
    'destroyScore'
  ],
  store => ({
    tournirs: store.tournirs,
    competitors: store.competitors
  })
);
