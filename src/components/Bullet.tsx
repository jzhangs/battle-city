import * as React from 'react';
import { Pixel } from 'components/Elements';

const fill = '#ADADAD';

type P = {
  x: number;
  y: number;
  direction: Direction;
};

function renderHead(direction: Direction) {
  switch (direction) {
    case 'up':
      return <Pixel x={1} y={-1} fill={fill} />;
    case 'down':
      return <Pixel x={1} y={3} fill={fill} />;
    case 'left':
      return <Pixel x={-1} y={1} fill={fill} />;
    default:
      // right
      return <Pixel x={3} y={1} fill={fill} />;
  }
}

const Bullet = ({ x, y, direction } : P) => (
  <g data-role="bullet" transform={`translate(${x},${y})`}>
    {renderHead(direction)}
    <rect width={3} height={3} fill={fill} />
  </g>
);

export default Bullet;
