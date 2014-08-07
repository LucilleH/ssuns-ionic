'use strict';

// Articles routes use itemtransactions controller
var committees = require('../controllers/committees');
var authorization = require('./middlewares/authorization');

module.exports = function(app) {

    app.get('/committees', authorization.requiresLogin, committees.all);
    app.get('/committees/:committeeId', authorization.requiresLogin, committees.show);
    app.put('/committees/:committeeId', authorization.requiresLogin, committees.update);
 
    // Finish with setting up the committeeId param
    app.param('committeeId', committees.committee);

};