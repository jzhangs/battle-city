import * as React from 'react';
import * as ReactDOM from 'react-dom';
// import * as classNames from 'classnames';
import { saveAs } from 'file-saver';
import createSagaMiddleware from 'redux-saga';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import { is, List, Range, Record, Repeat } from 'immutable';
import { Provider } from 'react-redux';
import { BLOCK_SIZE as B, FIELD_BLOCK_SIZE as FBZ } from 'utils/consts';
import BrickLayer from 'components/BrickLayer';
import SteelLayer from 'components/SteelLayer';
import RiverLayer from 'components/RiverLayer';
import SnowLayer from 'components/SnowLayer';
import ForestLayer from 'components/ForestLayer';
import Eagle from 'components/Eagle';
import Text from 'components/Text';
import River from 'components/River';
import Snow from 'components/Snow';
import Forest from 'components/Forest';
import BrickWall from 'components/BrickWall';
import SteelWall from 'components/SteelWall';
import Tank from 'components/Tank';
import TextInput from 'components/TextInput';
import TextButton from 'components/TextButton';
import tickEmitter from 'sagas/tickEmitter';
import { time } from 'reducers/index';
import game from 'reducers/game';
import parseStageMap from 'utils/parseStageMap';
import { TankRecord } from 'types';
import { inc, dec } from 'utils/common';

const simpleSagaMiddleware = createSagaMiddleware();
const simpleReducer = combineReducers({ time, game });

const simpleStore = createStore(simpleReducer, undefined, applyMiddleware(simpleSagaMiddleware));
simpleSagaMiddleware.run(tickEmitter);

const zoomLevel = 2;
const totalWidth = 16 * B;
const totalHeight = 15 * B;

function incTankLevel(record: EnemyConfigRecord) {
  if (record.tankLevel === 'basic') {
    return record.set('tankLevel', 'fast');
  } else if (record.tankLevel === 'fast') {
    return record.set('tankLevel', 'power');
  } else {
    return record.set('tankLevel', 'armor');
  }
}

function decTankLevel(record: EnemyConfigRecord) {
  if (record.tankLevel === 'armor') {
    return record.set('tankLevel', 'power');
  } else if (record.tankLevel === 'power') {
    return record.set('tankLevel', 'fast');
  } else {
    return record.set('tankLevel', 'basic');
  }
}

function toString(list: List<MapItemRecord>): StageConfig['map'] {
  const result: string[] = [];
  for (let row = 0; row < FBZ; row += 1) {
    const array: string[] = [];
    for (let col = 0; col < FBZ; col += 1) {
      const { type, hex } = list.get(row * FBZ + col);
      if (type === 'B') {
        array.push(hex > 0 ? 'B' + hex.toString(16) : 'X');
      } else if (type === 'E') {
        array.push('E');
      } else if (type === 'R') {
        array.push('R');
      } else if (type === 'S') {
        array.push('S');
      } else if (type === 'T') {
        array.push(hex > 0 ? 'T' + hex.toString(16) : 'X');
      } else if (type === 'F') {
        array.push('F');
      } else {
        array.push('X');
      }
    }
    result.push(array.map(s => s.padEnd(3)).join(''));
  }
  return result;
}

export type MapItemType = 'X' | 'E' | 'B' | 'T' | 'R' | 'S' | 'F';

export const MapItemRecord = Record({
  type: 'X' as MapItemType,
  hex: 0xf
});

export type PopupType = 'none' | 'alert' | 'confirm';

export const PopupRecord = Record({
  type: 'none' as PopupType,
  message: ''
});

const popupRecord = PopupRecord();

export type PopupRecord = typeof popupRecord;

const mapItemRecord = MapItemRecord();

export type MapItemRecord = typeof mapItemRecord;

export const EnemyConfigRecord = Record({
  tankLevel: 'basic' as TankLevel,
  count: 0
});

const enemyConfigRecord = EnemyConfigRecord();
export type EnemyConfigRecord = typeof enemyConfigRecord;

type DashLinesProps = {
  t?: number;
};

