'use strict';

module.exports = {
    db: 'mongodb://localhost/mean-test',
    port: 3001,
    app: {
        name: 'MEAN - A Modern Stack - Test'
    },
    facebook: {
        clientID: '817587064937801',
        clientSecret: '90ccd8e6fec3ac1452c1ba6c83cd66a8',
        callbackURL: 'http://localhost:3000/auth/facebook/callback'
    }
};
