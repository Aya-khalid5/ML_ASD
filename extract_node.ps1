Set-Location "c:\Users\asd\OneDrive\Desktop\Machine Learning\ASD_Prediction\ASD_Prediction"

$zipPath = Join-Path (Get-Location) "node-portable.zip"
for ($i = 0; $i -lt 24; $i++) {
    $size = (Get-Item $zipPath).Length
    Write-Host "Poll $i : zip size = $size"
    if ($size -gt 28000000) {
        Write-Host "Download appears complete. Trying to copy/extract..."
        try {
            Copy-Item $zipPath "node-portable-copy.zip" -Force
            Write-Host "Copy OK"
            Expand-Archive -Path "node-portable-copy.zip" -DestinationPath "node-portable" -Force
            Write-Host "Extracted:"
            Get-ChildItem node-portable | Select-Object Name
            exit 0
        } catch {
            Write-Host "Extract failed (still locked?), waiting more: $_"
        }
    }
    Start-Sleep -Seconds 10
}
Write-Host "Timed out waiting for download."

