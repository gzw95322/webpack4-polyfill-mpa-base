export const MOCK_API_URL = "/mock_api/"; // mockapi

// ! 开发/测试环境
export const API_URL =
    process.env.NODE_ENV == "development"
        ? "/api/"
        : process.env.NODE_ENV == "release"
        ? "http://release.foo.com/rest/"
        : "http://build.foo.com/rest/"; // api
