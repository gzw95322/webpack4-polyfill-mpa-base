import { API_URL } from "./index";

import req from "@/constants/utils/request";
import qs from "qs";

// 用户信息
export const getUserInfo = (param = {}) => {
    return req.get(`${API_URL}getInfo`, param);
};

// 列表接口
export const companyApi = {
    user: {
        create: (params = {}) => {
            return req.postForm(`${API_URL}create`, params);
        },
        delete: (params = {}) => {
            return req.postForm(`${API_URL}delete`, params);
        },
        list: (params = {}) => {
            return req.get(`${API_URL}list`, params);
        }
    }
};
