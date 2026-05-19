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
    for /f %%i in ('python -c "import secrets; print(secrets.token_hex(32))"') do set JWT_SECRET=%%i
    (
        echo GEMINI_API_KEY=
        echo MONGODB_URI=mongodb://localhost:27017
        echo DATABASE_NAME=roadmapai
        echo JWT_SECRET=%JWT_SECRET%
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
echo   Installation Complete!
echo ========================================
echo.
echo Next steps - run TWO separate terminals:
echo.
echo TERMINAL 1 - Start Backend:
echo   cd backend
echo   venv\Scripts\activate
echo   uvicorn main:app --reload --port 8000
echo.
echo TERMINAL 2 - Start Frontend:
echo   cd frontend
echo   npm run dev
echo.
echo Then open: http://localhost:3000
echo.
pause
