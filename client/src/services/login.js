import axios from "axios";

let baseUrl = "/api";

const login = async (credentials) => {
  const response = await axios.post(`${baseUrl}/login`, credentials);
  return response.data;
};

export default { login };
