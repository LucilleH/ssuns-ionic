'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


/**
 * ItemTransaction Schema
 */

var ItemSchema = new Schema({
    name: {
        type: String,
        default: '',
        trim: true
    },
    description: {
        type: String,
        default: '',
        trim: true
    },
    value: Number,
    photo_url: String
});

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

var ItemTransactionSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    return_date: {
        type: Date
    },
    status: {
        type: String,
        default: 'unconfirmed'
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
    items: [ItemSchema]
});


/**
 * Statics
 */
ItemTransactionSchema.statics.load = function(id, cb) {
    this.findOne({
        _id: id
    })
    .populate('owner', 'name facebook')
    .populate('borrower', 'name facebook')
    .exec(cb);
};

mongoose.model('ItemTransaction', ItemTransactionSchema);
