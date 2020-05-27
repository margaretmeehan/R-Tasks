import semver = require('semver');
import task = require('azure-pipelines-task-lib/task');
import tool = require('azure-pipelines-tool-lib/tool');

import { EOL } from 'os';

interface TaskParams {
    versionSpec: string,
    addToPath: boolean
}

const RTOOL: string = 'Rscript';

export async function useRVersion(taskParams: Readonly<TaskParams>, platform: task.Platform): Promise<void> {
    const { versionSpec, addToPath } = taskParams;

    // parse valid semantic version
    const semVersionSpec: string | null = semver.valid(versionSpec);
    if (semVersionSpec === null) {
        throw new Error(`Invalid semantic version spec: ${versionSpec}`);
    }

    // attempt to find R installation for specified version and arch
    const installDir: string | null = tool.findLocalTool(RTOOL, semVersionSpec);

    // if not found, throw error and show available versions
    if (!installDir) {
        const availableVersions = tool.findLocalToolVersions(RTOOL);
        
        console.log(`task.which("${RTOOL}")`);
        console.log(task.which(RTOOL));

        throw new Error([
            `Unavailable specified version ${semVersionSpec}`,
            `${availableVersions.length} available versions:`,
            `${availableVersions}`
        ].join(EOL));
    }

    // add R installation dir to PATH
    if (addToPath) {
        console.log(`BEFORE PATH:\n${process.env['PATH']}`)
        console.log(`FOUND DIR: ${installDir}`)
        task.prependPath(installDir);
        console.log(`AFTER PATH:\n${process.env['PATH']}`)
    }
}
