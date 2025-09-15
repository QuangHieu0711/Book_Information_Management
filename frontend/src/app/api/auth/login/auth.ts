import axios from "axios";
const API_URL = "http://localhost:8081/api/auth";

export const login = async (username: string, password: string) => {
  console.log("Sending login request:", { username, password });

  const res = await axios.post(
    `${API_URL}/login`,
    { username, password },
    { withCredentials: true }
  );

  console.log("Response status:", res.status);
  console.log("Response data:", res.data);
  return res.data;
};
