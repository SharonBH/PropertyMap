# PropertyMap Azure Infrastructure

This folder contains Azure Resource Manager (ARM) templates and deployment scripts to set up the complete Azure infrastructure for the PropertyMap application.

## Files Overview

- `azure-resources.json` - Main ARM template defining all Azure resources
- `azure-resources.parameters.json` - Parameters file for the ARM template
- `deploy-infrastructure.ps1` - PowerShell deployment script
- `deploy-infrastructure.sh` - Bash deployment script for Linux/macOS

## Quick Start

### Prerequisites

1. **Azure CLI** installed and logged in
2. **Appropriate Azure permissions** (Contributor or Owner role)
3. **PowerShell** (for Windows) or **Bash** (for Linux/macOS)

### Option 1: Using PowerShell (Windows)

```powershell
# Navigate to infrastructure folder
cd infrastructure

# Run deployment script
.\deploy-infrastructure.ps1
```

### Option 2: Using Bash (Linux/macOS)

```bash
# Navigate to infrastructure folder
cd infrastructure

# Make script executable
chmod +x deploy-infrastructure.sh

# Run deployment script
./deploy-infrastructure.sh
```

### Option 3: Manual Azure CLI Deployment

```bash
# Set variables
RESOURCE_GROUP="rg-propertymap-prod"
LOCATION="East US"

# Create resource group
az group create --name $RESOURCE_GROUP --location "$LOCATION"

# Deploy template
az deployment group create \
  --resource-group $RESOURCE_GROUP \
  --template-file azure-resources.json \
  --parameters @azure-resources.parameters.json \
  --parameters sqlAdminPassword="YourSecurePassword123!"
```

## Resources Created

The ARM template creates the following Azure resources:

### Core Infrastructure
- **App Service Plan** - Hosting plan for web applications
- **API App Service** - Hosts the .NET 9 API application
- **Client App Service** - Hosts the React client application

### Database
- **Azure SQL Server** - Database server
- **Azure SQL Database** - PropertyMap database
- **Firewall Rules** - Allow Azure services to access the database

### Monitoring & Storage
- **Application Insights** - Application performance monitoring
- **Storage Account** - For file storage and blob storage

## Configuration

### Environment Parameters

| Parameter | Description | Default | Options |
|-----------|-------------|---------|---------|
| `environmentName` | Environment suffix | `prod` | `dev`, `staging`, `prod` |
| `location` | Azure region | Resource Group location | Any Azure region |
| `appServicePlanSku` | App Service Plan pricing tier | `S1` | `F1`, `B1`, `B2`, `S1`, `S2`, `S3`, `P1`, `P2`, `P3` |
| `sqlAdminUsername` | SQL Server admin username | `sqladmin` | Any valid username |
| `sqlAdminPassword` | SQL Server admin password | Required | Secure password |
| `enableApplicationInsights` | Enable monitoring | `true` | `true`, `false` |

### Naming Convention

All resources follow this naming pattern:
- App Service Plan: `asp-propertymap-{environment}`
- API App Service: `app-propertymap-api-{environment}`
- Client App Service: `app-propertymap-client-{environment}`
- SQL Server: `sql-propertymap-{environment}`
- Application Insights: `appi-propertymap-{environment}`
- Storage Account: `stpropertymap{environment}`

## Security Features

### Network Security
- **HTTPS Only** - All web applications force HTTPS
- **TLS 1.2 Minimum** - Modern TLS encryption
- **FTPS Disabled** - Secure file transfer only

### Database Security
- **Firewall Rules** - Restricted access
- **Encrypted Connections** - TLS encryption required
- **Strong Authentication** - Admin credentials required

### Application Security
- **Managed Identity** - Can be enabled for secure resource access
- **Key Vault Integration** - Ready for secrets management
- **Application Insights** - Security monitoring

## Post-Deployment Steps

After successful deployment:

1. **Update Azure DevOps Variables**
   - Copy output values to your pipeline variable groups
   - Update connection strings with actual values

2. **Configure Database**
   - Run Entity Framework migrations
   - Set up initial data if needed

3. **Set up Service Principal**
   ```bash
   az ad sp create-for-rbac \
     --name "sp-propertymap-devops" \
     --role contributor \
     --scopes /subscriptions/{subscription-id}/resourceGroups/{resource-group}
   ```

4. **Configure Monitoring**
   - Set up alerts in Application Insights
   - Configure log analytics if needed

## Cost Optimization

### Development Environment
For development, use these cost-effective settings:
- App Service Plan: `F1` (Free tier)
- SQL Database: `Basic` tier
- Disable Application Insights if not needed

### Production Environment
For production, recommended settings:
- App Service Plan: `S1` or higher
- SQL Database: `S0` or higher
- Enable all monitoring features

## Troubleshooting

### Common Issues

1. **Resource Name Conflicts**
   - Azure resource names must be globally unique
   - Try different environment names or regions

2. **Permission Issues**
   - Ensure you have Contributor or Owner role
   - Check subscription limits and quotas

3. **SQL Password Requirements**
   - Must be 8+ characters
   - Must contain uppercase, lowercase, numbers
   - Must contain special characters

### Validation Commands

```bash
# Check resource group
az group show --name rg-propertymap-prod

# List all resources
az resource list --resource-group rg-propertymap-prod --output table

# Check App Service status
az webapp show --name app-propertymap-api-prod --resource-group rg-propertymap-prod

# Test SQL connectivity
az sql db show --server sql-propertymap-prod --name PropertyMapDB --resource-group rg-propertymap-prod
```

## Cleanup

To remove all resources:

```bash
# Delete resource group (removes all resources)
az group delete --name rg-propertymap-prod --yes --no-wait
```

**⚠️ Warning**: This will permanently delete all resources and data!

## Support

For issues with:
- **ARM Templates**: Check Azure Resource Manager documentation
- **Azure CLI**: Check Azure CLI documentation  
- **Deployment Errors**: Review the Azure portal deployment logs
