# Azure Static Web Apps Deployment Guide

This guide shows how to deploy your React client to Azure Static Web Apps instead of Azure App Service. Static Web Apps is more cost-effective and performant for Single Page Applications (SPAs).

## Benefits of Azure Static Web Apps

### 🚀 **Performance**
- Global CDN distribution
- Optimized static content delivery
- Built-in compression and caching

### 💰 **Cost-Effective**
- Free tier available (100GB bandwidth/month)
- Standard tier: Pay only for usage
- No server runtime costs

### 🔧 **Developer-Friendly**
- Automatic builds from GitHub
- Preview environments for Pull Requests
- Built-in staging environments

### 🔐 **Built-in Features**
- Custom authentication providers
- API routes support
- Custom domains with free SSL

## Quick Setup

### 1. Create Static Web Apps

#### Option A: Using PowerShell (Recommended for Windows)
```powershell
# Navigate to infrastructure folder
cd infrastructure

# Create staging environment
.\deploy-static-web-app.ps1 -Environment staging

# Create production environment  
.\deploy-static-web-app.ps1 -Environment production
```

#### Option B: Using Bash (Linux/macOS)
```bash
# Navigate to infrastructure folder
cd infrastructure

# Make script executable
chmod +x deploy-static-web-app.sh

# Create staging environment
./deploy-static-web-app.sh -e staging

# Create production environment
./deploy-static-web-app.sh -e production
```

#### Option C: Manual Azure CLI
```bash
# Create staging Static Web App
az staticwebapp create \
  --name "swa-propertymap-client-staging" \
  --resource-group "rg-propertymap-staging" \
  --location "East US 2" \
  --sku Standard

# Create production Static Web App
az staticwebapp create \
  --name "swa-propertymap-client-production" \
  --resource-group "rg-propertymap-production" \
  --location "East US 2" \
  --sku Standard
```

### 2. Configure GitHub Repository

#### Add GitHub Secrets
Go to **Settings** → **Secrets and variables** → **Actions** → **Secrets**:

| Secret Name | Value | Description |
|-------------|-------|-------------|
| `AZURE_STATIC_WEB_APPS_API_TOKEN_STAGING` | `{staging-token}` | Deployment token for staging |
| `AZURE_STATIC_WEB_APPS_API_TOKEN_PRODUCTION` | `{production-token}` | Deployment token for production |

#### Add GitHub Variables  
Go to **Settings** → **Secrets and variables** → **Actions** → **Variables**:

| Variable Name | Example Value | Description |
|---------------|---------------|-------------|
| `API_BASE_URL_STAGING` | `https://app-propertymap-api-staging.azurewebsites.net` | Staging API URL |
| `API_BASE_URL_PRODUCTION` | `https://app-propertymap-api-production.azurewebsites.net` | Production API URL |
| `STATIC_WEB_APP_URL_STAGING` | `https://happy-ocean-123456789.2.azurestaticapps.net` | Staging SWA URL |
| `STATIC_WEB_APP_URL_PRODUCTION` | `https://brave-hill-987654321.2.azurestaticapps.net` | Production SWA URL |

### 3. Use the New Workflow

The new workflow file `deploy-client-swa.yml` is ready to use. It will:

✅ **Automatically deploy** on push to main branch  
✅ **Create preview environments** for Pull Requests  
✅ **Support manual deployments** with environment selection  
✅ **Build with environment-specific variables**  
✅ **Handle SPA routing** automatically  

## Workflow Features

### 🎯 **Triggers**
- **Push to main**: Deploys to staging, then production
- **Pull Requests**: Creates preview environments
- **Manual dispatch**: Deploy to specific environment

### 🏗️ **Build Process**
- Node.js 20.x setup with npm caching
- Dependency installation with `npm ci`
- Code linting (continues on error)
- Unit testing (if available)
- Environment-specific builds

### 🚀 **Deployment Process**
- Direct deployment to Azure Static Web Apps
- Environment-specific configuration
- Automatic preview environments for PRs
- Cleanup of closed PR environments

## Configuration Files

### `staticwebapp.config.json`
Located at `src/apps/react/public/staticwebapp.config.json`, this file configures:

- **SPA Routing**: Fallback to `index.html` for all routes
- **Cache Headers**: Long-term caching for static assets
- **Security Headers**: OWASP recommended security headers
- **MIME Types**: Proper content types for all assets

