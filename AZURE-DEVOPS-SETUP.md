# Azure DevOps Pipelines Setup for PropertyMap

This repository contains two Azure DevOps pipelines for deploying the PropertyMap application to Azure App Service:

1. **API Pipeline** (`azure-pipelines-api.yml`) - Deploys the .NET 9 API server
2. **Client Pipeline** (`azure-pipelines-client.yml`) - Deploys the React client application

## Prerequisites

### Azure Resources
Before setting up the pipelines, you need to create the following Azure resources:

1. **Resource Group** - A container for your Azure resources
2. **Azure App Service Plans** - Hosting plans for your applications
3. **Azure App Services** - Web apps for hosting API and client
4. **Azure SQL Database** (if using Azure SQL) - Database for the API
5. **Service Principal** - For Azure DevOps authentication

### Azure CLI Setup Script
```bash
# Variables
RESOURCE_GROUP="rg-propertymap-prod"
LOCATION="East US"
APP_SERVICE_PLAN="asp-propertymap-prod"
API_APP_NAME="app-propertymap-api-prod"
CLIENT_APP_NAME="app-propertymap-client-prod"
SQL_SERVER_NAME="sql-propertymap-prod"
SQL_DB_NAME="PropertyMapDB"

# Create Resource Group
az group create --name $RESOURCE_GROUP --location "$LOCATION"

# Create App Service Plan (Standard tier for production)
az appservice plan create \
  --name $APP_SERVICE_PLAN \
  --resource-group $RESOURCE_GROUP \
  --sku S1 \
  --is-linux

# Create API App Service (.NET 9)
az webapp create \
  --name $API_APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --plan $APP_SERVICE_PLAN \
  --runtime "DOTNET|9.0"

# Create Client App Service (Node.js for React)
az webapp create \
  --name $CLIENT_APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --plan $APP_SERVICE_PLAN \
  --runtime "NODE|20-lts"

# Create SQL Server (if using Azure SQL)
az sql server create \
  --name $SQL_SERVER_NAME \
  --resource-group $RESOURCE_GROUP \
  --location "$LOCATION" \
  --admin-user sqladmin \
  --admin-password "YourSecurePassword123!"

# Create SQL Database
az sql db create \
  --resource-group $RESOURCE_GROUP \
  --server $SQL_SERVER_NAME \
  --name $SQL_DB_NAME \
  --service-objective S0

# Create Service Principal for Azure DevOps
az ad sp create-for-rbac \
  --name "sp-propertymap-devops" \
  --role contributor \
  --scopes /subscriptions/{subscription-id}/resourceGroups/$RESOURCE_GROUP
```

## Azure DevOps Setup

### 1. Create Azure Service Connection

1. In Azure DevOps, go to **Project Settings** → **Service connections**
2. Click **New service connection** → **Azure Resource Manager** → **Service principal (automatic)**
3. Select your subscription and resource group
4. Name it `PropertyMapAzureConnection`
5. Grant access permission to all pipelines

### 2. Configure Pipeline Variables

In Azure DevOps, go to **Pipelines** → **Library** and create a variable group named `PropertyMap-Production` with these variables:

#### Common Variables
| Variable Name | Value | Secret |
|---------------|-------|---------|
| `AzureServiceConnection` | `PropertyMapAzureConnection` | No |
| `ResourceGroupName` | `rg-propertymap-prod` | No |

#### API Pipeline Variables
| Variable Name | Value | Secret |
|---------------|-------|---------|
| `ApiAppServiceName` | `app-propertymap-api-prod` | No |
| `DatabaseProvider` | `mssql` | No |
| `DatabaseConnectionString` | `Server=tcp:sql-propertymap-prod.database.windows.net,1433;Initial Catalog=PropertyMapDB;Persist Security Info=False;User ID=sqladmin;Password={password};MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;` | Yes |

#### Client Pipeline Variables
| Variable Name | Value | Secret |
|---------------|-------|---------|
| `ClientAppServiceName` | `app-propertymap-client-prod` | No |
| `ApiBaseUrl` | `https://app-propertymap-api-prod.azurewebsites.net` | No |

