/*eslint-disable*/
const webpack = require("webpack");
const path = require("path");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const ProgressBarPlugin = require("progress-bar-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const config = require("./config");
const fileGenerateConfig = require("./config/file.generate.config");
// const fileGenerateConfig = require("./config/file.generate.config.lite");

// 静态资源cdn
const staticFile = {
    // css: ["//at.alicdn.com/t/font_1745243_xpr9ho7dfdb.css"],
    css: [],
    img: [],
    js: [
        "./static/es5-shim.min.js", // 使ie支持es5特性
        "./static/es5-sham.min.js", // 使ie支持es5特性
        "./static/json2.js" // 使ie支持JSON特性
    ]
};
var entryConfig = {};
var geneHtmlConfig = [];
fileGenerateConfig.forEach(item => {
    entryConfig[item.chunkName] = item.chunkUrl;
    geneHtmlConfig.push(
        new HtmlWebPackPlugin({
            filename: item.generateFilename,
            title: "index",
            minify: {
                removeComments: true, // 去除注释
                collapseWhitespace: true //是否去除空格
            },
            inject: true,
            chunks: ["styles", "jquery", item.chunkName],
            template: item.templateUrl
        })
    );
});
module.exports = {
    entry: entryConfig,
    resolve: {
        // extensions: [".ts"],
        alias: {
            // @路径解析, vscode支持需要配置jsconfig.js
            "@": path.resolve(__dirname, "./src")
            // pg: path.resolve(__dirname, "./src/pages")
        }
    },
    module: {
        rules: [
            // eslint
            {
                test: /\.(js)$/,
                loader: "eslint-loader",
                enforce: "pre",
                include: [path.join(__dirname, "src")],
                options: {
                    fix: true
                }
            },
            // 处理js, 兼容处理到es5
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env"],
                        plugins: [
                            "@babel/plugin-transform-runtime",
                            "@babel/plugin-transform-modules-commonjs"
                        ]
                    }
                }
            },
            // ts支持
            // {
            //     test: /\.ts$/,
            //     use: "ts-loader"
            // },
            // html处理
            {
                test: /\.html$/,
                use: [
                    {
                        loader: "html-loader",
                        options: {
                            minimize: true, // 压缩
                            attrs: ["img:src", "img:data-src", "audio:src"], // 处理html文件中的src引用
                            root: path.resolve(__dirname, "./dist")
                        }
                    }
                ]
            },
            // ejs模板处理
            {
                test: /\.ejs$/,
                use: ["ejs-loader?variable=data"]
            },
            // svg雪碧图
            // {
            //     test: /\.svg$/,
            //     loader: "svg-sprite-loader",
            //     include: path.resolve(__dirname, "./src/assets/icons")
            // },
            // 字体处理
            {
                test: /\.(woff|woff2|eot|ttf|svg)$/,
                use: {
                    loader: "file-loader",
                    options: {
                        // 保留原文件名和后缀名
                        name: "[name].[hash:7].[ext]",
                        // 输出到dist/fonts/目录
                        outputPath: "fonts"
                    }
                }
            },
            // htc文件处理
            {
                test: /\.(htc)$/,
                use: {
                    loader: "file-loader",
                    options: {
                        // 保留原文件名和后缀名
                        name: "[name].[hash:7].[ext]",
                        // 输出到dist/static/目录
                        outputPath: "static"
                    }
                }
            },
            // templatejs处理
            {
                test: /\.tmpl/,
                loader: "templatejs-loader",
                options: {
                    sTag: "<#",
                    eTag: "#>",
                    escape: false,
                    expression: 'require("@templatejs/runtime").default'
                }
            },
            // 图片处理
            {
                test: /\.(png|jpe?g|gif|svg|ico)(\?.*)?$/,
                loader: "url-loader",
                options: {
                    esModule: false, // 不使用es语法加载
                    limit: 1024, // 大小范围内使用base64
                    name: "[name].[hash:7].[ext]",
                    // publicPath: "./img",
                    outputPath: "img"
                }
            }
        ]
    },
    plugins: [
        // terminal进度条组件
        new ProgressBarPlugin(),
        // 清理dist
        new CleanWebpackPlugin({}),
        // ejs模板内的参数
        new webpack.DefinePlugin({
            cdn: JSON.stringify(staticFile), // cdn文件
            menu: JSON.stringify(config.menuList),
            loginPath: JSON.stringify(config.logoutPath),
            searchPath: JSON.stringify(config.searchOrigin),
            centerPath: JSON.stringify(config.centerOrigin),
            hotKw: JSON.stringify(config.hotKw),
            "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV)
        }),
        // 统一依赖加载, 这么加有缺陷, commonjs打包的this不是指向的window, 导致不能全局引入$
        // new webpack.ProvidePlugin({
        //     commons: "./src/constants/modules/commonImport.js"
        // }),
        //复制静态文件
        new CopyWebpackPlugin([
            { from: path.resolve(__dirname, "./src/static"), to: "./static" },
            { from: path.resolve(__dirname, "./src/static/public"), to: "./" }
        ]),
        // 多页面打包配置, 有几个页面配几个页面
        ...geneHtmlConfig
    ],
    optimization: {
        // 分包优化, jquery, 样式公共文件提取,
        splitChunks: {
            chunks: "async", // all async initial
            minSize: 30000,
            maxSize: 0,
            minChunks: 1,
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
            automaticNameDelimiter: "~",
            name: true,
            cacheGroups: {
                jquery: {
                    test: /jquery/,
                    name: "jquery",
                    priority: 10,
                    chunks: "all"
                },
                styles: {
                    test: /[\\/]public[\\/].+\.(css|sass|scss)$/,
                    name: "styles",
                    chunks: "all",
                    enforce: true
                }
            }
        },
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    ie8: true,
                    compress: {
                        properties: false
                    },
                    output: {
                        quote_keys: true
                    }
                }
            })
        ]
    }
};
