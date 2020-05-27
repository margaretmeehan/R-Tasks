#!/usr/bin/env Rscript

# The intent with this script is just to verify that all arguments can be picked up correctly

args <- commandArgs(trailingOnly=TRUE)

if (length(args) != 3) {
  stop("Incorrect number of arguments", call.=FALSE)
}

print(paste("Sample script running with", length(args), "args"))
print(paste(args, sep='', collapse=' '))