import React, { Component } from 'react';
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
      activePair: '',
      nodes: this.props.nodes,
      links: this.props.links
    };
    this.activepairid = '';
    this.linkHorizontal = this.linkHorizontal.bind(this);
    this.setActivePairInGraph = this.setActivePairInGraph.bind(this);
  }
  componentWillReceiveProps(newProps) {
    this.setState({
      nodes: newProps.nodes,
      links: newProps.links,
      activePair: this.state.activePair
    });
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
  render() {
    const activePair = this.activepairid;
    const translate =
      'translate(' + this.props.x + 50 + ',' + this.props.y + ')';
    const { links, nodes } = this.state;
    return (
      <g className="graph" transform={translate}>
        <g className="graph-pairs">
          {links.map(this.linkHorizontal)}
          {nodes.map((node, index) => (
            <Node
              id={node.data.name}
              x={this.props.width - node.y}
              y={node.x}
              width={210}
              height={100}
              index={index}
              pair={node.pair}
              key={'graph-' + node.data.name}
              showMenu={this.props.toggleMenu}
              activePair={activePair}
              setActivePairInGraph={this.setActivePairInGraph}
            />
          ))}
        </g>
      </g>
    );
  }
}

export default connectDecorator(
  Graph,
  ['addScore', 'destroyScore'],
  store => ({})
);
