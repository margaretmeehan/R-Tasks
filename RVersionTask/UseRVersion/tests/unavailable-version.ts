import ma = require('azure-pipelines-task-lib/mock-answer');
import mr = require('azure-pipelines-task-lib/mock-run');
import path = require('path');

import { mockSemVer, mockToolLib } from './testutil';

let taskPath = path.join(__dirname, '..', 'index.js');
let runner: mr.TaskMockRunner = new mr.TaskMockRunner(taskPath);

// value doesn't change anything since we're mocking semver
const version = '0.0.1';

runner.setInput('versionSpec', version);
runner.setInput('addToPath', 'true');

// mock valid semver version
runner.registerMock('semver', mockSemVer());

// mock unavailable version (returning null for installDir)
runner.registerMock('azure-pipelines-tool-lib/tool', mockToolLib(null, [version]));

// mock task functions using built-in mock lib
let mocks: ma.TaskLibAnswers = <ma.TaskLibAnswers>{
    'which': {
        'Rscript': './mock/Rscript'
    }
}
runner.setAnswers(mocks);

runner.run();
