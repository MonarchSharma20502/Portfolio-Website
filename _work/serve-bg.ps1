$ErrorActionPreference = "Continue"
$root = "c:\Users\monar\OneDrive - Surbhi Electronet Private Limited (SEPL)\Desktop\Portfolio Website"
$node = "C:\Users\monar\node-portable\node-v22.11.0-win-x64\node.exe"

Set-Location (Join-Path $root "portfolio\out")
$scriptPath = Join-Path $root "_work\serve-out.js"
$srv = Start-Process -FilePath $node -ArgumentList "`"$scriptPath`" 4322" -PassThru -WindowStyle Hidden
Start-Sleep -Seconds 2
try {
  # keep the server alive for the browser check
  Start-Sleep -Seconds 60
} finally {
  Stop-Process -Id $srv.Id -Force -ErrorAction SilentlyContinue
}
Write-Output "DONE"
