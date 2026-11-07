# Erzeugt zusätzliche Store-/Seitenbilder aus vorhandenen Grafiken:
#  - docs/store/haendlersymbol-128.png  (96-px-Symbol mit 16 px Rand, Chrome-Vorgabe)
#  - docs/social-preview.png            (1280 × 640, GitHub-Vorschau und og:image)
# Aufruf: powershell -ExecutionPolicy Bypass -File tools/make-store-images.ps1
Add-Type -AssemblyName System.Drawing
$root = Split-Path -Parent $PSScriptRoot

$icon = [System.Drawing.Image]::FromFile((Join-Path $root 'icons/icon-128.png'))
$bmp = New-Object System.Drawing.Bitmap 128, 128
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.InterpolationMode = 'HighQualityBicubic'
$g.Clear([System.Drawing.Color]::Transparent)
$g.DrawImage($icon, 16, 16, 96, 96)
$g.Dispose()
$bmp.Save((Join-Path $root 'docs/store/haendlersymbol-128.png'), [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()
$icon.Dispose()

$promo = [System.Drawing.Image]::FromFile((Join-Path $root 'docs/store/promo-1400x560.png'))
$bmp = New-Object System.Drawing.Bitmap 1280, 640
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.InterpolationMode = 'HighQualityBicubic'
$g.Clear($promo.GetPixel(2, 2))
$g.DrawImage($promo, 0, 64, 1280, 512)
# Ränder oben/unten mit der ersten/letzten Bildzeile füllen, damit der Verlauf weiterläuft.
$px = [System.Drawing.GraphicsUnit]::Pixel
$g.DrawImage($promo, (New-Object System.Drawing.Rectangle 0, 0, 1280, 65), (New-Object System.Drawing.Rectangle 0, 6, 1400, 1), $px)
$g.DrawImage($promo, (New-Object System.Drawing.Rectangle 0, 575, 1280, 65), (New-Object System.Drawing.Rectangle 0, 553, 1400, 1), $px)
$g.Dispose()
$bmp.Save((Join-Path $root 'docs/social-preview.png'), [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()
$promo.Dispose()
Write-Output 'Bilder geschrieben'
