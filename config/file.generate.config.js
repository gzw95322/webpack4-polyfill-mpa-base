/*eslint-disable*/
/*
 * @Description: webpack 多页面配置
 * @Date: 2020-04-11 14:39:13
 * @LastEditors: gzw
 * @LastEditTime: 2020-05-11 16:56:26
 */
"use strict";

/**
 * @param {String} title 页面title ，目前webpack处理不了
 * @param {String} chunkName 模块名称，entry的key
 * @param {String} chunkUrl js路径
 * @param {String} templateUrl ejs路径
 * @param {String} generateFilename 生成的html名称，有路径的话写全
 * @param {Array} breadcrumb 生成面包屑
 */
module.exports = [
    {
        title: "首页",
        breadcrumb: [["首页", "index.html"]],
        chunkName: "Dashboard",
        chunkUrl: "./src/pages/Dashboard/index.js",
        templateUrl: "./src/pages/Dashboard/index.ejs",
        generateFilename: "index.html"
    }
]