import axios from "axios";

let authToken = null;

const AxiosObj = axios.create({ responseType: "json" });

const setBaseUrl = (url) => {
    if (url) AxiosObj.defaults.baseURL = url;
};

const setToken = (token) => {
    authToken = token;
};

const requestHandler = async (request) => {
    request.headers['Content-Type'] = 'application/json';
    if (authToken) {
        request.headers['Authorization'] = `Bearer ${authToken}`;
    }
    return request;
};

AxiosObj.interceptors.request.use(request => requestHandler(request));

export { AxiosObj, setBaseUrl, setToken };