# Use R Version Task for Azure DevOps
WIP - unimplemented

## Requirements
The only prerequisite for running this task is that __the build agent running the task must have R installed__. R is currently not installed by default on the supported build agents and must be done manually (e.g. by powershell script) before invoking this task.

## Build Agent Compatibility
Provided that R is installed, this task can run on any supported build agent environment (i.e. Windows, Ubuntu, and macOS)

## Installing R Packages
TODO - how to use the task (specifying R.Project verision, RTools version, etc)

## Credit
The R logo has been sourced from the the [R Project website](https://www.r-project.org/logo/) and is being used under the [CC-BY-SA 4.0 license](https://creativecommons.org/licenses/by-sa/4.0/legalcode").