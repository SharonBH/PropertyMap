# Multi-Tenancy Implementation Guide

## Overview

This document describes the multi-tenancy implementation for the PropertyMap client-side application. The system supports agency-based tenancy where each tenant corresponds to a single Agency entity.

## Architecture

### 1. **Tenant Context (`TenantContext.tsx`)**
- Manages current tenant state and agency information
- Provides tenant switching functionality
- Persists tenant information in localStorage
- Integrates with the authentication system

### 2. **Dynamic Tenant Headers**
The Axios client automatically includes the tenant header in all API requests:
```typescript
// In customAxiosClient.ts
const tenant = localStorage.getItem('currentTenant');
if (tenant) {
  config.headers.tenant = tenant;
} else {
  config.headers.tenant = 'root'; // Fallback
}
```

### 3. **Authentication Integration**
The AuthContext has been enhanced to support tenant-aware login:
```typescript
login(email: string, password: string, tenantId?: string): Promise<boolean>
```

## Components

### TenantSelector Component
- **Purpose**: Allows users to select their agency during login
- **Features**: 
  - Fetches available agencies from API with fallback support
  - **Circuit breaker**: Stops retrying on authentication errors (401/403)
  - **Three selection modes**: API list, common fallback options, manual input
  - **Smart defaults**: Starts with fallback mode if no previous tenant stored
  - **Retry mechanism**: Exponential backoff for network errors
  - Loading and error states with user-friendly messages
  - **Offline resilience**: Works even when API is completely unavailable

### TenantInfo Component
- **Purpose**: Displays current tenant information
- **Features**:
  - Shows agency details (name, email, phone, address)
  - Displays current tenant ID
  - Optional tenant switching button

## Configuration

### Environment Variables
Add these to your `.env` file:

```env
# Multi-tenancy configuration
VITE_MULTI_TENANT=true
VITE_DEFAULT_TENANT=root
VITE_ALLOW_TENANT_SWITCHING=true
```

### Settings
Configure in `settings.ts`:
```typescript
export const settings = {
  // ...existing settings
  multiTenant: {
    enabled: import.meta.env.VITE_MULTI_TENANT === 'true' || true,
    defaultTenant: import.meta.env.VITE_DEFAULT_TENANT || 'root',
    allowTenantSwitching: import.meta.env.VITE_ALLOW_TENANT_SWITCHING === 'true' || true,
  },
};
```

## Implementation Steps

### 1. **Provider Setup**
Wrap your app with both providers in the correct order:
```tsx
<TenantProvider>
  <AuthProvider>
    {/* Your app components */}
  </AuthProvider>
</TenantProvider>
```

### 2. **Login Flow Enhancement**
The enhanced login flow:
1. User enters credentials
2. If multi-tenancy is enabled, show agency selector
3. User selects agency (or skips for default)
4. Login completes with tenant context set
5. All subsequent API calls include tenant header

### 3. **Tenant Resolution Strategy**

#### Option A: Agency ID as Tenant
```typescript
// Use agency.id as tenant identifier
localStorage.setItem("currentTenant", agency.id);
```

#### Option B: Custom Tenant Mapping
```typescript
// Map agency to custom tenant identifier
const tenantId = getTenantIdForAgency(agency.id);
localStorage.setItem("currentTenant", tenantId);
```

#### Option C: User-Selected Tenant
```typescript
// Let user choose from available tenants
const availableTenants = await fetchUserTenants(userId);
```

## API Integration

### Tenant Header Usage
All API endpoints automatically receive the tenant header:
```http
POST /api/v1/catalog/properties
Authorization: Bearer {token}
tenant: {agency-id}
Content-Type: application/json
```

### Server-Side Handling
Ensure your API properly handles the tenant header:
- Filters data by tenant
- Applies tenant-specific business rules
- Isolates tenant data

## User Experience

### Multi-Tenant Login Flow
1. **Standard Login**: Email/password entry
2. **Agency Selection**: Choose from available agencies
3. **Tenant Context**: All operations scoped to selected agency

### Single-Tenant Mode
When `VITE_MULTI_TENANT=false`:
- Direct login without agency selection
- Uses default tenant ('root')
- Simplified user experience

## Security Considerations

### 1. **Tenant Isolation**
- All API calls include tenant context
- Server must enforce tenant boundaries
- No cross-tenant data access

### 2. **Session Management**
- Tenant context cleared on logout
- Session expiry clears tenant information
- Secure tenant switching

### 3. **Authorization**
- Permissions scoped to tenant
- Role-based access within tenant
- Agency-specific data access

## Testing

### Development Tools
Use the multi-tenant login page to test:
- Agency selection functionality
- Tenant switching
- API header injection
- Error handling

### Test Scenarios
1. **Valid Agency Selection**: User selects valid agency
2. **Skip Selection**: User skips agency selection
3. **No Agencies**: Handle case with no available agencies
4. **API Errors**: Network errors during agency fetch
5. **Tenant Switching**: Switch between different agencies

## Troubleshooting

### Common Issues

#### 1. **Missing Tenant Header**
- Check localStorage for 'currentTenant'
- Verify Axios interceptor setup
- Ensure TenantProvider is mounted

#### 2. **Agency Not Loading**
- Check API permissions for agency endpoints
- Verify search endpoint parameters
- Check network requests in dev tools

#### 3. **Tenant Context Lost**
- Check for localStorage clearing
- Verify provider hierarchy
- Check for context re-initialization

### Debug Tools
```typescript
// Check current tenant
console.log('Current tenant:', localStorage.getItem('currentTenant'));

// Check agency data
console.log('Current agency:', localStorage.getItem('currentAgency'));

// Check API headers
// Open Network tab in dev tools to verify tenant header
```

## Future Enhancements

### 1. **Advanced Tenant Management**
- Tenant creation and management UI
- Tenant-specific branding
- Tenant analytics and reporting

### 2. **Multi-Agency Users**
- Support users with access to multiple agencies
- Quick agency switching
- Saved agency preferences

### 3. **Tenant-Specific Features**
- Agency-specific feature flags
- Customizable workflows per tenant
- Tenant-specific integrations

## Best Practices

1. **Always use the tenant context** when making API calls
2. **Test with multiple tenants** to ensure proper isolation
3. **Handle tenant switching** gracefully in all components
4. **Monitor tenant context** during development
5. **Document tenant-specific** business rules

---

This multi-tenancy implementation provides a solid foundation for agency-based data isolation while maintaining a good user experience and security posture.
