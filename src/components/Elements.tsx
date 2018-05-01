import * as React from 'react';

type PixelProps = {
  x: number;
  y: number;
  fill: string;
};
export const Pixel = ({ x, y, fill }: PixelProps) => <rect x={x} y={y} width={1} height={1} fill={fill} />;

type BitMapProps = {
  x: number;
  y: number;
  d: string[];
  scheme: { [key: string]: string };
};
export const Bitmap = ({ x, y, d, scheme }: BitMapProps) => {
  const cols = d[0].length;
  return (
    <g transform={`translate(${x},${y})`}>
      {d.map((cs, dy) => Array.from(cs).map((c, dx) => <Pixel key={dy * cols + dx} x={dx} y={dy} fill={scheme[c]} />))}
    </g>
  );
};
