const path = require('path');
// const webpack = require('webpack');
// const WasmPackPlugin = require("@wasm-tool/wasm-pack-plugin");

module.exports = {
    entry: './index.js',
    output: {
        path: path.resolve('../static'),
        filename: 'oso-bundled.js',
    },
    mode: 'development',
    resolve: {
        modules: [path.resolve(__dirname, "node_modules")]
    },
    target: "web"
};