class DashLines extends React.PureComponent<DashLinesProps> {
  render() {
    const { t } = this.props;
    const hrow = Math.floor(t / FBZ);
    const hcol = t % FBZ;

    return (
      <g className="dash-lines" stroke="steelblue" strokeWidth="0.5" strokeDasharray="2 2">
        {Range(1, FBZ + 1)
          .map(col => (
            <line
              key={col}
              x1={B * col}
              y1={0}
              x2={B * col}
              y2={totalHeight}
              strokeOpacity={hcol === col || hcol === col - 1 ? 1 : 0.3}
            />
          ))
          .toArray()}
        {Range(1, FBZ + 1)
          .map(row => (
            <line
              key={row}
              x1={0}
              y1={B * row}
              x2={totalWidth}
              y2={B * row}
              strokeOpacity={hrow === row || hrow === row - 1 ? 1 : 0.3}
            />
          ))
          .toArray()}
      </g>
    );
  }
}

const HexBrickWall = ({ x, y, hex }: { x: number; y: number; hex: number }) => (
  <g data-role="hex-brick-wall">
    {[[0b0001, 0, 0], [0b0010, 8, 0], [0b0100, 0, 8], [0b1000, 8, 8]].map(([mask, dx, dy], index) => (
      <g key={index} style={{ opacity: hex & mask ? 1 : 0.3 }} transform={`translate(${dx},${dy})`}>
        <BrickWall x={x} y={y} />
        <BrickWall x={x + 4} y={y} />
        <BrickWall x={x} y={y + 4} />
        <BrickWall x={x + 4} y={y + 4} />
      </g>
    ))}
  </g>
);

const HexSteelWall = ({ x, y, hex }: { x: number; y: number; hex: number }) => (
  <g data-role="hex-steel-wall">
    <SteelWall x={x} y={y} gstyle={{ opacity: hex & 0b0001 ? 1 : 0.3 }} />
    <SteelWall x={x + 8} y={y} gstyle={{ opacity: hex & 0b0010 ? 1 : 0.3 }} />
    <SteelWall x={x} y={y + 8} gstyle={{ opacity: hex & 0b0100 ? 1 : 0.3 }} />
    <SteelWall x={x + 8} y={y + 8} gstyle={{ opacity: hex & 0b1000 ? 1 : 0.3 }} />
  </g>
);

type AreaButtonProps = {
  x: number;
  y: number;
  width: number;
  height: number;
  onClick: () => void;
  strokeWidth?: number;
  spreadX?: number;
  spreadY?: number;
};

const AreaButton = ({ x, y, width, height, onClick, strokeWidth = 1, spreadX = 2, spreadY = 1 }: AreaButtonProps) => (
  <rect
    className="area-button"
    x={x - spreadX}
    y={y - spreadY}
    width={width + 2 * spreadX}
    height={height + 2 * spreadY}
    onClick={onClick}
    stroke="transparent"
    strokeWidth={strokeWidth}
  />
);

type TextWithLineWrapProps = {
  x: number;
  y: number;
  fill?: string;
  maxLength: number;
  content: string;
  lineSpacing?: number;
};

const TextWithLineWrap = ({ x, y, fill, maxLength, content, lineSpacing = 0.25 * B }: TextWithLineWrapProps) => (
  <g role="text-with-line-wrap">
    {Range(0, Math.ceil(content.length / maxLength))
      .map(index => (
        <Text
          key={index}
          x={x}
          y={y + (0.5 * B + lineSpacing) * index}
          fill={fill}
          content={content.substring(index * maxLength, (index + 1) * maxLength)}
        />
      ))
      .toArray()}
  </g>
);

const positionMap = {
  X: B,
  B: 2.5 * B,
  T: 4 * B,
  R: 5.5 * B,
  S: 7 * B,
  F: 8.5 * B,
  E: 10 * B
};

type EditorView = 'map' | 'config';

class Editor extends React.Component {
  private input: HTMLInputElement;
  private resetButton: HTMLInputElement;
  private form: HTMLFormElement;
  private svg: SVGSVGElement;
  private pressed = false;
  private resolveConfirm: (ok: boolean) => void = null;
  private resolveAlert: () => void = null;
  state = {
    view: 'config' as EditorView,
    popup: popupRecord,
    t: -1,

    map: Repeat(mapItemRecord, FBZ ** 2).toList(),
    itemType: 'X' as MapItemType,
    brickHex: 0xf,
    steelHex: 0xf,

    stageName: '',
    difficulty: 1,
    enemies: List<EnemyConfigRecord>([
      EnemyConfigRecord({ tankLevel: 'basic', count: 10 }),
      EnemyConfigRecord({ tankLevel: 'fast', count: 4 }),
      EnemyConfigRecord({ tankLevel: 'power', count: 4 }),
      EnemyConfigRecord({ tankLevel: 'armor', count: 2 })
    ])
  };

