import * as React from 'react';
import { List } from 'immutable';
import { ITEM_SIZE_MAP, N_MAP } from 'utils/consts';
import { getRowCol } from 'utils/common';
import BrickWall from 'components/BrickWall';

type P = {
  bricks: List<boolean>,
};

export default class BrickLayer extends React.PureComponent<P, {}> {
  render() {
    const { bricks } = this.props;

    return (
      <g data-role="brick-layer">
        {bricks.map((set, t) => {
          if (set) {
            const [row, col] = getRowCol(t, N_MAP.BRICK);
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
