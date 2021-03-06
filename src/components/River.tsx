import * as React from 'react';
import { Pixel } from 'components/Elements';

const coordinates = [
  [[5, 0], [0, 2], [1, 3], [4, 3], [3, 4], [5, 4], [1, 6], [2, 7], [6, 7]],
  [[7, 0], [1, 1], [2, 2], [3, 3], [6, 3], [7, 4], [3, 5], [2, 6], [4, 6], [0, 7]]
];

const RiverPart = (shape: number, dx: number, dy: number) => (
  <g transform={`translate(${dx},${dy})`}>
    <rect width={8} height={8} fill="#4242FF" />
    {coordinates[shape % 2].map(([x, y], i) => <Pixel key={i} x={x} y={y} fill="#B5EFEF" />)}
  </g>
);

type P = {
  x: number,
  y: number,
  shape: number,
};
export default class River extends React.PureComponent<P, {}> {
  render() {
    const { x, y, shape } = this.props;
    return (
      <g transform={`translate(${x},${y})`}>
        {RiverPart(shape, 0, 0)}
        {RiverPart(shape, 8, 0)}
        {RiverPart(shape, 8, 8)}
        {RiverPart(shape, 0, 8)}
      </g>
    );
  }
}
