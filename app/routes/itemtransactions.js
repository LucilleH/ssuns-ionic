'use strict';

// Articles routes use itemtransactions controller
var itemtransactions = require('../controllers/itemtransactions');
var authorization = require('./middlewares/authorization');

// Article authorization helpers
var hasAuthorization = function(req, res, next) {
    if (req.itemtransaction.borrower._id == req.user.id.toString() || req.itemtransaction.owner._id == req.user.id.toString()) {
        next();
    } else {
        return res.send(401, 'User is not authorized');
    }
};

module.exports = function(app) {

    app.get('/friends/:friendId/itemtransactions', authorization.requiresLogin, itemtransactions.all);
    app.post('/itemtransactions', authorization.requiresLogin, itemtransactions.create);
    app.get('/itemtransactions/:itemtransactionId', authorization.requiresLogin, itemtransactions.show);
    app.put('/itemtransactions/:itemtransactionId', authorization.requiresLogin, hasAuthorization, itemtransactions.update);
    app.del('/itemtransactions/:itemtransactionId', authorization.requiresLogin, hasAuthorization, itemtransactions.destroy);

    // Finish with setting up the itemtransactionId param
    app.param('itemtransactionId', itemtransactions.itemtransaction);

};