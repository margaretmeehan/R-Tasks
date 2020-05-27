import ma = require('azure-pipelines-task-lib/mock-answer');
import tmrm = require('azure-pipelines-task-lib/mock-run');
import path = require('path');

let taskPath = path.join(__dirname, '..', 'index.js');
let tmr: tmrm.TaskMockRunner = new tmrm.TaskMockRunner(taskPath);

const installPackagesScriptPath = path.join(__dirname, '../install-packages.R')
const packageNames = 'stringr, testthat';

tmr.setInput('rPackageNames', packageNames);

let a: ma.TaskLibAnswers = <ma.TaskLibAnswers> {
    "which": {
        "Rscript": "./R/R-3.5.3/bin/Rscript"
    },
    "exec": {
          [`./R/R-3.5.3/bin/Rscript ${installPackagesScriptPath} stringr testthat`]: { 
          "code": 0,
          "stdout": "some output"  
       }
   } 
}
tmr.setAnswers(a);
tmr.run();
