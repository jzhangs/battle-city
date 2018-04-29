import React from 'react';
import { connect } from 'react-redux';

import Tank from 'components/tank';
import Bullet from 'components/bullet';

import { BLOCK_SIZE, UP, DOWN, LEFT, RIGHT } from 'utils/consts';
import * as selectors from 'utils/selectors';

function mapStateToProps(state) {
  return selectors.player(state).toObject();
}

@connect(mapStateToProps)
export default class Screen extends React.Component {
  render() {
    const { direction, x, y, moving } = this.props;
    return (
      <g data-role="screen">
        <g data-role="board" transform={`translate(${BLOCK_SIZE},${BLOCK_SIZE})`}>
          <rect width={13 * BLOCK_SIZE} height={13 * BLOCK_SIZE} fill="#000" />
          <Bullet x={20} y={20} direction={UP} />
          <Bullet x={28} y={20} direction={DOWN} />
          <Bullet x={36} y={20} direction={LEFT} />
          <Bullet x={44} y={20} direction={RIGHT} />
          <Tank direction={direction} x={x} y={y} level={0} color="yellow" moving={moving} />
        </g>
      </g>
    );
  }
}
