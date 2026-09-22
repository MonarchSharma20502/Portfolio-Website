$ErrorActionPreference = "Continue"
$root = "c:\Users\monar\OneDrive - Surbhi Electronet Private Limited (SEPL)\Desktop\Portfolio Website"
$node = "C:\Users\monar\node-portable\node-v22.11.0-win-x64\node.exe"
$out  = Join-Path $root "_work\build-log.txt"

Set-Location (Join-Path $root "portfolio")
$log = @()

# Kill any stuck node processes from previous builds, then clear caches.
Get-Process -Name node -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.Id -Force }
Start-Sleep -Milliseconds 400
Remove-Item -Recurse -Force (Join-Path $root "portfolio\.next") -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force (Join-Path $root "portfolio\out") -ErrorAction SilentlyContinue

$log += "=== next build (started $(Get-Date -Format o)) ==="
& $node "node_modules\next\dist\bin\next" build 2>&1 | Out-String | ForEach-Object { $log += $_ }
$log += "BUILD EXIT: $LASTEXITCODE"

$log += "=== out/ index exists? ==="
$idx = Join-Path $root "portfolio\out\index.html"
$log += "index.html: $(Test-Path $idx)"

$log | Out-File -FilePath $out -Encoding utf8
Write-Output "DONE"
