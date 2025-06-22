#!/bin/bash

# Azure Static Web Apps Infrastructure Setup Script

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
GRAY='\033[0;37m'
NC='\033[0m' # No Color

# Default values
ENVIRONMENT=""
RESOURCE_GROUP_NAME=""
LOCATION="East US 2"
STATIC_WEB_APP_NAME=""
GITHUB_REPO=""
GITHUB_BRANCH="main"

# Function to display usage
usage() {
    echo -e "${GREEN}Azure Static Web Apps Infrastructure Setup${NC}"
    echo "Usage: $0 -e <environment> [options]"
    echo ""
    echo "Required:"
    echo "  -e, --environment    Environment (staging|production)"
    echo ""
    echo "Optional:"
    echo "  -r, --resource-group Resource group name (default: rg-propertymap-{environment})"
    echo "  -l, --location       Azure location (default: East US 2)"
    echo "  -n, --name          Static Web App name (default: swa-propertymap-client-{environment})"
    echo "  -g, --github-repo   GitHub repository URL for auto-deployment"
    echo "  -b, --branch        GitHub branch (default: main)"
    echo "  -h, --help          Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 -e staging"
    echo "  $0 -e production -g https://github.com/yourusername/PropertyMap"
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -e|--environment)
            ENVIRONMENT="$2"
            shift 2
            ;;
        -r|--resource-group)
            RESOURCE_GROUP_NAME="$2"
            shift 2
            ;;
        -l|--location)
            LOCATION="$2"
            shift 2
            ;;
        -n|--name)
            STATIC_WEB_APP_NAME="$2"
            shift 2
            ;;
        -g|--github-repo)
            GITHUB_REPO="$2"
            shift 2
            ;;
        -b|--branch)
            GITHUB_BRANCH="$2"
            shift 2
            ;;
        -h|--help)
            usage
            exit 0
            ;;
        *)
            echo -e "${RED}Unknown option: $1${NC}"
            usage
            exit 1
            ;;
    esac
done

# Validate required parameters
if [[ -z "$ENVIRONMENT" ]]; then
    echo -e "${RED}Error: Environment is required${NC}"
    usage
    exit 1
fi

if [[ "$ENVIRONMENT" != "staging" && "$ENVIRONMENT" != "production" ]]; then
    echo -e "${RED}Error: Environment must be 'staging' or 'production'${NC}"
    exit 1
fi

# Set default values based on environment
if [[ -z "$RESOURCE_GROUP_NAME" ]]; then
    RESOURCE_GROUP_NAME="rg-propertymap-$ENVIRONMENT"
fi

if [[ -z "$STATIC_WEB_APP_NAME" ]]; then
    STATIC_WEB_APP_NAME="swa-propertymap-client-$ENVIRONMENT"
fi

echo -e "${GREEN}🚀 Creating Azure Static Web App for PropertyMap - $ENVIRONMENT${NC}"
echo -e "${GREEN}=================================================${NC}"

# Check if Azure CLI is installed
if ! command -v az &> /dev/null; then
    echo -e "${RED}❌ Azure CLI is not installed. Please install it first.${NC}"
    exit 1
fi

# Check if Azure CLI is logged in
if ! az account show &> /dev/null; then
    echo -e "${YELLOW}Please login to Azure CLI${NC}"
    az login
fi

# Get subscription info
SUBSCRIPTION_ID=$(az account show --query id --output tsv)
SUBSCRIPTION_NAME=$(az account show --query name --output tsv)
echo -e "${GREEN}✅ Using Azure subscription: $SUBSCRIPTION_NAME ($SUBSCRIPTION_ID)${NC}"

# Create resource group if it doesn't exist
echo -e "${YELLOW}📦 Creating resource group: $RESOURCE_GROUP_NAME${NC}"
az group create --name "$RESOURCE_GROUP_NAME" --location "$LOCATION"

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to create resource group${NC}"
    exit 1
