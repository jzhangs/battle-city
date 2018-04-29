import React from 'react';
import { connect } from 'react-redux';

import Tank from 'components/tank';

function mapStateToProps(state) {
  return { state };
}

@connect(mapStateToProps)
export default class App extends React.Component {
  render() {
    return (
      <svg width="208" height="208" style={{ background: 'black' }}>
        <Tank x={0} y={0} color="yellow" />
        <Tank x={32} y={0} color="green" />
        <Tank x={0} y={32} color="silver" />
        <Tank x={32} y={32} color="red" />
      </svg>
    );
  }
}
