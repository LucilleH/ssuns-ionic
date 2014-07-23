'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    BalanceTransaction = mongoose.model('BalanceTransaction'),
    _ = require('lodash');

/**
 * Find balancetransaction by id
 */
exports.balancetransaction = function(req, res, next, id) {
    BalanceTransaction.load(id, function(err, balancetransaction) {
        if (err) return next(err);
        if (!balancetransaction) return next(new Error('Failed to load balancetransaction ' + id));
        req.balancetransaction = balancetransaction;
        next();
    });
};

/**
 * Create an balancetransaction
 */
exports.create = function(req, res) {
    var balancetransaction = new BalanceTransaction(req.body);
    balancetransaction.owner = req.user;

    balancetransaction.save(function(err) {
        if (err) {
            return res.send('users/signup', {
                errors: err.errors,
                balancetransaction: balancetransaction
            });
        } else {
            res.jsonp(balancetransaction);
        }
    });
};

/**
 * Update an balancetransaction
 */
exports.update = function(req, res) {
    var balancetransaction = req.balancetransaction;

    // Only the owner can modify.
    if(req.user._id === req.balancetransaction.owner){

        balancetransaction = _.extend(balancetransaction, req.body);

        balancetransaction.save(function(err) {
            if (err) {
                return res.send('users/signup', {
                    errors: err.errors,
                    balancetransaction: balancetransaction
                });
            } else {
                res.jsonp(balancetransaction);
            }
        });

    } else {
        res.send(401);
    }
};

/**
 * Delete an balancetransaction
 */
exports.destroy = function(req, res) {
    var balancetransaction = req.balancetransaction;

    balancetransaction.remove(function(err) {
        if (err) {
            return res.send('users/signup', {
                errors: err.errors,
                balancetransaction: balancetransaction
            });
        } else {
            res.jsonp(balancetransaction);
        }
    });
};

/**
 * Show an balancetransaction
 */
exports.show = function(req, res) {
    res.jsonp(req.balancetransaction);
};

/**
 * List of BalanceTransactions between friends
 */
exports.all = function(req, res) {
    var user = req.user;
    var friendId = req.params.friendId;

    BalanceTransaction.find().or([{ borrower: req.user._id, owner: friendId}, { owner: req.user._id, borrower: friendId }])
    .sort('-created').populate('owner borrower', 'name username facebook.id')
    .exec(function(err, balancetransactions) {
        if (err) {
            res.render('error', {
                status: 500
            });
        } else {
            res.jsonp(balancetransactions);
        }
    });
};


