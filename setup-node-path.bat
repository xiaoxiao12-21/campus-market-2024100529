@echo off
echo ========================================
echo   设置 Node.js 到系统环境变量 PATH
echo ========================================
echo.

set "NODE_PATH=C:\Users\王泽浩\AppData\Roaming\TRAE SOLO CN\ModularData\ai-agent\vm\tools\node"

echo 正在将 Node.js 路径添加到用户环境变量...
echo 路径: %NODE_PATH%
echo.

:: 使用 PowerShell 设置用户级环境变量（永久生效）
powershell -Command "[Environment]::SetEnvironmentVariable('Path', [Environment]::GetEnvironmentVariable('Path', 'User') + ';%NODE_PATH%', 'User')"

if %errorlevel% equ 0 (
    echo ✅ 环境变量设置成功！
    echo.
    echo ========================================
    echo   设置完成！
    echo ========================================
    echo.
    echo 请【关闭当前终端】，重新打开一个新的 PowerShell/CMD 窗口
    echo 然后运行以下命令验证：
    echo   node -v
    echo   npm -v
    echo.
) else (
    echo ❌ 设置失败，请尝试手动设置或使用管理员权限运行
)

pause
