import React from 'react';
import { connect } from 'react-redux';

import Tank from 'components/tank';
import Bullet from 'components/bullet';

import { BLOCK_SIZE } from 'utils/consts';
import * as selectors from 'utils/selectors';

function mapStateToProps(state) {
  return {
    player: selectors.player(state),
    bullets: selectors.bullets(state)
  };
}

@connect(mapStateToProps)
export default class Screen extends React.Component {
  render() {
    const { player, bullets } = this.props;
    const { direction, x, y, moving } = player.toObject();
    return (
      <g data-role="screen">
        <g data-role="board" transform={`translate(${BLOCK_SIZE},${BLOCK_SIZE})`}>
          <rect width={13 * BLOCK_SIZE} height={13 * BLOCK_SIZE} fill="#000" />
          {bullets.map((b, i) => <Bullet key={i} direction={b.direction} x={b.x} y={b.y} />)}
          <Tank direction={direction} x={x} y={y} level={0} color="yellow" moving={moving} />
        </g>
      </g>
    );
  }
}
