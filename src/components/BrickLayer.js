import React from 'react';
import { BLOCK_SIZE, ITEM_SIZE_MAP, FIELD_BSIZE } from 'utils/consts';
import { getRowCol } from 'utils/common';
import BrickWall from 'components/BrickWall';

const N = BLOCK_SIZE / ITEM_SIZE_MAP.BRICK * FIELD_BSIZE;

export default class BrickLayer extends React.PureComponent {
  render() {
    const { bricks } = this.props;

    return (
      <g data-role="brick-layer">
        {bricks.map((set, t) => {
          if (set) {
            const [row, col] = getRowCol(t, N);
            return (
              <BrickWall key={t} x={col * ITEM_SIZE_MAP.BRICK} y={row * ITEM_SIZE_MAP.BRICK} />
            );
          }
          return null;
        })}
      </g>
    );
  }
}
