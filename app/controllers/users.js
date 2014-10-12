'use strict';

/**
 * Module dependencies.
 */
 var mongoose = require('mongoose'),
 User = mongoose.model('User'),
 _ = require('lodash');

/**
 * Auth callback
 */
 exports.authCallback = function(req, res) {
    res.redirect('#/menu');
};

/**
 * Show login form
 */
 exports.signin = function(req, res) {
    res.render('users/signin', {
        title: 'Signin',
        message: req.flash('error')
    });
};

/**
 * Show sign up form
 */
 exports.signup = function(req, res) {
    res.render('users/signup', {
        title: 'Sign up',
        user: new User()
    });
};

/**
 * Logout
 */
 exports.signout = function(req, res) {
    req.logout();
    res.redirect('/');
};

/**
 * Session
 */
 exports.session = function(req, res) {
    res.redirect('#/friends');
};

/**
 * Create user
 */
 exports.create = function(req, res, next) {
    var user = new User(req.body);
    var message = null;

    user.provider = 'local';
    user.save(function(err) {
        if (err) {
            switch (err.code) {
                case 11000:
                case 11001:
                message = 'Username already exists';
                break;
                default:
                message = 'Please fill all the required fields';
            }

            return res.render('users/signup', {
                message: message,
                user: user
            });
        }
        req.logIn(user, function(err) {
            if (err) return next(err);
            return res.redirect('/friends');
        });
    });
};

/**
 * Send User
 */
exports.me = function(req, res) {
    res.jsonp(req.user || null);
};

exports.addAssign = function (req, res){
    var user = req.user;
    if(req.body.committee._id)
        user = _.extend(user, {"committee":req.body.committee._id});
    if(req.body.position)
        user = _.extend(user, {"position": req.body.position});
    user.save(function(err) {
        if (err) {
            res.send(401);
            return;
        } else {
            res.jsonp(user);
        }
    });
}


exports.allUsers = function (req, res){
    User.find().select('name email facebook.id facebook.education friends')
        .exec(function(err, users) {
        if (err) {
            res.render('error', {
                status: 500
            });
        } else {
            res.jsonp(users);
        }
    });
}


exports.addFriend = function (req, res){
    var user = req.user,
    friend = req.body;

    User.findOne({_id: friend._id})
        .exec(function(err, f){
            if (err){
                res.send(401);
                return;
            } else if (!f){
                res.send(401);
                return;
            } else {
                user.friends = user.friends || [];
                
                if (_.indexOf(_.map(user.friends, function(n){return n.toString();}), friend._id) === -1){
                    user.friends.push(friend._id);

                    user.save(function(err) {
                        if (err) {
                            res.send(401, {
                                errors: err.errors,
                                user: user
                            });
                        } else {
                            res.jsonp(user);
                        }
                    });

                } else {
                    res.send(401, {errors: 'Friend already exists', user: user});
                }
            }
    });
}

exports.listFriends = function(req, res){
    var user = req.user;

    User.findOne({_id: user._id})
        .populate('friends')
        .exec(function(err, user){
            if (err){
                res.send(401);
                return;
            } else if (!user){
                res.send(401);
                return;
            } else {
                res.jsonp(user.friends);
            }
        })
}

exports.show = function(req, res) {
    User.findOne({_id: req.params.uId})
    .exec(function(err, user){
        if (err){
            res.send(401);
            return;
        } else if (!user){
            res.send(401);
            return;
        } else {
            res.jsonp(user);
        }
    });
}

exports.committee = function(req, res) {
    User.find({'committee': req.params.commId, 'roles': {$ne: 'secretariat'}}).select('name email facebook.id facebook.education friends committee position')
        .exec(function(err, users) {
        if (err) {
            res.send(401);
            return;
        } else {
            res.jsonp(users);
        }
    });
}

exports.roles = function(req, res) {
    User.find({'roles': req.params.role}).select('name email facebook.id facebook.education friends committee position').sort('position')
        .exec(function(err, users) {
        if (err) {
            res.render('error', {
                status: 500
            });
        } else {
            res.jsonp(users);
        }
    });
}

/**
 * Find user by id
 */
 exports.user = function(req, res, next, id) {
    User
    .findOne({
        _id: id
    })
    .populate('friends')
    .exec(function(err, user) {
        if (err) return next(err);
        if (!user) return next(new Error('Failed to load User ' + id));
        req.profile = user;
        next();
    });
};
