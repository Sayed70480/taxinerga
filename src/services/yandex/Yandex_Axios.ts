import axios from "axios";

const cache: Record<string, { data: any; timestamp: number }> = {};

const Yandex_Axios = axios.create({
  baseURL: "https://fleet-api.taxi.yandex.net",
  headers: {
    "X-Client-ID": process.env.YANDEX_X_Client_ID as string,
    "X-Api-Key": process.env.YANDEX_X_API_Key as string,
    "X-Park-ID": process.env.YANDEX_PARK_ID as string,
    "Content-Type": "application/json",
  },
});

Yandex_Axios.interceptors.request.use(async (config) => {
  const cacheKey = config.url + JSON.stringify(config.data);
  const cachedResponse = cache[cacheKey];

  if (cachedResponse && Date.now() - cachedResponse.timestamp < 60000) {
    return Promise.reject({ cachedData: cachedResponse.data });
  }
  return config;
});

Yandex_Axios.interceptors.response.use(
  (response) => {
    const cacheKey = response.config.url + JSON.stringify(response.config.data);
    cache[cacheKey] = { data: response.data, timestamp: Date.now() };
    return response;
  },
  (error) => {
    if (error.cachedData) return Promise.resolve({ data: error.cachedData });
    return Promise.reject(error);
  },
);

export default Yandex_Axios;
