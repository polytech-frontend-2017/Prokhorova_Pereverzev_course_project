import React, { Component } from 'react';
import connectDecorator from "../context/connectDecorator";
import '../App.css';

class CreateCompMenu extends Component {
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
    }
    render() {
        return (
                <div className={"create-comp-menu"}>
                    <header className="App-header">
                        <h1 className="App-title">Менеджер Соревнований</h1>
                    </header>
                    <div className="container">
                    <form onSubmit={this.handlerCreateCompetition.bind(this)}>
                        <label className='container-label'>Соревнование</label>
                        {/*this.props.tournirsCount > 0 && <h3>Has {this.props.tournirsCount} tournirs</h3>*/}
                        <input className='container-input' size={this.state.size}
                               type="text" name="title" placeholder="Наименование" required
                               defaultValue={this.state.title}
                               onInput={this.handleTitleChange.bind(this)}/>
                        <input className='container-input' size={this.state.size}
                               type="date" name="date" required
                               defaultValue={this.state.date}
                               onInput={this.handleDateChange.bind(this)}/>
                        <button className='container-input submit-btn' type={"submit"} >Создать</button>
                    </form>
                    </div>
                </div>
            );
        }

}

export default connectDecorator(CreateCompMenu,
    ['createCompetition'],
    store => ({
        tournirsCount: store.tournirs.length,
    })
);