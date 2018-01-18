import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default function connectDecorator(
  OriginalComponent,
  methods = ['createCompetition'],
  getData
) {
  class Connected extends Component {
    constructor(props, context) {
      super(props, context);
      this.methods = methods.reduce((acc, methodName) => {
        acc[methodName] = this.context.store[methodName].bind(
          this.context.store
        );
        return acc;
      }, {});
      this.context.store.addListener(
        () => (this.context.store.storeVersion += 1)
      );
    }
    componentWillMount() {}
    render() {
      //console.log("Store v: "+OriginalComponent.name+" "+this.context.store.storeVersion); //выдает warning(no-op)
      return (
        <OriginalComponent
          {...this.props}
          {...this.methods}
          {...getData(this.context.store)}
        />
      );
    }
  }

  Connected.contextTypes = {
    store: PropTypes.object
  };

  Connected.displayName = `Connected(${OriginalComponent.displayName ||
    OriginalComponent.name})`;
  return Connected;
}
