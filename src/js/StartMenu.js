import React, { Component } from 'react';

export class StartMenu extends Component {
    constructor(props) {
        super(props);
        this.handlerCreateCompetition = this.handlerCreateCompetition.bind(this);
    }
    handlerCreateCompetition(e){
        //console.dir(e.target.parentNode.parentNode[1].value);
        var form=e.target.parentNode.parentNode;
        this.props.data.addCompetition(form[0].value,form[1].value);
    }
    render() {
        return (
            <div className="conteiner">
                <form>
                    <p>Create Competition</p>
                    <input type="text" name="title" placeholder="Name of competition"/>
                    <span>Date:</span>
                    <input type="date" name="date" />
                    <p><input type="button" onClick={this.handlerCreateCompetition} value="Create Competition"/></p>
                </form>
            </div>
        );
    }
}

export default StartMenu;