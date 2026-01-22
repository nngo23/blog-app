import axios from "axios";

const baseUrl = import.meta.env.VITE_BACKEND_URL;

const login = async (credentials) => {
  const response = await axios.post(`${baseUrl}/api/login`, credentials);
  return response.data;
};

export default { login };
