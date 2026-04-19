# Start Rook Multiplayer Game
Write-Host "Starting Rook Multiplayer Game..." -ForegroundColor Green
Write-Host ""

# Start server in background
Write-Host "Starting server..." -ForegroundColor Yellow
Start-Process -FilePath "cmd" -ArgumentList "/k cd server && `"$env:TEMP\node-v20.12.2-win-x64\node.exe`" server.js" -WindowStyle Normal

# Wait a moment
Start-Sleep -Seconds 2

# Start client in background
Write-Host "Starting client..." -ForegroundColor Yellow
Start-Process -FilePath "cmd" -ArgumentList "/k `"$env:TEMP\node-v20.12.2-win-x64\node.exe`" node_modules\vite\bin\vite.js" -WindowStyle Normal

Write-Host ""
Write-Host "Both server and client are starting..." -ForegroundColor Green
Write-Host "Server: http://localhost:3001" -ForegroundColor Cyan
Write-Host "Client: http://localhost:5174" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press any key to continue..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")