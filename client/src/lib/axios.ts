import axios from "axios";

export const axiosInstance = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "/api"
      : "https://api.lumierecosmetics.site/api",
  // : "http://ec2-54-169-103-14.ap-southeast-1.compute.amazonaws.com:3000/api",
  withCredentials: true,
});

