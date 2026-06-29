@echo off
cd /d "%~dp0"
echo ========================================
echo   Campus Market - Mock API Server
echo ========================================
echo.
echo Starting JSON Server on http://localhost:3001
echo.
echo Available endpoints:
echo   http://localhost:3001/trades
echo   http://localhost:3001/lostFounds
echo   http://localhost:3001/groupBuys
echo   http://localhost:3001/errands
echo.
echo Press Ctrl+C to stop
echo ========================================
echo.
node node_modules\json-server\lib\bin\cli.js --watch db.json --port 3001
pause
