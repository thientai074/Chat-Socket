import axios, {AxiosInstance} from "axios";
import {env} from "./utils/MyVariables";
import Cookies from "js-cookie";

const cookie = Cookies.get(env.nameCookie);

export const apiAuthClient: AxiosInstance = axios.create({
    baseURL: env.hostServer,
    withCredentials: true,
    // @ts-ignore
    headers: {"Access-Control-Allow-Credentials": true},
});

export const apiClient: AxiosInstance = axios.create({
    baseURL: env.hostServer,
    // @ts-ignore
    headers: {"Content-Type": "application/json", authorization: cookie},
});