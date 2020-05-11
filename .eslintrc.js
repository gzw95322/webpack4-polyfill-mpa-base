module.exports = {
    root: true,
    parserOptions: {
        parser: "babel-eslint", // eslint未支持的js新特性先进行转换
        sourceType: "module"
    },
    env: {
        browser: true,
        es6: true,
        node: true,
        // "shared-node-browser": true,
        commonjs: true,
        jquery: true
    },
    // globals: {
    //     // 设置全局变量（false：不允许重写；）
    //     BUILD_ENV: false
    // },
    extends: ["eslint:recommended", "plugin:prettier/recommended"],
    rules: {
        // 定义检查规则
        "prettier/prettier": "error",
        "no-unreachable": "off",
        "no-unused-vars": "off"
    }
};