  getT(event: React.MouseEvent<SVGSVGElement>) {
    let totalTop = 0;
    let totalLeft = 0;
    let node: Element = this.svg;
    while (node) {
      totalTop += node.scrollTop + node.clientTop;
      totalLeft += node.scrollLeft + node.clientLeft;
      node = node.parentElement;
    }
    const row = Math.floor((event.clientY + totalTop - this.svg.clientTop) / zoomLevel / B);
    const col = Math.floor((event.clientX + totalLeft - this.svg.clientLeft) / zoomLevel / B);
    if (row >= 0 && row < FBZ && col >= 0 && col < FBZ) {
      return row * FBZ + col;
    } else {
      return -1;
    }
  }

  getCurrentItem() {
    const { itemType, brickHex, steelHex } = this.state;
    if (itemType === 'B') {
      return MapItemRecord({ type: 'B', hex: brickHex });
    } else if (itemType === 'T') {
      return MapItemRecord({ type: 'T', hex: steelHex });
    } else {
      return MapItemRecord({ type: itemType });
    }
  }

  setAsCurrentItem(t: number) {
    const { map } = this.state;
    const item = this.getCurrentItem();
    if (t === -1 || is(map.get(t), item)) {
      return;
    }
    if (item.type === 'E') {
      // 先将已存在的eagle移除 保证Eagle最多出现一次
      const eagleRemoved = map.map(item => (item.type === 'E' ? mapItemRecord : item));
      this.setState({ map: eagleRemoved.set(t, item) });
    } else {
      this.setState({ map: map.set(t, item) });
    }
  }

  onMouseDown = (event: React.MouseEvent<SVGSVGElement>) => {
    const { view, popup } = this.state;
    if (view === 'map' && popup.type === 'none' && this.getT(event) !== -1) {
      this.pressed = true;
    }
  };

  onMouseMove = (event: React.MouseEvent<SVGSVGElement>) => {
    const { view, popup, t: lastT } = this.state;
    const t = this.getT(event);
    if (t !== lastT) {
      this.setState({ t });
    }
    if (view === 'map' && popup.type === 'none' && this.pressed) {
      this.setAsCurrentItem(t);
    }
  };

  onMouseUp = (event: React.MouseEvent<SVGSVGElement>) => {
    this.pressed = false;
    const { view, popup } = this.state;
    if (view === 'map' && popup.type === 'none') {
      this.setAsCurrentItem(this.getT(event));
    }
  };

  onMouseLeave = () => {
    this.pressed = false;
    this.setState({ t: -1 });
  };

  onChangeView = (view: EditorView) => this.setState({ view });

  onIncDifficulty = () => {
    const { difficulty } = this.state;
    this.setState({ difficulty: difficulty + 1 });
  };

  onDecDifficulty = () => {
    const { difficulty } = this.state;
    this.setState({ difficulty: difficulty - 1 });
  };

  onIncEnemyLevel = (index: number) => {
    const { enemies } = this.state;
    this.setState({ enemies: enemies.update(index, incTankLevel) });
  };

  onDecEnemyLevel = (index: number) => {
    const { enemies } = this.state;
    this.setState({ enemies: enemies.update(index, decTankLevel) });
  };

  onIncEnemyCount = (index: number) => {
    const { enemies } = this.state;
    this.setState({ enemies: enemies.updateIn([index, 'count'], inc(1)) });
  };

  onDecEnemyCount = (index: number) => {
    const { enemies } = this.state;
    this.setState({ enemies: enemies.updateIn([index, 'count'], dec(1)) });
  };

  onRequestLoad = () => {
    this.input.click();
  };

  onSave = async () => {
    const { map, stageName, enemies, difficulty } = this.state;
    const totalEnemyCount = enemies.map(e => e.count).reduce((x: number, y) => x + y);

    if (stageName === '') {
      await this.showAlertPopup('Please enter stage name.');
      this.setState({ view: 'config' });
      return;
    }

    if (totalEnemyCount === 0) {
      this.showAlertPopup('no enemy');
      return;
    } else if (totalEnemyCount !== 20 && !(await this.showConfirmPopup('total enemy count is not 20. continue?'))) {
      return;
    }

    const hasEagle = map.some(mapItem => mapItem.type === 'E');
    if (!hasEagle && !(await this.showConfirmPopup('no eagle. continue?'))) {
      return;
    }

    const content = JSON.stringify(
      {
        name: stageName.toLowerCase(),
        difficulty,
        map: toString(map),
        enemies: enemies.filter(e => e.count > 0).map(e => `${e.count}*${e.tankLevel}`)
      },
      null,
      2
    );
    saveAs(new Blob([content], { type: 'text/plain;charset=utf-8' }), `stage-${stageName}.json`);
  };

