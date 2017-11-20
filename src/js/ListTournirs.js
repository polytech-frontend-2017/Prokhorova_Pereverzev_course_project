import React,{ Component } from 'react';
import connectDecorator from "../context/connectDecorator";
import '../Lists.css';

class ListTournirs extends Component {
    constructor(props){
        super();
        this.state={
            minAge:'',
            maxAge:'',
            minKiu:'',
            maxKiu:'',
            minMass:'',
            maxMass:'',
        };
        this.Id=0; //id tournir
        this.textInput = null;
        this.focus = this.focus.bind(this);
        this.handleAddTournir=this.handleAddTournir.bind(this);
        this.handleDestroy=this.handleDestroy.bind(this);
        this.changeMinAge=this.changeMinAge.bind(this);
        this.changeMaxAge=this.changeMaxAge.bind(this);
        this.changeMinKiu=this.changeMinKiu.bind(this);
        this.changeMaxKiu=this.changeMaxKiu.bind(this);
        this.changeMinMass=this.changeMinMass.bind(this);
        this.changeMaxMass=this.changeMaxMass.bind(this);
    }
    focus() {
        this.textInput.focus();
    }
    changeMinAge(event){
        this.setState({minAge:event.target.value})
    }
    changeMaxAge(event){
        this.setState({maxAge:event.target.value})
    }
    changeMinKiu(event){
        this.setState({minKiu:event.target.value})
    }
    changeMaxKiu(event){
        this.setState({maxKiu:event.target.value})
    }
    changeMinMass(event){
        this.setState({minMass:event.target.value})
    }
    changeMaxMass(event){
        this.setState({maxMass:event.target.value})
    }
    handleAddTournir(event) {
        event.preventDefault();
        this.props.addTournir(
            this.state.minAge,
            this.state.maxAge,
            this.state.minKiu,
            this.state.maxKiu,
            this.state.minMass,
            this.state.maxMass
        );

        this.setState({
            minAge:'',
            maxAge:'',
            minKiu:'',
            maxKiu:'',
            minMass:'',
            maxMass:'',
        });
        this.focus();
    }
    handleDestroy(id){
        this.props.destroyTournir(id);
    }
    render(){

            return(
            <div>
                <article className={"add-form"}>
                    <form className={'formInput'} onSubmit={this.handleAddTournir} >
                        <h1>
                            Добавить турнир
                        </h1>
                        <div className={'group_input short-tournir'}>
                            <label>Возраст:</label>
                            <input type={'number'} min={1} max={100} placeholder={'от'}
                                   value={this.state.minAge} onInput={this.changeMinAge} required
                                   ref={(input) => { this.textInput = input; }}/>&nbsp;—&nbsp;
                            <input type={'number'} min={1} max={100} placeholder={'до'}
                                   value={this.state.maxAge} onInput={this.changeMaxAge} required/>

                        </div>
                        <div className={'group_input short-tournir'}>
                            <label>Кю/дан:</label>
                            <input type={'number'} min={1} max={10} placeholder={'от'}
                                   value={this.state.minKiu} onInput={this.changeMinKiu} required/>&nbsp;—&nbsp;
                            <input type={'number'} min={1} max={10} placeholder={'до'}
                                   value={this.state.maxKiu} onInput={this.changeMaxKiu} required/>
                        </div>
                        <div className={'group_input short-tournir'}>
                    <label>Вес:</label>
                        <input type={'number'} min={1} max={150} placeholder={'от'}
                               value={this.state.minMass} onInput={this.changeMinMass} required/>&nbsp;—&nbsp;
                        <input type={'number'} min={1} max={150} placeholder={'до'}
                               value={this.state.maxMass} onInput={this.changeMaxMass} required/>
                        </div>
                        <div className="submit-button">
                            <input type="submit" value={'Добавить'}/>
                        </div>
                </form>
                </article>
                <div className="table-title"><h3>Турниры</h3></div>
                <table className={'table-fill'}>
                    <tbody>
                    <tr><th>№</th><th>Возраст</th><th>Кю/Дан</th><th>Вес</th><th/></tr>
                    {this.props.tournirs.map((tournir,i)=>
                        <tr key={i}>
                            <td>{i}</td>
                            <td>{tournir.ageRange.min+' - '+tournir.ageRange.max}</td>
                            <td>{tournir.qiuRange.min+' - '+tournir.qiuRange.max}</td>
                            <td>{tournir.massRange.min+' - '+tournir.massRange.max}</td>
                            <td>
                                <svg className={'btnDestroy'} onClick={this.handleDestroy.bind(this,tournir.id)}
                                     xmlns="http://www.w3.org/2000/svg" viewBox="0 0 138.03 138.03">
                                    <path d="M138.92,121.51l-114-114C14-3.42-3,13.55,7.95,24.49l114,114c10.94,10.94,27.91-6,17-17Z"
                                          transform="translate(-4.41 -3.98)" fill="#ff0000"/>
                                    <path d="M121.95,7.51l-114,114c-10.94,10.94,6,27.91,17,17l114-114c10.94-10.94-6-27.91-17-17Z"
                                          transform="translate(-4.41 -3.98)" fill="#ff0000"/>
                                </svg>
                            </td>
                        </tr>)}
                    </tbody>
                </table>
            </div>)

    }

}
export default connectDecorator(ListTournirs,
    ['addTournir','destroyTournir'],
    store => ({
        tournirs: store.tournirs,
    })
);

const stylesForm = {
    formAdd:{
        /*width:'inherit',
        backgroundColor:'#fff',
        color:'#000',
        display: 'inline-block',*/
    },

};