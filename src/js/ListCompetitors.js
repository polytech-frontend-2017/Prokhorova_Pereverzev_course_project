import React,{ Component } from 'react';
import connectDecorator from "../context/connectDecorator";
import '../Lists.css';
import '../form.css';

class ListCompetitors extends Component {
    constructor(props){
        super();
        this.state={
            surname:'',
            name:'',
            patronomics:'',
            age:'',
            qiu:'',
            mass:'',
        };
        this.textInput = null;
        this.focus = this.focus.bind(this);
        this.changeSurname=this.changeSurname.bind(this);
        this.changeName=this.changeName.bind(this);
        this.changePatronomics=this.changePatronomics.bind(this);
        this.changeAge=this.changeAge.bind(this);
        this.changeQiu=this.changeQiu.bind(this);
        this.changeMass=this.changeMass.bind(this);
        this.handleAddCompetitor=this.handleAddCompetitor.bind(this);
    }
    focus() {
        this.textInput.focus();
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
    handleAddCompetitor(event){
        event.preventDefault();
        this.props.addCompetitor(
            this.state.name,
            this.state.surname,
            this.state.patronomics,
            this.state.qiu,
            this.state.age,
            this.state.mass,
        );
        this.setState({surname:'',
            name:'',
            patronomics:'',
            age:'',
            qiu:'',
            mass:'',
        });
        this.focus();
    }
    handleDestroy(id){
        this.props.destroyCompetitor(id);
    }
    render(){

        return(
            <div className={'baseDiv'}>
                <article className={"add-form"}>
                    <form className={'formInput'} onSubmit={this.handleAddCompetitor}>
                        <h1>
                            Добавить участника
                        </h1>
                        <div className={'left-input'}>
                            <div className={'group_input'}>
                                <input type={'text'} value={this.state.surname}
                                       onInput={this.changeSurname} required
                                       placeholder={'Фамилия'}
                                       ref={(input) => { this.textInput = input; }}/></div>
                            <div className={'group_input'}>
                                <input type={'text'} value={this.state.name}
                                       onInput={this.changeName} required
                                       placeholder={'Имя'}/></div>
                            <div className={'group_input'}>
                                <input type={'text'} value={this.state.patronomics}
                                       onInput={this.changePatronomics} required
                                       placeholder={'Отчество'}/></div>
                        </div>
                        <div className={'right-input'}>
                            <div className={'group_input short'}>
                                <label>Ранг:</label>
                                    <input type={'number'} value={this.state.qiu} min={-10} max={10}
                                           onInput={this.changeQiu} required/></div>
                            <div className={'group_input short'}>
                                <label>Возраст:</label>
                                <input type={'number'} value={this.state.age} min={1} max={150}
                                       onInput={this.changeAge} required/></div>
                            <div className={'group_input short'}>
                                <label>Вес:</label>
                                <input type={'number'} value={this.state.mass} min={1} max={150}
                                       onInput={this.changeMass} required/></div>
                        </div>
                            <br/>
                        <div className="submit-button">
                        <input type={'submit'} value={'Добавить'}/></div>
                    </form>
                </article>
                <div className="table-title"><h3>Соревнующиеся</h3></div>
                <table className={'table-fill'}>
                    <tbody>
                        <tr><th>№</th><th>Фамилия</th><th>Имя</th><th>Отчество</th><th>Возраст</th><th>Ранг</th><th>Вес</th><th/></tr>
                        {this.props.competitors.map((competitor,i)=>
                            <tr key={i}>
                                <td>{i}</td>
                                <td>{competitor.surname}</td>
                                <td>{competitor.name}</td>
                                <td>{competitor.patronomics}</td>
                                <td>{competitor.age}</td>
                                <td>{competitor.qiu}</td>
                                <td>{competitor.mass} </td>
                                <td>
                                    <svg className={'btnDestroy'} onClick={this.handleDestroy.bind(this,competitor.id)}
                                         xmlns="http://www.w3.org/2000/svg" viewBox="0 0 138.03 138.03">
                                        <path d="M138.92,121.51l-114-114C14-3.42-3,13.55,7.95,24.49l114,114c10.94,10.94,27.91-6,17-17Z"
                                              transform="translate(-4.41 -3.98)" fill="#ff0000"/>
                                        <path d="M121.95,7.51l-114,114c-10.94,10.94,6,27.91,17,17l114-114c10.94-10.94-6-27.91-17-17Z"
                                              transform="translate(-4.41 -3.98)" fill="#ff0000"/>
                                    </svg></td>
                            </tr>)}
                    </tbody>
                </table>
            </div>

        );
    }

}

export default connectDecorator(ListCompetitors,
    ['addCompetitor','destroyCompetitor'],
    store => ({
        competitors: store.competitors,
    })
);

