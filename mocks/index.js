const mockjs = require("mockjs");
const delay = require("mocker-api/utils/delay");
const area = require("../src/constants/config/area.json");
// 是否禁用代理
const noProxy = process.env.NO_PROXY === "true";

const proxy = {
    // Priority processing.
    _proxy: {
        proxy: {
            // "/api/(.*)": "http://api.kdxf.com/"
        },
        changeHost: true
    },
    
    // 获取列表
    "GET /mock_api/getList": (req, res) => {
        let _mock = {
            code: "200",
            message: "success",
            data: mockjs.mock({
                totalSize: 30,
                totalPage: 10,
                pageNo: req.query.page,
                pageSize: req.query.rows
            })
        };
        _mock.data[`list|0-${req.query.rows}`] = [
            {
                "tag|1-10": "6,",
                id: "173282438",
                "prog|1-10": 0,
                "isCollect|0-1": 0,
                title: "@csentence(20, 40)",
                url: "@url",
                "area|1-100": 126,
                cityName: "@city",
                _version_: 1661445854216585216,
                "userIds|1-100": "2,",
                provinceName: "@province",
                updatetime: "@datetime",
                "state|1": [0, 1, 2],
                "stoptime|1": ["2020-04-30 00:00:00", "2020-04-01 00:00:00", "2020-04-25 00:00:00", "2020-04-22 00:00:00", "2020-04-21 00:00:00"]
            }
        ];
        return res.json(mockjs.mock(_mock));
    },
    // add
    "POST /mock_api/add": (
        req,
        res
    ) => {
        let _mock = {
            code: "200",
            message: "success",
            data: ""
        };
        return res.json(mockjs.mock(_mock));
    }
};
module.exports = noProxy ? {} : delay(proxy, 1000);
// module.exports = proxy;
