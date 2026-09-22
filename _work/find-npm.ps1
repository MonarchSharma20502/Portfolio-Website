$ErrorActionPreference = "Continue"
$root = "c:\Users\monar\OneDrive - Surbhi Electronet Private Limited (SEPL)\Desktop\Portfolio Website"
$out  = Join-Path $root "_work\find-npm.txt"
$log = @()

# Where is npm?
$cands = @(
  "C:\Users\monar\node-portable\node-v22.11.0-win-x64\node_modules\npm\bin\npm-cli.js",
  "C:\Users\monar\node-portable\node-v22.11.0-win-x64\node_modules\npm",
  "C:\Users\monar\AppData\Roaming\npm",
  "C:\Program Files\nodejs"
)
foreach ($c in $cands) { $log += "$c => $(Test-Path $c)" }

$log += "=== npm on PATH ==="
$cmd = Get-Command npm -ErrorAction SilentlyContinue
if ($cmd) { $log += "npm: $($cmd.Source)" } else { $log += "npm: NOT FOUND on PATH" }

$log += "=== node_modules\npm dirs anywhere under node-portable ==="
$log += Get-ChildItem -Path "C:\Users\monar\node-portable" -Recurse -Filter "npm-cli.js" -ErrorAction SilentlyContinue | Select-Object -ExpandProperty FullName

$log += "=== global npm root ==="
$node = "C:\Users\monar\node-portable\node-v22.11.0-win-x64\node.exe"
$log += & $node -p "require('module').globalPaths" 2>&1 | Out-String

$log | Out-File -FilePath $out -Encoding utf8
Write-Output "DONE"
