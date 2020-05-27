import ma = require('azure-pipelines-task-lib/mock-answer');
import mr = require('azure-pipelines-task-lib/mock-run');
import path = require('path');

let taskPath = path.join(__dirname, '..', 'index.js');
let runner: mr.TaskMockRunner = new mr.TaskMockRunner(taskPath);

const scriptPath = './sample-script.R';
const args = 'arg1 --arg2 -arg3=value'

runner.setInput('scriptPath', scriptPath);
runner.setInput('arguments', args);

// mock task functions
let mocks: ma.TaskLibAnswers = <ma.TaskLibAnswers> {
    "which": {
        "Rscript": "./mock/Rscript"
    },
    "exec": {
        [`./mock/Rscript ${scriptPath} arg1 --arg2 -arg3=value`]: { 
            "code": 0,
            "stdout": "sample script"  
       }
   } 
}
runner.setAnswers(mocks);

// mock fs module
let mockFs = {
    "statSync": (filePath : string) => {
        console.log(`mocking filepath ${filePath}`);
        return {
            "isFile": () => true
        };
    },
};
runner.registerMock('fs', mockFs);

runner.run();
