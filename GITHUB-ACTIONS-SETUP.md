# GitHub Actions Deployment Setup for PropertyMap

This repository uses GitHub Actions workflows to automatically build and deploy the PropertyMap application to Azure App Service. The workflows are designed to deploy to both staging and production environments.

## Workflows Overview

### 1. API Deployment (`.github/workflows/deploy-api.yml`)
- **Triggers**: Push to `main` branch affecting `src/api/**`, or manual dispatch
- **Environments**: Staging → Production (with approval gates)
- **Features**:
  - .NET 9 build and test
  - Automatic deployment to staging
  - Manual approval for production
  - Environment-specific configuration

### 2. Client Deployment (`.github/workflows/deploy-client.yml`)
- **Triggers**: Push to `main` branch affecting `src/apps/react/**`, or manual dispatch
- **Environments**: Staging → Production (with approval gates)
- **Features**:
  - React/Vite build with environment-specific variables
  - SPA routing configuration (web.config)
  - Automatic deployment to staging
  - Manual approval for production

## Prerequisites

### 1. Azure Resources Setup

First, create your Azure resources using the ARM template:

```powershell
# Navigate to infrastructure folder
cd infrastructure

# Run deployment script
.\deploy-infrastructure.ps1
```

### 2. Download Publish Profiles

For each App Service, download the publish profile:

1. Go to Azure Portal → App Services
2. Select your API app service
3. Click **Get publish profile** → Download
4. Repeat for client app service

## GitHub Repository Setup

### 1. Create Environments

1. Go to your GitHub repository
2. Navigate to **Settings** → **Environments**
3. Create two environments:
   - `staging` (no protection rules needed)
   - `production` (add required reviewers for approval)

### 2. Configure Repository Variables

Go to **Settings** → **Secrets and variables** → **Actions** → **Variables**

#### Repository Variables
| Variable Name | Value | Description |
|---------------|-------|-------------|
| `DATABASE_PROVIDER` | `mssql` | Database provider type |
| `AZURE_API_APP_NAME_STAGING` | `app-propertymap-api-staging` | Staging API app name |
| `AZURE_API_APP_NAME_PRODUCTION` | `app-propertymap-api-prod` | Production API app name |
| `AZURE_CLIENT_APP_NAME_STAGING` | `app-propertymap-client-staging` | Staging client app name |
| `AZURE_CLIENT_APP_NAME_PRODUCTION` | `app-propertymap-client-prod` | Production client app name |
| `API_BASE_URL_STAGING` | `https://app-propertymap-api-staging.azurewebsites.net` | Staging API URL |
| `API_BASE_URL_PRODUCTION` | `https://app-propertymap-api-prod.azurewebsites.net` | Production API URL |

### 3. Configure Repository Secrets

Go to **Settings** → **Secrets and variables** → **Actions** → **Secrets**

#### Repository Secrets
| Secret Name | Value | Description |
|-------------|-------|-------------|
| `AZURE_API_PUBLISH_PROFILE_STAGING` | Contents of staging API publish profile | API staging deployment credentials |
| `AZURE_API_PUBLISH_PROFILE_PRODUCTION` | Contents of production API publish profile | API production deployment credentials |
| `AZURE_CLIENT_PUBLISH_PROFILE_STAGING` | Contents of staging client publish profile | Client staging deployment credentials |
| `AZURE_CLIENT_PUBLISH_PROFILE_PRODUCTION` | Contents of production client publish profile | Client production deployment credentials |
| `DATABASE_CONNECTION_STRING_STAGING` | Staging database connection string | Staging database access |
| `DATABASE_CONNECTION_STRING_PRODUCTION` | Production database connection string | Production database access |
| `JWT_KEY` | Base64 encoded JWT signing key | JWT token signing |
| `APPINSIGHTS_CONNECTION_STRING_STAGING` | Application Insights connection string | Staging monitoring |
| `APPINSIGHTS_CONNECTION_STRING_PRODUCTION` | Application Insights connection string | Production monitoring |

## Setting Up Secrets

### 1. Publish Profiles

To get the publish profile content:

```powershell
# For each App Service
az webapp deployment list-publishing-profiles --name "your-app-name" --resource-group "your-rg" --xml
```

