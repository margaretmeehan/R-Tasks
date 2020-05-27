import tmrm = require('azure-pipelines-task-lib/mock-run');
import path = require('path');

let taskPath = path.join(__dirname, '..', 'index.js');
let tmr: tmrm.TaskMockRunner = new tmrm.TaskMockRunner(taskPath);

const packageNames = 'stringr,-fakepackage,testthat'

tmr.setInput('rPackageNames', packageNames);

tmr.run();
