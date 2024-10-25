const unleash = require("unleash-server");
const oidcAuthHook = require("./oidc-auth-hook");

unleash.start({
  db: {
    user: "unleash",
    password: "unleash",
    host: "localhost",
    port: 5432,
    database: "unleash",
    ssl: false,
  },
  authentication: {
    type: "custom",
    customAuthHandler: oidcAuthHook,
  },
  server: {
    enableRequestLogger: true,
    baseUriPath: "",
  },
  logLevel: "info",
});
