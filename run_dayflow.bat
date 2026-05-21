@echo off
echo ===================================================
echo 🌊 Starting DayFlow Smart Scheduler Dev Server...
echo ===================================================
echo.

:: Navigate to frontend and start dev server
cd frontend
echo [1/2] Launching React Dev Server...
start "" cmd /c "npm run dev"

:: Wait 3 seconds for server to start, then open in Chrome
timeout /t 3 /nobreak >nul
echo [2/2] Opening Chrome...
start "" http://localhost:5173

echo.
echo ===================================================
echo ✅ Frontend is running at http://localhost:5173
echo ⚠️ Make sure your Spring Boot Backend is running in
echo   your IDE (IntelliJ/VS Code) to connect the database!
echo ===================================================
echo.
pause
