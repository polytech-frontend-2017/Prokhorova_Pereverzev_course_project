import React,{ Component } from 'react';
import connectDecorator from "../context/connectDecorator";

class CompetitorsTable extends Component {
    constructor(props){
        super();
        this.state={
            surname:'',
            name:'',
            patronomics:'',
            age:'',
            qiu:'',
            mass:'',
        }
    }
    changeSurname(event){
        this.setState({surname:event.target.value})
    }
    changeName(event){
        this.setState({name:event.target.value})
    }
    changePatronomics(event){
        this.setState({patronomics:event.target.value})
    }
    changeAge(event){
        this.setState({age:event.target.value})
    }
    changeQiu(event){
        this.setState({qiu:event.target.value})
    }
    changeMass(event){
        this.setState({mass:event.target.value})
    }
    handleAddCompetitor(){
        this.props.addCompetitor(
            this.state.name,
            this.state.surname,
            this.state.patronomics,
            this.state.qiu,
            this.state.age,
            this.state.mass
        );

    }
    render(){
        return(
            <div style={stylesTable.baseDiv}>
                <form>
                <label>Фамилия:
                    <input type={'text'} defaultValue={this.state.surname} onInput={this.changeSurname.bind(this)}/></label>
                <label>Имя:
                    <input type={'text'} defaultValue={this.state.name} onInput={this.changeName.bind(this)}/></label>
                <label>Отчество:
                    <input type={'text'} defaultValue={this.state.patronomics} onInput={this.changePatronomics.bind(this)}/></label>
                <label>Ранг:
                    <input type={'text'} defaultValue={this.state.qiu} onInput={this.changeQiu.bind(this)}/></label>
                <label>Возраст:
                    <input type={'text'} defaultValue={this.state.age} onInput={this.changeAge.bind(this)}/></label>
                <label>Вес:
                    <input type={'text'} defaultValue={this.state.mass} onInput={this.changeMass.bind(this)}/></label>
                    <input type={'button'} value={'Добавить'} onClick={this.handleAddCompetitor.bind(this)}/>
                </form>
                <table>
                    <tbody>
                        <tr><td>№</td><td>Фамилия</td><td>Имя</td><td>Отчество</td><td>Возраст</td><td>Ранг</td><td>Вес</td></tr>
                        {this.props.competitors.map((competitor,i)=>
                            <tr key={i}>
                                <td>{i}</td>
                                <td>{competitor.surname}</td>
                                <td>{competitor.name}</td>
                                <td>{competitor.patronomics}</td>
                                <td>{competitor.age}</td>
                                <td>{competitor.qiu}</td>
                                <td>{competitor.mass}</td>
                            </tr>)}
                    </tbody>
                </table>
            </div>

        )};

}

export default connectDecorator(CompetitorsTable,
    ['addCompetitor'],
    store => ({
        competitors: store.competitors,
    })
);

const stylesTable = {
    baseDiv:{
        margin:'0 0',
        padding:'0px',
        width:'500px',
        backgroundColor:'#fff',
        color:'#000',
        display: 'block',
    },

};