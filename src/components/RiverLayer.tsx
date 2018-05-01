import * as React from 'react';
import { List } from 'immutable';
import { getRowCol } from 'utils/common';
import { ITEM_SIZE_MAP, N_MAP } from 'utils/consts';
import River from 'components/River';
import registerTick from 'hocs/registerTick';

type P = {
  rivers: List<boolean>,
  tickIndex: number,
};

class RiverLayer extends React.PureComponent<P, {}> {
  render() {
    const { rivers, tickIndex } = this.props;

    return (
      <g data-role="river-layer">
        {rivers.map((set, t) => {
          if (set) {
            const [row, col] = getRowCol(t, N_MAP.RIVER);
            return (
              <River
                key={t}
                x={col * ITEM_SIZE_MAP.RIVER}
                y={row * ITEM_SIZE_MAP.RIVER}
                shape={tickIndex}
              />
            );
          }
          return null;
        })}
      </g>
    );
  }
}

export default registerTick(600, 600)(RiverLayer);
