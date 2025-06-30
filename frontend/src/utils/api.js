import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5000/api", // Adjust as needed
  withCredentials: true, // Ensures cookies are sent
});

export default instance;
