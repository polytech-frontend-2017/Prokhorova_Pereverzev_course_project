import React, { Component } from 'react';
import Node from './Node';
import './Graph.css';

class Graph extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nodes: this.props.nodes,
      links: this.props.links,
      judgeVoices: this.props.judgeVoices
    };
    this.linkHorizontal = this.linkHorizontal.bind(this);
  }
  componentWillReceiveProps(newProps) {
    this.setState({
      nodes: newProps.nodes,
      links: newProps.links,
      judgeVoices: newProps.judgeVoices
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

  render() {
    const translate =
      'translate(' + this.props.x + 50 + ',' + this.props.y + ')';
    const { links, nodes } = this.state;
    return (
      <g className="graph" transform={translate}>
        <g className="graph-pairs">
          {links.map(this.linkHorizontal)}
          {nodes.map((node, index) => (
            <Node
              judgeVoices={this.props.judgeVoices}
              id={node.data.name}
              x={this.props.width - node.y}
              y={node.x}
              width={210}
              height={100}
              index={index}
              pair={node.pair}
              key={'graph-' + node.data.name}
              showMenu={this.props.toggleMenuName}
              activePair={this.props.activePair}
              setActivePairId={this.props.setActivePairId}
            />
          ))}
        </g>
      </g>
    );
  }
}

export default Graph;
