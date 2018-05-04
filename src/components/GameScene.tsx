import * as React from 'react';
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
import TextLayer from 'components/TextLayer';
import HUD from 'components/HUD';

import { BLOCK_SIZE } from 'utils/consts';
import { State } from 'types';

function mapStateToProps(state: State) {
  return { ...state };
}

class GameScene extends React.Component<State> {
  render() {
    const { bullets, map, explosions, flickers, tanks, texts } = this.props;
    const { bricks, steels, rivers, snows, forests, eagle } = map;
    return (
      <g data-role="game-screen">
        <HUD />
        <g data-role="battle-field" transform={`translate(${BLOCK_SIZE},${BLOCK_SIZE})`}>
          <rect width={13 * BLOCK_SIZE} height={13 * BLOCK_SIZE} fill="#000" />
          <SteelLayer steels={steels} />
          <BrickLayer bricks={bricks} />
          <RiverLayer rivers={rivers} />
          <SnowLayer snows={snows} />
          <Eagle x={eagle.x} y={eagle.y} broken={eagle.broken} />
          <g data-role="bullet-layer">
            {bullets.map((b, i) => <Bullet key={i} direction={b.direction} x={b.x} y={b.y} />).toArray()}
          </g>
          <g data-role="tank-layer">{tanks.map(tank => <Tank key={tank.tankId} tank={tank} />).toArray()}</g>
          <ForestLayer forests={forests} />
          <g data-role="explosion-layer">
            {explosions
              .map(exp => <Explosion key={exp.explosionId} x={exp.x} y={exp.y} explosionType={exp.explosionType} />)
              .toArray()}
          </g>
          <g data-role="flicker-layer">
            {flickers.map(flicker => <Flicker key={flicker.flickerId} x={flicker.x} y={flicker.y} />).toArray()}
          </g>
        </g>
        <TextLayer texts={texts} />
      </g>
    );
  }
}

export default connect(mapStateToProps)(GameScene);