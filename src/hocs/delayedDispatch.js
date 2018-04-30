import React from 'react';
import { connect } from 'react-redux';
import wrapDisplayname from 'recompose/wrapDisplayName';
import * as selectors from 'utils/selectors';

export default function delayedDispatch(delay, propKey = 'delayedAction') {
  return function (BaseComponent) {
    class Component extends React.Component {
      static displayName = wrapDisplayname(BaseComponent, 'delayedDispatch');

      constructor(props) {
        super(props);
        this.startTime = 0;
        this.dispatched = false;
      }

      componentDidMount() {
        this.startTime = this.props.time;
      }

      componentDidUpdate() {
        const { dispatch, time } = this.props;
        if (!this.dispatched && time - this.startTime > delay) {
          this.dispatched = true;
          dispatch(this.props[propKey]);
        }
      }

      render() {
        return <BaseComponent {...this.props} />;
      }
    }

    const enhance = connect(state => ({
      time: selectors.time(state)
    }));

    return enhance(Component);
  };
}
