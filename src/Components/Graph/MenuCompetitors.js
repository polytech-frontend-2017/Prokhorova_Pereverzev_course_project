import React, { Component } from 'react';
import Select from 'react-select';
import PropTypes from 'prop-types';

class MenuCompetitors extends Component {
    /*propTypes: {
        label: PropTypes.string,
        searchable: PropTypes.bool,
    };*/
    constructor(props) {
        super(props);
        this.state = {
            name:"",
            size: 15.2,
            clearable:true,
            disabled: false,
            selectValue: 'new-name',
            rtl: false,
            searchable: true,
        };
        this.select="";
        this.updateValue = this.updateValue.bind(this);
        this.switchName = this.switchName.bind(this);
        this.clearValue = this.clearValue.bind(this);
    }
    updateValue(newValue){
        this.setState({
            selectValue: newValue,
        });
    }
    clearValue (e) {
        this.setState({
            selectValue: null,
        });
    }
    switchName (e) {
        let newName = e.target.value;
        this.setState({
            name: newName,
            selectValue: null,
        });
    }
    render() {

        let options = this.props.currCompetitors.map(c=>c={label:c.name+" "+c.surname,value:c});
        return(
            <g>
                <foreignObject x={this.props.x} y={this.props.y} width="300" height="300">
                    <Select
                        size={"210px"}
                        id="name-select"
                        ref={(ref) => { this.select = ref; }}
                        onBlurResetsInput={false}
                        onSelectResetsInput={false}
                        autoFocus
                        options={options}
                        clearable={this.state.clearable}
                        name="selected-name"
                        disabled={this.state.disabled}
                        value={this.state.selectValue}
                        onChange={this.updateValue}
                        rtl={this.state.rtl}
                        searchable={this.state.searchable}
                    />
                    <button style={{ marginTop: '15px' }} type="button" onClick={this.clearValue}>Clear Value</button>

                    <button onClick={()=>this.props.menuSelect(this.state.selectValue)}>Ok</button>
                </foreignObject>
            </g>
        );
    }
}

export default MenuCompetitors;