# Use R Version Task for Azure DevOps
WIP (Work In Progress) - unimplemented.

_Note: Since the default agent images are preinstalled with only the `latest` version of R, this task is still WIP, as there will not be more than one version to choose from._

## Requirements
The only prerequisite for running this task is that __the build agent running the task must have R installed__. The `latest` version of R is currently included by default on the supported build agents. If another version is desired, it must be installed manually (e.g. by powershell script) before invoking this task.

## Build Agent Compatibility
Provided that R is installed, this task can run on any supported build agent environment (i.e. Windows, Ubuntu, and macOS)

## Installing R Packages
TODO - how to use the task (specifying R.Project verision, RTools version, etc)

## Credit
The R logo has been sourced from the the [R Project website](https://www.r-project.org/logo/) and is being used under the [CC-BY-SA 4.0 license](https://creativecommons.org/licenses/by-sa/4.0/legalcode").