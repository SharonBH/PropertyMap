# Enhanced Authentication System

## Overview
This document describes the enhanced authentication system that automatically handles session expiry and redirects users to login when their session ends.

## Components

### 1. API Response Interceptor (`customAxiosClient.ts`)
- **401 Handler**: Automatically detects 401 Unauthorized responses
- **Auto-Logout**: Clears authentication data from localStorage
- **Smart Redirect**: Redirects to login with the current page as redirect parameter
- **Duplicate Prevention**: Prevents multiple simultaneous redirects
- **Network Error Handling**: Handles network connectivity issues

### 2. AuthContext Enhancements (`AuthContext.tsx`)
- **Session Expiry Listener**: Listens for session expiry events from API interceptor
- **State Synchronization**: Updates authentication state when session expires
- **Auto-Redirect Logic**: Redirects unauthenticated users from protected pages
- **Public Route Awareness**: Doesn't redirect from public pages

### 3. Login Page Updates (`LoginPage.tsx`)
- **Redirect Parameter Handling**: Supports both URL search params and location state
- **Post-Login Navigation**: Redirects users to their intended destination after login
- **User Experience**: Maintains user's intended workflow after authentication

### 4. Session Expiry Handler (`SessionExpiryHandler.tsx`)
- **User Notifications**: Shows Hebrew toast notifications when session expires
- **Event-Driven**: Responds to custom events from the API interceptor
- **Non-Blocking**: Doesn't interfere with application rendering

### 5. Development Tools (`AuthTestPanel.tsx`)
- **Testing Component**: Allows developers to simulate authentication scenarios
- **Session Expiry Simulation**: Test session expiry handling
- **401 Error Simulation**: Test API authentication failures
- **Development Only**: Automatically hidden in production builds

## User Flow

### Normal Authentication
1. User accesses protected page
2. If not authenticated, redirected to `/login?redirect=/intended-page`
3. User logs in successfully
4. Redirected to originally intended page

### Session Expiry
1. User makes API request with expired token
2. Server returns 401 Unauthorized
3. API interceptor catches 401 response
4. Authentication data cleared from localStorage
5. Custom event dispatched to notify AuthContext
6. AuthContext updates state to unauthenticated
7. User shown "Session expired" notification
8. User redirected to login with current page as redirect
9. After re-login, user returned to original page

### Network Errors
1. API request fails due to network issues
2. Network error event dispatched
3. Application can handle gracefully without logout

## Configuration

### Protected Routes
Protected routes are wrapped with `<ProtectedRoute>` component:
```tsx
<Route path="/add-property" element={
  <ProtectedRoute>
    <AddProperty />
  </ProtectedRoute>
} />
```

### Public Routes
Public routes that don't require authentication:
- `/login`
- `/properties`
- `/property/*`
- `/about`
- `/services`
- `/contact`

### Protected Routes
Protected routes that require authentication:
- `/` (home/manage listings)
- `/add-property`
- `/edit-property/*`
- `/neighborhood`

## Security Features

1. **Automatic Token Injection**: All API requests automatically include authentication token
2. **Immediate Session Cleanup**: Authentication data cleared immediately on 401
3. **Redirect Loop Prevention**: Smart logic prevents infinite redirects
4. **State Synchronization**: Authentication state consistent across components
5. **Secure Redirect**: Only allows redirects to same-origin paths

## Development Testing

Use the AuthTestPanel component (development only) to test:
- Session expiry scenarios
- 401 error handling
- Network error responses
- Redirect logic

## Implementation Notes

- Uses Axios interceptors for global API response handling
- Custom events for loose coupling between API layer and React components
- Hebrew UI text for user-facing notifications
- TypeScript for type safety
- Graceful degradation for missing dependencies

## Best Practices

1. **Always use ProtectedRoute** for authenticated pages
2. **Handle loading states** during authentication checks
3. **Provide user feedback** for authentication events
4. **Test authentication flows** thoroughly
5. **Monitor authentication errors** in production
