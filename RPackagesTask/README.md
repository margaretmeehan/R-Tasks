# Install R Packages Task for Azure DevOps

[Install R Packages Extension](https://marketplace.visualstudio.com/items?itemName=cse-nyc.install-r-packages) (Azure DevOps Marketplace)

The task in this extension allows for the installation of R packages within a CI/CD pipeline in Azure DevOps. Provided a list of R package names, the task will install each of them from [CRAN](https://cran.r-project.org/).

## Requirements

The only prerequisite for running this task is that __the build agent running the task must have R installed and configured in the PATH__.

## Build Agent Compatibility

Provided that R is installed, this task can run on any supported build agent environment (i.e. Windows, Ubuntu, and macOS)

## Installing R Packages

When adding this task to an Azure Pipeline, provide a list of R package names separated by commas into the R Package Names (`rPackageNames`) field to have them installed on the build agent. These packages will then be available for use in any R scripts being run in the pipeline.

In YAML, this should look something like:

```yaml
- task: InstallRPackages@0
  displayName: Install R Packages
  inputs:
    rPackageNames: stringr, testthat
```

## Credit

The R logo has been sourced from the the [R Project website](https://www.r-project.org/logo/) and is being used under the [CC-BY-SA 4.0 license](https://creativecommons.org/licenses/by-sa/4.0/legalcode").
