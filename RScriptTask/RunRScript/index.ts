import task = require('azure-pipelines-task-lib/task');
import * as path from 'path';
import { runRScript } from './rscript';

async function run() {
    try {
        task.setResourcePath(path.join(__dirname, 'task.json'));
        // `scriptPath` is required and is asserted non-null, so a string is guaranteed
        await runRScript({
            scriptPath: task.getPathInput('scriptPath', true)!,
            arguments: task.getInput('arguments')
        });
        task.setResult(task.TaskResult.Succeeded, '');
    }
    catch (err) {
        task.setResult(task.TaskResult.Failed, err.message);
    }
}

run();
