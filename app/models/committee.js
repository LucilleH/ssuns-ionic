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


var CommitteeSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    positions: [String],
    messages: [MessageSchema]
});



CommitteeSchema.statics.load = function(id, cb) {
    this.findOne({
        _id: id
    })
    .exec(cb);
};

mongoose.model('Committee', CommitteeSchema);
