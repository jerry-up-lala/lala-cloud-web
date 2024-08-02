import axios from 'axios';
import qs from 'query-string';

export function get<RData = any>(url: string, params?: any) {
  return axios.get<RData>(url, {
    params,
    paramsSerializer: (_params) => {
      return qs.stringify(_params);
    },
  });
}

export function getFile(url: string, params?: any) {
  return axios.request({
    url,
    method: 'get',
    responseType: 'blob',
    params,
    paramsSerializer: (_params) => {
      return qs.stringify(_params);
    },
  });
}

export function post<RData = any>(url: string, data?: any) {
  return axios.request<RData>({
    url,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    data,
  });
}

export function put<RData = any>(url: string, data?: any) {
  return axios.request<RData>({
    url,
    method: 'put',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    data,
  });
}

export function deleteRequest<RData = any>(url: string, data?: any) {
  return axios.request<RData>({
    url,
    method: 'delete',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    data,
  });
}
