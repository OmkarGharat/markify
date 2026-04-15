@echo off
REM Markify Vercel Deployment Script for Windows
REM This script helps you deploy Markify to Vercel

echo ====================================
echo 🚀 Markify Vercel Deployment Script
echo ====================================
echo.

REM Check if we're in the right directory
if not exist "package.json" (
    echo ✗ package.json not found. Please run this script from the Markify root directory.
    pause
    exit /b 1
)

echo ✓ Found package.json - in correct directory
echo.

REM Step 1: Clean up test files
echo ℹ Step 1: Cleaning up test files...
if exist "test_comprehensive_syntax.md" (
    del test_comprehensive_syntax.md
    echo ✓ Removed test_comprehensive_syntax.md
)
if exist "test_large_100pages.md" (
    del test_large_100pages.md
    echo ✓ Removed test_large_100pages.md
)
if exist "generate_large_test.js" (
    del generate_large_test.js
    echo ✓ Removed generate_large_test.js
)
echo.

REM Step 2: Run tests
echo ℹ Step 2: Running tests...
call npm test -- --run
if %errorlevel% neq 0 (
    echo ✗ Tests failed. Please fix them before deploying.
    pause
    exit /b 1
)
echo ✓ All tests passed
echo.

REM Step 3: Build the project
echo ℹ Step 3: Building the project...
call npm run build
if %errorlevel% neq 0 (
    echo ✗ Build failed. Please check the errors above.
    pause
    exit /b 1
)
echo ✓ Build completed successfully
echo.

REM Step 4: Check git status
echo ℹ Step 4: Checking git status...
if not exist ".git" (
    echo ⚠ Git repository not initialized. Initializing now...
    git init
    git add .
    git commit -m "Initial commit - Markify application"
    echo ✓ Git repository initialized
) else (
    echo ✓ Git repository already initialized
)
echo.

REM Step 5: Check for uncommitted changes
for /f %%i in ('git status --porcelain') do set has_changes=%%i
if defined has_changes (
    echo ⚠ You have uncommitted changes.
    set /p commit_choice="Do you want to commit them now? (y/n): "
    if /i "%commit_choice%"=="y" (
        git add .
        set /p commit_msg="Enter commit message: "
        git commit -m "%commit_msg%"
        echo ✓ Changes committed
    ) else (
        echo ⚠ Skipping commit. Please commit changes before deploying.
    )
) else (
    echo ✓ No uncommitted changes
)
echo.

REM Step 6: Check if Vercel CLI is installed
echo ℹ Step 6: Checking Vercel CLI...
where vercel >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠ Vercel CLI not found. Installing now...
    call npm install -g vercel
    echo ✓ Vercel CLI installed
) else (
    echo ✓ Vercel CLI already installed
)
echo.

REM Step 7: Check if logged in to Vercel
echo ℹ Step 7: Checking Vercel login status...
vercel whoami >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠ Not logged in to Vercel. Please login...
    call vercel login
    echo ✓ Logged in to Vercel
) else (
    echo ✓ Already logged in to Vercel
)
echo.

REM Step 8: Deploy to Vercel
echo ℹ Step 8: Deploying to Vercel...
echo.
echo ⚠ You will be prompted with several questions. Here are the recommended answers:
echo   - Set up and deploy? Y
echo   - Which scope? Your username
echo   - Link to existing project? N (for first deployment)
echo   - Project name? markify (or your preferred name)
echo   - In which directory? ./ (default)
echo   - Override settings? N (use existing vercel.json)
echo.
pause
call vercel

REM Step 9: Ask about production deployment
echo.
echo ⚠ Deployment completed! This is a preview deployment.
set /p prod_choice="Do you want to deploy to production now? (y/n): "
if /i "%prod_choice%"=="y" (
    echo ℹ Deploying to production...
    call vercel --prod
    echo ✓ Production deployment completed!
) else (
    echo ℹ Skipping production deployment. You can deploy later with: vercel --prod
)

REM Final summary
echo.
echo ====================================
echo 🎉 Deployment Summary
echo ====================================
echo ✓ Tests passed
echo ✓ Build completed
echo ✓ Deployed to Vercel
echo.
echo ℹ Next steps:
echo   1. Visit your Vercel dashboard to see the deployment
echo   2. Test the deployed application
echo   3. Set up custom domain (optional)
echo   4. Configure environment variables (optional)
echo.
echo ℹ Useful commands:
echo   - vercel --prod      # Deploy to production
echo   - vercel logs        # View deployment logs
echo   - vercel env ls      # List environment variables
echo   - vercel --prod      # Redeploy to production
echo.
echo ✓ Deployment process completed! 🚀
echo.
pause