### Key Configuration Features:
```json
{
  "routes": [
    {
      "route": "/*",
      "serve": "/index.html",
      "statusCode": 200
    }
  ],
  "navigationFallback": {
    "rewrite": "/index.html"
  },
  "globalHeaders": {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "Strict-Transport-Security": "max-age=31536000"
  }
}
```

## Migrating from App Service

### 1. Update API CORS Settings
Add your Static Web App URLs to the API's CORS configuration:

```json
{
  "CorsOptions": {
    "AllowedOrigins": [
      "https://app-propertymap-client-staging.azurewebsites.net",
      "https://app-propertymap-client-production.azurewebsites.net",
      "https://happy-ocean-123456789.2.azurestaticapps.net",
      "https://brave-hill-987654321.2.azurestaticapps.net"
    ]
  }
}
```

### 2. Update Environment Variables
Update your GitHub variables to point to the new Static Web App URLs.

### 3. Test the New Workflow
1. Create a test branch
2. Make a small change to your React app
3. Create a Pull Request
4. Verify the preview environment is created
5. Merge to main and verify production deployment

### 4. Retire App Service (Optional)
Once you're satisfied with Static Web Apps:
```powershell
# Stop the old App Service
az webapp stop --name app-propertymap-client-production --resource-group rg-propertymap-production

# Delete when ready
az webapp delete --name app-propertymap-client-production --resource-group rg-propertymap-production
```

## Comparison: App Service vs Static Web Apps

| Feature | App Service | Static Web Apps |
|---------|-------------|-----------------|
| **Cost** | ~$15/month (S1) | Free tier available |
| **Performance** | Single region | Global CDN |
| **Scaling** | Manual/Auto scale | Automatic |
| **SSL** | Built-in | Built-in (free) |
| **Custom Domains** | Supported | Supported (free SSL) |
| **Preview Environments** | Manual setup | Automatic (PR builds) |
| **API Integration** | Separate service | Built-in API routes |
| **Authentication** | Custom setup | Built-in providers |

## Advanced Features

### Custom Domains
```bash
# Add custom domain
az staticwebapp hostname set \
  --name swa-propertymap-client-production \
  --resource-group rg-propertymap-production \
  --hostname app.propertymap.com

# Verify DNS configuration
az staticwebapp hostname show \
  --name swa-propertymap-client-production \
  --resource-group rg-propertymap-production \
  --hostname app.propertymap.com
```

### Environment Variables in Static Web Apps
```bash
# Set build-time environment variables
az staticwebapp appsettings set \
  --name swa-propertymap-client-production \
  --setting-names VITE_API_BASE_URL=https://api.propertymap.com
```

### API Routes (Optional)
Static Web Apps can host serverless API functions:
```
src/apps/react/
├── api/           # Azure Functions (Node.js, Python, C#, Java)
│   ├── hello/
│   │   └── index.js
├── src/
└── dist/
```

## Monitoring and Analytics

### Application Insights Integration
```bash
# Link Application Insights
az staticwebapp show \
  --name swa-propertymap-client-production \
  --resource-group rg-propertymap-production
```

### Custom Analytics
Add to your React app:
```typescript
// src/lib/analytics.ts
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

export const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, parameters);
  }
};
```

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Node.js version compatibility
   - Verify package.json scripts
   - Check environment variables

2. **Routing Issues**
   - Ensure `staticwebapp.config.json` is in the `public` folder
   - Verify fallback configuration
   - Check route patterns

3. **CORS Errors**
   - Update API CORS settings
   - Verify Static Web App URLs
   - Check environment-specific URLs

### Useful Commands

```bash
# Get deployment token
az staticwebapp secrets list \
  --name swa-propertymap-client-production \
  --resource-group rg-propertymap-production \
  --query "properties.apiKey"

# List all Static Web Apps
az staticwebapp list --resource-group rg-propertymap-production

# Show deployment history
az staticwebapp show \
  --name swa-propertymap-client-production \
  --resource-group rg-propertymap-production
```

## Next Steps

1. ✅ **Create Static Web Apps** using the deployment scripts
2. ✅ **Configure GitHub secrets and variables**
3. ✅ **Test the new workflow** with a Pull Request
4. ✅ **Update API CORS settings**
5. ✅ **Set up custom domains** (optional)
6. ✅ **Configure monitoring** and analytics
7. ✅ **Retire old App Service** (when ready)

The Static Web Apps setup provides a more modern, cost-effective, and performant solution for your React application! 🚀
