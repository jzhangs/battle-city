import * as React from 'react';
import { connect } from 'react-redux';
import EnemyCountIndicator from 'components/EnemyCountIndicator';
import PlayerTankThumbnail from 'components/Icons';
import Text from 'components/Text';
import { BLOCK_SIZE } from 'utils/consts';

import { State, PlayersMap } from 'types';

function mapStateToProps(state: State) {
  return {
    remainingEnemyCount: state.game.remainingEnemies.size,
    players: state.players,
  };
}

type P = {
  remainingEnemyCount: number,
  players: PlayersMap,
};

class HUD extends React.PureComponent<P> {
  renderPlayer1Info() {
    const { players } = this.props;
    const player1 = players.find(p => p.playerName === 'player-1');
    if (player1 == null) {
      return null;
    }
    const transform = `translate(${14.5 * BLOCK_SIZE},${7.5 * BLOCK_SIZE})`;
    return (
      <g data-role="player-1-info" transform={transform}>
        <Text x={0} y={0} content={'\u2160P'} fill="#000" />
        <PlayerTankThumbnail x={0} y={0.5 * BLOCK_SIZE} />
        <Text
          x={0.5 * BLOCK_SIZE}
          y={0.5 * BLOCK_SIZE}
          content={String(player1.lives)}
          fill="#000"
        />
      </g>
    );
  }

  renderPlayer2Info() {
    const { players } = this.props;
    const player2 = players.find(p => p.playerName === 'player-2');
    if (player2 == null) {
      return null;
    }
    const transform = `translate(${14.5 * BLOCK_SIZE},${8.5 * BLOCK_SIZE})`;
    return (
      <g data-role="player-2-info" transform={transform}>
        <Text x={0} y={0} content={'\u2161P'} fill="#000000" />
        <PlayerTankThumbnail x={0} y={0.5 * BLOCK_SIZE} />
        <Text x={0.5 * BLOCK_SIZE} y={0.5 * BLOCK_SIZE} content={String(player2.lives)} fill="#000" />
      </g>
    );
  }

  render() {
    const { remainingEnemyCount } = this.props;

    return (
      <g data-role="HUD">
        <EnemyCountIndicator count={remainingEnemyCount} />
        {this.renderPlayer1Info()}
        {this.renderPlayer2Info()}
      </g>
    );
  }
}

export default connect(mapStateToProps)(HUD);
