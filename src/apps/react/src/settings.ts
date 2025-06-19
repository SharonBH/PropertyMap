// src/settings.ts
// Central place for app-wide settings

export const settings = {
  baseAPI: import.meta.env.VITE_API_BASE_URL || "",
  useMockLogin: import.meta.env.VITE_USE_MOCK_LOGIN === 'true' || false,
  multiTenant: {
    enabled: import.meta.env.VITE_MULTI_TENANT === 'true' || true,
    defaultTenant: import.meta.env.VITE_DEFAULT_TENANT || 'root',
    allowTenantSwitching: import.meta.env.VITE_ALLOW_TENANT_SWITCHING === 'true' || true,
  },
};
