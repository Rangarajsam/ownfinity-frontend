import axios from "axios";
import { toast } from "react-hot-toast"

const api = axios.create({
    baseURL: "http://localhost:1234",
    withCredentials: true,
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Something went wrong";
  
        toast.error(message);
  
      return Promise.reject(error);
    }
  );
  
  export default api;
    