Copy the entire XML content as the secret value.

### 2. Connection Strings

#### SQL Server Connection String Format:
```
Server=tcp:your-server.database.windows.net,1433;Initial Catalog=PropertyMapDB;Persist Security Info=False;User ID=sqladmin;Password=your-password;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;
```

#### JWT Key Generation:
```powershell
# Generate a secure JWT key
$key = [System.Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
Write-Host $key
```

### 3. Application Insights

Get the connection string from Azure Portal:
1. Go to Application Insights resource
2. Copy the **Connection String** (not Instrumentation Key)

## Workflow Features

### Deployment Strategy

1. **On Push to Main**:
   - Build and test the application
   - Deploy to **staging** automatically
   - Wait for manual approval
   - Deploy to **production** after approval

2. **Manual Deployment**:
   - Can be triggered from GitHub Actions tab
   - Choose specific environment (staging or production)
   - Useful for hotfixes or rollbacks

### Environment Configuration

#### Staging Environment
- Automatic deployment on merge to main
- Used for final testing before production
- Separate database and configuration

#### Production Environment
- Requires manual approval
- Protected with required reviewers
- Production database and configuration

### Build Optimizations

#### API Workflow
- ✅ .NET package caching
- ✅ Incremental builds
- ✅ Test result reporting
- ✅ Artifact sharing between jobs

#### Client Workflow
- ✅ Node.js package caching
- ✅ Environment-specific builds
- ✅ SPA routing configuration
- ✅ Static file compression

## Security Best Practices

### 1. Secrets Management
- ✅ All sensitive data stored as GitHub Secrets
- ✅ Environment-specific secrets
- ✅ Least privilege access

### 2. Deployment Security
- ✅ HTTPS-only deployment
- ✅ Publish profiles for authentication
- ✅ Environment isolation

### 3. Code Security
- ✅ Dependency vulnerability scanning
- ✅ Code quality checks
- ✅ Automated testing

## Monitoring and Troubleshooting

### Workflow Monitoring

1. **GitHub Actions Tab**: View all workflow runs
2. **Environment Status**: Check deployment status per environment
3. **Logs**: Detailed logs for each step

### Common Issues

#### Build Failures
```powershell
# Check .NET version compatibility
dotnet --version

# Restore packages locally
cd src/api/server
dotnet restore
dotnet build
```

#### Deployment Failures
- Verify publish profiles are valid
- Check App Service is running
- Verify connection strings

#### Runtime Issues
- Check Application Insights logs
- Verify environment variables
- Check App Service logs in Azure Portal

### Manual Deployment Commands

If needed, you can deploy manually:

```powershell
# API Deployment
cd src/api/server
dotnet publish -c Release -o ./publish
# Then zip and upload to App Service

# Client Deployment
cd src/apps/react
npm ci
npm run build
# Then upload dist folder to App Service
```

## Maintenance

### Updating Dependencies

#### .NET Dependencies
```powershell
cd src/api/server
dotnet list package --outdated
dotnet add package PackageName --version x.x.x
```

#### Node.js Dependencies
```powershell
cd src/apps/react
npm audit
npm update
```

### Environment Management

#### Adding New Environment
1. Create environment in GitHub
2. Add environment-specific variables and secrets
3. Update workflow files to include new environment

#### Rollback Strategy
1. Use **Re-run jobs** feature in GitHub Actions
2. Deploy previous successful artifact
3. Use manual deployment workflow with specific commit

## Integration with Existing Workflows

The new deployment workflows complement your existing workflows:

- **`webapi.yml`** - Continues to handle build/test and container publishing
- **`blazor.yml`** - Continues to handle Blazor app builds
- **`deploy-api.yml`** - New: Handles Azure App Service deployments for API
- **`deploy-client.yml`** - New: Handles Azure App Service deployments for React client

All workflows can run independently and don't conflict with each other.

## Next Steps

1. **Set up Azure resources** using the infrastructure templates
2. **Configure GitHub secrets and variables** as outlined above
3. **Test workflows** by pushing changes or running manual deployments
4. **Set up monitoring** in Application Insights
5. **Configure alerts** for deployment failures

The setup provides a robust, secure, and automated deployment pipeline that follows modern DevOps practices.
