import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = "https://api.trello.com/1";

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use(async (config) => {
    const key = await AsyncStorage.getItem("trello_key");
    const token = await AsyncStorage.getItem("trello_token");
    config.params = {
        ...config.params,
        key,
        token,
    };
    return config;
});
export default api;