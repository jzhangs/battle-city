import React from 'react';
import { ITEM_SIZE_MAP, N_MAP } from 'utils/consts';
import { getRowCol } from 'utils/common';
import SteelWall from 'components/SteelWall';

export default class SteelLayer extends React.PureComponent {
  render() {
    const { steels } = this.props;
    return (
      <g data-role="steel-layer">
        {steels.map((set, t) => {
          if (set) {
            const [row, col] = getRowCol(t, N_MAP.STEEL);
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
