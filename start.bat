@echo off
SETLOCAL EnableDelayedExpansion

title Page Tracker - Next.js & Netlify Simulator
cls

echo =======================================================
echo    PAGE TRACKER - NEXT.JS PORTAL
echo    Local Start ^& Netlify Simulation
echo =======================================================
echo.

:menu
echo [1] Iniciar Servidor de Desenvolvimento (Local)
echo [2] Simular Implementacao Netlify (Build ^& Start)
echo [3] Atualizar/Instalar Dependencias (npm install)
echo [4] Instalar Netlify CLI (Recomendado para simulacao)
echo [5] Sair
echo.

set /p choice="Escolha uma opcao (1-5): "

if "%choice%"=="1" goto dev
if "%choice%"=="2" goto netlify_sim
if "%choice%"=="3" goto deps
if "%choice%"=="4" goto install_netlify
if "%choice%"=="5" goto end

:check_deps
if not exist "node_modules\" (
    echo [INFO] Dependencias nao encontradas. Instalando agora...
    call npm install
)
exit /b

:dev
echo.
cd portal
call :check_deps
echo [INFO] Iniciando Next.js em modo Desenvolvimento...
call npm run dev
pause
cd ..
goto menu

:netlify_sim
echo.
cd portal
call :check_deps
echo [INFO] Simulando ambiente Netlify...
echo [INFO] 1. Executando Build...
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo [ERRO] Falha no Build. Verifique os erros acima.
    pause
    cd ..
    goto menu
)
echo.
echo [INFO] 2. Iniciando servidor de producao (Simulacao Netlify)...
call npm run start
pause
cd ..
goto menu

:deps
echo.
cd portal
echo [INFO] Instalando/Atualizando dependencias...
call npm install
pause
cd ..
goto menu

:install_netlify
echo.
echo [INFO] Instalando Netlify CLI globalmente...
call npm install -g netlify-cli
echo [INFO] Concluido. Agora voce pode usar 'npx netlify dev' para uma simulacao real.
pause
goto menu

:end
echo Obrigado por usar o Page Tracker!
exit
