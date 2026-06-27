@echo off
cd /d "%~dp0"
set "PATH=D:\;%APPDATA%\npm;%PATH%"
echo Starting dev server...
echo Open http://localhost:5173/ in your browser
echo Press Ctrl+C to stop
node node_modules\vite\bin\vite.js
pause
