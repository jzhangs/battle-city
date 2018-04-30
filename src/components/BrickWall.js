import React from 'react';

const BrickWallPart = (transform, type) => (
  <g data-role={`brickwall${type}`} transform={transform}>
    <rect width={4} height={4} fill="#636363" />
    <rect
      x={type === 1 ? 0 : 1}
      y={0}
      width={type === 1 ? 4 : 3}
      height={3}
      fill="#6B0800"
    />
    <rect
      x={type === 1 ? 0 : 2}
      y={1}
      width={type === 1 ? 4 : 2}
      height={2}
      fill="#9C4A00"
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
