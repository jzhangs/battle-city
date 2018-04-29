import React from 'react';
import { BRICK_WALL_COLOR_SCHEMES } from 'utils/consts';

const BrickWallPart = (transform, type) => (
  <g data-role={`brickwall${type}`} transform={transform}>
    <rect width={4} height={4} fill={BRICK_WALL_COLOR_SCHEMES.c} />
    <rect
      x={type === 1 ? 0 : 1}
      y={0}
      width={type === 1 ? 4 : 3}
      height={3}
      fill={BRICK_WALL_COLOR_SCHEMES.a}
    />
    <rect
      x={type === 1 ? 0 : 2}
      y={1}
      width={type === 1 ? 4 : 2}
      height={2}
      fill={BRICK_WALL_COLOR_SCHEMES.b}
    />
  </g>
);

const BrickWall = ({ x, y }) => (
  <g data-role="wall" transform={`translate(${x},${y})`}>
    {BrickWallPart('translate(0,0)', 1)}
    {BrickWallPart('translate(0,4)', 2)}
    {BrickWallPart('translate(4,0)', 2)}
    {BrickWallPart('translate(4,4)', 1)}
  </g>
);

export default BrickWall;