### 3. Create Pipelines

#### API Pipeline
1. Go to **Pipelines** → **New pipeline**
2. Select **Azure Repos Git** → Choose your repository
3. Select **Existing Azure Pipelines YAML file**
4. Choose `/azure-pipelines-api.yml`
5. Click **Save and run**

#### Client Pipeline
1. Go to **Pipelines** → **New pipeline**
2. Select **Azure Repos Git** → Choose your repository
3. Select **Existing Azure Pipelines YAML file**
4. Choose `/azure-pipelines-client.yml`
5. Click **Save and run**

### 4. Configure Environments

1. Go to **Pipelines** → **Environments**
2. Create a new environment named `production`
3. Add approvals and checks as needed for production deployments

## Pipeline Features

### API Pipeline (`azure-pipelines-api.yml`)
- **Triggers**: Runs on changes to `src/api/**` in main/develop branches
- **Build Steps**:
  - Sets up .NET 9 SDK
  - Restores NuGet packages
  - Builds the API project
  - Runs unit tests (if available)
  - Publishes the application
  - Creates deployment artifacts
- **Deploy Steps**:
  - Deploys to Azure App Service
  - Configures application settings

### Client Pipeline (`azure-pipelines-client.yml`)
- **Triggers**: Runs on changes to `src/apps/react/**` in main/develop branches
- **Build Steps**:
  - Sets up Node.js 20.x
  - Caches node_modules for faster builds
  - Installs dependencies with `npm ci`
  - Runs linting
  - Runs tests (if available)
  - Builds the React application
  - Creates web.config for SPA routing
  - Creates deployment artifacts
- **Deploy Steps**:
  - Deploys to Azure App Service
  - Configures application settings

## Security Considerations

1. **Secrets Management**: Store sensitive values (connection strings, API keys) in Azure DevOps variable groups as secret variables
2. **Service Principal**: Use least-privilege principle for the service principal
3. **Network Security**: Consider using Azure Application Gateway or Azure Front Door for additional security
4. **SSL/TLS**: Ensure HTTPS is enforced on both App Services

## Monitoring and Logging

### Application Insights Setup
```bash
# Create Application Insights
APPINSIGHTS_NAME="appi-propertymap-prod"
az monitor app-insights component create \
  --app $APPINSIGHTS_NAME \
  --location "$LOCATION" \
  --resource-group $RESOURCE_GROUP \
  --kind web

# Get instrumentation key
az monitor app-insights component show \
  --app $APPINSIGHTS_NAME \
  --resource-group $RESOURCE_GROUP \
  --query instrumentationKey
```

Add the instrumentation key to your pipeline variables and configure it in your applications.

## Troubleshooting

### Common Issues

1. **Build Failures**:
   - Check that all NuGet packages are available
   - Verify .NET version compatibility
   - Ensure all project references are correct

2. **Deployment Failures**:
   - Verify service connection permissions
   - Check App Service configuration
   - Ensure connection strings are correct

3. **Runtime Issues**:
   - Check Application Insights logs
   - Verify environment-specific configurations
   - Check database connectivity

### Useful Commands

```bash
# Check App Service logs
az webapp log tail --name $API_APP_NAME --resource-group $RESOURCE_GROUP

# Restart App Service
az webapp restart --name $API_APP_NAME --resource-group $RESOURCE_GROUP

# Update App Service settings
az webapp config appsettings set \
  --name $API_APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --settings "ASPNETCORE_ENVIRONMENT=Production"
```

## Additional Resources

- [Azure DevOps Documentation](https://docs.microsoft.com/en-us/azure/devops/)
- [Azure App Service Documentation](https://docs.microsoft.com/en-us/azure/app-service/)
- [ASP.NET Core Deployment](https://docs.microsoft.com/en-us/aspnet/core/host-and-deploy/azure-apps/)
- [React Deployment to Azure](https://docs.microsoft.com/en-us/azure/static-web-apps/)
