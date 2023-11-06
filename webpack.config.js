const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = [
    {
        name: 'client',
        context: path.resolve(__dirname, 'src'),
        entry: './index.js',
        devServer: {
            port: 8000,
            historyApiFallback: true
         },
        module: {
            rules: [
                {test: /\.(gif|png)$/i, type: 'asset/resource'},
                {test: /\.svg/, type: 'asset/inline'},
                //{test: /\.css$/, use: ['style-loader', 'css-loader']},
                {
                    test: /\.handlebars$/,
                    loader: 'handlebars-loader',
                    options: {
                        partialDirs: [path.resolve(__dirname, 'src/components/ProfileMenu'),
                            path.resolve(__dirname, 'src/components/Comment'),
                            path.resolve(__dirname, 'src/components/Target'),
                            path.resolve(__dirname, 'src/components/SubLevel'),
                            path.resolve(__dirname, 'src/components/Post'),
                            path.resolve(__dirname, 'src/components/Donate'),]
                    }
                },
                {test: /\.(js)$/, exclude: /node_modules/, use: 'babel-loader'},
                {test: /\.(css|scss)$/, exclude: /node_modules/, use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader']}
            ]
        },
        resolve: {
            alias: {
                '@components': path.resolve(__dirname, 'src/components'),
                '@configs': path.resolve(__dirname, 'src/configs'),
                '@modules': path.resolve(__dirname, 'src/modules'),
                '@static': path.resolve(__dirname, 'static/'),
            },
        },
        output: {
            path: path.resolve(__dirname, 'dist/client'),
            filename: 'index_bundle.js'
        },
        plugins: [
            new HtmlWebpackPlugin({template: './index.html'}),
        ]
    },
]