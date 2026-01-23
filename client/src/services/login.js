import axios from "axios";

let baseUrl;

if (process.env.NODE_ENV === "development") {
  baseUrl = "http://localhost:3003/api";
} else if (process.env.NODE_ENV === "test") {
  baseUrl = process.env.TEST_BACKEND_URL || "http://localhost:3004/api";
} else {
  baseUrl = "/api";
}

const login = async (credentials) => {
  const response = await axios.post(`${baseUrl}/login`, credentials);
  return response.data;
};

export default { login };
