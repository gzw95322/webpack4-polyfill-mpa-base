const webpack = require("webpack");
const merge = require("webpack-merge");
const apiMocker = require("mocker-api");
const FriendlyErrorsPlugin = require("friendly-errors-webpack-plugin");
// const ErrorOverlayPlugin = require("error-overlay-webpack-plugin");
const base = require("./webpack.base.conf");
const path = require("path");

const _url = {
    host: "127.0.0.1",
    port: "80"
};

module.exports = merge(base, {
    mode: "development",
    output: {
        path: path.resolve(__dirname, "./public"),
        // 打包多出口文件
        // 生成 a.bundle.js  b.bundle.js  jquery.bundle.js
        filename: `./js/[name].[hash:7].js`
    },
    devServer: {
        contentBase: path.resolve(__dirname, "./public"),
        host: _url.host,
        port: _url.port,
        overlay: { warnings: true, errors: true },
        inline: true,
        disableHostCheck: true,
        quiet: true, // necessary for FriendlyErrorsPlugin
        open: true, // 开启浏览器
        hot: true, // 开启热更新
        proxy: {
            "/api": {
                target: "http://foo.com", //测试环境, 需要配置host
                changeOrigin: true,
                ws: false,
                pathRewrite: {
                    "^/api": ""
                }
            },
            "/user-api": {
                target: "http://foo.com", //测试环境, 需要配置host
                changeOrigin: true,
                ws: false,
                pathRewrite: {
                    "^/user-api": ""
                }
            },
            "/enterprise": {
                target: "http://foo.com", //测试环境, 需要配置host
                changeOrigin: true,
                ws: false,
                pathRewrite: {
                    "^/enterprise": ""
                }
            }
        },
        // 此为mock代码
        before(app) {
            apiMocker(app, path.resolve("./mocks/index.js"), {
                proxy: {
                    // "/api/*": "http://api.kdxf.com/"
                },
                changeHost: true
            });
        }
    },
    devtool: "source-map", // 开启调试模式
    module: {
        rules: [
            {
                test: /\.(css)$/,
                use: ["style-loader", "css-loader", "postcss-loader"]
            },
            // sass处理
            {
                test: /\.(scss|sass)$/,
                use: [
                    "style-loader",
                    "css-loader",
                    "postcss-loader",
                    "sass-loader"
                ]
            }
        ]
    },
    plugins: [
        // 热更新组件
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        // new ErrorOverlayPlugin() // 对react和原生js友好
        new FriendlyErrorsPlugin({
            clearConsole: true,
            compilationSuccessInfo: {
                messages: [
                    `server is running: http://${_url.host}:${_url.port}`
                ]
            },
            onErrors: undefined
        })
    ]
});
