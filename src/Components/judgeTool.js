import React, { Component } from 'react';
import "./judgeTool.css"
class judgeTool extends Component {
	constructor(props) {
        super(props);
        this.state={
            choise:'',
			isDisable: false,
        };
        this.choose = this.choose.bind(this);
		this.change	=this.change.bind(this);
        
    }
	choose(nameChoose){
		this.setState({choise:nameChoose, isDisable: true});
		console.log(nameChoose);
	}
	change(){
		this.setState({isDisable:false,choise:''})
	}
    render(){
        return(
				
				<div className = {'pultik'}>
						<button className = {'red'} onClick = {this.choose.bind(this,'red')} disabled = {this.state.isDisable}>{'Aka'}</button>
						<button className = {'blue'} onClick = {this.choose.bind(this,'blue')} disabled = {this.state.isDisable}>{'Shiro'}</button>
						<button className = {'changeSelect'} onClick = {this.change}>{'Change'}</button>
				</div>
        )
    }
}
export default judgeTool;
