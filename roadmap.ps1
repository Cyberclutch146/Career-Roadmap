# Single command to run RoadmapAI
# Usage: .\roadmap.ps1  (from the project root)

$ErrorActionPreference = "SilentlyContinue"

$PROJECT_ROOT = $PSScriptRoot
if (-not $PROJECT_ROOT) { $PROJECT_ROOT = (Get-Location).Path }

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  RoadmapAI - Starting..." -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Install frontend dependencies
Write-Host "[*] Installing dependencies..." -ForegroundColor Yellow
Push-Location "$PROJECT_ROOT\frontend"
npm install --silent --legacy-peer-deps
Pop-Location

# Create .env.local if missing
if (-not (Test-Path "$PROJECT_ROOT\frontend\.env.local")) {
    Copy-Item "$PROJECT_ROOT\frontend\.env.example" "$PROJECT_ROOT\frontend\.env.local"
    Write-Host "[*] Created frontend\.env.local from template. Edit it with your keys." -ForegroundColor Yellow
}

Write-Host "[*] Opening browser..." -ForegroundColor Yellow
Start-Sleep -Seconds 3
Start-Process "http://localhost:3000"

# Start Next.js dev server
Write-Host "[*] Starting Next.js dev server..." -ForegroundColor Yellow
Write-Host "`nPress Ctrl+C to stop the server.`n" -ForegroundColor Gray
Push-Location "$PROJECT_ROOT\frontend"
try {
    npm run dev
} finally {
    Pop-Location
}
