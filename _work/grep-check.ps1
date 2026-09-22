$ErrorActionPreference = "Continue"
$root = "c:\Users\monar\OneDrive - Surbhi Electronet Private Limited (SEPL)\Desktop\Portfolio Website"
$out  = Join-Path $root "_work\grep-log.txt"
$log = @()

$idx = Join-Path $root "portfolio\out\index.html"
$raw = [System.IO.File]::ReadAllText($idx)
$log += "index.html length: $($raw.Length)"

foreach ($m in @("reveal", "Where I have worked", "Things I have built", "opacity:0", "Monarch")) {
  $log += "$m => $($raw.Contains($m))"
}

# Show a slice around the first occurrence of 'reveal' if present
$i = $raw.IndexOf("reveal")
if ($i -ge 0) { $log += "context: " + $raw.Substring([Math]::Max(0,$i-80), 200) }

# Check the page chunk for the reduced-motion hook
$chunkDir = Join-Path $root "portfolio\out\_next\static\chunks\app"
$chunk = Get-ChildItem -Path $chunkDir -Filter "page-*.js" -ErrorAction SilentlyContinue | Select-Object -First 1
if ($chunk) {
  $c = [System.IO.File]::ReadAllText($chunk.FullName)
  $log += "page chunk: $($chunk.Name), length: $($c.Length)"
  $log += "chunk has useReducedMotion: $($c.Contains('useReducedMotion'))"
  $log += "chunk has 'opacity:0': $($c.Contains('opacity:0'))"
  $log += "chunk has 'prefers-reduced-motion': $($c.Contains('prefers-reduced-motion'))"
} else {
  $log += "page chunk NOT FOUND in $chunkDir"
}

$log | Out-File -FilePath $out -Encoding utf8
Write-Output "DONE"
