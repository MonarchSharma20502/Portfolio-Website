$ErrorActionPreference = "Continue"
$root = "c:\Users\monar\OneDrive - Surbhi Electronet Private Limited (SEPL)\Desktop\Portfolio Website"
$node = "C:\Users\monar\node-portable\node-v22.11.0-win-x64\node.exe"
$git = "C:\Program Files\Git\cmd\git.exe"
$out  = Join-Path $root "_work\install-log.txt"

Set-Location $root

$log = @()
$log += "=== branch/status ==="
$log += & $git -c core.pager=cat status --short
$log += "=== current branch ==="
$log += & $git -c core.pager=cat rev-parse --abbrev-ref HEAD

# Install framer-motion (motion package) into portfolio
Set-Location (Join-Path $root "portfolio")
$log += "=== npm install framer-motion ==="
$env:NODE_ENV = ""
& $node "node_modules\npm\bin\npm-cli.js" install framer-motion --save 2>&1 | Out-String | ForEach-Object { $log += $_ }

Set-Location $root
$log += "=== package.json deps ==="
$log += Get-Content (Join-Path $root "portfolio\package.json") | Select-String -Pattern '"(framer-motion|next|react)"' -SimpleMatch:$false

$log | Out-File -FilePath $out -Encoding utf8
Write-Output "DONE"
