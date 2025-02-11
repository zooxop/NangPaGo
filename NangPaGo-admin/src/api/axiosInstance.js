import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_HOST,
  withCredentials: true,
});

let navigate;

export const setNavigate = (nav) => {
  navigate = nav;
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      if (navigate) {
        const errorData = encodeURIComponent(JSON.stringify(error.response.data));
        navigate(`/auth-error?error=${errorData}`);
      } else {
        window.location.href = '/auth-error';
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
