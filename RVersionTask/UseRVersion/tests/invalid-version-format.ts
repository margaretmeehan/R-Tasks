import ma = require('azure-pipelines-task-lib/mock-answer');
import mr = require('azure-pipelines-task-lib/mock-run');
import path = require('path');

import { mockSemVer, mockToolLib } from './testutil';

let taskPath = path.join(__dirname, '..', 'index.js');
let runner: mr.TaskMockRunner = new mr.TaskMockRunner(taskPath);

// value doesn't change anything since we're mocking semver
const version = '3.5a.3b+1';

runner.setInput('versionSpec', version);
runner.setInput('addToPath', 'true');

// mock invalid semver version
runner.registerMock('semver', mockSemVer(true));

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
