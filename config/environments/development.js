var express = require('express'),
	path = require('path');

function perimitirCrossDomain(req, res, next) {
  //en vez de * se puede definir SÓLO los orígenes que permitimos
  res.header('Access-Control-Allow-Origin', '*'); 
  //metodos http permitidos para CORS
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE'); 
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
}

module.exports = function (app) {
	app.configure('development', function () {
		app.use(function staticsPlacehoder(req, res, next){
			return next();
		});

		app.set('port', process.env.PORT || 9000);
		app.engine('html', require('ejs').renderFile);
		app.set('view engine', 'html');
		app.use(express.favicon());
		app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser('your secret here'));
    app.use(express.session());
    app.set("jsonp callback", true);
    app.use(perimitirCrossDomain);

    app.use(function middlewarePlaceholder(req, res, next) {
       return next();
    });

    app.use(app.router);
    app.use(express.errorHandler());

	});
};