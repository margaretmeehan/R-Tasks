[Diagnostics.CodeAnalysis.SuppressMessageAttribute('PSAvoidUsingWriteHost', '', Justification='AzDO agent integration')]
param()

if ([bool](Get-Command Rscript -ErrorAction SilentlyContinue))
{
  Exit 0
}

if ([bool](Get-Command choco -ErrorAction SilentlyContinue))
{
  # Windows
  $rVersion = '3.5.3'
  $rtoolsVersion = '3.5.0.4'
  $arch = if ([Environment]::Is64BitProcess) { "64" } else { "32" }

  choco install R.Project --version=$rVersion
  choco install -y rtools --version=$rtoolsVersion

  $rPath = "$env:SystemDrive\Program Files\R\R-$rVersion\bin"
  $rtoolsPath = "$env:SystemDrive\Rtools\bin"
  $mingwPath = "$env:SystemDrive\Rtools\mingw_$arch\bin"
  $path = "$rPath;$rtoolsPath;$mingwPath"

  $env:PATH = "$path;$env:PATH"
  Write-Host "##vso[task.prependpath]$path"
}
elseif ([bool](Get-Command apt-get -ErrorAction SilentlyContinue))
{
  # Ubuntu
  $release = lsb_release --codename --short
  $rVersion = '35'

  sudo apt-key adv --keyserver 'keyserver.ubuntu.com' --recv-keys 'E298A3A825C0D65DFD57CBB651716619E084DAB9'
  sudo add-apt-repository "deb https://cloud.r-project.org/bin/linux/ubuntu $release-cran$rVersion/"
  sudo apt-get update
  sudo apt-get install -y r-base
  # for installing R packages
  sudo apt-get install -y libcurl4-openssl-dev
  sudo apt-get install -y libgit2-dev
  Rscript --version
}
elseif ([bool](Get-Command brew -ErrorAction SilentlyContinue))
{
  # macOS - This installs only the latest 4.x version of R
  brew install r
  Rscript --version
}
else
{
  Write-Error 'No idea how to install R on this platform'
  Exit 1
}