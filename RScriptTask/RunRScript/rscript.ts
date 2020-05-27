import task = require('azure-pipelines-task-lib/task');
import * as fs from 'fs';
import { IExecOptions } from 'azure-pipelines-task-lib/toolrunner';

interface TaskParams {
    scriptPath: string,
    arguments?: string
}

const RTOOL: string = 'Rscript';

export async function runRScript(taskParams: Readonly<TaskParams>): Promise<void> {
    // Ensure script filepath is valid
    const { scriptPath } = taskParams;
    if (!fs.statSync(scriptPath).isFile()) {
        throw new Error(task.loc('NotAFile', scriptPath));
    }
    
    // Instantiate tool runner with appropriate arguments
    const rPath = task.which(RTOOL);
    if (!rPath)
        throw new Error(`Invalid tool path: ${rPath}`);
    const rTool = task.tool(rPath).arg(scriptPath);
    if (taskParams.arguments)
        rTool.line(taskParams.arguments);

    // Execute R script
    // `failOnStdErr` set to false allows warnings and error messages to be printed but doesn't immediately fail the task
    // `ignoreReturnCode` set to false will fail the task if the R script terminates with an error exit code (non-zero)
    await rTool.exec(<IExecOptions>{
        failOnStdErr: false,
        errStream: process.stderr,
        outStream: process.stdout,
        ignoreReturnCode: false
    });
}
