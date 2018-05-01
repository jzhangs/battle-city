import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

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
import EnemyCountIndicator from 'components/EnemyCountIndicator';
import TextLayer from 'components/TextLayer';
import GameoverOverlay from 'components/GameoverOverlay';

import { BLOCK_SIZE } from 'utils/consts';

@connect(_.identity)
export default class Screen extends React.Component {
  render() {
    const { bullets, map, explosions, flickers, tanks, game, texts } = this.props;
    const { remainingEnemyCount, overlay } = game.toObject();
    const { bricks, steels, rivers, snows, forests, eagle } = map.toObject();
    return (
      <g data-role="screen">
        <EnemyCountIndicator count={remainingEnemyCount} />
        <g data-role="battle-field" transform={`translate(${BLOCK_SIZE},${BLOCK_SIZE})`}>
          <rect width={13 * BLOCK_SIZE} height={13 * BLOCK_SIZE} fill="#000" />
          <SteelLayer steels={steels} />
          <BrickLayer bricks={bricks} />
          <RiverLayer rivers={rivers} />
          <SnowLayer snows={snows} />
          <Eagle x={eagle.get('x')} y={eagle.get('y')} broken={eagle.get('broken')} />
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
          <g data-role="explosion-layer">
            {explosions
              .map(exp => <Explosion key={exp.explosionId} x={exp.x} y={exp.y} explosionType={exp.explosionType} />)
              .toArray()}
          </g>
          <g data-role="flicker-layer">
            {flickers
              .map(flicker => <Flicker key={flicker.flickerId} x={flicker.x} y={flicker.y} />)
              .toArray()}
          </g>
        </g>
        {overlay === 'gameover' ? <GameoverOverlay /> : null}
        <TextLayer texts={texts} />
      </g>
    );
  }
}
