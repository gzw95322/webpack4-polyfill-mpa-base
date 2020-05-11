const merge = require("webpack-merge");
const base = require("./webpack.base.conf");
const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ManifestPlugin = require("webpack-manifest-plugin");
const FileManagerPlugin = require("filemanager-webpack-plugin");
// const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
//     .BundleAnalyzerPlugin;
const CompressionWebpackPlugin = require("compression-webpack-plugin");
module.exports = merge(base, {
    mode: "production",
    devtool: "false",
    output: {
        path: path.resolve(__dirname, "./dist"),
        // 打包多出口文件
        // 生成 a.bundle.js  b.bundle.js  jquery.bundle.js
        filename: `./js/[name].[contenthash:7].js`
    },
    module: {
        rules: [
            // css处理
            {
                test: /\.(css)$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            // css中的图片路径增加前缀
                            publicPath: "../"
                        }
                    },
                    "css-loader",
                    "postcss-loader"
                ]
            },
            // sass处理
            {
                test: /\.(scss|sass)$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            // css中的图片路径增加前缀
                            publicPath: "../"
                        }
                    },
                    "css-loader",
                    "postcss-loader",
                    "sass-loader"
                ]
            }
        ]
    },
    plugins: [
        // css文件处理
        new MiniCssExtractPlugin({
            filename: `./css/[name].[contenthash:7].css`
            // chunkFilename: "./css/[id].[hash:7].css"
        }),
        new ManifestPlugin(),
        // new BundleAnalyzerPlugin({
        //     analyzerMode: "server",
        //     analyzerHost: "127.0.0.1",
        //     analyzerPort: 8889,
        //     reportFilename: "report.html",
        //     defaultSizes: "parsed",
        //     generateStatsFile: false,
        //     statsFilename: "stats.json",
        //     statsOptions: null,
        //     logLevel: "info"
        // }),
        new FileManagerPlugin({
            onEnd: {
                delete: [
                    "./zip" // 删除原来的文件夹
                ],
                mkdir: ["./zip"], // 创建zip文件夹
                archive: [
                    {
                        source: "./dist", // 要打包的目标文件夹
                        destination: `./zip/bundle.zip`
                    } // 需要生成的文件
                ]
            }
        })
        // new CompressionWebpackPlugin({
        //     filename: "[path].gz[query]",
        //     algorithm: "gzip",
        //     test: new RegExp("\\.(js|css)$"),
        //     threshold: 10240,
        //     minRatio: 0.8
        // })
    ]
});
