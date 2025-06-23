# PropertyMap Static Web Apps Migration Helper
# This script helps migrate from App Service to Static Web Apps

param(
    [Parameter(Mandatory=$false)]
    [switch]$DryRun = $false
)

Write-Host "🚀 PropertyMap Static Web Apps Migration Helper" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green

if ($DryRun) {
    Write-Host "⚠️  DRY RUN MODE - No changes will be made" -ForegroundColor Yellow
    Write-Host ""
}

# Step 1: Check prerequisites
Write-Host "✅ Step 1: Checking Prerequisites" -ForegroundColor Cyan
Write-Host "  - Azure CLI installed: " -NoNewline
if (Get-Command az -ErrorAction SilentlyContinue) {
    Write-Host "✅" -ForegroundColor Green
} else {
    Write-Host "❌ Please install Azure CLI" -ForegroundColor Red
    exit 1
}

Write-Host "  - Logged into Azure: " -NoNewline
try {
    $account = az account show 2>$null | ConvertFrom-Json
    Write-Host "✅ ($($account.name))" -ForegroundColor Green
} catch {
    Write-Host "❌ Please run 'az login'" -ForegroundColor Red
    exit 1
}

# Step 2: Create Static Web Apps
Write-Host ""
Write-Host "✅ Step 2: Create Static Web Apps" -ForegroundColor Cyan
Write-Host "  Run these commands to create your Static Web Apps:"
Write-Host ""
Write-Host "  cd infrastructure" -ForegroundColor Yellow
Write-Host "  .\deploy-static-web-app.ps1 -Environment staging" -ForegroundColor Yellow
Write-Host "  .\deploy-static-web-app.ps1 -Environment production" -ForegroundColor Yellow
Write-Host ""

if (-not $DryRun) {
    $createNow = Read-Host "Create Static Web Apps now? (y/N)"
    if ($createNow.ToLower() -eq 'y') {
        Set-Location infrastructure
        .\deploy-static-web-app.ps1 -Environment staging
        .\deploy-static-web-app.ps1 -Environment production
        Set-Location ..
    }
}

# Step 3: GitHub Configuration
Write-Host ""
Write-Host "✅ Step 3: GitHub Repository Configuration" -ForegroundColor Cyan
Write-Host "  Add these new GitHub Secrets:" -ForegroundColor White
Write-Host "    - AZURE_STATIC_WEB_APPS_API_TOKEN_STAGING" -ForegroundColor Yellow
Write-Host "    - AZURE_STATIC_WEB_APPS_API_TOKEN_PRODUCTION" -ForegroundColor Yellow
Write-Host ""
Write-Host "  Keep these existing secrets (for API deployment):" -ForegroundColor White
Write-Host "    ✅ AZURE_API_PUBLISH_PROFILE_STAGING" -ForegroundColor Green
Write-Host "    ✅ AZURE_API_PUBLISH_PROFILE_PRODUCTION" -ForegroundColor Green
Write-Host "    ✅ DATABASE_CONNECTION_STRING_*" -ForegroundColor Green
Write-Host "    ✅ JWT_KEY_*" -ForegroundColor Green
Write-Host ""
Write-Host "  You can remove these secrets (after migration):" -ForegroundColor White
Write-Host "    ❌ AZURE_CLIENT_PUBLISH_PROFILE_STAGING" -ForegroundColor Red
Write-Host "    ❌ AZURE_CLIENT_PUBLISH_PROFILE_PRODUCTION" -ForegroundColor Red

# Step 4: CORS Configuration
Write-Host ""
Write-Host "✅ Step 4: Update API CORS Configuration" -ForegroundColor Cyan
Write-Host "  Add your Static Web App URLs to your API's appsettings.json:" -ForegroundColor White
Write-Host ""
Write-Host '  "CorsOptions": {' -ForegroundColor Gray
Write-Host '    "AllowedOrigins": [' -ForegroundColor Gray
Write-Host '      "https://localhost:7100",' -ForegroundColor Gray
Write-Host '      "http://localhost:7100",' -ForegroundColor Gray
Write-Host '      "https://your-staging-swa.azurestaticapps.net",' -ForegroundColor Yellow
Write-Host '      "https://your-production-swa.azurestaticapps.net"' -ForegroundColor Yellow
Write-Host '    ]' -ForegroundColor Gray
Write-Host '  }' -ForegroundColor Gray

# Step 5: Testing Plan
Write-Host ""
Write-Host "✅ Step 5: Testing Plan" -ForegroundColor Cyan
Write-Host "  1. Test the new workflow with a PR (creates preview environment)" -ForegroundColor White
Write-Host "  2. Deploy to staging and verify functionality" -ForegroundColor White
Write-Host "  3. Test API integration and routing" -ForegroundColor White
Write-Host "  4. Compare performance with current App Service" -ForegroundColor White
Write-Host "  5. When satisfied, deploy to production" -ForegroundColor White

# Step 6: Cleanup (Future)
Write-Host ""
Write-Host "✅ Step 6: Cleanup (After Migration)" -ForegroundColor Cyan
Write-Host "  When ready to fully migrate:" -ForegroundColor White
Write-Host "  - Remove old GitHub secrets for App Service" -ForegroundColor White
Write-Host "  - Stop App Service resources to save costs" -ForegroundColor White
Write-Host "  - Delete App Service resources when confident" -ForegroundColor White

Write-Host ""
Write-Host "🎯 Next Actions:" -ForegroundColor Green
Write-Host "  1. Create Static Web Apps using the infrastructure scripts" -ForegroundColor White
Write-Host "  2. Add deployment tokens to GitHub Secrets" -ForegroundColor White
Write-Host "  3. Update API CORS configuration" -ForegroundColor White
Write-Host "  4. Test deploy-client-swa.yml workflow" -ForegroundColor White
Write-Host ""
Write-Host "💡 Tip: Keep both workflows during testing for easy rollback!" -ForegroundColor Yellow