  showAlertPopup(message: string) {
    this.setState({
      popup: PopupRecord({
        type: 'alert',
        message
      })
    });
    return new Promise<boolean>(resolve => {
      this.resolveAlert = resolve;
    });
  }

  showConfirmPopup(message: string) {
    this.setState({
      popup: PopupRecord({
        type: 'confirm',
        message
      })
    });
    return new Promise<boolean>(resolve => {
      this.resolveConfirm = resolve;
    });
  }

  onConfirm = () => {
    this.resolveConfirm(true);
    this.resolveConfirm = null;
    this.setState({ popup: popupRecord });
  };

  onCancel = () => {
    this.resolveConfirm(false);
    this.resolveConfirm = null;
    this.setState({ popup: popupRecord });
  };

  onClickOkOfAlert = () => {
    this.resolveAlert();
    this.resolveAlert = null;
    this.setState({ popup: popupRecord });
  };

  onShowHelpInfo = async () => {
    await this.showAlertPopup('1. Choose an item type below');
    await this.showAlertPopup('2. Click or pan in the left');
    await this.showAlertPopup('3. After select Brick or Steel you can change its shape');
  };

  renderItemSwitchButtons() {
    return (
      <g data-role="item-switch-buttons">
        {Object.entries(positionMap).map(([type, y]: [MapItemType, number]) => (
          <AreaButton
            key={type}
            x={0.25 * B}
            y={y}
            width={2.5 * B}
            height={B}
            onClick={() => this.setState({ itemType: type })}
          />
        ))}
      </g>
    );
  }

  renderHexAdjustButtons() {
    const { itemType, brickHex, steelHex } = this.state;
    let brickHexAdjustButtons: JSX.Element[] = null;
    let steelHexAdjustButtons: JSX.Element[] = null;

    if (itemType === 'B') {
      brickHexAdjustButtons = [0b0001, 0b0010, 0b0100, 0b1000].map(bin => (
        <AreaButton
          key={bin}
          x={B + (bin & 0b1010 ? 0.5 * B : 0)}
          y={2.5 * B + (bin & 0b1100 ? 0.5 * B : 0)}
          width={0.5 * B}
          height={0.5 * B}
          spreadX={0}
          spreadY={0}
          onClick={() => this.setState({ brickHex: brickHex ^ bin })}
        />
      ));
    }
    if (itemType === 'T') {
      steelHexAdjustButtons = [0b0001, 0b0010, 0b0100, 0b1000].map(bin => (
        <AreaButton
          key={bin}
          x={B + (bin & 0b1010 ? 0.5 * B : 0)}
          y={4 * B + (bin & 0b1100 ? 0.5 * B : 0)}
          width={0.5 * B}
          height={0.5 * B}
          spreadX={0}
          spreadY={0}
          onClick={() => this.setState({ steelHex: steelHex ^ bin })}
        />
      ));
    }
    return (
      <g data-role="hex-adjust-buttons">
        {brickHexAdjustButtons}
        {steelHexAdjustButtons}
        {itemType === 'B' ? (
          <TextButton
            content="f"
            spreadX={0.125 * B}
            x={2.25 * B}
            y={2.75 * B}
            onClick={() => this.setState({ itemType: 'B', brickHex: 0xf })}
          />
        ) : null}
        {itemType === 'T' ? (
          <TextButton
            content="f"
            spreadX={0.125 * B}
            x={2.25 * B}
            y={4.25 * B}
            onClick={() => this.setState({ itemType: 'T', steelHex: 0xf })}
          />
        ) : null}
      </g>
    );
  }

