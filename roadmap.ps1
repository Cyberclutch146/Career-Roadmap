# Single command to run everything - RoadmapAI
# Usage: .\roadmap.ps1  (from the project root)

$ErrorActionPreference = "SilentlyContinue"

$PROJECT_ROOT = $PSScriptRoot
if (-not $PROJECT_ROOT) { $PROJECT_ROOT = (Get-Location).Path }

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  RoadmapAI - Starting Everything..." -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Install backend
Write-Host "[*] Setting up backend..." -ForegroundColor Yellow
Push-Location "$PROJECT_ROOT\backend"
python -m venv venv
& ".\venv\Scripts\Activate.ps1" -Quiet
pip install --quiet -r requirements.txt
& deactivate
Pop-Location

# Install frontend
Write-Host "[*] Setting up frontend..." -ForegroundColor Yellow
Push-Location "$PROJECT_ROOT\frontend"
npm install --silent --legacy-peer-deps
Pop-Location

# Create env files if missing
if (-not (Test-Path "$PROJECT_ROOT\backend\.env")) {
    @"
GEMINI_API_KEY=
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
"@ | Out-File "$PROJECT_ROOT\backend\.env"
}
if (-not (Test-Path "$PROJECT_ROOT\frontend\.env.local")) {
    "NEXT_PUBLIC_API_URL=http://localhost:8000" | Out-File "$PROJECT_ROOT\frontend\.env.local"
}

# Start backend in background
Write-Host "[*] Starting backend server in background..." -ForegroundColor Yellow
$backendJob = Start-Job -ScriptBlock {
    param($dir)
    Set-Location $dir
    if (Test-Path ".\venv\Scripts\Activate.ps1") {
        & ".\venv\Scripts\Activate.ps1"
    }
    uvicorn main:app --reload --port 8000
} -ArgumentList "$PROJECT_ROOT\backend"

Write-Host "[*] Opening browser..." -ForegroundColor Yellow
Start-Sleep -Seconds 3
Start-Process "http://localhost:3000"

# Start frontend in foreground
Write-Host "[*] Starting frontend server..." -ForegroundColor Yellow
Write-Host "`nPress Ctrl+C to stop both servers.`n" -ForegroundColor Gray
Push-Location "$PROJECT_ROOT\frontend"
try {
    npm run dev
} finally {
    Pop-Location
    Write-Host "`n[*] Stopping backend server..." -ForegroundColor Yellow
    Stop-Job -Job $backendJob
    Remove-Job -Job $backendJob
}
