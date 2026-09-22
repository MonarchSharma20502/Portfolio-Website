$ErrorActionPreference = "Continue"
$root = "c:\Users\monar\OneDrive - Surbhi Electronet Private Limited (SEPL)\Desktop\Portfolio Website"
$node = "C:\Users\monar\node-portable\node-v22.11.0-win-x64\node.exe"
$out  = Join-Path $root "_work\serve-log.txt"

Set-Location (Join-Path $root "portfolio\out")
$log = @()

# Serve the static export on 4321 with basePath-free root (out/ is already prefixed)
# Start-Process splits the arg array on spaces; pass the script path as a
# single quoted argument instead.
$scriptPath = Join-Path $root "_work\serve-out.js"
$srv = Start-Process -FilePath $node -ArgumentList "`"$scriptPath`" 4321" -PassThru -WindowStyle Hidden -RedirectStandardError (Join-Path $root "_work\serve-err.txt") -RedirectStandardOutput (Join-Path $root "_work\serve-stdout.txt")

Start-Sleep -Seconds 3
$log += "server pid: $($srv.Id)  hasExited: $($srv.HasExited)"
if ($srv.HasExited) {
  $log += "=== server stdout ==="
  $log += "exit code: $($srv.ExitCode)"
}
try {
  $log += "=== HTTP 200 check ==="
  $r = Invoke-WebRequest -Uri "http://localhost:4321/index.html" -UseBasicParsing -TimeoutSec 15
  $log += "status: $($r.StatusCode), length: $($r.Content.Length)"
  $log += "=== markers ==="
  $html = $r.Content
  foreach ($m in @("Monarch", "Cloud", "framer", "scroll", "Marquee", "marquee", "Things I have built", "Where I have worked")) {
    $found = $html.Contains($m)
    $log += "$m => $found"
  }
} finally {
  Stop-Process -Id $srv.Id -Force -ErrorAction SilentlyContinue
}

$log | Out-File -FilePath $out -Encoding utf8
Write-Output "DONE"
