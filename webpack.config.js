const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    entry: env({dev: './src/plain.tsx', production: "./src/chrome.tsx"}),
    devtool: env({dev: 'inline-source-map', production: "source-map"}),
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'awesome-typescript-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    output: {
        filename: 'panel.js',
        path: path.resolve(__dirname, 'shells/chrome/dist')
    },
    mode: env({dev: 'development', production: 'production'}),
    devServer: {},
    plugins: env({
        dev: [],
        production: [
            new UglifyJSPlugin({
                sourceMap: true
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
