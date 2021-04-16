const path = require('path');
const webpack = require ('webpack');
const CURRENT_WORKING_DIR = process.cwd();
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CSPWebpackPlugin = require('csp-webpack-plugin');

const config = {
    name: "browser",
    mode: "development",
    devtool: 'eval-source-map',
    entry:[
        'webpack-hot-middleware/client?reload=true',
        path.join(CURRENT_WORKING_DIR, 'client/main.js')
    ],
    output: {
        path:path.join(CURRENT_WORKING_DIR , '/dist'),
        filename: 'bundle.js',
        publicPath: '/dist/'
    },
    module: {
        rules:[
            {
                test:/\.jsx?$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            },
            {
                test: /\.(ttf|eot|svg|gif|jpg|png)(\?[\s\S]+)?$/,
                use: 'file-loader'
            }
        ]
    },
    plugins:[
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new HtmlWebpackPlugin(),
        new CSPWebpackPlugin({
            'object-src': '\'none\'',
            'base-uri': '\'self\'',
            'script-src': ['\'unsafe-inline\'', '\'self\'', '\'unsafe-eval\'','http://ajax.googleapis.com'],
            'worker-src': ['\'self\'','blob:']
        })
    ],
    resolve: {
        alias: {
            'react-dom': '@hot-loader/react-dom'
        }
    }
}

module.exports = config