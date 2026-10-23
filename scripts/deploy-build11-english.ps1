# MAKHEX Build 11 self-hosted English media + complete hardware BOM deployment.
# Run on Ky_Basement in PowerShell after PR #57 is merged.
# No Shopify writes, no Squarespace writes, no orders. Isolated checkout only.
$ErrorActionPreference = 'Stop'
function Assert-Native([string]$step) {
 if ($LASTEXITCODE -ne 0) { throw "$step failed with exit code $LASTEXITCODE" }
}
function Verify-Route([string]$url, [string]$expectedType) {
 $r = Invoke-WebRequest -UseBasicParsing -Uri $url -TimeoutSec 30 -Headers @{'Cache-Control'='no-cache'}
 if ($r.StatusCode -ne 200) { throw "Unexpected HTTP $($r.StatusCode): $url" }
 $kind = [string]$r.Headers['Content-Type']
 if ($expectedType -and $kind -notlike "$expectedType*") {
   throw "Unexpected Content-Type $kind (expected $expectedType) for $url"
 }
 Write-Output "PASS HTTP 200 $kind $url"
}
$gitHubDir = Join-Path $HOME 'Documents\GitHub'
$choices = @(
 'makhex-blog-20261023',
 'makhex-build11-deploy-20261023',
 'makhex-cart-media-20261023',
 'makhex-sprint19-20261023',
 'makhex'
)
$source = $null
foreach ($folder in $choices) {
 $candidate = Join-Path $gitHubDir $folder
 if (-not (Test-Path (Join-Path $candidate '.git'))) { continue }
 $remote = (& git -C $candidate remote get-url origin 2>$null)
 if ($LASTEXITCODE -eq 0 -and $remote -match '(?i)polygoku/makhex(?:\.git)?$') {
  $source = $candidate; break
 }
}
if (-not $source) {
 throw "No existing polygoku/makhex checkout found in $gitHubDir. Clone from GitHub and re-run."
}
Write-Output "Using source checkout: $source"
& git -C $source fetch origin main
Assert-Native 'Fetch latest MAKHEX main'
$stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$deploy = Join-Path $gitHubDir "makhex-build11-english-deploy-$stamp"
& git -C $source worktree add --detach $deploy origin/main
Assert-Native 'Create isolated deploy worktree'
Set-Location $deploy
$sha = (& git rev-parse --short HEAD).Trim()
Write-Output "Deployment source SHA: $sha"
$assets = @(
 'public\demo\build11-en-concept.mp4',
 'public\demo\build11-en-poster.jpg',
 'public\demo\build11-scene-01.jpg',
 'public\demo\build11-scene-02.jpg',
 'public\demo\build11-scene-03.jpg',
 'public\demo\build11-en.vtt',
 'src\components\MosaicoHardwareBOM.astro'
)
foreach ($file in $assets) {
 if (-not (Test-Path $file)) { throw "Expected file missing from merged main: $file" }
}
if ((Get-Item 'public\demo\build11-en-concept.mp4').Length -lt 5000) { throw 'MP4 is unexpectedly empty' }
& npm.cmd ci --no-audit --no-fund
Assert-Native 'npm ci'
& npm.cmd run check
Assert-Native 'Astro validation'
& npm.cmd run build
Assert-Native 'Astro build'
& npm.cmd run qa
Assert-Native 'MAKHEX QA'
Write-Output "PREDEPLOY QA PASS at $sha"
& .\node_modules\.bin\wrangler.cmd deploy
Assert-Native 'Cloudflare Worker deploy'
$root = 'https://makhex.com'
Verify-Route "$root/" 'text/html'
Verify-Route "$root/projects/mosaico-learning-assistant/" 'text/html'
Verify-Route "$root/projects/mosaico-learning-assistant.csv" 'text/csv'
Verify-Route "$root/demo/build11-en-concept.mp4" 'video/mp4'
Verify-Route "$root/demo/build11-en-poster.jpg" 'image/jpeg'
Verify-Route "$root/demo/build11-scene-02.jpg" 'image/jpeg'
Verify-Route "$root/demo/build11-en.vtt" 'text/vtt'
Verify-Route "$root/cart/" 'text/html'
$r = Invoke-WebRequest -UseBasicParsing -Uri "$root/projects/mosaico-learning-assistant/" -TimeoutSec 30
$page = [string]$r.Content
foreach ($marker in @('/demo/build11-en-concept.mp4','mosaico-hardware','data-cart-add-plan','SC101IOT')) {
 if (-not $page.Contains($marker)) { throw "Build 11 page missing required marker: $marker" }
}
Write-Output "MAKHEX_BUILD11_COMPLETE_BOM_MEDIA_DEPLOYED SHA=$sha"
Write-Output "Worktree kept for audit: $deploy"
