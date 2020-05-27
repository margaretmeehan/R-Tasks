import ma = require('azure-pipelines-task-lib/mock-answer');
import mr = require('azure-pipelines-task-lib/mock-run');
import path = require('path');

import { mockSemVer, mockToolLib } from './testutil';

let taskPath = path.join(__dirname, '..', 'index.js');
let runner: mr.TaskMockRunner = new mr.TaskMockRunner(taskPath);

const version = '3.5.3';
const mockInstallPath = `C:\\Program Files\\R\\R-${version}\\bin`;

runner.setInput('versionSpec', version);
runner.setInput('addToPath', 'true');

// mock valid semver version
runner.registerMock('semver', mockSemVer());

// mock found version installDir and available version
runner.registerMock('azure-pipelines-tool-lib/tool', mockToolLib(mockInstallPath, [version]));

// mock task functions using built-in mock lib
let mocks: ma.TaskLibAnswers = <ma.TaskLibAnswers>{
    'which': {
        'Rscript': './mock/Rscript'
    }
}
runner.setAnswers(mocks);

// mock specific task.prependPath() function
runner.registerMockExport(
    'prependPath',
    (path: string): void => {
        console.log(`mocking task.prependPath("${path}")`);
    }
);

runner.run();
