@echo off
echo ========================================
echo   RoadmapAI - Quick Start
echo ========================================
echo.

cd /d "%~dp0"

echo [1/3] Installing backend dependencies...
cd backend
if not exist "venv" (
    python -m venv venv
)
call venv\Scripts\activate.bat
pip install -r requirements.txt -q
call deactivate
cd ..

echo.
echo [2/3] Installing frontend dependencies...
cd frontend
npm install --silent
cd ..

echo.
echo [3/3] Creating environment files...
if not exist "backend\.env" (
    (
        echo GEMINI_API_KEY=
        echo CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
    ) > backend\.env
)
if not exist "frontend\.env.local" (
    (
        echo NEXT_PUBLIC_API_URL=http://localhost:8000
    ) > frontend\.env.local
)

echo.
echo ========================================
echo   Installation Complete! Starting servers...
echo ========================================
echo.
echo [*] Starting backend server in background...
start /B cmd /c "cd backend && call venv\Scripts\activate.bat && uvicorn main:app --reload --port 8000"

echo [*] Opening browser...
timeout /t 3 /nobreak > NUL
start http://localhost:3000

echo [*] Starting frontend server...
echo Press Ctrl+C to stop both servers.
cd frontend
npm run dev
