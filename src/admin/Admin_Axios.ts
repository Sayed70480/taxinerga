import axios from "axios";

const Admin_Axios = axios.create({
  baseURL: "/api/admin",
});

export default Admin_Axios;
