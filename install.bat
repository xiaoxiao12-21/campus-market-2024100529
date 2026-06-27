@echo off
cd /d "%~dp0"
set "PATH=D:\;%APPDATA%\npm;%PATH%"
echo Installing dependencies...
node -v
call npm install -g pnpm@11.9.0
call pnpm install --node-linker=hoisted
echo Done!
pause
