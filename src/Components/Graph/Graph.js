import React, { Component } from 'react';
import * as d3 from 'd3';
import connectDecorator from '../../context/connectDecorator';
import Node from './Node';
import MenuCompetitors from './MenuCompetitors';
import './Graph.css';
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

class Graph extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showMenu: false,
      xMenu: 50,
      yMenu: 50,
      selectedNodeId: '',
      numberName: null,
      activePair: null
    };
    this.activepairid = null;
    this.d3tree = d3.tree();
    this.line = d3.line();
    this.nodes = [];
    this.links = [];
    this.DataNodes = [];
    this.currentPairs = [];
    this.createDataNodes = this.createDataNodes.bind(this);
    this.createPairs = this.createPairs.bind(this);
    this.updateD3 = this.updateD3.bind(this);
    this.updatePairs = this.updatePairs.bind(this);
    this.linkHorizontal = this.linkHorizontal.bind(this);
    this.makeGraph = this.makeGraph.bind(this);
    this.toggleMenu = this.toggleMenu.bind(this);
    this.menuSelect = this.menuSelect.bind(this);
    this.HideMenu = this.HideMenu.bind(this);
    this.setActivePairInGraph = this.setActivePairInGraph.bind(this);
    this.updateD3(props);
  }
  createDataNodes(props) {
    if (props.deepLevel === -1) return false;
    this.DataNodes = createEmptyDataTree(props.deepLevel, null, 0);
    return true;
  }
  componentWillReceiveProps(newProps) {
    this.updateD3(newProps);
  }
  updateD3(props) {
    if (props.deepLevel === 0) this.links = [];
    if (this.createDataNodes(props)) {
      this.root = d3.hierarchy(this.DataNodes[0], function(d) {
        return d.children;
      });
      this.root.x0 = props.height / 2;
      this.root.y0 = 0;
      this.d3tree.size([props.height, props.width]);
      let treeData = this.d3tree(this.root);
      this.nodes = treeData.descendants();
      this.links = treeData.descendants().slice(1);
      this.updatePairs(props);
    }
  }
  updatePairs(props) {
    if (
      props.activeTournir.groups.filter(pair => pair.depth === props.deepLevel)
        .length === 0
    )
      this.createPairs(props);
    else {
      this.currentPairs = props.activeTournir.groups;
    }
  }
  toggleMenu(x, y, SelectedNodeId, NumberName) {
    if (SelectedNodeId !== '')
      this.setState({
        selectedNodeId: SelectedNodeId,
        numberName: NumberName
      });
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
    let nod = this.nodes.find(
      node => node.data.name === this.state.selectedNodeId
    );
    let pair = this.currentPairs.find(
      pair => pair.id === this.state.selectedNodeId
    );
    switch (this.state.numberName) {
      case 1:
        if (selectValue.value && selectValue.value.id !== pair.name2.id)
          pair.name1 = selectValue.value;
        break;
      default:
        if (selectValue.value && pair.name1.id !== selectValue.value.id)
          pair.name2 = selectValue.value;
    }
    /** ...change pair */
    this.props.destroyGroup(pair.id);
    this.props.addGroup(pair);
    nod.data.name = this.state.selectedNodeId;
  }
  createPairs(props) {
    if (props.currentCompetitors.length === 0) return [];
    props.destroyAllGroups();
    let arrPairs = [];
    let arrIdPairs = this.nodes.filter(node => node.depth === props.deepLevel);
    for (
      let i = 0, ind = 0;
      i < props.currentCompetitors.length;
      i += 2, ind++
    ) {
      let pair = {
        name1: props.currentCompetitors[i],
        name2: props.currentCompetitors[i + 1],
        win1: 0,
        win2: 0,
        depth: props.deepLevel,
        id: arrIdPairs[ind].data.name
      };
      arrPairs.push(pair);
    }
    if (props.currentCompetitors.length % 2 !== 0)
      arrPairs[arrPairs.length - 1].name2 = 'no';
    arrPairs.forEach(pair => props.addGroup(pair));
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
  makeGraph(node, index) {
    let Pair = this.currentPairs.find(pair => pair.id === node.data.name);
    if (Pair === undefined) {
      Pair = {
        name1: this.createEmptyCompetitor(),
        name2: this.createEmptyCompetitor(),
        win1: 0,
        win2: 0,
        depth: node.depth,
        id: node.data.name
      };
      this.currentPairs.push(Pair);
      this.props.addGroup(Pair, this.props.activeTournir.id);
    }
    let props = {
      id: node.data.name,
      x: this.props.width - node.y,
      y: node.x,
      width: 210,
      height: 100,
      index: index,
      pair: Pair,
      key: 'graph-' + node.data.name,
      showMenu: this.toggleMenu,
      activePair: this.activepairid,
      setActivePairInGraph: this.setActivePairInGraph
    };
    return <Node {...props} />;
  }
  linkHorizontal(link) {
    const parentX = this.props.width - link.parent.y + 10,
      targetX = this.props.width - link.y + 210;

    let d =
      'M ' +
      parentX +
      ',' +
      (link.parent.x + 10) +
      'C' +
      parentX +
      ',' +
      (link.parent.x + 10 + link.x) / 2 +
      ' ' +
      targetX +
      ',' +
      (link.parent.x + 10 + link.x) / 2 +
      ' ' +
      targetX +
      ',' +
      link.x;
    return <path className="link" d={d} key={link.data.name} />;
  }

  setActivePairInGraph(id) {
    this.activepairid = id;
    this.setState({ activePair: id });
  }
  /*componentWillMount(){
        if (this.props.deepLevel===0) this.links =[];
        this.createDataNodes(this.props);
        this.root =d3.hierarchy(this.DataNodes[0], function(d) { return d.children; });
        this.root.x0 = this.props.height / 2;
        this.root.y0 = 0;
        this.d3tree.size([this.props.height, this.props.width]);
        let treeData = this.d3tree(this.root);
        this.nodes = treeData.descendants();
        this.links = treeData.descendants().slice(1);
        this.updatePairs();
    }*/
  render() {
    const activePair = this.activepairid;
    const translate =
      'translate(' + this.props.x + 50 + ',' + this.props.y + ')';
    return (
      <g className="graph" transform={translate}>
        <g className="graph-pairs">
          {this.links.map(this.linkHorizontal)}
          {this.nodes.map(this.makeGraph)}
          {this.state.showMenu && (
            <MenuCompetitors
              currCompetitors={this.props.currentCompetitors}
              menuSelect={this.menuSelect}
              hideMenu={this.HideMenu}
              x={this.state.xMenu}
              y={this.state.yMenu}
            />
          )}
        </g>
      </g>
    );
  }
}

export default connectDecorator(
  Graph,
  ['addGroup', 'destroyGroup', 'destroyAllGroups', 'addScore', 'destroyScore'],
  store => ({})
);
