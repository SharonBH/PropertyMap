# React Client Build Issue Fix

## Issue

The React client build was failing in GitHub Actions with the following error:

```text
The command could not be loaded, possibly because:
  * You intended to execute a .NET application:
      The application 'dev-certs' does not exist.
  * You intended to execute a .NET SDK command:
      A compatible .NET SDK was not found.
```

## Root Cause

The error was occurring because the Vite configuration (`vite.config.ts`) was attempting to generate HTTPS development certificates using the .NET SDK's `dev-certs` tool, which is not available in the GitHub Actions runner environment. This code was intended for local development only but was being executed in the CI/CD pipeline.

## Solution

1. **Modified the Vite configuration** to conditionally skip certificate generation when running in CI/CD environments:
   - Added a check for the `CI=true` environment variable (set by GitHub Actions)
   - Moved certificate generation code into a separate function
   - Made HTTPS configuration optional in CI environments

2. **Refactored the code** to properly handle error cases:
   - Improved error reporting for local development
   - Added more robust error handling for certificate creation
   - Fixed TypeScript typing issues

## Technical Details

### Key Changes

1. **Detection of CI environment**:

   ```typescript
   const isCI = env.CI === 'true';
   ```

2. **Conditional HTTPS setup**:

   ```typescript
   server: {
     // Other configuration...
     https: isCI ? undefined : getDevHttpsConfig()
   }
   ```

3. **Isolated certificate setup** in a separate function:

   ```typescript
   function getDevHttpsConfig() {
     // Certificate setup logic only runs in development
     // Returns undefined instead of false for proper typing
   }
   ```

## Local Development

For local development, the behavior remains unchanged. The `dev-certs` tool will be used to generate HTTPS certificates for secure local development.

## CI/CD Environment

In CI/CD environments (like GitHub Actions), the certificate generation is skipped entirely, and Vite will build the application without attempting to use HTTPS.

## Testing

This change has been tested to ensure:

- The build process completes successfully in GitHub Actions
- Local development still has access to HTTPS for testing
- The application still functions correctly when deployed

## Related Files

- `src/apps/react/vite.config.ts` - Updated to conditionally handle HTTPS certificates
- `.github/workflows/deploy-client.yml` - No modifications needed to the workflow itself
