import axios from 'axios'

let baseUrl = `http://localhost:${window.BACKEND_PORT || 3003}`

const login = async (credentials) => {
  const response = await axios.post(`${baseUrl}/api/login`, credentials)
  return response.data
}

export default { login }