'use strict'

var User 		 = require('mongoose').model('User'),
    path     = require('path'),
		passport = require('passport');

exports.render = function(req, res, next) {
  if (req.user) {
    // Use the 'response' object to render the signin page
    User.populate(req.user, {path: 'clients'}, function(err, user) {
      if(user) {
        res.render(path.resolve('app/index'), {
          user: JSON.stringify(user)
        });
      }
      else {
        res.render('landing', {
    			// Set the page title variable
    			title: 'Fitpath',
    			// Set the flash message variable
    			messages: req.flash('There was an error loading clients')
    		});
      }
    });


  } else {
    //req.session.returnTo = req.path;
		return res.redirect('/signin');
	}
}
