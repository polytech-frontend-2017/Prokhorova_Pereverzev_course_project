import React, { Component } from 'react';
import connectDecorator from "../context/connectDecorator";

class StartMenu extends Component {
    constructor(props) {
        super(props);
        this.state={
            size: 15.2,
            title:'',
            date:'',
        };
    }
    handleTitleChange(e){
        this.setState({title:e.target.value});
    }
    handleDateChange(e){
        this.setState({date:e.target.value});
    }
    handlerCreateCompetition(e){
        //must be ajax to server
        e.preventDefault();
        this.props.createCompetition(this.state.title,this.state.date);
        console.log(this.state.title+'; '+this.state.date);
    }
    render() {
        return (
            <div className="container">
                <form onSubmit={this.handlerCreateCompetition.bind(this)}>
                    <label>Competition</label>
                    {this.props.tournirsCount > 0 && <h3>Has {this.props.tournirsCount} tournirs</h3>}
                    <input size={this.state.size} type="text" name="title" placeholder="Name of competition"
                           value={this.state.title}
                           onInput={this.handleTitleChange.bind(this)}/>
                    <input size={this.state.size} type="date" name="date"
                           value={this.state.date}
                           onInput={this.handleDateChange.bind(this)}/>
                    <input type="submit"  value="Create"/>
                </form>
            </div>
        );
    }
}

export default connectDecorator(StartMenu,
    ['createCompetition'],
    store => ({
        tournirsCount: store.tournirs.length
    })
);