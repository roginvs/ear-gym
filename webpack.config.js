const webpack = require("webpack");
const webpackDevServer = require("webpack-dev-server");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const WebpackVersionHashPlugin = require("webpack-version-hash-plugin");

const indexHtml = new HtmlWebpackPlugin({
    title: "Ear gym",
    template: "!!ejs-compiled-loader!./src/ejs/index.ejs"
});

const devServer /*: webpackDevServer.Configuration */ = {
    contentBase: "./dist",
    port: 4004
};

const config /*: webpack.Configuration */ = {
    entry: {
        index: "./src/index.tsx"
    },

    output: {
        filename: "[name].js",
        chunkFilename: "[id].js",
        path: __dirname + "/dist"
    },

    plugins: [
        indexHtml,
        new CopyWebpackPlugin([
            {
                from: "assets"
            }
        ]),
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: "[name].css",
            chunkFilename: "[id].css"
        }),
        new WebpackVersionHashPlugin({
            filename: 'version.json',
            include_date: true
        })
    ],

    module: {
        rules: [
            {
                enforce: "pre",
                test: /\.(js|ts|tsx)$/,
                loader: "source-map-loader",
                exclude: /node_modules/
            },
            {
                test: /\.tsx?$/,
                loader: "ts-loader",
                exclude: /node_modules/
            },

            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, "css-loader"]
            },

            {
                test: /\.(png|svg|jpg|gif)$/,
                use: ["file-loader?name=img/[hash].[ext]"]
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: ["file-loader?name=fonts/[hash].[ext]"]
            }
        ]
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".json"]
    },
    //  devtool: '#cheap-module-source-map',
    devServer
};

module.exports = config;
