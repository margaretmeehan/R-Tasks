import path = require('path');
import task = require('azure-pipelines-task-lib');

import { useRVersion } from './rversion';

async function run() {
    try {
        task.setResourcePath(path.join(__dirname, 'task.json'));

        await useRVersion({
            versionSpec: task.getPathInput('versionSpec', true)!,
            addToPath: task.getBoolInput('addToPath', true)
        }, task.getPlatform());

        task.setResult(task.TaskResult.Succeeded, '');
    }
    catch (err) {
        task.setResult(task.TaskResult.Failed, err.message);
    }
}

run();
