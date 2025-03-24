import axios from "axios";
import Cookies from "js-cookie";

const BASE_URL = import.meta.env.PROD
  ? import.meta.env.VITE_BACKEND_URL_PROD
  : import.meta.env.VITE_BACKEND_URL_LOCAL;

export function getAccessToken() {
  const token = Cookies.get("auth_token");
  return token || "";
}
axios.interceptors.request.use((request) => {
  request.headers["Authorization"] = `Bearer ${getAccessToken()}`;
  return request;
});
export class ApiService {
  static async getData(url: string) {
    let headers;
    headers = {
      Authorization: `Bearer  ${getAccessToken()}`,
    };
    const config = {
      headers,
    };
    const response = await axios.get(`${BASE_URL}/${url}`, config);
    return response;
  }

  static async postData(url: string, data: object) {
    let headers;
    headers = {
      Authorization: `Bearer  ${getAccessToken()}`,
    };

    const config = {
      headers,
    };

    const response = await axios.post(`${BASE_URL}/${url}`, data, config);
    return response;
  }
  static async putData(url: string, data: object) {
    let headers;
    headers = {
      Authorization: `Bearer  ${getAccessToken()}`,
    };

    const config = {
      headers,
    };

    const response = await axios.put(`${BASE_URL}/${url}`, data, config);
    return response;
  }
  static async patchData(url: string, data: object) {
    let headers;
    headers = {
      Authorization: `Bearer  ${getAccessToken()}`,
    };

    const config = {
      headers,
    };

    const response = await axios.patch(`${BASE_URL}/${url}`, data, config);
    return response;
  }

  static async deleteData(url: string, _data: object) {
    let headers;
    headers = {
      Authorization: `Bearer  ${getAccessToken()}`,
    };

    const config = {
      headers,
    };

    const response = await axios.delete(`${BASE_URL}/${url}`, config);
    return response;
  }
}
