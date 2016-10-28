var webpack              = require('webpack');
var webpackDevMiddleware = require('webpack-dev-middleware');
var webpackHotMiddleware = require('webpack-hot-middleware');
var config               = require('./webpack.config');
var Express = require('express');
var app  = new (Express)();
var port = 8080;
var compiler = webpack(config);

if (process.env.NODE_ENV !== 'production') {
    console.log('Development ENV');

    app.use(webpackDevMiddleware(compiler, {
        noInfo: true,
        publicPath: config.output.publicPath
    }));
    app.use(webpackHotMiddleware(compiler));
} else {
    console.log('PRODUCTION ENV');
    app.use('/js', Express.static(__dirname + '/dist'));
}

app.get("/", function (req, res) {
    res.sendFile(__dirname + '/example/index.html')
});

app.get("/authorize", function (req, res) {
    res.sendFile(__dirname + '/example/oauthAuth.html')
});

app.get("/redirect", function (req, res) {
    res.sendFile(__dirname + '/example/oauthRedirect.html')
});

app.listen(port, function (error) {
    if (error) {
        console.error(error)
    } else {
        console.info("Express server listening on %s", port)
    }
});