fi

# Create Static Web App
echo -e "${YELLOW}🌐 Creating Azure Static Web App: $STATIC_WEB_APP_NAME${NC}"

if [[ -n "$GITHUB_REPO" ]]; then
    # Create with GitHub integration
    echo -e "${CYAN}Creating with GitHub integration...${NC}"
    az staticwebapp create \
        --name "$STATIC_WEB_APP_NAME" \
        --resource-group "$RESOURCE_GROUP_NAME" \
        --location "$LOCATION" \
        --source "$GITHUB_REPO" \
        --branch "$GITHUB_BRANCH" \
        --app-location "src/apps/react" \
        --output-location "dist" \
        --login-with-github
else
    # Create without GitHub integration (manual deployment)
    echo -e "${CYAN}Creating for manual deployment...${NC}"
    az staticwebapp create \
        --name "$STATIC_WEB_APP_NAME" \
        --resource-group "$RESOURCE_GROUP_NAME" \
        --location "$LOCATION" \
        --sku Standard
fi

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to create Static Web App${NC}"
    exit 1
fi

# Get deployment token
echo -e "${YELLOW}🔑 Getting deployment token...${NC}"
DEPLOYMENT_TOKEN=$(az staticwebapp secrets list --name "$STATIC_WEB_APP_NAME" --resource-group "$RESOURCE_GROUP_NAME" --query "properties.apiKey" --output tsv)

# Get Static Web App details
SWA_DETAILS=$(az staticwebapp show --name "$STATIC_WEB_APP_NAME" --resource-group "$RESOURCE_GROUP_NAME")
DEFAULT_HOSTNAME=$(echo "$SWA_DETAILS" | jq -r '.defaultHostname')
SKU_NAME=$(echo "$SWA_DETAILS" | jq -r '.sku.name')

echo -e "${GREEN}✅ Azure Static Web App created successfully!${NC}"
echo ""
echo -e "${CYAN}📋 Static Web App Details:${NC}"
echo -e "${WHITE}   Name: $STATIC_WEB_APP_NAME${NC}"
echo -e "${WHITE}   URL: https://$DEFAULT_HOSTNAME${NC}"
echo -e "${WHITE}   Resource Group: $RESOURCE_GROUP_NAME${NC}"
echo -e "${WHITE}   SKU: $SKU_NAME${NC}"
echo ""
echo -e "${CYAN}🔐 GitHub Secrets to Add:${NC}"
echo -e "${WHITE}   Secret Name: AZURE_STATIC_WEB_APPS_API_TOKEN_$(echo $ENVIRONMENT | tr '[:lower:]' '[:upper:]')${NC}"
echo -e "${YELLOW}   Secret Value: $DEPLOYMENT_TOKEN${NC}"
echo ""
echo -e "${CYAN}📝 GitHub Variables to Add:${NC}"
echo -e "${WHITE}   Variable Name: STATIC_WEB_APP_URL_$(echo $ENVIRONMENT | tr '[:lower:]' '[:upper:]')${NC}"
echo -e "${WHITE}   Variable Value: https://$DEFAULT_HOSTNAME${NC}"
echo ""
echo -e "${CYAN}🎯 Next Steps:${NC}"
echo -e "${WHITE}   1. Add the deployment token as a GitHub secret${NC}"
echo -e "${WHITE}   2. Add the URL as a GitHub variable${NC}"
echo -e "${WHITE}   3. Update your API CORS settings to include the new URL${NC}"
echo -e "${WHITE}   4. Test the deployment workflow${NC}"
echo ""
echo -e "${CYAN}🌍 Custom Domain Setup (Optional):${NC}"
echo -e "${WHITE}   To add a custom domain:${NC}"
echo -e "${GRAY}   az staticwebapp hostname set --name $STATIC_WEB_APP_NAME --resource-group $RESOURCE_GROUP_NAME --hostname your-domain.com${NC}"
