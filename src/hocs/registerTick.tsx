import * as React from 'react';
import { connect } from 'react-redux';
import * as _ from 'lodash';
import { wrapDisplayName } from 'recompose';

import { State } from 'types';

export default function registerTick(...intervals: number[]) {
  const sum = _.sum(intervals);

  return function (BaseComponent: React.ComponentClass<any>) {
    class Component extends React.Component<{}, {}> {
      static displayName = wrapDisplayName(BaseComponent, 'registerTick');

      startTime: number;

      constructor(props: any) {
        super(props);
        this.startTime = props.time;
      }

      render() {
        const { time, ...otherProps } = this.props as any;
        let t = (time - this.startTime) % sum;
        let tickIndex = 0;
        while (intervals[tickIndex] < t) {
          t -= intervals[tickIndex];
          tickIndex += 1;
        }

        return <BaseComponent tickIndex={tickIndex} {...otherProps} />;
      }
    }

    const enhance: any = connect((state: State, ownProps) => ({
      ...ownProps,
      time: state.time
    }));

    return enhance(Component);
  };
}
