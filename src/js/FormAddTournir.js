import React,{ Component } from 'react';
import connectDecorator from "../context/connectDecorator";

class FormAddTournir extends Component {

    constructor(props){
        super(props);
        this.minAge='';
        this.maxAge='';
        this.minKiu='';
        this.maxKiu='';
        this.handlerAddTournir=this.handlerAddTournir.bind(this);
    }
    handlerAddTournir(event){
        event.preventDefault();
        this.props.addTournir(this.minAge.value,this.maxAge.value,this.minKiu.value,this.maxKiu.value);
    }

    render(){
        if(this.props.showOrHideForm)
        return(
            <form style={stylesForm.formAdd} onSubmit={this.handlerAddTournir}>
                <p>Возраст:<br/>
                    <input type="number" min={1} max={100} title={'Минимальный возраст'} required autoFocus
                           defaultValue={''}  ref={(input) => this.minAge = input}/> -
                    <input type="number" min={1} max={100} title={'Максимальный возраст'} required
                           defaultValue={''} ref={(input) => this.maxAge = input}/></p>
                <p>Кю/дан:<br/>
                    <input type="number" min={1} max={10} title={'Минимальный кю/дан'} required
                           defaultValue={''} ref={(input) => this.minKiu = input}/> -
                    <input type="number" min={1} max={10} title={'Максимальный кю/дан'} required
                           defaultValue={''} ref={(input) => this.maxKiu = input}/>
                </p>
                <br/><input type="submit" value={'Добавить'}/>
            </form>
        );
    else return null}
}
export default connectDecorator(FormAddTournir,
    ['addTournir',],
    store => ({})
);

const stylesForm = {
    formAdd:{
        /*width:'inherit',
        backgroundColor:'#fff',
        color:'#000',
        display: 'inline-block',*/
    },

};