  renderMapView() {
    const { map, brickHex, steelHex, itemType, t } = this.state;
    const { rivers, steels, bricks, snows, forests, eagle } = parseStageMap(toString(map));

    return (
      <g data-role="map-view">
        <g data-role="board">
          <rect width={FBZ * B} height={FBZ * B} fill="#000000" />
          <RiverLayer rivers={rivers} />
          <SteelLayer steels={steels} />
          <BrickLayer bricks={bricks} />
          <SnowLayer snows={snows} />
          {eagle ? <Eagle x={eagle.x} y={eagle.y} broken={eagle.broken} /> : null}
          <ForestLayer forests={forests} />
        </g>
        <DashLines t={t} />
        <g data-role="tools" transform={`translate(${13 * B},0)`}>
          <TextButton
            content="?"
            x={2.25 * B}
            y={0.25 * B}
            spreadX={0.05 * B}
            spreadY={0.05 * B}
            onClick={this.onShowHelpInfo}
          />
          <Text content={'\u2192'} fill="#E91E63" x={0.25 * B} y={0.25 * B + positionMap[itemType]} />

          <rect x={B} y={B} width={B} height={B} fill="black" />
          <HexBrickWall x={B} y={2.5 * B} hex={brickHex} />
          <HexSteelWall x={B} y={4 * B} hex={steelHex} />
          <River shape={0} x={B} y={5.5 * B} />
          <Snow x={B} y={7 * B} />
          <Forest x={B} y={8.5 * B} />
          <Eagle x={B} y={10 * B} broken={false} />

          {this.renderItemSwitchButtons()}
          {this.renderHexAdjustButtons()}
        </g>
      </g>
    );
  }

  renderConfigView() {
    const { enemies, difficulty, stageName, t } = this.state;
    const totalEnemyCount = enemies.map(e => e.count).reduce((x: number, y) => x + y);
    return (
      <g data-role="config-view">
        <DashLines t={t} />
        <Text content="name:" x={3.5 * B} y={1 * B} fill="#ccc" />
        <TextInput
          x={6.5 * B}
          y={B}
          maxLength={12}
          value={stageName}
          onChange={stageName => this.setState({ stageName })}
        />

        <Text content="difficulty:" x={0.5 * B} y={2.5 * B} fill="#ccc" />
        <TextButton content="-" x={6.25 * B} y={2.5 * B} disabled={difficulty === 1} onClick={this.onDecDifficulty} />
        <Text content={String(difficulty)} x={7.25 * B} y={2.5 * B} fill="#ccc" />
        <TextButton content="+" x={8.25 * B} y={2.5 * B} disabled={difficulty === 4} onClick={this.onIncDifficulty} />

        <Text content="enemies:" x={2 * B} y={4 * B} fill="#ccc" />
        <g data-role="enemies-config" transform={`translate(${6 * B}, ${4 * B})`}>
          {enemies.map(({ tankLevel, count }, index) => (
            <g key={index} transform={`translate(0, ${1.5 * B * index})`}>
              <TextButton
                content={'\u2190'}
                x={0.25 * B}
                y={0.25 * B}
                disabled={tankLevel === 'basic'}
                onClick={() => this.onDecEnemyLevel(index)}
              />
              <Tank tank={TankRecord({ side: 'ai', level: tankLevel, x: B, y: 0 })} />
              <TextButton
                content={'\u2192'}
                x={2.25 * B}
                y={0.25 * B}
                disabled={tankLevel === 'armor'}
                onClick={() => this.onIncEnemyLevel(index)}
              />
              <TextButton
                content="-"
                x={3.75 * B}
                y={0.25 * B}
                disabled={count === 0}
                onClick={() => this.onDecEnemyCount(index)}
              />
              <Text content={String(count).padStart(2, '0')} x={4.5 * B} y={0.25 * B} fill="#ccc" />
              <TextButton
                content="+"
                x={5.75 * B}
                y={0.25 * B}
                disabled={count === 99}
                onClick={() => this.onIncEnemyCount(index)}
              />
            </g>
          ))}
          <Text content="total:" x={0.25 * B} y={6 * B} fill="#ccc" />
          <Text content={String(totalEnemyCount).padStart(2, '0')} x={4.5 * B} y={6 * B} fill="#ccc" />
        </g>
      </g>
    );
  }

