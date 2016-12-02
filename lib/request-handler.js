var request = require('request');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var util = require('../lib/utility');

var db = require('../app/config');
var User = require('../app/models/user');
var Link = require('../app/models/link');
// var Users = require('../app/collections/users');
// var Links = require('../app/collections/links');

exports.renderIndex = function(req, res) {
  res.render('index');
};

exports.signupUserForm = function(req, res) {
  res.render('signup');
};

exports.loginUserForm = function(req, res) {
  res.render('login');
};

exports.logoutUser = function(req, res) {
  req.session.destroy(function() {
    res.redirect('/login');
  });
};

exports.fetchLinks = function(req, res) {
  Links.reset().fetch().then(function(links) {
    res.status(200).send(links.models);
  });
};

exports.saveLink = function(req, res) {
  var uri = req.body.url;

  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.sendStatus(404);
  }



  // Link.findOne({url: uri}).exec(function(err, exists) {
  //   if (exists) {
  //     console.log('Link already saved');
  //     res.status(200).send(exists);
  //   } else {
  //     util.getUrlTitle(uri, function(err, title) {
  //       var newLink = new Link ({
  //         url: uri,
  //         title: title, 
  //         baseUrl: req.headers.origin,
  //         visits: 0
  //       });
  //       newLink.save(function (err, newLink) {
  //         if (err) {
  //           res.status(500).send(err);
  //         } else {
  //           res.status(200).send(newLink);
  //         }
  //       });
  //     });
  //   }
  // });


  // var checkLink = Link.findOne({
  //   url: uri
  // });
  
  Link.findOne({ url: uri} ).then(function(exists) {
    if (exists) {
      console.log('Link already saved');
      res.status(200).send(exists);
    } else {
      util.getUrlTitle(uri, function(err, title) {
        var newLink = Link ({
          url: uri,
          title: title, 
          baseUrl: req.headers.origin,
          visits: 0
        });
        newLink.save()
        .then(res.status(200).send(newLink));
        // res.send(200, newLink);
      });
    }
  });


  // new Link({ url: uri }).fetch().then(function(found) {
  //   if (found) {
  //     res.status(200).send(found.attributes);
  //   } else {
  //     util.getUrlTitle(uri, function(err, title) {
  //       if (err) {
  //         console.log('Error reading URL heading: ', err);
  //         return res.sendStatus(404);
  //       }
  //       var newLink = new Link({
  //         url: uri,
  //         title: title,
  //         baseUrl: req.headers.origin
  //       });
  //       newLink.save().then(function(newLink) {
  //         Links.add(newLink);
  //         res.status(200).send(newLink);
  //       });
  //     });
  //   }
  // });
};

exports.loginUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  var loginUser = User({ 
    username: username,
    password: password
  });

  var checkUserAndPassword = User.findOne({ username: username, password: password });
  checkUserAndPassword.then(function(exists) {
    if (exists) {
      console.log('Successful log in');

      util.createSession(req, res, username);
      
      res.status(302).redirect('/');
    } else {
      console.log('Unsuccessful log in');
      res.status(302).redirect('/login');
    }
    // .fetch()
    // .then(function(user) {
    //   if (!user) {
    //     res.redirect('/login');
    //   } else {
    //     user.comparePassword(password, function(match) {
    //       if (match) {
    //         util.createSession(req, res, user);
    //       } else {
    //         res.redirect('/login');
    //       }
    //     });
      
  });
};

exports.signupUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  var newUser = User({
    username: username,
    password: password
  });

  var checkUserExists = User.findOne({ username: username });
  checkUserExists.then(function(exists) {
    if (exists) {
      console.log('Account already exists');
      res.redirect('/signup');
    } else {
      newUser.save()
        .then(function() {
          console.log('newSession created: ', username);
          util.createSession(req, res, username);
        });
    }
  });
};


  // new User({ username: username })
  //   .fetch()
  //   .then(function(user) {
  //     if (!user) {
  //       var newUser = new User({
  //         username: username,
  //         password: password
  //       });
  //       newUser.save()
  //         .then(function(newUser) {
  //           Users.add(newUser);
  //           util.createSession(req, res, newUser);
  //         });
  //     } else {
  //       console.log('Account already exists');
  //       res.redirect('/signup');
  //     }
  //   });



// REFACTOR

exports.navToLink = function(req, res) {
  Link.findOne({ code: req.params[0]}).exec(function(err, exists) {
    if (!exists) {
      res.redirect('/');
    } else {
      Link.save({ visits: this.visits + 1}).then(function() {
        return res.redirect(this.url);
      });
    }
  });


// exports.navToLink = function(req, res) {
//   new Link({ code: req.params[0] }).fetch().then(function(link) {
//     if (!link) {
//       res.redirect('/');
//     } else {
//       link.set({ visits: link.get('visits') + 1 })
//         .save()
//         .then(function() {
//           return res.redirect(link.get('url'));
//         });
//     }
//   });
};