// 此为mock用的api

import { MOCK_API_URL } from "./index";
import req from "@/constants/utils/request";

// 获取列表
export const getList = (param = {}) => {
    return req.get(`${MOCK_API_URL}/getList`, param);
};
// post
export const access = (param = {}) => {
    return req.post(
        `${MOCK_API_URL}/add`,
        param
    );
};
