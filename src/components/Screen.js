import React from 'react';
import { connect } from 'react-redux';

import Tank from 'components/Tank';
import Bullet from 'components/Bullet';
import BrickLayer from 'components/BrickLayer';
import SteelLayer from 'components/SteelLayer';
import RiverLayer from 'components/RiverLayer';
import SnowLayer from 'components/SnowLayer';
import ForestLayer from 'components/ForestLayer';
import Eagle from 'components/Eagle';
import Explosion from 'components/Explosion';
import Flicker from 'components/Flicker';

import { BLOCK_SIZE } from 'utils/consts';
import * as selectors from 'utils/selectors';

function mapStateToProps(state) {
  return {
    bullets: selectors.bullets(state),
    map: selectors.map(state),
    explosions: selectors.explosions(state),
    flickers: selectors.flickers(state),
    tanks: selectors.tanks(state)
  };
}

@connect(mapStateToProps)
export default class Screen extends React.Component {
  render() {
    const { bullets, map, explosions, flickers, tanks } = this.props;
    const { bricks, steels, rivers, snows, forests, eagle } = map.toObject();
    return (
      <g data-role="screen">
        <g data-role="board" transform={`translate(${BLOCK_SIZE},${BLOCK_SIZE})`}>
          <rect width={13 * BLOCK_SIZE} height={13 * BLOCK_SIZE} fill="#000" />
          {/* <Items x={0} y={0} name="shovel" /> */}
          <SteelLayer steels={steels} />
          <BrickLayer bricks={bricks} />
          <RiverLayer rivers={rivers} />
          <SnowLayer snows={snows} />
          <g data-role="bullet-layer">
            {bullets
              .map((b, i) => <Bullet key={i} direction={b.direction} x={b.x} y={b.y} />)
              .toArray()}
          </g>
          <g data-role="tank-layer">
            {tanks
              .map(tank => (
                <Tank
                  key={tank.tankId}
                  x={tank.x}
                  y={tank.y}
                  direction={tank.direction}
                  level={0}
                  color={tank.color}
                  moving={tank.moving}
                />
              ))
              .toArray()}
          </g>
          <ForestLayer forests={forests} />
          <Eagle x={eagle.get('x')} y={eagle.get('y')} broken={eagle.get('broken')} />
          <g data-role="explosion-layer">
            {explosions
              .map(exp => (
                <Explosion
                  key={exp.explosionId}
                  x={exp.x}
                  y={exp.y}
                />
              ))
              .toArray()}
          </g>
          <g data-role="flicker-layer">
            {flickers
              .map(flicker => (
                <Flicker
                  key={flicker.flickerId}
                  x={flicker.x}
                  y={flicker.y}
                />
              ))
              .toArray()}
          </g>
        </g>
      </g>
    );
  }
}
