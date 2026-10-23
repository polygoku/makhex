$ErrorActionPreference='Stop'
Add-Type -AssemblyName System.Drawing
$root=Join-Path (Split-Path $PSScriptRoot -Parent) 'public\demo'
$codec=[System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object {$_.MimeType -eq 'image/jpeg'} | Select-Object -First 1
if(-not $codec){throw 'JPEG codec unavailable'}
$params=New-Object System.Drawing.Imaging.EncoderParameters(1)
$params.Param[0]=New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality,[long]87)
function Convert-Photo([string]$source,[string]$target,[int]$top,[int]$cropHeight){
  $from=Join-Path $root $source
  $to=Join-Path $root $target
  $im=[System.Drawing.Image]::FromFile($from)
  try {
    $width=$im.Width
    $height=if($cropHeight -gt 0){$cropHeight}else{$im.Height}
    if($top -lt 0 -or ($top+$height) -gt $im.Height){throw 'Invalid crop for '+$source}
    $bitmap=New-Object System.Drawing.Bitmap($width,$height)
    try {
      $g=[System.Drawing.Graphics]::FromImage($bitmap)
      try {
        $g.Clear([System.Drawing.Color]::White)
        $g.InterpolationMode=[System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $destR=New-Object System.Drawing.Rectangle(0,0,$width,$height)
        $sourceR=New-Object System.Drawing.Rectangle(0,$top,$width,$height)
        $g.DrawImage($im,$destR,$sourceR,[System.Drawing.GraphicsUnit]::Pixel)
      }finally{$g.Dispose()}
      $bitmap.Save($to,$codec,$params)
    }finally{$bitmap.Dispose()}
  }finally{$im.Dispose()}
  $bytes=[System.IO.File]::ReadAllBytes($to)
  if($bytes.Length -lt 20000 -or $bytes[0] -ne 255 -or $bytes[1] -ne 216){throw 'Invalid JPEG output: '+$to}
  Write-Output ($target+' '+$bytes.Length+' bytes')
}
Convert-Photo 'build11-approved-hero-source.png' 'build11-english-lifestyle.jpg' 0 0
Convert-Photo 'build11-approved-hero-source.png' 'build11-english-lifestyle-wide.jpg' 260 701
Convert-Photo 'build11-approved-capture-source.png' 'build11-english-capture.jpg' 0 0
Convert-Photo 'build11-approved-explanation-source.png' 'build11-english-explanation.jpg' 0 0
Convert-Photo 'build11-approved-followup-source.png' 'build11-english-followup.jpg' 0 0
$params.Dispose()
Write-Output 'MAKHEX_BUILD11_APPROVED_IMAGES_OPTIMIZED'
