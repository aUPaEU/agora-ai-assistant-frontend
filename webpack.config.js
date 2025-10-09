const path = require('path')
const webpack = require('webpack')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

module.exports = {
    entry: './src/App.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/, // Regular expression for JavaScript files
                exclude: /node_modules/, // Exclude node_modules folder
                use: {
                    loader: 'babel-loader', // Use Babel loader to transpile JS files
                },
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'], // Add CSS loaders
            },
        ],
    },
    devtool: 'source-map',
    devServer: {
        static: path.join(__dirname, ''), // Serve static files from 'dist' folder
        compress: true,
        hot: true, // Enable Hot Module Replacement
        port: 9000, // Development server port
        open: true, // Open the browser automatically
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(), // Enable Hot Module Replacement
    ],
    resolve: {
        extensions: ['.js', '.css'], // Allow importing JS files without extension
    },
}