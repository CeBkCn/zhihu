var path = require('path');
var nib = require('nib');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin')

var isStatis = !!(process.argv[2] == 'statis');
var plugins = [
    new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor', 
        filename: 'vendor.js'
    }),
    new ExtractTextPlugin({
      filename: "[name].css"
    }),
    new webpack.HotModuleReplacementPlugin()
]
if(isStatis) {
    plugins.push(new webpack.optimize.DedupePlugin())
    plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            compress: {
              warnings: false
            },
            output: {
                comments: false
            },
            except: ['$super', '$', 'exports', 'require']
        })
    )
}
module.exports = {
    cache: true,
    entry: {
        // app: ['webpack/hot/dev-server', path.join(__dirname, '../src/statis-month.js')],
        month: path.join(__dirname, '../src/statis-month.js'),
        year: path.join(__dirname, '../src/statis-year.js')
    },
    output: {
        path: path.join(__dirname, '../public/statis'),
        publicPath: 'statis',
        filename: '[name].bundle.js',
        chunkFilename: '[id].chunk.js'
    },
    clearBeforeBuild: true,
    module: {
        loaders: [
            {
                test: /\.styl$/,
                loader: ExtractTextPlugin.extract({ fallbackLoader: 'style-loader', loader: 'css-loader!stylus-loader' })
            },
            {
                test: /\.js$/,
                loader: "babel-loader",
                exclude: /node_modules/
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url',
                query: {
                    limit: 1,
                    name: '[name].[ext]'
                }
            },
            {
                test: /\.css$/,
                loader: "style-loader!css-loader"
            },
        ]
    },
    stylus: {
        use: [nib()],
        import: ['~nib/lib/nib/index.styl'],
        "include css": true
    },
    babel: {
        presets: ['es2015'],
        plugins: ['transform-runtime']
    },
    resolve: {
        extensions: ['', '.js'],
        fallback: [path.join(__dirname, './node_modules')],
        alias: {
          // 'src': path.resolve(__dirname, './src'),
          // 'components': path.resolve(__dirname, './src/c/components')
        }
    },
    resolveLoader: {
        fallback: [path.join(__dirname, '../node_modules')]
    },
    plugins: plugins
};