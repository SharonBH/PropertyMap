import { settings } from '@/settings';
import Axios, { AxiosError, AxiosRequestConfig } from 'axios';
 
 export const AXIOS_INSTANCE = Axios.create({ baseURL: settings.baseAPI  }); // use your own URL here or environment variable
 
 AXIOS_INSTANCE.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      if (config.headers) {
        config.headers['Authorization'] = `Bearer ${token}`;
      } else {
        config.headers = { Authorization: `Bearer ${token}` } as any;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
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
 
   // @ts-ignore
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