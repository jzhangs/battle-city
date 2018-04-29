import React from 'react';
import { UP, DOWN, LEFT } from 'utils/consts';
import { Pixel } from 'components/Elements';

const fill = '#ADADAD';

function renderHead(direction) {
  switch (direction) {
    case UP:
      return <Pixel x={1} y={-1} fill={fill} />;
    case DOWN:
      return <Pixel x={1} y={3} fill={fill} />;
    case LEFT:
      return <Pixel x={-1} y={1} fill={fill} />;
    default: // RIGHT
      return <Pixel x={3} y={1} fill={fill} />;
  }
}

const Bullet = ({ x, y, direction }) => (
  <g data-role="bullet" transform={`translate(${x},${y})`}>
    {renderHead(direction)}
    <rect width={3} height={3} fill={fill} />
  </g>
);

export default Bullet;
