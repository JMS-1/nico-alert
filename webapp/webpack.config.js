const copy = require('copy-webpack-plugin')
const extract = require('mini-css-extract-plugin')
const path = require('path')

module.exports = () => ({
    devtool: 'source-map',
    entry: {
        index: './src/index.tsx',
    },
    module: {
        rules: [
            {
                loader: 'ts-loader',
                test: /\.tsx?$/i,
            },
            {
                test: /\.scss$/i,
                use: [
                    { loader: extract.loader },
                    { loader: 'css-loader', options: { sourceMap: false, url: false } },
                    'sass-loader',
                ],
            },
            {
                test: /\.css$/i,
                use: [{ loader: extract.loader }, { loader: 'css-loader', options: { sourceMap: false, url: false } }],
            },
        ],
    },
    output: {
        filename: '[name].js',
        path: path.join(__dirname, '../deploy/dist'),
    },
    performance: {
        maxAssetSize: 5000000,
        maxEntrypointSize: 5000000,
    },
    plugins: [new extract({ filename: 'index.css' }), new copy({ patterns: [{ from: 'static' }] })],
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.scss', '.css'],
    },
})
