# Azure Static Web Apps Infrastructure Setup Script

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("staging", "production")]
    [string]$Environment,
    
    [Parameter(Mandatory=$false)]
    [string]$ResourceGroupName = "rg-propertymap-$Environment",
    
    [Parameter(Mandatory=$false)]
    [string]$Location = "East US 2",
    
    [Parameter(Mandatory=$false)]
    [string]$StaticWebAppName = "swa-propertymap-client-$Environment",
    
    [Parameter(Mandatory=$false)]
    [string]$GitHubRepo = "",
    
    [Parameter(Mandatory=$false)]
    [string]$GitHubBranch = "main"
)

Write-Host "🚀 Creating Azure Static Web App for PropertyMap - $Environment" -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Green

# Check if Azure CLI is logged in
try {
    $account = az account show 2>$null | ConvertFrom-Json
    Write-Host "✅ Using Azure subscription: $($account.name)" -ForegroundColor Green
} catch {
    Write-Host "❌ Please login to Azure CLI first: az login" -ForegroundColor Red
    exit 1
}

# Create resource group if it doesn't exist
Write-Host "📦 Creating resource group: $ResourceGroupName" -ForegroundColor Yellow
az group create --name $ResourceGroupName --location $Location

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to create resource group" -ForegroundColor Red
    exit 1
}

# Create Static Web App
Write-Host "🌐 Creating Azure Static Web App: $StaticWebAppName" -ForegroundColor Yellow

if ($GitHubRepo) {
    # Create with GitHub integration
    $result = az staticwebapp create `
        --name $StaticWebAppName `
        --resource-group $ResourceGroupName `
        --location $Location `
        --source $GitHubRepo `
        --branch $GitHubBranch `
        --app-location "src/apps/react" `
        --output-location "dist" `
        --login-with-github
} else {
    # Create without GitHub integration (manual deployment)
    $result = az staticwebapp create `
        --name $StaticWebAppName `
        --resource-group $ResourceGroupName `
        --location $Location `
        --sku Standard
}

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to create Static Web App" -ForegroundColor Red
    exit 1
}

# Get deployment token
Write-Host "🔑 Getting deployment token..." -ForegroundColor Yellow
$deploymentToken = az staticwebapp secrets list --name $StaticWebAppName --resource-group $ResourceGroupName --query "properties.apiKey" --output tsv

# Get Static Web App details
$swaDetails = az staticwebapp show --name $StaticWebAppName --resource-group $ResourceGroupName | ConvertFrom-Json

Write-Host "✅ Azure Static Web App created successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Static Web App Details:" -ForegroundColor Cyan
Write-Host "   Name: $($swaDetails.name)" -ForegroundColor White
Write-Host "   URL: https://$($swaDetails.defaultHostname)" -ForegroundColor White
Write-Host "   Resource Group: $($swaDetails.resourceGroup)" -ForegroundColor White
Write-Host "   SKU: $($swaDetails.sku.name)" -ForegroundColor White
Write-Host ""
Write-Host "🔐 GitHub Secrets to Add:" -ForegroundColor Cyan
Write-Host "   Secret Name: AZURE_STATIC_WEB_APPS_API_TOKEN_$($Environment.ToUpper())" -ForegroundColor White
Write-Host "   Secret Value: $deploymentToken" -ForegroundColor Yellow
Write-Host ""
Write-Host "📝 GitHub Variables to Add:" -ForegroundColor Cyan
Write-Host "   Variable Name: STATIC_WEB_APP_URL_$($Environment.ToUpper())" -ForegroundColor White
Write-Host "   Variable Value: https://$($swaDetails.defaultHostname)" -ForegroundColor White
Write-Host ""
Write-Host "🎯 Next Steps:" -ForegroundColor Cyan
Write-Host "   1. Add the deployment token as a GitHub secret" -ForegroundColor White
Write-Host "   2. Add the URL as a GitHub variable" -ForegroundColor White
Write-Host "   3. Update your API CORS settings to include the new URL" -ForegroundColor White
Write-Host "   4. Test the deployment workflow" -ForegroundColor White
Write-Host ""

# Create custom domain instructions
Write-Host "🌍 Custom Domain Setup (Optional):" -ForegroundColor Cyan
Write-Host "   To add a custom domain:" -ForegroundColor White
Write-Host "   az staticwebapp hostname set --name $StaticWebAppName --resource-group $ResourceGroupName --hostname your-domain.com" -ForegroundColor Gray
