#!/usr/bin/env Rscript

# Create user lib for installed packages and add to path
dir.create(Sys.getenv("R_LIBS_USER"), showWarnings = FALSE, recursive = TRUE)
.libPaths(Sys.getenv("R_LIBS_USER"))

# Process package name args
packageNames = commandArgs(trailingOnly=TRUE)
if (length(packageNames) < 1) {
  stop("Invalid number of arguments", call.=FALSE)
}

cranMirror = "https://cloud.r-project.org/" # alt: http://cran.rstudio.com/

# Install packages
install.packages(c(packageNames), repos = cranMirror, dependencies = TRUE, quiet = TRUE)

# Verify package installation by loading and unloading each
for (pkg in packageNames) {
  tryCatch({
    library(pkg, character.only=TRUE, quietly=TRUE)
    detach(paste('package', pkg, sep = ':'), unload = TRUE, character.only = TRUE)
  }, error = function(msg) {
    stop(paste('Package \"', pkg, '\" could not be installed', sep=''), call.=FALSE)
    quit(status=1)
  })
}
