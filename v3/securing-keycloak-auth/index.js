'use strict';

// const unleash = require('unleash-server');
const unleash = require('../dist/lib/server-impl.js');

const enableKeycloak = require('./keycloak-auth-hook');

unleash.start({
    databaseUrl: 'postgres://unleash_user:passord@localhost:5432/unleash',
    adminAuthentication: 'custom',
    preRouterHook: enableKeycloak,
})
