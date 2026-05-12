# RoadmapAI Setup Script
# Run this script to set up and start everything

param(
    [string]$MongoDBUri = "mongodb://localhost:27017",
    [string]$GeminiApiKey = ""
)

$ErrorActionPreference = "Stop"

$PROJECT_ROOT = $PSScriptRoot
$BACKEND_DIR = Join-Path $PROJECT_ROOT "backend"
$FRONTEND_DIR = Join-Path $PROJECT_ROOT "frontend"

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  RoadmapAI Setup Script" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Step 1: Check prerequisites
Write-Host "[1/5] Checking prerequisites..." -ForegroundColor Yellow

$nodeVersion = & node --version 2>$null
if (-not $nodeVersion) {
    Write-Host "ERROR: Node.js is not installed. Please install Node.js 18+ first." -ForegroundColor Red
    exit 1
}
Write-Host "  Node.js: $nodeVersion" -ForegroundColor Green

$pythonVersion = & python --version 2>$null
if (-not $pythonVersion) {
    Write-Host "ERROR: Python is not installed. Please install Python 3.9+ first." -ForegroundColor Red
    exit 1
}
Write-Host "  Python: $pythonVersion" -ForegroundColor Green

# Step 2: Set up backend
Write-Host "`n[2/5] Setting up backend..." -ForegroundColor Yellow

# Create .env file for backend
$envContent = @"
# RoadmapAI Backend Environment Variables
GEMINI_API_KEY=$GeminiApiKey
MONGODB_URI=$MongoDBUri
DATABASE_NAME=roadmapai
JWT_SECRET=roadmapai-dev-secret-key-$(Get-Random -Maximum 99999)
"@

Set-Content -Path (Join-Path $BACKEND_DIR ".env") -Value $envContent -Force
Write-Host "  Created backend/.env" -ForegroundColor Green

# Create virtual environment and install dependencies
Push-Location $BACKEND_DIR

if (Test-Path "venv") {
    Write-Host "  Using existing virtual environment..." -ForegroundColor Gray
} else {
    Write-Host "  Creating virtual environment..." -ForegroundColor Gray
    python -m venv venv
}

# Activate venv and install requirements
$venvActivate = if ($IsWindows -or (-not $IsMacOS -and -not $IsLinux)) { "venv\Scripts\Activate.ps1" } else { "venv/bin/activate" }
& (Join-Path $PWD $venvActivate) -ErrorAction SilentlyContinue

Write-Host "  Installing Python dependencies..." -ForegroundColor Gray
python -m pip install --upgrade pip -q
pip install -r requirements.txt -q

Pop-Location

# Step 3: Set up frontend
Write-Host "`n[3/5] Setting up frontend..." -ForegroundColor Yellow

# Create .env.local for frontend
$frontendEnvContent = @"
NEXT_PUBLIC_API_URL=http://localhost:8000
"@

Set-Content -Path (Join-Path $FRONTEND_DIR ".env.local") -Value $frontendEnvContent -Force
Write-Host "  Created frontend/.env.local" -ForegroundColor Green

Push-Location $FRONTEND_DIR
Write-Host "  Installing Node dependencies..." -ForegroundColor Gray
npm install --silent 2>$null
Pop-Location

# Step 4: Create start script
Write-Host "`n[4/5] Creating convenience scripts..." -ForegroundColor Yellow

$startBackendContent = @'
@echo off
cd /d "%~dp0backend"
call venv\Scripts\activate
uvicorn main:app --reload --port 8000
'@

$startFrontendContent = @'
@echo off
cd /d "%~dp0frontend"
npm run dev
'@

Set-Content -Path (Join-Path $PROJECT_ROOT "start-backend.bat") -Value $startBackendContent -Force
Set-Content -Path (Join-Path $PROJECT_ROOT "start-frontend.bat") -Value $startFrontendContent -Force
Write-Host "  Created start-backend.bat and start-frontend.bat" -ForegroundColor Green

# Step 5: Start services
Write-Host "`n[5/5] Starting services..." -ForegroundColor Yellow

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  Starting Backend Server (Port 8000)" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Start backend in background
$backendJob = Start-Job -ScriptBlock {
    param($dir, $envFile)
    Set-Location $dir
    Import-Module (Join-Path $dir "venv\Scripts\modules.psd1") -ErrorAction SilentlyContinue
    & python -m uvicorn main:app --reload --port 8000
} -ArgumentList $BACKEND_DIR

Write-Host "Backend starting in background (Job ID: $($backendJob.Id))" -ForegroundColor Green
Write-Host "API will be available at: http://localhost:8000" -ForegroundColor Cyan
Write-Host "API docs at: http://localhost:8000/docs`n" -ForegroundColor Cyan

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Starting Frontend Server (Port 3000)" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Start frontend in background
$frontendJob = Start-Job -ScriptBlock {
    param($dir)
    Set-Location $dir
    npm run dev
} -ArgumentList $FRONTEND_DIR

Write-Host "Frontend starting in background (Job ID: $($frontendJob.Id))" -ForegroundColor Green
Write-Host "Frontend will be available at: http://localhost:3000`n" -ForegroundColor Cyan

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  RoadmapAI is starting up!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host @"

Quick Start:
1. Wait ~30 seconds for servers to start
2. Open http://localhost:3000 in your browser
3. Click 'Generate Your Roadmap'
4. Enter your learning goal

For AI-generated roadmaps, add your Gemini API key to backend/.env

To stop servers later:
  Stop-Job -Id $backendJob.Id
  Stop-Job -Id $frontendJob.Id
  Remove-Job -Id $backendJob.Id, $frontendJob.Id

Or simply close these terminal windows.

"@ -ForegroundColor White

# Wait a moment then show status
Start-Sleep -Seconds 5

Write-Host "`nBackend output (last few lines):" -ForegroundColor Yellow
Receive-Job $backendJob | Select-Object -Last 5

Write-Host "`nFrontend output (last few lines):" -ForegroundColor Yellow
Receive-Job $frontendJob | Select-Object -Last 5

Write-Host "`nDone! The servers are running in the background.`n" -ForegroundColor Green
