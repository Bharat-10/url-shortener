@echo off
cd /d "%~dp0"
taskkill /fi "WINDOWTITLE eq URL Shortener - Backend*" /t /f >nul 2>&1
taskkill /fi "WINDOWTITLE eq URL Shortener - Frontend*" /t /f >nul 2>&1
docker compose down
echo Everything stopped.
pause
