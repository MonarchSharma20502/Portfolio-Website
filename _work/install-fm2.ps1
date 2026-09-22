$ErrorActionPreference = "Continue"
$root = "c:\Users\monar\OneDrive - Surbhi Electronet Private Limited (SEPL)\Desktop\Portfolio Website"
$node = "C:\Users\monar\node-portable\node-v22.11.0-win-x64\node.exe"
$npm  = "C:\Users\monar\node-portable\node-v22.11.0-win-x64\node_modules\npm\bin\npm-cli.js"
$out  = Join-Path $root "_work\install-log2.txt"

Set-Location (Join-Path $root "portfolio")
$log = @()

$log += "=== npm config get cache / registry ==="
$log += & $node $npm config get cache 2>&1 | Out-String
$log += & $node $npm config get registry 2>&1 | Out-String

$log += "=== npm install framer-motion ==="
& $node $npm install framer-motion --no-audit --no-fund 2>&1 | Out-String | ForEach-Object { $log += $_ }
$log += "EXIT: $LASTEXITCODE"

$log += "=== installed? ==="
$fm = Join-Path $root "portfolio\node_modules\framer-motion\package.json"
$log += "framer-motion present: $(Test-Path $fm)"
if (Test-Path $fm) {
  $pkg = Get-Content $fm | ConvertFrom-Json
  $log += "version: $($pkg.version)"
}

$log += "=== package.json ==="
$log += Get-Content (Join-Path $root "portfolio\package.json")

$log | Out-File -FilePath $out -Encoding utf8
Write-Output "DONE"
