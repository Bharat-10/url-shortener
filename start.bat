@echo off
cd /d "%~dp0"
echo Starting MySQL, Redis and Kafka...
docker compose up -d
if errorlevel 1 (
  echo.
  echo Could not start the databases. Is Docker Desktop open and showing "Engine running"?
  pause
  exit /b 1
)
echo Waiting for MySQL to be ready...
timeout /t 15 /nobreak >nul
start "URL Shortener - Backend" cmd /k "cd /d "%~dp0backend" && set "DB_PASSWORD=root" && mvnw.cmd spring-boot:run"
start "URL Shortener - Frontend" cmd /k "cd /d "%~dp0frontend" && npm run dev"
echo Opening the app in your browser in 30 seconds...
timeout /t 30 /nobreak >nul
start http://localhost:5173
