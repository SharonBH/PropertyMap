# TenantSelector Infinite Loop Fix

## Problem
The login page was constantly reloading because the TenantSelector component was getting 401 errors when trying to fetch agencies from the API, which require authentication. This created an infinite retry loop.

## Root Cause
1. **searchAgenciesEndpoint** requires `"Permissions.Agencies.View"` permission
2. **TenantSelector** tries to fetch agencies BEFORE user authentication
3. **401 errors** triggered retry mechanisms causing infinite loops
4. **No fallback mechanism** when API is unavailable

## Solution Implementation

### 1. Circuit Breaker Pattern
```typescript
const [apiUnavailable, setApiUnavailable] = useState(false);

// Prevent retries after auth errors
if (isAuthError) {
  setApiUnavailable(true);
  setDefaultTab("fallback");
  // No more API calls until manual retry
}
```

### 2. Smart Default Tab Selection
```typescript
const [defaultTab, setDefaultTab] = useState(() => {
  // If no stored tenant, start with fallback to avoid API calls
  const storedTenant = localStorage.getItem("currentTenant");
  return storedTenant ? "select" : "fallback";
});
```

### 3. Three Selection Modes
- **API List Tab**: Only enabled when API is available
- **Fallback Tab**: Common tenant options (root, demo, etc.)
- **Manual Input Tab**: Direct tenant ID entry

### 4. Conditional API Calls
```typescript
useEffect(() => {
  // Only try API if not marked unavailable and in select mode
  if (!apiUnavailable && defaultTab === "select") {
    fetchAgencies();
  } else if (defaultTab === "fallback") {
    setLoading(false); // Skip loading for fallback mode
  }
}, [fetchAgencies, apiUnavailable, defaultTab]);
```

### 5. Error Handling Improvements
- **401/403 errors**: Immediately switch to fallback mode
- **Network errors**: Retry with exponential backoff (max 2 times)
- **Other errors**: Switch to fallback mode
- **Circuit breaker**: Prevents further API calls after auth failures

### 6. User Experience Enhancements
- **Clear error messages** in Hebrew explaining the situation
- **Retry button** to attempt API connection again
- **Fallback options** always available
- **Manual input** as last resort
- **Loading indicators** with retry count

## Result
- ✅ **No more infinite loops** on 401 errors
- ✅ **Graceful degradation** when API is unavailable
- ✅ **User can always proceed** with login process
- ✅ **Clear feedback** about API availability status
- ✅ **Multiple ways** to select tenant/agency

## Testing Scenarios
1. **API Available**: Normal agency selection from server
2. **API Unavailable (401)**: Automatic fallback to common options
3. **Network Issues**: Retry with backoff, then fallback
4. **Fresh Install**: Starts with fallback mode by default
5. **Retry**: Manual retry button to test API again

This fix ensures the login flow works reliably regardless of API availability.
