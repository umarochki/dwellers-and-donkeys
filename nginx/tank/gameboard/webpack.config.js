const path = require('path');
const isDev = process.env.NODE_ENV !== 'production';
const pixiModule = path.join(__dirname, '/node_modules/pixi.js-legacy/')

const config = {
    mode: isDev ? 'development' : 'production',
    entry: './src/app.ts',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'app.js',
        library: "commonjs",
        libraryTarget: "umd"
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
        alias: {
            'PIXI': pixiModule,
          }
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
            }
        ]
    },
    plugins: [
    ],
    optimization: {
        minimize: !isDev
    },
    devtool: "eval-cheap-source-map"

};

module.exports = config;