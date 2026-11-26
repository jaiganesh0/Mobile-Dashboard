// Single place that reads Vite environment variables.
// Only variables prefixed with VITE_ are exposed to client code.
export const env = {
  appName: import.meta.env.VITE_APP_NAME,
  mode: import.meta.env.VITE_APP_ENV,
  apiUrl: import.meta.env.VITE_API_URL,
  debug: import.meta.env.VITE_ENABLE_DEBUG === 'true',
  baseUrl: import.meta.env.VITE_BASE_URL,
};
