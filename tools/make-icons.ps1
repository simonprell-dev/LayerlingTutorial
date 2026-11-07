# Erzeugt die Erweiterungs-Symbole: abgerundetes Quadrat mit einem Würfel aus drei
# Druckschichten. Bewusst ohne Layerling-Logo (unabhängiges Projekt).
# Aufruf: powershell -ExecutionPolicy Bypass -File tools/make-icons.ps1
Add-Type -AssemblyName System.Drawing
$root = Split-Path -Parent $PSScriptRoot
$out = Join-Path $root 'icons'
New-Item -ItemType Directory -Force $out | Out-Null

function RoundedRect([float]$x, [float]$y, [float]$w, [float]$h, [float]$r) {
    $p = New-Object System.Drawing.Drawing2D.GraphicsPath
    $d = $r * 2
    $p.AddArc($x, $y, $d, $d, 180, 90)
    $p.AddArc($x + $w - $d, $y, $d, $d, 270, 90)
    $p.AddArc($x + $w - $d, $y + $h - $d, $d, $d, 0, 90)
    $p.AddArc($x, $y + $h - $d, $d, $d, 90, 90)
    $p.CloseFigure()
    return $p
}

function Pts($s, $pairs) {
    $list = @()
    for ($i = 0; $i -lt $pairs.Length; $i += 2) {
        $list += New-Object System.Drawing.PointF(([float]($pairs[$i] * $s)), ([float]($pairs[$i + 1] * $s)))
    }
    return [System.Drawing.PointF[]]$list
}

foreach ($size in 16, 32, 48, 128) {
    $bmp = New-Object System.Drawing.Bitmap $size, $size
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = 'AntiAlias'
    $g.Clear([System.Drawing.Color]::Transparent)
    $s = $size / 128.0

    $bg = RoundedRect 0 0 ($size - 1) ($size - 1) (28 * $s)
    $g.FillPath((New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 24, 118, 110))), $bg)

    # Würfel in Iso-Ansicht: drei Schichten übereinander
    $top = [System.Drawing.Color]::FromArgb(255, 255, 214, 102)
    $left = [System.Drawing.Color]::FromArgb(255, 255, 159, 67)
    $right = [System.Drawing.Color]::FromArgb(255, 235, 110, 50)
    $layers = 3
    $h = 18
    for ($i = 0; $i -lt $layers; $i++) {
        $y0 = 82 - $i * ($h + 3)
        $g.FillPolygon((New-Object System.Drawing.SolidBrush $left), (Pts $s @(24, $y0, 64, ($y0 + 20), 64, ($y0 + 20 + $h), 24, ($y0 + $h))))
        $g.FillPolygon((New-Object System.Drawing.SolidBrush $right), (Pts $s @(64, ($y0 + 20), 104, $y0, 104, ($y0 + $h), 64, ($y0 + 20 + $h))))
    }
    $yt = 82 - ($layers - 1) * ($h + 3)
    $g.FillPolygon((New-Object System.Drawing.SolidBrush $top), (Pts $s @(24, $yt, 64, ($yt - 20), 104, $yt, 64, ($yt + 20))))

    $g.Dispose()
    $bmp.Save((Join-Path $out "icon-$size.png"), [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
}
Write-Output "Symbole geschrieben nach $out"
