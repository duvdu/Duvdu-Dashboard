import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

let prevdate: number = Date.now();

// Create an instance of axios
export const mainApiInstance: AxiosInstance = axios.create({
  baseURL: "https://dashboardapi.duvdu.com",
  withCredentials: true
});

// Add a request interceptor
mainApiInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const dateNow: number = Date.now();
    const timeSinceLastRequest: number = dateNow - prevdate;

    if (timeSinceLastRequest < 1000) {  // Check if less than 1 second has passed
      // Delay the request to fulfill the 1 second requirement
      return new Promise<InternalAxiosRequestConfig>((resolve) => {
        setTimeout(() => {
          prevdate = Date.now();  // Update prevdate to the current time
          resolve(config);  // Continue with the request configuration
        }, 1000 - timeSinceLastRequest);  // Calculate the remaining time to delay
      });
    }
    prevdate = dateNow;
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
mainApiInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: any) => {
    
    if (error.response && error.response.status === 423) {

      if (error.config.url == "/api/users/auth/refresh") {
        
      }
      else {
        try {
          const response: AxiosResponse = await mainApiInstance.post(`api/users/auth/refresh`);
          return mainApiInstance(error.config);
        } catch (refreshError) {
          return Promise.reject(refreshError);
        }
      }
    }
    return Promise.reject(error);
  }
);
