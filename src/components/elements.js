import React from 'react';

export const Pixel = ({ x, y, fill }) => <rect x={x} y={y} width={1} height={1} fill={fill} />;

export const Bitmap = ({ x, y, d, scheme }) => {
  const cols = d[0].length;
  return (
    <g transform={`translate(${x},${y})`}>
      {d.map((cs, dy) => Array.from(cs).map((c, dx) =>
        <Pixel key={dy * cols + dx} x={dx} y={dy} fill={scheme[c]} />))}
    </g>
  );
};
