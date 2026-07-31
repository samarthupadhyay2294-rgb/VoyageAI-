# Windows PowerShell helper for backend setup
# Run from the repository root: .\backend\setup_windows.ps1

Set-Location -Path $PSScriptRoot

if (-not (Get-Command py -ErrorAction SilentlyContinue)) {
    Write-Error "Python launcher 'py' is not available. Install Python 3 and enable the Python launcher."
    exit 1
}

py -3 -m venv venv

if (-not (Test-Path .\venv\Scripts\Activate.ps1)) {
    Write-Error "Virtual environment activation script not found. Ensure the venv was created successfully."
    exit 1
}

Write-Output "Installing backend dependencies..."
& .\venv\Scripts\Activate.ps1
pip install -r requirements.txt
Write-Output "Backend setup complete. Activate the venv with .\\venv\\Scripts\\Activate.ps1 and run the app with py -3 -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"
