var path    = require('path');
var webpack = require('webpack');
var config  = {};

function generateConfig(name) {
    config     = {
        devtool: 'cheap-module-eval-source-map',
        entry: [
            'webpack-hot-middleware/client',
            './index'
        ],
        output: {
            path: path.join(__dirname, 'dist'),
            filename: 'om.sdk.' + name + '.js',
            publicPath: '/js',
            library: ['om', 'sdk', name],
            libraryTarget: "umd"
        },
        plugins: [
            new webpack.HotModuleReplacementPlugin(),
            new webpack.DefinePlugin({
                'process.env': {
                    CLIENT: JSON.stringify(true),
                    'NODE_ENV': JSON.stringify('development'),
                }
            }),
        ]
    };

    return config;
}

module.exports = generateConfig('ClientOauth2');
