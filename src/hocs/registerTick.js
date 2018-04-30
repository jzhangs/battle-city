import React from 'react';
import { connect } from 'react-redux';
import wrapDisplayName from 'recompose/wrapDisplayName';
import * as _ from 'lodash';
import * as selectors from 'utils/selectors';

export default function registerTick(...intervals) {
  const sum = _.sum(intervals);
  return function (BaseComponent) {
    class Component extends React.Component {
      static displayName = wrapDisplayName(BaseComponent, 'registerTick');

      constructor(props) {
        super(props);
        this.startTime = props.time;
      }

      render() {
        const { time, ...otherProps } = this.props;
        let t = (time - this.startTime) % sum;
        let tickIndex = 0;
        while (intervals[tickIndex] < t) {
          t -= intervals[tickIndex];
          tickIndex += 1;
        }
        return <BaseComponent tickIndex={tickIndex} {...otherProps} />;
      }
    }

    const enhance = connect(state => ({
      time: selectors.time(state)
    }));

    return enhance(Component);
  };
}
