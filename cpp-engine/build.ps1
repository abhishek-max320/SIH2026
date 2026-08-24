# AgriSentinel C++ Engine Build Script for Windows (MinGW g++)
param (
    [switch]$RunTests
)

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " Building AgriSentinel C++ Spatial & Risk Engine (Win32)  " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

$OutputDir = "$PSScriptRoot\bin"
if (!(Test-Path $OutputDir)) {
    New-Item -ItemType Directory -Path $OutputDir | Out-Null
}

$DllOutput = "$OutputDir\risk_engine.dll"
$TestExe = "$OutputDir\test_risk_engine.exe"

# 1. Compile Shared Dynamic Library (.dll)
Write-Host "[1/2] Compiling dynamic library -> $DllOutput" -ForegroundColor Yellow
$ImplibArg = "-Wl,--out-implib,$OutputDir\librisk_engine.a"
& g++ -std=c++17 -O3 -shared -fPIC -I "$PSScriptRoot\include" "$PSScriptRoot\src\risk_engine.cpp" -o "$DllOutput" "$ImplibArg"

if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Shared DLL compilation failed with exit code $LASTEXITCODE" -ForegroundColor Red
    exit $LASTEXITCODE
}
Write-Host "[OK] Dynamic Library built successfully." -ForegroundColor Green

# 2. Compile High-Performance CLI Executable
$CliExe = "$OutputDir\risk_engine_cli.exe"
Write-Host "[2/3] Compiling high-speed CLI executable -> $CliExe" -ForegroundColor Yellow
& g++ -std=c++17 -O3 -I "$PSScriptRoot\include" "$PSScriptRoot\src\risk_engine.cpp" "$PSScriptRoot\src\cli_main.cpp" -o "$CliExe"

if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] CLI executable compilation failed with exit code $LASTEXITCODE" -ForegroundColor Red
    exit $LASTEXITCODE
}
Write-Host "[OK] CLI executable built successfully." -ForegroundColor Green

# 3. Compile and Run Unit Tests
Write-Host "[3/3] Compiling standalone test executable -> $TestExe" -ForegroundColor Yellow
& g++ -std=c++17 -O3 -I "$PSScriptRoot\include" "$PSScriptRoot\src\risk_engine.cpp" "$PSScriptRoot\tests\test_risk_engine.cpp" -o "$TestExe"

if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Test compilation failed with exit code $LASTEXITCODE" -ForegroundColor Red
    exit $LASTEXITCODE
}
Write-Host "[OK] Unit test executable built successfully." -ForegroundColor Green

Write-Host "`nRunning C++ Unit Tests..." -ForegroundColor Cyan
& "$TestExe"

if ($LASTEXITCODE -eq 0) {
    Write-Host "[SUCCESS] AgriSentinel C++ Engine ready for Python bridge integration." -ForegroundColor Green
} else {
    Write-Host "[ERROR] Unit tests failed." -ForegroundColor Red
    exit $LASTEXITCODE
}
