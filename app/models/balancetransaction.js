'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var MessageSchema = new Schema({
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    content: {
        type: String,
        trim: true
    },
    created: {
        type: Date,
        default: Date.now
    }
});

/**
 * BalanceTransaction Schema
 */
var BalanceTransactionSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    owner: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    borrower: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    messages: [MessageSchema],
    amount: Number
});

BalanceTransactionSchema.path('amount').validate(function(amount) {
    // If you are authenticating by any of the oauth strategies, don't validate.
    if (!this.provider) return true;
    return (amount > 0);
}, 'Amount should be greater than 0');


/**
 * Statics
 */
BalanceTransactionSchema.statics.load = function(id, cb) {
    this.findOne({
        _id: id
    })
    .populate('owner', 'name facebook')
    .populate('borrower', 'name facebook')
    .populate('messages.message')
    .exec(cb);
};

mongoose.model('BalanceTransaction', BalanceTransactionSchema);
