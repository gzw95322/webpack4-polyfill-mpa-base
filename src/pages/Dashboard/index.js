/* eslint-disable no-undef */
import "@/constants/modules/common";
import "./index.scss";
require("layui-layer");
import { getList } from "@/constants/config/api_mock";
process.env.NODE_ENV == "development" ? require("./index.ejs") : null;
$(function() {
    getRList();
});


// 获取list
function getRList() {
    getList().then(res => {
        if (res.code == 200) {
            let appTpl = require("./tpl/app.tmpl");
            $("#appTpl").html(appTpl({ list: res.data.list }));
        }
    });
}