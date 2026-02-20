import axios from "axios";

const baseUrl = "/api/login";

const login = async (credentials) => {
  const response = await axios.post(`${baseUrl}/login`, credentials);
  return response.data;
};

export default { login };
