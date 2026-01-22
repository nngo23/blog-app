import axios from "axios";

let baseUrl = `http://localhost:${window.BACKEND_PORT || 3003}`;

let token = null;

const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};

const getAll = async () => {
  const response = await fetch(`${baseUrl}/api/blogs`);
  return response.json();
};

const create = async (newBlog) => {
  const res = await fetch(`${baseUrl}/api/blogs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify(newBlog),
  });
  return res.json();
};

const update = (id, newObject) => {
  const request = axios.put(`${baseUrl}/api/blogs/${id}`, newObject);
  return request.then((response) => response.data);
};

const remove = async (id) => {
  const config = { headers: { Authorization: token } };
  const response = await axios.delete(`${baseUrl}/api/blogs/${id}`, config);
  return response.data;
};

export default { setToken, getAll, create, update, remove };
