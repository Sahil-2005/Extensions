Add-Type -AssemblyName System.Drawing
$sizes = @(16, 48, 128)
foreach ($size in $sizes) {
    $src = "icons\icon$size.jpg"
    $dest = "icons\icon$size.png"
    if (Test-Path $src) {
        try {
            $absSrc = (Resolve-Path $src).Path
            $absDest = Join-Path (Get-Location).Path $dest
            $img = [System.Drawing.Image]::FromFile($absSrc)
            $img.Save($absDest, [System.Drawing.Imaging.ImageFormat]::Png)
            $img.Dispose()
            Write-Host "Converted $src to $dest"
        } catch {
            Write-Host "Error converting $src : $_"
        }
    } else {
        Write-Host "Source not found: $src"
    }
}
