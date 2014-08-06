'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Committee = mongoose.model('Committee'),
    _ = require('lodash');

/**
 * Find Committee by id
 */
exports.committee = function(req, res, next, id) {
    Committee.load(id, function(err, Committee) {
        if (err) return next(err);
        if (!Committee) return next(new Error('Failed to load Committee ' + id));
        req.Committee = Committee;
        next();
    });
};

/**
 * Create an Committee
 
exports.create = function(req, res) {
    var Committee = new Committee(req.body);
    Committee.owner = req.user;

    Committee.save(function(err) {
        if (err) {
            return res.send('users/signup', {
                errors: err.errors,
                Committee: Committee
            });
        } else {
            res.jsonp(Committee);
        }
    });
};
*/

/**
 * Update an Committee
 */
exports.update = function(req, res) {
    var committee = req.Committee;
    committee = _.extend(committee, req.body);
    console.log(committee);
    committee.save(function(err) {
        if (err) {
            res.send(401);
            return;
        } else {
            res.jsonp(committee);
        }
    });

};

/**
 * Delete an Committee
 
exports.destroy = function(req, res) {
    var Committee = req.Committee;

    Committee.remove(function(err) {
        if (err) {
            return res.send('users/signup', {
                errors: err.errors,
                Committee: Committee
            });
        } else {
            res.jsonp(Committee);
        }
    });
};
*/

/**
 * Show an Committee
 */
exports.show = function(req, res) {
    Committee.findOne({_id : req.Committee._id})
    .populate('messages.user', 'position')
    .exec(function(err, Committees) {
        if (err) {
            res.send(401);
            return;
        } else {
            res.jsonp(Committees);
        }
    });
};

/**
 * get user's Committee
 *
exports.all = function(req, res) {
    var user = req.user;

    Committee.find({ positions.user : req.user._id })
    .populate('positions.position')
    .populate('positions.user', 'name username facebook.id')
    .exec(function(err, Committees) {
        if (err) {
            res.render('error', {
                status: 500
            });
        } else {
            res.jsonp(Committees);
        }
    });
};

*/

exports.all = function(req, res) {
    Committee.find()
    .populate('positions.position')
    .populate('positions.user', 'name username facebook.id')
    .exec(function(err, Committees) {
        if (err) {
            res.send(401);
            return;
        } else {
            res.jsonp(Committees);
        }
    });
};
