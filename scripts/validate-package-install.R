#!/usr/bin/env Rscript

library(stringr)
library(lubridate)

# STRINGR
print("stringr tests:")
x <- c("abcdef", "ghifjk")
print(str_sub(x, 3, 3))
print(str_sub(x, 2, -2))
# LUBRIDATE
print("lubridate tests:")
print(ymd("20110604"))
print(mdy("06-04-2011"))
print(dmy("04/06/2011"))