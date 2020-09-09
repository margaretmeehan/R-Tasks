import task = require('azure-pipelines-task-lib/task');
import * as path from 'path';
import { IExecSyncOptions } from 'azure-pipelines-task-lib/toolrunner';

const RTOOL: string = 'Rscript';
const INSTALL_SCRIPT_NAME: string = 'install-packages.R';

async function run() {
    try {
        task.setResourcePath(path.join(__dirname, 'task.json'));

        // use comma as delimiter for package names and trim whitespace
        const rPackageNamesInput: string | undefined = task.getInput('rPackageNames', true);
        const rPackageNames: string[] = rPackageNamesInput ? rPackageNamesInput.split(/[,]+/).map(name => name.trim()) : [];

        if (!rPackageNames.length) {
            task.setResult(task.TaskResult.Failed, 'No package name(s) provided');
            return;
        }

        if (invalidPackageName(rPackageNames)) {
            task.setResult(task.TaskResult.Failed, 'Invalidly formatted package name(s) provided');
            return;
        }

        console.log(`Packages to be installed: ${rPackageNames.join(', ')}`);
        installRPackages(rPackageNames);
    }
    catch (err) {
        task.setResult(task.TaskResult.Failed, err.message);
    }
}

function invalidPackageName(names: string[]): boolean {
    // immediately invalid if name doesn't begin with letter or if < 2 chars in length
    for (let name of names) {
        if (!/[a-zA-Z]/.test(name[0]) || name.length < 2)
            return true;
    }
    return false;
}

function installRPackages(packageNames: string[]): void {
    // ensure R is installed and availabe in PATH
    const rScriptPath = task.which(RTOOL);
    if (!rScriptPath)
        throw new Error('R is not installed or properly configured in the PATH');

    // prepare command to run R script and append each package name as args
    let installScriptPath = path.join(__dirname, INSTALL_SCRIPT_NAME);
    let installScriptCommand = task.tool(rScriptPath).arg(installScriptPath); 
    for (let name of packageNames)
        installScriptCommand = installScriptCommand.arg(name);

    // invoke install script synchronously so we can examine stdout, stderr, and exit code
    const { stderr, code } = installScriptCommand.execSync(<IExecSyncOptions>{
        outStream: process.stdout,
        errStream: process.stdout
    });
    switch (code) {
        case 0:
            task.setResult(task.TaskResult.Succeeded, '');
            break;
        case 1:
            // start with generic msg, try to replace with specific package install error.
            let errMsg = 'Make sure that all package names are valid and are available in CRAN.';
            const errLines = stderr.split('\n');
            const errPrefix = 'Error: ';
            for (let line of errLines) {
                if (line.startsWith(errPrefix)) {
                    errMsg = line.replace(errPrefix, '').trim();
                    break;
                }
            }
            throw new Error(`Installation error: ${errMsg}`);
        default:
            throw new Error(`Unknown exit code ${code} error: ${stderr}`);
    }
}

run();
