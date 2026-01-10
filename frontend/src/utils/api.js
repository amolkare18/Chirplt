import axios from "axios";

const instance = axios.create({
  baseURL: "https://chirplt.onrender.com/", // Adjust as needed
  withCredentials: true, // Ensures cookies are sent
});

export default instance;
