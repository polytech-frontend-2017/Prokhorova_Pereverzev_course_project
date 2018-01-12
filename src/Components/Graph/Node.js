import React, { Component } from 'react';
import "./Node.css"


class Node extends Component {
    constructor(props) {
        super(props);
        this.state={
            widthRectComp:this.props.width-30,
            heightRectComp:this.props.height/2-15,

        };
        this.firstName="no";
        this.secondName="no";
        this.win1=0;
        this.win2=0;
        this.changeNameFirst=this.changeNameFirst.bind(this);
        this.changeNameSecond=this.changeNameSecond.bind(this);
        this.showChoose=this.showChoose.bind(this);
        this.updatePair(props);
    }
    updatePair(props){
        let Name_1="", Name_2="";
        if(props.pair.name1 && props.pair.name2) {
            props.pair.name1.name ? Name_1 = props.pair.name1.name.substr(0, 1) + "." : "";
            props.pair.name2.name ? Name_2 = props.pair.name2.name.substr(0, 1) + "." : "";
            Name_1 = props.pair.name1.surname + " " + Name_1;
            Name_2 = props.pair.name2.surname + " " + Name_2;
            this.firstName = Name_1;
            this.secondName = Name_2;
            this.win1 = 0;
            this.win2 = 0;
        }
    }
    changeNameFirst(name){
        this.setState({firstName:name});
    }
    changeNameSecond(name){
        this.setState({secondName:name});
    }
    componentWillReceiveProps(newProps) {
        this.updatePair(newProps)
    }
    showChoose(num,event){
        event.preventDefault();
        let y;
        switch (num){
            case 1:
                y = this.props.y+10;
                break;
            default:
                y = this.props.y+this.props.height/2;
        }
        this.props.showMenu(
            this.props.x,
            y,
            this.props.id,
            num,
            );
    }

    render() {
        const active=this.props.activePair === this.props.id;
        const x=this.props.x,
            y=this.props.y;
        let translate = "translate(" + x + "," + (y-this.props.height/2) + ")";
        let label = "Group "+this.props.index;
        return(
            <g transform={translate}
               className={"node" + (active ?" activePair":"")}
               onClick={()=>{this.props.setActivePairInGraph(this.props.id)}}>
                <g className={"inner-g"} onContextMenu={this.showChoose.bind(this,1)}>
                    <rect
                        width={this.state.widthRectComp}
                        height={this.state.heightRectComp}
                        className={"rectComp"}
                        transform="translate(0, 20)"/>
                    <text x={5} y={this.state.heightRectComp+10} className={"text-group"}>
                        {this.firstName}
                        </text>
                    <rect
                        width={this.state.heightRectComp}
                        height={this.state.heightRectComp}
                        className={"rectComp"}
                        transform={"translate("+this.state.widthRectComp+", 20)"}
                    />
                    <text
                          x={this.state.widthRectComp-5+this.state.heightRectComp/2}
                          y={(this.state.heightRectComp+10)}
                          className={"text-group"}>
                        {this.win1}
                          </text>
                </g>
                <g className={"inner-g"} onContextMenu={this.showChoose.bind(this,2)}>
                    <rect
                        width={this.state.widthRectComp}
                        height={this.state.heightRectComp}
                        className={"rectComp"}
                        transform={"translate(0, "+(this.state.heightRectComp+25)+")"}
                    />
                    <text x={5} y={this.state.heightRectComp*2+15} className={"text-group"}>
                        {this.secondName}
                        </text>
                    <rect
                        width={this.state.heightRectComp}
                        height={this.state.heightRectComp}
                        className={"rectComp"}
                        transform={"translate("+this.state.widthRectComp+","+(this.state.heightRectComp+25)+")"}
                    />
                    <text
                          x={this.state.widthRectComp-5+this.state.heightRectComp/2}
                          y={(this.state.heightRectComp*2+15)}
                          className={"text-group"}>
                        {this.win2}
                        </text>
                </g>
                <text x={5} y={17} className={"text-group"}>{label}</text>




            </g>
        );
    }
}
export default Node;