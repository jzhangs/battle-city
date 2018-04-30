import React from 'react';
import { BLOCK_SIZE, ITEM_SIZE_MAP, FIELD_BSIZE } from 'utils/consts';
import { getRowCol } from 'utils/common';
import SteelWall from 'components/SteelWall';

const N = BLOCK_SIZE / ITEM_SIZE_MAP.STEEL * FIELD_BSIZE;

export default class SteelLayer extends React.PureComponent {
  render() {
    const { steels } = this.props;
    return (
      <g data-role="steel-layer">
        {steels.map((set, t) => {
          if (set) {
            const [row, col] = getRowCol(t, N);
            return (
              <SteelWall key={t} x={col * ITEM_SIZE_MAP.STEEL} y={row * ITEM_SIZE_MAP.STEEL} />
            );
          }
            return null;
        })}
      </g>
    );
  }
}