  renderPopup() {
    const { popup } = this.state;
    if (popup.type === 'alert') {
      return (
        <g data-role="popup-alert">
          <rect x={0} y={0} width={totalWidth} height={totalHeight} fill="transparent" />
          <g transform={`translate(${2.5 * B}, ${4.5 * B})`}>
            <rect x={-0.5 * B} y={-0.5 * B} width={12 * B} height={4 * B} fill="#e91e63" />
            <TextWithLineWrap x={0} y={0} fill="#333" maxLength={22} content={popup.message} />
            <TextButton x={9.5 * B} y={2.25 * B} textFill="#333" content="OK" onClick={this.onClickOkOfAlert} />
          </g>
        </g>
      );
    } else if (popup.type === 'confirm') {
      return (
        <g data-role="popup-confirm">
          <rect x={0} y={0} width={totalWidth} height={totalHeight} fill="transparent" />
          <g transform={`translate(${2.5 * B}, ${4.5 * B})`}>
            <rect x={-0.5 * B} y={-0.5 * B} width={12 * B} height={4 * B} fill="#e91e63" />
            <TextWithLineWrap x={0} y={0} fill="#333" maxLength={22} content={popup.message} />
            <TextButton x={7.5 * B} y={2 * B} textFill="#333" content="no" onClick={this.onCancel} />
            <TextButton x={9 * B} y={2 * B} textFill="#333" content="yes" onClick={this.onConfirm} />
          </g>
        </g>
      );
    } else {
      return null;
    }
  }

  componentDidMount() {
    this.form = document.createElement('form');
    this.resetButton = document.createElement('input');
    this.input = document.createElement('input');

    this.resetButton.type = 'reset';
    this.input.type = 'file';

    this.form.style.display = 'none';

    this.input.addEventListener('change', this.onLoadFile);

    this.form.appendChild(this.input);
    this.form.appendChild(this.resetButton);
    document.body.appendChild(this.form);
  }

  componentWillUnmount() {
    this.input.removeEventListener('change', this.onLoadFile);
    this.form.remove();
  }

  onLoadFile = () => {
    const file = this.input.files[0];
    if (file == null) {
      return;
    }
    const fileReader = new FileReader();
    fileReader.readAsText(file);
    fileReader.onloadend = () => {
      try {
        const stage: StageConfig = JSON.parse(fileReader.result);
        this.loadStateFromFileContent(stage);
      } catch (error) {
        this.showAlertPopup('Failed to open file.');
      }
      this.resetButton.click();
    };
  };

  async loadStateFromFileContent(stage: StageConfig) {
    const stageName = stage.name;
    const difficulty = stage.difficulty;
    const enemies = List(
      stage.enemies.map(line => {
        const splited = line.split('*');
        return EnemyConfigRecord({
          count: Number(splited[0]),
          tankLevel: splited[1] as TankLevel
        });
      })
    )
      .setSize(4)
      .map(v => (v ? v : enemyConfigRecord));
    const map = List(stage.map).flatMap(line => {
      const items = line.trim().split(/ +/);
      return items.map(item => {
        const hex = parseInt(item[1], 16);
        return MapItemRecord({
          type: item[0] as MapItemType,
          hex: isNaN(hex) ? 0 : hex
        });
      });
    });
    if (await this.showConfirmPopup('This will override current config and map. Continue?')) {
      this.setState({ stageName, difficulty, enemies, map });
    }
  }

  render() {
    const { view } = this.state;

    return (
      <svg
        ref={node => (this.svg = node)}
        className="svg"
        style={{ background: '#333' }}
        width={totalWidth * zoomLevel}
        height={totalHeight * zoomLevel}
        viewBox={`0 0 ${totalWidth} ${totalHeight}`}
        onMouseDown={this.onMouseDown}
        onMouseUp={this.onMouseUp}
        onMouseMove={this.onMouseMove}
        onMouseLeave={this.onMouseLeave}
      >
        {view === 'map' ? this.renderMapView() : null}
        {view === 'config' ? this.renderConfigView() : null}
        <g role="menu" transform={`translate(0, ${13 * B})`}>
          <TextButton
            content="config"
            x={2.5 * B}
            y={0.5 * B}
            selected={view === 'config'}
            onClick={() => this.onChangeView('config')}
          />
          <TextButton
            content="map"
            x={0.5 * B}
            y={0.5 * B}
            selected={view === 'map'}
            onClick={() => this.onChangeView('map')}
          />
          <TextButton content="load" x={7 * B} y={0.5 * B} onClick={this.onRequestLoad} />
          <TextButton content="save" x={9.5 * B} y={0.5 * B} onClick={this.onSave} />
        </g>
        {this.renderPopup()}
      </svg>
    );
  }
}

ReactDOM.render(
  <Provider store={simpleStore}>
    <Editor />
  </Provider>,
  document.getElementById('app')
);
