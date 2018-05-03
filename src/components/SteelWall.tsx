import * as React from 'react';

type P = {
  x: number,
  y: number,
  gstyle?: React.CSSProperties
}

const SteelWall = ({ x, y, gstyle = {} } : P) => (
  <g data-role="steelwall" transform={`translate(${x},${y})`} style={gstyle}>
    <rect width={8} height={8} fill="#adadad" />
    <rect x={2} y={2} width={4} height={4} fill="#fff" />
    <path d="M6,2 h1,v-1,h1,v7,h-7,v-1,h1,v-1,h4,v-4" fill="#636363" />
  </g>
);

export default SteelWall;
