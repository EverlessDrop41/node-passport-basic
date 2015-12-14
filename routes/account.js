var passport = require('passport');
var Account = require('../models/account');

module.exports = function(app) {
	app.get('/register', function(req, res) {
    res.render('register.nunjucks', { });
	});

	app.post('/register', function(req, res) {
		console.log(req.body);
		console.log(req.body.username);
		console.log(req.body.password);
    Account.register(new Account({ username : req.body.username }), req.body.password, function(err, account) {
	      if (err) {
	        return res.render('error.nunjucks', { account : account, error: err });
	      }

	      passport.authenticate('local', function(err, user, info) {
	      	if (err) { return res.render('error.nunjucks', {error: err, user: req.user}); }
			    if (!user) { return res.render('error.nunjucks', {error: "Error registerring and logging in", user: req.user}); }
			    req.logIn(user, function(err) {
			      if (err) { return res.render('error.nunjucks', {error: err, user: req.user}); }
			      return res.redirect('/');
			    });
	      })(req, res, function () {
	        res.redirect('/');
	      });
	    });
	});

	app.get('/login', function(req, res) {
	  res.render('login.nunjucks', { user : req.user });
	});

	app.post('/login', function(req, res) {
	  passport.authenticate('local', function (err, user, info) {
			if (err) { return res.render('error.nunjucks', {error: err, user: req.user}); }
	    if (!user) { return res.render('error.nunjucks', {error: "Error loging in", user: req.user}); }
	    req.logIn(user, function(err) {
	      if (err) { return res.render('error.nunjucks', {error: err, user: req.user}); }
	      return res.redirect('/');
	    });
		})(req, res);
	});

	app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
	});

	app.get('/ping', function(req, res){
	  res.status(200).send("pong!");
	});
};