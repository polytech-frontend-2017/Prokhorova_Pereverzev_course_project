import { Component } from 'react';
import PropTypes from 'prop-types';

/** class returns store props for other components  */
export default class Provider extends Component {
    getChildContext() {
        return {
            store: this.props.store
        };
    }
    render(){
        return this.props.children;
    }
}

Provider.childContextTypes = {
    store: PropTypes.object
};