import axios, {AxiosInstance} from "axios";
import {env} from "./utils/MyVariables";

export const apiAuthClient: AxiosInstance = axios.create({
    baseURL: env.hostServer,
    withCredentials: true,
    // @ts-ignore
    headers: {"Access-Control-Allow-Credentials": true},
});

export function apiClient(cookie: string): AxiosInstance {
    return axios.create({
        baseURL: env.hostServer,
        // @ts-ignore
        headers: { "Content-Type": "application/json", authorization: cookie },
    });
} 