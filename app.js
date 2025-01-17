﻿var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//holaaaa
//Renderizar el layout.ejs y completar las vistas.
var partials = require('express-partials');

// Para editar las preguntas
var methodOverride = require('method-override');

// Para autenticación de usuarios
var session = require('express-session');


var routes = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Usar el express-partials
app.use(partials());

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser('Quiz-2015'));
app.use(session());

// Para editar las preguntas
app.use(methodOverride('_method'));

app.use(express.static(path.join(__dirname, 'public')));

// Helpers dinámicos
app.use(
      function(req, res, next) {

      // guardar path en session.redir para despues de login
      if (!req.path.match(/\/login|\/logout/)) {
        req.session.redir = req.path;
      }

      // Hacer visible req.session en las vistas
      res.locals.session = req.session;

      // Desconectar auto-logout de sesion si permanece inactivo mas de dos minutos
      if (req.session.instanteInicioSesion) {
        var tiempoActual= new Date().getTime();
        var tiempoPasado= tiempoActual - req.session.instanteInicioSesion;

        console.log ("tiempoActual: " + tiempoActual);
        console.log("req.session.instanteInicioSesion: " + req.session.instanteInicioSesion);
        console.log("timepoPasado: " + tiempoPasado);
        console.log ("autoLogout: " + req.session.autoLogout);

        if (tiempoPasado > (2 * 60 * 1000)) {
          delete req.session.instanteInicioSesion;
          req.session.autoLogout = true;
          console.log ("autoLogout: " + req.session.autoLogout);
          res.redirect("/logout");
        }
        else {
          req.session.instanteInicioSesion = tiempoActual;
        }
      }
      next();
    }
  );


app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err,
            errors: []
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
        errors: []
    });
});

module.exports = app;