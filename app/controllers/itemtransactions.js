'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    ItemTransaction = mongoose.model('ItemTransaction'),
    _ = require('lodash');

/**
 * Find itemtransaction by id
 */
exports.itemtransaction = function(req, res, next, id) {
    ItemTransaction.load(id, function(err, itemtransaction) {
        if (err) return next(err);
        if (!itemtransaction) return next(new Error('Failed to load itemtransaction ' + id));
        req.itemtransaction = itemtransaction;
        next();
    });
};

/**
 * Create an itemtransaction
 */
exports.create = function(req, res) {
    var itemtransaction = new ItemTransaction(req.body);
    itemtransaction.owner = req.user;

    itemtransaction.save(function(err) {
        if (err) {
            return res.send('users/signup', {
                errors: err.errors,
                itemtransaction: itemtransaction
            });
        } else {
            res.jsonp(itemtransaction);
        }
    });
};

/**
 * Update an itemtransaction
 */
exports.update = function(req, res) {
    var itemtransaction = req.itemtransaction;
    itemtransaction = _.extend(itemtransaction, req.body);

    itemtransaction.save(function(err) {
        if (err) {
            return res.send('users/signup', {
                errors: err.errors,
                itemtransaction: itemtransaction
            });
        } else {
            res.jsonp(itemtransaction);
        }
    });

};

/**
 * Delete an itemtransaction
 */
exports.destroy = function(req, res) {
    var itemtransaction = req.itemtransaction;

    itemtransaction.remove(function(err) {
        if (err) {
            return res.send('users/signup', {
                errors: err.errors,
                itemtransaction: itemtransaction
            });
        } else {
            res.jsonp(itemtransaction);
        }
    });
};

/**
 * Show an itemtransaction
 */
exports.show = function(req, res) {
    res.jsonp(req.itemtransaction);
};

/**
 * List of ItemTransactions between friends
 */
exports.all = function(req, res) {
    var user = req.user;
    var friendId = req.params.friendId;

    ItemTransaction.find().or([{ borrower: req.user._id, owner: friendId}, { owner: req.user._id, borrower: friendId }])
    .sort('-created').populate('owner borrower', 'name username facebook.id')
    .exec(function(err, itemtransactions) {
        if (err) {
            res.render('error', {
                status: 500
            });
        } else {
            res.jsonp(itemtransactions);
        }
    });
};


