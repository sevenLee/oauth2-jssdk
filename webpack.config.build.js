var path    = require('path');
var webpack = require('webpack');
var config  = {};

function generateConfig(name) {
    config     = {
        devtool: 'source-map',
        entry: [
            './index'
        ],
        output: {
            path: path.join(__dirname, 'dist'),
            filename: 'om.sdk.' + name + '.js',
            library: ['om', 'sdk', name],
            libraryTarget: "umd"
        },
        plugins: [
            new webpack.DefinePlugin({
                'process.env': {
                    'NODE_ENV': JSON.stringify('production')
                }
            })
        ]
    };

    return config;
}

config['ClientOauth2'] = generateConfig('ClientOauth2');

module.exports = config;
