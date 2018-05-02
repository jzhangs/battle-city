import { StageConfig } from 'types';

const testStage: StageConfig = require('stages/stage-test.json');
const stageConfigs: { [name: string]: StageConfig } = {
  test: testStage
};

export default stageConfigs;
