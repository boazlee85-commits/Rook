@echo off
echo Starting Rook Multiplayer Game...
echo.

echo Starting server...
start "Rook Server" cmd /k "cd server && \"%TEMP%\node-v20.12.2-win-x64\node.exe\" server.js"

timeout /t 2 /nobreak > nul

echo Starting client...
start "Rook Client" cmd /k "\"%TEMP%\node-v20.12.2-win-x64\node.exe\" node_modules\vite\bin\vite.js"

echo.
echo Both server and client are starting...
echo Server: http://localhost:3001
echo Client: http://localhost:5174
echo.
pause