#!/bin/bash

# Deploy Azure Infrastructure using ARM Template

# Variables
ENVIRONMENT_NAME="prod"
RESOURCE_GROUP_NAME="rg-propertymap-$ENVIRONMENT_NAME"
LOCATION="East US"
TEMPLATE_FILE="azure-resources.json"
PARAMETERS_FILE="azure-resources.parameters.json"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}PropertyMap Azure Infrastructure Deployment${NC}"
echo "=============================================="

# Check if Azure CLI is installed
if ! command -v az &> /dev/null; then
    echo -e "${RED}Azure CLI is not installed. Please install it first.${NC}"
    exit 1
fi

# Login check
echo -e "${YELLOW}Checking Azure CLI login status...${NC}"
if ! az account show &> /dev/null; then
    echo -e "${YELLOW}Please login to Azure CLI${NC}"
    az login
fi

# Get subscription info
SUBSCRIPTION_ID=$(az account show --query id --output tsv)
SUBSCRIPTION_NAME=$(az account show --query name --output tsv)
echo -e "${GREEN}Using subscription: $SUBSCRIPTION_NAME ($SUBSCRIPTION_ID)${NC}"

# Prompt for SQL password
echo -e "${YELLOW}Enter SQL Server admin password:${NC}"
read -s SQL_ADMIN_PASSWORD

# Create resource group
echo -e "${GREEN}Creating resource group: $RESOURCE_GROUP_NAME${NC}"
az group create --name "$RESOURCE_GROUP_NAME" --location "$LOCATION"

# Deploy ARM template
echo -e "${GREEN}Deploying Azure resources...${NC}"
DEPLOYMENT_NAME="propertymap-$(date +%Y%m%d-%H%M%S)"

az deployment group create \
  --resource-group "$RESOURCE_GROUP_NAME" \
  --name "$DEPLOYMENT_NAME" \
  --template-file "$TEMPLATE_FILE" \
  --parameters environmentName="$ENVIRONMENT_NAME" \
              location="$LOCATION" \
              sqlAdminPassword="$SQL_ADMIN_PASSWORD"

# Check deployment status
if [ $? -eq 0 ]; then
    echo -e "${GREEN}Deployment completed successfully!${NC}"
    
    # Get deployment outputs
    echo -e "${YELLOW}Getting deployment outputs...${NC}"
    az deployment group show \
      --resource-group "$RESOURCE_GROUP_NAME" \
      --name "$DEPLOYMENT_NAME" \
      --query properties.outputs \
      --output table
    
    echo -e "${GREEN}Next steps:${NC}"
    echo "1. Update your Azure DevOps pipeline variables with the output values"
    echo "2. Configure your database connection string"
    echo "3. Set up your service principal for Azure DevOps"
    echo "4. Run your pipelines to deploy the applications"
    
else
    echo -e "${RED}Deployment failed. Please check the error messages above.${NC}"
    exit 1
fi
