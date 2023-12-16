const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = [
    {
        name: 'client',
        context: path.resolve(__dirname, 'src'),
        entry: './index.js',
        devServer: {
            port: 8000,
            historyApiFallback: true,
            hot: true,
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
                            path.resolve(__dirname, 'src/components/Donate'),],
			encoding: 'utf-8',
                    }
                },
                {
                    test: /\.(js)$/, exclude: /node_modules/, use: {
                        loader: 'babel-loader', options: {
                            presets: [
                                ['@babel/preset-env', {targets: {"firefox": "30"},"useBuiltIns": "usage"}]
                            ],
                            plugins: [
                                ['@babel/plugin-transform-runtime', {
                                    regenerator: true
                                }]
                            ]
                        }
                    }
                },
                {
                    test: /\.(css|scss)$/,
                    exclude: /node_modules/,
                    use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader']
                }
            ]
        },
        resolve: {
            alias: {
                '@components': path.resolve(__dirname, 'src/components'),
                '@configs': path.resolve(__dirname, 'src/configs'),
                '@modules': path.resolve(__dirname, 'src/modules'),
                '@static': path.resolve(__dirname, 'static/'),
            },
            fallback: {
                "async_hooks": false,
                "path": require.resolve("path-browserify"),
                "zlib": require.resolve("browserify-zlib"),
                "querystring": require.resolve("querystring-es3"),
                "fs": false, // Можно использовать пустой модуль, так как fs не используется в браузере
                "stream": require.resolve("stream-browserify"),
                "assert": require.resolve('assert'),
                "util": require.resolve('util')
            }
        },
        output: {
            path: path.resolve(__dirname, 'dist/client'),
            filename: 'index_bundle.js',
            environment: {
                arrowFunction: false
            }
        },
        plugins: [
            new HtmlWebpackPlugin({template: './index.html'}),
            new CopyPlugin({
                patterns: [
                    {from: path.resolve(__dirname, 'src/sw.js'), to: ''},
                ],
            }),
        ]
    },
]
