import axios from "axios";

const BOG_Axios = axios.create({
  baseURL: "https://api.businessonline.ge/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default BOG_Axios;
