'use strict';

module.exports = {
    db: 'mongodb://localhost/borrowed-dev',
    app: {
        name: 'SSUNS'
    },
    facebook: {
        clientID: '152340601610394',
        clientSecret: '1e9a0112d44a4d8a4f6d4e4fc5fdf7b8',
        callbackURL: 'http://localhost:3000/auth/facebook/callback'
    }
};
