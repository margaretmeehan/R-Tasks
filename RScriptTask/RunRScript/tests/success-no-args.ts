import ma = require('azure-pipelines-task-lib/mock-answer');
import mr = require('azure-pipelines-task-lib/mock-run');
import path = require('path');

let taskPath = path.join(__dirname, '..', 'index.js');
let runner: mr.TaskMockRunner = new mr.TaskMockRunner(taskPath);

const scriptPath = './sample-script.R';

runner.setInput('scriptPath', scriptPath);
runner.setInput('arguments', '');

// mock task functions
let mocks: ma.TaskLibAnswers = <ma.TaskLibAnswers> {
    "which": {
        "Rscript": "./mock/Rscript"
    },
    "exec": {
        [`./mock/Rscript ${scriptPath}`]: { 
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
