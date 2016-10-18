var path    = require('path');
var webpack = require('webpack');
var config  = {};

function generateConfig(name) {
    var uglify = name.indexOf('min') > -1;
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

    if (uglify) {
        config.plugins.push(
            new webpack.optimize.UglifyJsPlugin({
                compressor: {
                    warnings: false
                }
            })
        );
    }

    return config;
}

config['ClientOauth2.min'] = generateConfig('ClientOauth2.min');

module.exports = config;
