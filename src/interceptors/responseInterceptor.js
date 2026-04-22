export const attachResponseInterceptor = (axiosInstance) => {
  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        console.log('Unauthorized', error.response);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }

      return Promise.reject(error);
    },
  );
};

