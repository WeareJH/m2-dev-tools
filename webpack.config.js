const path = require('path');
const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const extractSass = new ExtractTextPlugin({
    filename: "panel.css",
    disable: process.env.NODE_ENV === "development"
});

module.exports = {
    entry: env({
        dev: {
            iframe: './src/envs/iframe.tsx',
            plain: './src/envs/plain.tsx',
            inject: './src/chrome/inject-plain.ts',
            background: './src/chrome/background.ts',
        },
        production: {
            panel: "./src/envs/chrome.tsx",
            inject: './src/chrome/inject.ts',
            background: './src/chrome/background.ts',
        }
    }),
    devtool: env({dev: 'inline-source-map', production: "source-map"}),
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'awesome-typescript-loader',
                exclude: /node_modules/
            },
            {
                test: /\.scss$/,
                use: extractSass.extract({
                    use: [{
                        loader: "css-loader"
                    }, {
                        loader: "sass-loader"
                    }],
                    // use style-loader in development
                    fallback: "style-loader"
                })
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.scss']
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'shells/chrome/dist')
    },
    devServer: {},
    plugins: env({
        shared: [extractSass],
        dev: [],
        production: [
            new UglifyJSPlugin({
                sourceMap: true
            }),
            new webpack.DefinePlugin({
               'process.env.NODE_ENV': JSON.stringify('production')
            })
        ]
    })
};

function env(input) {
    const selection = input[process.env.NODE_ENV || 'dev'];
    if (input.shared && Array.isArray(input.shared)) {
        return input.shared.concat(selection);
    }
    return selection;
}
