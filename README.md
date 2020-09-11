# R Tasks for Azure DevOps

# Overview 
This repo contains two Azure DevOps tasks for R projects. These tasks are intended to work on any build agent.
- [InstallRPackages](./RPackagesTask/) - Install a specified list of R packages from CRAN
- [RunRScript](./RScriptTask/) - Run a specified R script with support for command-line arguments

### Build Status
InstallRPackage<br>
[![Build Status](https://dev.azure.com/mameehan/R-Tasks/_apis/build/status/margaretmeehan.R-Tasks.InstallRPackage.Build?branchName=master)](https://dev.azure.com/mameehan/R-Tasks/_build/latest?definitionId=2&branchName=master)

RunRScript<br>
[![Build Status](https://dev.azure.com/mameehan/R-Tasks/_apis/build/status/margaretmeehan.R-Tasks.RunRScript.Build?branchName=master)](https://dev.azure.com/mameehan/R-Tasks/_build/latest?definitionId=3&branchName=master)

UseRVersion<br>
[![Build Status](https://dev.azure.com/mameehan/R-Tasks/_apis/build/status/margaretmeehan.R-Tasks.UseRVersion.Build?branchName=master)](https://dev.azure.com/mameehan/R-Tasks/_build/latest?definitionId=1&branchName=master)


## I. CI/CD Setup for Task Development
For the development of these tasks, there are two general pipeline templates all the tasks use: __Build__ and __Release__. 

#### Build
Build is a short, single-stage pipeline template primarily concerned with installing dependencies, building the TypeScript task files, and running associated unit tests. It's intended to be run frequently during development, like whenever a relevant change is pushed up to a feature branch.

#### Release
Release is a longer pipeline template with three stages: _Build_, _Dev_, and _Prod_. 
- _Build Stage_ - largely the same as the Build pipeline, this stage reuses the same templated steps with the added step of packaging the task for use in the next two stages.
- _Dev Stage_ - using the packaged task from the build stage, this task is responsible for privately uploading that task to an AzDO org and then validating the task in a more real-world scenario. It does this by directly invoking the new task as a user would and running a step to validate that it works as expected (e.g. using a custom script). These specific validation steps vary depending on what task is in the current context.
- _Prod Stage_ - assuming the previous stages have both succeeded and that the pipeline is running on the master branch, this stage currently publishes the current task to the Visual Studio Marketplace (currently this is set as a private publish).

#### Task Context: Triggering Pipelines at the Task-level
A problem encountered early on was finding a good way to run only the pipeline steps relevant to the task being actively worked on. For instance, making a code change to one task ideally should not also trigger a pipeline run for all other tasks in the repository.

The chosen solution to this was extracting as much as possible into two generalized pipeline templates (Build and Release). These pipeline templates don't know anything about the current task and only use variables to do all their work. 

Each individual task has two short YAML files in [./pipelines](./pipelines) that define these variables and specify pipeline triggers. One references the Build pipeline template and the other references the Release pipeline template. This allows each task to define their own triggering rules while still reusing virtually all of the same pipeline logic for only their own relevant files.

For examples of this, take a look at the two pipeline files for RunRScript:
- [./pipelines/r-script-build.yml](./pipelines/r-script-build.yml) - Build pipeline entrypoint
- [./pipelines/r-script-release.yml](./pipelines/r-script-release.yml) - Release pipeline entrypoint

## II. Task Development
### Adding a new task
#### Prerequisites
A note about Node versions in developing extensions for Azure DevOps:
> The production Environment only uses Node10 or Node6 (by using the `Node` in the `execution ` object instead of `Node10`).

Cited from the Microsoft docs on developing an Azure Pipelines task [here](https://docs.microsoft.com/en-us/azure/devops/extend/develop/add-build-task?view=azure-devops). For this reason, the tasks in this repo target Node v10.
#### Folder structure
In this repo, each task is its own Azure DevOps extension. The following is the general folder structure:
```bash
|-- extensionDir/ # e.g. RScriptTask
  |-- README.md
  |-- taskLogo.png
  |-- vss-extension.json
  |-- taskDir/ # e.g. RunRScript
    |-- index.ts
    |-- task.json
    |-- package.json
    |-- package-lock.json
    |-- tsconfig.json
    |-- tests/
      |-- _suite.ts
```
A more in-depth look at each file's role:
- `README.md` - what will be displayed in the extension's marketplace page when published
- `taskLogo.png` - the icon to be used for the extension in the VS marketplace
- `vss-extension.json` - sometimes referred to as the extension's manifest file: defines metadata for the extension such as icons, the markdown file to use (`README.md`), and the task's src directory (`taskDir/`)
  <details>
    <summary>See example manifest JSON</summary>

    In this example, our task will be called `PlaceholderTask`, so that will be replace the role of `taskDir`.
    ```json
    {
      "manifestVersion": 1,
      "id": "placeholder-task",
      "name": "Placeholder Task",
      "version": "0.0.1",
      "publisher": "placeholder-publisher",
      "targets": [
        {
          "id": "Microsoft.VisualStudio.Services"
        }
      ],  
      "description": "Brief task description text",
      "categories": [
        "Azure Pipelines"
      ],
      "icons": {
        "default": "taskLogo.png"    
      },
      "files": [
        {
          "path": "PlaceholderTask"
        }
      ],
      "content": {
        "details": {
          "path": "README.md"
        }
      },
      "contributions": [
        {
          "id": "placeholder-task-id", // this can be anything
          "type": "ms.vss-distributed-task.task",
          "targets": [
            "ms.vss-distributed-task.tasks"
          ],
          "properties": {
            "name": "PlaceholderTask"
          }
        }
      ]
    }
    ```
  </details>
- `index.ts` - the entry point for the task program (runs as a Node app)
- `task.json` - supplementing `vss-extension.json`, this describes task-specific metadata such as name, ID, author, input definitions, and execution information (e.g. Node10)
  <details>
    <summary>See example task JSON</summary>

    ```json
    {
      "$schema": "https://raw.githubusercontent.com/Microsoft/azure-pipelines-task-lib/master/tasks.schema.json",
      "id": "{{ GUID }}",
      "name": "PlaceholderTask",
      "friendlyName": "Placeholder Task",
      "description": "Placeholder task for demonstration!",
      "helpMarkDown": "",
      "category": "Utility",
      "author": "author@example.com",
      "version": {
        "Major": 0,
        "Minor": 0,
        "Patch": 1
      },
      "instanceNameFormat": "{{ text to be displayed in the pipeline step list }}",
      "inputs": [
        {
          "name": "stringInput1",
          "type": "string",
          "label": "Simple string input",
          "defaultValue": "",
          "required": true,
          "helpMarkDown": "Required string input named stringInput1 with no default value"
        }
      ],
      "execution": {
        "Node10": {
          "target": "index.js"
        }
      }
    }
    ```
  </details>
- `package.json` - tracks the task's Node dependencies as well as custom npm scripts
  <details>
    <summary>See example package JSON</summary>

    ```json
    {
      "name": "placeholdertask",
      "version": "1.0.0",
      "description": "",
      "main": "index.js",
      "scripts": {
        "compile": "tsc",
        "test": "mocha tests/_suite.js",
        "upload": "tfx build tasks upload --task-path ./ --overwrite",
        "delete": "tfx build tasks delete --task-id {{ GUID from task.json }}"
      },
      "author": "",
      "license": "ISC",
      "dependencies": {
        "azure-pipelines-task-lib": "^2.9.5"
      },
      "devDependencies": {
        "@types/mocha": "^7.0.2",
        "@types/node": "^14.0.6",
        "@types/q": "^1.5.4",
        "mocha": "^7.2.0",
        "sync-request": "^6.1.0",
        "typescript": "^3.9.3"
      }
    }
    ```
  </details>
- `package-lock.json` - describes the exact dependency tree that was generated
- `tsconfig.json` - specifies root files and compiler options required to compile the task scripts to JS
- `_suite.ts` - defines the unit tests for the task (uses the Mocha test framework)

#### Unit tests
The tasks in this repo use the [Mocha](https://mochajs.org/) testing framework for unit tests. To run the tests for any given task, run the following from the task's source directory (containing `package.json`):
```sh
npm run compile # compile to JS files
npm run test # run the Mocha test suite
```

#### CI/CD
As mentioned in the previous [CI/CD setup](#ci/cd-setup-for-task-development) section, each new task adds two new YAML files under `/pipelines` defining respective variables and pipeline triggers: one for the build pipeline and one for the release pipeline.
##### Add entry point YAML files
<details>
  <summary>placeholder-task-build.yml example</summary>

  ```yaml
  trigger:
    branches:
      include:
      - dev/*
    paths:
      include:
      - PlaceholderTaskDir/* # dir containing vss-extension.json

  variables:
  - group: PlaceholderTask # variable group to be created

  jobs:
  - template: templates/build.yml
  ```
</details>

<details>
  <summary>placeholder-task-release.yml example</summary>

  ```yaml
  trigger:
    branches:
      include:
      - master
    paths:
      include:
      - PlaceholderTaskDir/* # dir containing vss-extension.json

  variables:
  - group: PlaceholderTask # variable group to be created
  - group: Marketplace # variable group containing publishing info

  stages:
  - template: templates/release.yml
  ```
</details>

##### Create variable group
As referenced in the above YAML examples, each new task has its own variable group defined in the Azure DevOps UI. This page can be found using the blade on the left-hand side under __Pipelines__ -> __Library__.

The new variable group should have the following four variables defined:
- _taskID_ - the `id` value from the task's `vss-extension.json`
  - e.g. `placeholder-task`
- _taskName_ - the directory name containing the task's `task.json`
  - e.g. `PlaceholderTask`
- _taskRoot_ - the directory name containing the task's `vss-extension.json`
  - e.g. `PlaceholderTaskDir`
- _taskSrc_ - the value of taskRoot/taskName
  - e.g. `PlaceholderTaskDir/PlaceholderTask`

The shared `Marketplace` variable group should be referenced in all release pipelines. It can be edited in the Azure DevOps UI and contains:
- _publisherID_ - publisher ID to use during private publish to Visual Studio Marketplace
- _sharedList_ - comma-separated list of ADO organizations to share task with after publish
- _serviceUrl_ - URL value in the format `https://dev.azure.com/{{org}}`
- _accessToken_ - PAT with sufficient permissions for uploading an extension to the organization 
  - See [this later section](#access-tokens-/-organization-permissions) for more on this

#### Automated versioning
Currently, the release pipeline automatically increments a task's patch version upon publishing to the marketplace (assuming there exists a currently published version). If the task is being published for the first time, it just uses whatever version is specified in the manifest file, `vss-extension.json`.

For incrementing a task's major and minor version, it should just be manually updated in the task's manifest file and the automated patch updates should pick that up and reset.

### Task validation / Integration testing
In addition to unit tests, the Dev stage of the release pipeline runs the `validate-steps.yml` template as a form of integration testing. These steps are intended to invoke the updated task as a user would in yaml:
```yaml
- task: PlaceholderTask@0
  displayName: Run Placeholder Task
  condition: eq(variables['taskName'], 'PlaceholderTask')
  inputs:
    stringInput1: hello world
```
These are run only when Release is being run for an appropriate task, defined by `condition`. Depending on the task, just verifying that the task runs without error might be enough validation. Otherwise, additional steps can be added using the same `condition` for more validation steps for that task.

If any of these steps fail, the Dev stage will also fail and the Prod stage will not run.

### Publishing
This step will only run if running from the master branch (i.e. after merging a PR or after triggering manually). Assuming all the above variables have been set, no further changes should be required for publishing. 

The pipeline is currently configured to publish privately and share with select organizations defined in the `Marketplace` variable group. 

>__Note:__ The first time a new task is publishing, the release pipeline will _appear to fail_ when it has actually succeeded. This is a result of the step to query for the currently published version of the task -- which would not exist. This "succeeds with issues" and then results in the pipeline showing a red fail icon, even though it has successfully published to the marketplace. 

## III. Refactor / Todo
### R Installation Cleanup
While waiting on R to be installed on the Microsoft-hosted build agents, the Dev stage of the release pipeline has been referencing a powershell script to manually install R on each platform: `scripts/install_r.ps1`

In addition to this, the pipeline uses an added step to manually set the `R_LIBS_USER` environment variable to a new directory. This environment variable is set by default by R and defines where to install packages to. However, when installing R manually, it's set to a directory the agent doesn't have write permissions to (depending on platform). This issue is mitigated by manually setting this environment variable to a directory the agent has full write access to.

Both of these steps are used in `pipelines/templates/validate-steps.yml` and can be removed once R is installed and configured on all Microsoft-hosted agent images.

### InstallRPackages - Installing packages from sources other than CRAN
Prioritizing core functionality first, the task currently only supports installing packages from CRAN. However, there are numerous packages available in other locations such as GitHub, Bioconductor, etc. One approach for addressing this is to use the `devtools` R package to install packages from many different sources. Example usages:
```r
devtools::install_github() # installing from GitHub
devtools::install_bioc() # installing from Bioconductor
```
This can be addressed in a future version of this task or done by using the _RunRScript_ task.

### Release Pipeline (Validation) - Referencing a task before it has been uploaded for the first time
In the Dev stage of the Release pipeline, a task is uploaded directly to an AzDO org to be validated. As part of this validation, the task is referenced in YAML as a user would use it:
```yaml
- task: RunRScript@0
  displayName: Run R Script
  inputs:
    scriptPath: # path to R script
    arguments: # string of script args
```
The issue here is that the pipeline will not be able to run if this step exists before the task has been uploaded for the first time. The pipeline will raise an error regarding referencing a task that does not exist. 

The workaround for this has been to manually trigger a Release pipeline run without the validation steps present for that specific task ([validate-steps.yml](./pipelines/templates/validate-steps.yml)). A first-time run of the Dev stage causes the pipeline to recognize the task moving forward. In order to prevent a full publish in this scenario, there is a check in the Prod stage ensuring that it will only publish to marketplace if it's running from the master branch. This allows for safe manual runs of the Release pipeline in feature branches. 

After the new task has been uploaded to the AzDO org for the first time, those validation steps can be added back for all subsequent runs.

### Access Tokens / Organization Permissions
I tried using my own access token with the appropriate scopes set, but when uploading a task directly to an organization for testing I kept seeing this error: 
```yaml
You cannot install this extension because it includes a build task, and you do not have sufficient permissions.
To proceed, you must be an administrator of All Pools.
```
Even when added as an administrator to all pools and as a project administrator, I still saw the error. 

My current workaround is to use an access token created by someone else who already has the correct permissions. This seems to be a common issue, as can be seen in this [GitHub issue thread](https://github.com/Microsoft/tfs-cli/issues/268) for the `tfs-cli`. The accepted resolution appears to be getting added to the _Project Collection Administrators_ group.

## IV. Credit
The R logo has been sourced from the the [R Project website](https://www.r-project.org/logo/) and is being used under the [CC-BY-SA 4.0 license](https://creativecommons.org/licenses/by-sa/4.0/legalcode").

___

## License
This project uses MIT licensing. All contributions in any form shall have the Open Source Community's best interest in mind. Please feel free to use, fork and contribute back to the community.

## Code of Conduct
This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.
