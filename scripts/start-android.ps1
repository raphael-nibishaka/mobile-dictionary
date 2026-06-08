# LexiDict — Android Emulator Startup
# Fixes ADB, port forwarding, and starts Expo in LAN mode.

Write-Host "Cleaning stuck ADB processes..." -ForegroundColor Yellow
taskkill /F /IM adb.exe 2>$null | Out-Null
Start-Sleep -Seconds 2
adb start-server | Out-Null

Write-Host "Waiting for emulator..." -ForegroundColor Yellow
adb wait-for-device | Out-Null

Write-Host "Setting up port forwarding..." -ForegroundColor Yellow
adb reverse tcp:8081 tcp:8081
adb reverse tcp:19000 tcp:19000
adb reverse tcp:19001 tcp:19001

Write-Host "Starting Expo on Android (LAN mode)..." -ForegroundColor Green
Remove-Item Env:CI -ErrorAction SilentlyContinue
Set-Location $PSScriptRoot\..
npx expo start --android --lan -c
