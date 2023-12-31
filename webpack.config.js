const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const webpack  = require('webpack');

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
            exprContextCritical: false,
            rules: [
                {
                    test: /\.(gif|png)$/i,
                    type: 'asset/resource',
                    use: [
                        // {
                        //   loader: 'file-loader',
                        //   options: {
                        //     outputPath: '',
                        //   },
                        // },
                        {
                          loader: 'image-webpack-loader',
                          options: {
                            mozjpeg: {
                              progressive: true,
                              quality: 65,
                            },
                            optipng: {
                              enabled: false,
                            },
                            pngquant: {
                              quality: [0.65, 0.90],
                              speed: 4,
                            },
                            gifsicle: {
                              interlaced: false,
                            },
                            webp: {
                              quality: 75,
                            },
                          },
                        },
                    ],
                },
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
                    use: [
                    // MiniCssExtractPlugin.loader,
                    'style-loader',
                    'css-loader',
                    'postcss-loader',
                    'sass-loader'],
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
                "fs": false,
                "stream": require.resolve("stream-browserify"),
                "assert": require.resolve('assert'),
                "util": require.resolve('util'),
                "crypto": require.resolve("crypto-browserify"),
                "http": require.resolve("stream-http"),
                "url": require.resolve("url/"),
                "net": require.resolve("net-browserify"),
                "process": require.resolve("process/browser"),
                "timers": require.resolve("timers-browserify")
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
                    {from: path.resolve(__dirname, 'src/firebase-messaging-sw.js'), to: ''},
                ],
            }),
            new webpack.ProvidePlugin({
                process: 'process/browser',
            }),
            new MiniCssExtractPlugin({
                filename: 'styles.css',
            }),
        ],
        optimization: {
            minimizer: [
              new TerserPlugin({
                parallel: true,
                terserOptions: {
                  ecma: 6,
                },
              }),
            ],
          },
    },
]
