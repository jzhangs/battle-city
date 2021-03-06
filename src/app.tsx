import * as React from 'react';
import { connect } from 'react-redux';
import { BLOCK_SIZE as B } from 'utils/consts';
import GameScene from 'components/GameScene';
import GameoverScene from 'components/GameoverScene';
import StatisticsScene from 'components/StatisticsScene';
import GameTitleScene from 'components/GameTitleScene';
import PauseIndicator from 'components/PauseIndicator';
import CurtainContainer from 'components/CurtainContainer';
// import Inspector from 'components/Inspector';
import { State } from 'types';

const Inspector = () => (
  <div style={{ maxWidth: 200, marginLeft: 20 }}>
    <p>
      游戏仍在开发中，目前只支持单人进行游戏。
      目前游戏仍有很多BUG，请见谅。
      请使用最新的chrome浏览器。
      游戏开始页面请使用鼠标进行操作。
      整个游戏都使用了矢量图，可以适当放大浏览器的缩放比例。
    </p>
    <p>WASD 控制坦克方向</p>
    <p>J 控制开火</p>
    <p>使用<a href="./editor.html" target="_blank">编辑器</a>创建自己喜欢的地图</p>
    <p>在<a href="./stories.html" target="_blank">stories页面</a>浏览游戏中的组件/素材</p>
    <p>STAR ME ON <a href="https://github.com/jzhangs/battle-city">GitHub</a></p>
  </div>
)

const zoomLevel = 2;
const totalWidth = 16 * B;
const totalHeight = 15 * B;

class App extends React.PureComponent<{ scene: Scene, paused: boolean }> {
  render() {
    const { scene, paused } = this.props;

    return (
      <div style={{ display: 'flex' }}>
        <svg
          className="svg"
          width={totalWidth * zoomLevel}
          height={totalHeight * zoomLevel}
          viewBox={`0 0 ${totalWidth} ${totalHeight}`}
        >
          {scene === 'game-title' ? <GameTitleScene /> : null}
          {scene === 'game' ? <GameScene /> : null}
          {scene === 'gameover' ? <GameoverScene /> : null}
          {scene === 'statistics' ? <StatisticsScene /> : null}
          <CurtainContainer />
          {paused ? <PauseIndicator /> : null}
        </svg>
        <Inspector />
      </div>
    );
  }
}

function mapStateToProps(state: State) {
  return {
    scene: state.game.scene,
    paused: state.game.paused
  };
}

export default connect(mapStateToProps)(App);
