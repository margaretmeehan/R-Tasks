# Run R Script Task for Azure DevOps

[Run R Script Extension](https://marketplace.visualstudio.com/items?itemName=cse-nyc.run-r-script) (Azure DevOps Marketplace)

The task in this extension runs a specified R script within a CI/CD pipeline in Azure DevOps. Provided a relative path to a given R script, and optional command-line arguments, this task will invoke that script.

## Requirements

There are two prerequisites for using this task:

1. __The build agent running the task must have R installed__. The `latest` version of R is currently included by default on the supported build agents. If another version is desired, it must be installed manually (e.g. by powershell script) before invoking this task.
2. __There exists an R script to be run in the repo__. This script will need to be referenced by relative path from project root.

## Build Agent Compatibility

Provided that R is installed, this task can run on any supported build agent environment (i.e. Windows, Ubuntu, and macOS)

## Run an R Script

When adding this task to an Azure Pipeline, provide a path to the desired R script. This path must either be relative from `$(System.DefaultWorkingDirectory)` or must be an absolute filepath. Optionally, the task can also be provided command-line arguments as a string input and they will be provided directly to the R script at runtime.

In YAML, this should look something like:

```yaml
# relative path example with arguments
- task: RunRScript@0
  displayName: Run R Script
  inputs:
    scriptPath: scripts/sample.R
    arguments: arg1 arg2 arg3
```

or

```yaml
# absolute path example with no arguments
- task: RunRScript@0
  displayName: Run R Script
  inputs:
    scriptPath: $(Build.SourcesDirectory)/scripts/sample.R
```

## Credit

The R logo has been sourced from the the [R Project website](https://www.r-project.org/logo/) and is being used under the [CC-BY-SA 4.0 license](https://creativecommons.org/licenses/by-sa/4.0/legalcode").
