# RoadmapAI Setup Script
# Run this script for a guided setup with prompts.

param(
    [string]$GeminiApiKey = ""
)

$ErrorActionPreference = "Stop"

$PROJECT_ROOT = $PSScriptRoot
$FRONTEND_DIR = Join-Path $PROJECT_ROOT "frontend"

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  RoadmapAI Setup Script" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Step 1: Check prerequisites
Write-Host "[1/3] Checking prerequisites..." -ForegroundColor Yellow

$nodeVersion = & node --version 2>$null
if (-not $nodeVersion) {
    Write-Host "ERROR: Node.js is not installed. Please install Node.js 18+ first." -ForegroundColor Red
    exit 1
}
Write-Host "  Node.js: $nodeVersion" -ForegroundColor Green

# Step 2: Install dependencies
Write-Host "`n[2/3] Installing dependencies..." -ForegroundColor Yellow

Push-Location $FRONTEND_DIR
Write-Host "  Installing Node dependencies..." -ForegroundColor Gray
npm install --silent 2>$null
Pop-Location

# Step 3: Create .env.local
Write-Host "`n[3/3] Configuring environment..." -ForegroundColor Yellow

$envPath = Join-Path $FRONTEND_DIR ".env.local"

if (-not (Test-Path $envPath)) {
    if (-not $GeminiApiKey) {
        Write-Host "`n  Enter your Gemini API key (or press Enter to skip):" -ForegroundColor White
        Write-Host "  Get one free at https://aistudio.google.com/app/apikey" -ForegroundColor Gray
        $GeminiApiKey = Read-Host "  GEMINI_API_KEY"
    }

    $envContent = @"
# RoadmapAI Environment Variables
GEMINI_API_KEY=$GeminiApiKey

# Firebase Configuration — fill these in with your project's values
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
"@
    Set-Content -Path $envPath -Value $envContent -Force
    Write-Host "  Created frontend/.env.local" -ForegroundColor Green
    Write-Host "  >> Remember to add your Firebase config to .env.local!" -ForegroundColor Yellow
} else {
    Write-Host "  frontend/.env.local already exists, skipping." -ForegroundColor Gray
}

# Done — start the server
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  Setup complete!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host @"

Quick Start:
  cd frontend
  npm run dev

Then open http://localhost:3000 in your browser.

For AI-generated roadmaps, make sure GEMINI_API_KEY is set in frontend/.env.local

"@ -ForegroundColor White
