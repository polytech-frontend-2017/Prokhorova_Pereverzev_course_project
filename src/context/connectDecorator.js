import React, { Component } from 'react';
import PropTypes from 'prop-types';
export default function connectDecorator(OriginalComponent, methods = ['createCompetition'], getData) {
    class Connected extends Component {
        constructor(props, context){
            super(props, context);
            this.methods = methods.reduce(
                (acc, methodName) => {
                    acc[methodName] = this.context.store[methodName].bind(this.context.store);
                    return acc;
                    // return {
                    //     ...acc,
                    //     [methodName]: smth
                    // }
                },
                {}
            );
            this.context.store.addListener(() => this.setState({
                storeVersion: this.state.storeVersion++
            }));
        }
        componentWillMount() {
            this.setState({
                storeVersion: 0
            })
        }
        render() {
            return <OriginalComponent
                {...this.props}
                {...this.methods}
                {...getData(this.context.store)}
            />;
        }
    }

    Connected.contextTypes = {
        store: PropTypes.object
    };

    Connected.displayName = `Connected(${OriginalComponent.displayName || OriginalComponent.name })`;
    return Connected;
}