import { settings } from '@/settings';
import Axios, { AxiosError, AxiosRequestConfig } from 'axios';
 
 export const AXIOS_INSTANCE = Axios.create({ baseURL: settings.baseAPI  }); // use your own URL here or environment variable
  // Flag to prevent multiple redirects
 let isRedirecting = false;
 AXIOS_INSTANCE.interceptors.request.use(  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add tenant header dynamically
    const tenant = localStorage.getItem('currentTenant');
    if (tenant) {
      config.headers.tenant = tenant;
    } else {
      // Fallback to root tenant if no tenant is set
      config.headers.tenant = 'root';
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle 401 errors
AXIOS_INSTANCE.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Check if it's a 401 unauthorized error
    if (error.response?.status === 401 && !isRedirecting) {
      // Skip redirect and localStorage clearing for login-related requests
      const isLoginRequest = error.config?.url?.includes('/token');
      const isOnLoginPage = window.location.pathname === '/login';

      if (!isLoginRequest && !isOnLoginPage) {
        isRedirecting = true;
        // Clear authentication data
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('refreshTokenExpiryTime');
        localStorage.removeItem('currentAgent');
        localStorage.removeItem('currentTenant');
        
        // Dispatch custom event to notify AuthContext
        window.dispatchEvent(new CustomEvent('auth:session-expired'));
        
        // Redirect to login with current location
        const currentPath = window.location.pathname;
        const loginUrl = `/login${currentPath !== '/login' ? `?redirect=${encodeURIComponent(currentPath)}` : ''}`;
        
        // Use setTimeout to avoid redirect during React render cycle
        setTimeout(() => {
          window.location.href = loginUrl;
          isRedirecting = false;
        }, 100);
      }
    }
    
    // Handle network errors or server unavailable
    if (!error.response && error.message === 'Network Error') {
      console.error('Network error - server may be unavailable');
      window.dispatchEvent(new CustomEvent('auth:network-error'));
    }
    
    return Promise.reject(error);
  }
);

 // add a second `options` argument here if you want to pass extra options to each generated query
 export const customInstance = <T>(
   config: AxiosRequestConfig,
   options?: AxiosRequestConfig,
 ): Promise<T> => {
   const source = Axios.CancelToken.source();
   const promise = AXIOS_INSTANCE({
     ...config,
     ...options,
     cancelToken: source.token,
   }).then(({ data }) => data);
   // @ts-expect-error cancel method is attached to promise
   promise.cancel = () => {
     source.cancel('Query was cancelled');
   };
 
   return promise;
 };
 
 // In some case with react-query and swr you want to be able to override the return error type so you can also do it here like this
 export type ErrorType<Error> = AxiosError<Error>;
 
 export type BodyType<BodyData> = BodyData;
 
 // Or, in case you want to wrap the body type (optional)
 // (if the custom instance is processing data before sending it, like changing the case for example)
 //export type BodyType<BodyData> = CamelCase<BodyData>;