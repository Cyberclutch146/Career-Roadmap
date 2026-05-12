# Single command to run everything - RoadmapAI
# Usage: & {iwr -useb https://gist.githubusercontent.com/user/roadmapai-setup.ps1} | iex
# Or save this file as run.ps1 and execute: .\run.ps1

$ErrorActionPreference = "SilentlyContinue"

$PROJECT_ROOT = $PSScriptRoot
if (-not $PROJECT_ROOT) { $PROJECT_ROOT = "." }

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  RoadmapAI - Starting Everything..." -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Install backend
Write-Host "[*] Setting up backend..." -ForegroundColor Yellow
Set-Location "$PROJECT_ROOT\backend"
python -m venv venv --quiet
& ".\venv\Scripts\Activate.ps1" -Quiet
pip install --quiet -r requirements.txt
pip install pymongo motor --quiet
& deactivate

# Install frontend
Write-Host "[*] Setting up frontend..." -ForegroundColor Yellow
Set-Location "$PROJECT_ROOT\frontend"
npm install --silent --legacy-peer-deps

# Create env files if missing
if (-not (Test-Path "$PROJECT_ROOT\backend\.env")) {
    "GEMINI_API_KEY=`nMONGODB_URI=mongodb://localhost:27017`nDATABASE_NAME=roadmapai`nJWT_SECRET=roadmapai-dev-key" | Out-File "$PROJECT_ROOT\backend\.env"
}
if (-not (Test-Path "$PROJECT_ROOT\frontend\.env.local")) {
    "NEXT_PUBLIC_API_URL=http://localhost:8000" | Out-File "$PROJECT_ROOT\frontend\.env.local"
}

# Start MongoDB if not running
Write-Host "[*] Checking MongoDB..." -ForegroundColor Yellow
$mongod = Get-Process mongod -ErrorAction SilentlyContinue
if (-not $mongod) {
    Write-Host "    Starting MongoDB..." -ForegroundColor Gray
    Start-Process mongod -WindowStyle Hidden -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 3
}

# Start backend
Write-Host "[*] Starting backend server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$PROJECT_ROOT\backend'; & '.\venv\Scripts\Activate.ps1'; uvicorn main:app --reload --port 8000" -WindowStyle Normal

# Start frontend
Write-Host "[*] Starting frontend server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$PROJECT_ROOT\frontend'; npm run dev" -WindowStyle Normal

# Open browser
Write-Host "[*] Opening browser..." -ForegroundColor Yellow
Start-Sleep -Seconds 5
Start-Process "http://localhost:3000"

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "  RoadmapAI is ready!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host "`n  Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "  Backend:  http://localhost:8000" -ForegroundColor White
Write-Host "  API Docs: http://localhost:8000/docs`n" -ForegroundColor White
Write-Host "  Close this window when done.`n" -ForegroundColor Gray
