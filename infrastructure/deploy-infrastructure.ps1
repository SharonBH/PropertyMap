# Deploy Azure Infrastructure using ARM Template

# Variables
$environmentName = "prod"
$resourceGroupName = "rg-propertymap-$environmentName"
$location = "East US"
$templateFile = "azure-resources.json"
$sqlAdminPassword = Read-Host -AsSecureString -Prompt "Enter SQL Server admin password"

# Create resource group
Write-Host "Creating resource group..." -ForegroundColor Green
az group create --name $resourceGroupName --location $location

# Deploy ARM template
Write-Host "Deploying Azure resources..." -ForegroundColor Green
az deployment group create `
  --resource-group $resourceGroupName `
  --template-file $templateFile `
  --parameters environmentName=$environmentName `
              location=$location `
              sqlAdminPassword=$sqlAdminPassword

# Get deployment outputs
Write-Host "Getting deployment outputs..." -ForegroundColor Green
$outputs = az deployment group show --resource-group $resourceGroupName --name "azure-resources" --query properties.outputs

Write-Host "Deployment completed successfully!" -ForegroundColor Green
Write-Host "Outputs:" -ForegroundColor Yellow
$outputs | ConvertFrom-Json | Format-Table
