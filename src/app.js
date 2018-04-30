import React from 'react';
import { connect } from 'react-redux';

import Screen from 'components/Screen';
import { BLOCK_SIZE } from 'utils/consts';

function mapStateToProps(state) {
  return { state };
}

@connect(mapStateToProps)
export default class App extends React.Component {
  render() {
    return (
      <svg width={15 * BLOCK_SIZE} height={15 * BLOCK_SIZE} style={{ background: 'grey' }}>
        <Screen />
      </svg>
    );
  }
}
