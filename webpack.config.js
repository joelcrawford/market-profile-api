// webpack.config.js
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FileManagerPlugin = require('filemanager-webpack-plugin')
const path = require('path')

module.exports = {
    entry: './client/index.js',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'public/js'),
        publicPath: '/js'
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'client', 'public', 'index.html')
        }),
        new FileManagerPlugin({
            events: {
                onEnd: {
                    move: [
                        {
                            source: 'public/js/index.html',
                            destination: 'public/index.html'
                        }
                    ]
                }
            }
        })
    ],
    devServer: {
        static: {
            directory: path.join(__dirname, 'public')
        },
        port: 3000
    },
    module: {
        // exclude node_modules
        rules: [
            {
                test: /\.(js|jsx)$/, // <-- added `|jsx` here
                exclude: /node_modules/,
                use: ['babel-loader']
            }
        ]
    },
    // pass all js files through Babel
    resolve: {
        extensions: ['*', '.js', '.jsx'] // <-- added `.jsx` here
    }
}
