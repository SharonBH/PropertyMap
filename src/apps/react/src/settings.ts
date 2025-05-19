// src/settings.ts
// Central place for app-wide settings

export const settings = {
  baseAPI: import.meta.env.VITE_API_BASE_URL || "",
  useMockLogin: import.meta.env.VITE_USE_MOCK_LOGIN === 'true' || false,
};
