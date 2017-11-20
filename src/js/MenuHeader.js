import React,{ Component } from 'react';
import logo from '../logoAikido.svg';
import '../header.css';
import connectDecorator from "../context/connectDecorator";
import FormAddTournir from "./FormAddTournir.js";

class MenuHeader extends Component {
    constructor(props) {
        super(props);
        this.state={
            activeMenu:'Соревнование',
        };
        this.ShowOrHideForm=this.ShowOrHideForm.bind(this);
        this.menu=[
            {name:'Соревнующиеся'},
            {name:'Турниры'},
            {name:'Раунды'},
            {name:'Соревнование'},
        ];

    }
    ShowOrHideForm(name,event){
        this.setState({activeMenu:name});
        this.props.changeShow(name);
    }
    render(){
        return(
            <div className={'divStyle'}>
                <img src={logo} className={'Applogo'} alt="logo" />
                <div className = {'titletext'}>{this.props.competitionName+' /'+this.props.competitionDate}</div>
                <ul>
                    { this.menu.map((m,i) => {

                        return (
                            <div key={i} className={'conteiner-li'}>
                            <div className={'verticalLine'}/>
                            <li className={(m.name===this.state.activeMenu)?'selected':null}
                                onClick={this.ShowOrHideForm.bind(this,m.name)}>
                                <a>{m.name}</a></li>
                            </div>
                        );
                    })}
                    <div className={'verticalLine'}/>
                </ul>
            </div>
        )
    }
}

export default connectDecorator(MenuHeader,
    [],
    store => ({
        competitionName: store.competition.title,
        competitionDate: store.competition.date,
    })
);
