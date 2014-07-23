'use strict';

// Articles routes use balancetransactions controller
var balancetransactions = require('../controllers/balancetransactions');
var authorization = require('./middlewares/authorization');

// Article authorization helpers
var hasAuthorization = function(req, res, next) {
    if (req.article.user.id !== req.user.id) {
        return res.send(401, 'User is not authorized');
    }
    next();
};

module.exports = function(app) {

    app.get('/friends/:friendId/balancetransactions', authorization.requiresLogin, balancetransactions.all);
    app.post('/balancetransactions', authorization.requiresLogin, balancetransactions.create);
    app.get('/balancetransactions/:balancetransactionId', authorization.requiresLogin, balancetransactions.show);
    app.put('/balancetransactions/:balancetransactionId', authorization.requiresLogin, hasAuthorization, balancetransactions.update);
    app.del('/balancetransactions/:balancetransactionId', authorization.requiresLogin, hasAuthorization, balancetransactions.destroy);

    // Finish with setting up the balancetransactionId param
    app.param('balancetransactionId', balancetransactions.balancetransaction);

};