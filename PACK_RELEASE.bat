@echo off
setlocal
cd /d "%~dp0"
rem Ensure the pinned release toolchain (Terser + Roadroller) is present for the
rem optimized Roadroller pipeline. If Node/npm are unavailable the packer prints a
rem clear warning and still emits a legal (larger) Zopfli baseline build.
if not exist "tools\node_modules\roadroller\cli.mjs" (
  where npm >nul 2>nul && (
    echo Installing pinned release tools in tools\ ...
    pushd tools
    call npm ci --silent 2>nul || call npm install --silent
    popd
  )
)
where py >nul 2>nul
if errorlevel 1 goto usepython
py -3 tools\pack_release.py
exit /b %errorlevel%
:usepython
python tools\pack_release.py
exit /b %errorlevel%
