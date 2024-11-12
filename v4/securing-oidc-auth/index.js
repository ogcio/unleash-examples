const unleash = require("unleash-server");
const oidcAuthHook = require("./oidc-auth-hook");

const { POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_HOST, POSTGRES_PORT, UNLEASH_BASE_URI, NODE_ENV } = process.env;

unleash.start({
  db: {
    user:  POSTGRES_USER ?? "unleash",
    password: POSTGRES_PASSWORD ?? "unleash",
    host: POSTGRES_HOST ?? "localhost",
    port: Number(POSTGRES_PORT ?? 5432),
    database: "unleash",
    ssl: NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  },
  authentication: {
    type: "custom",
    customAuthHandler: oidcAuthHook,
  },
  server: {
    enableRequestLogger: true,
    baseUriPath: UNLEASH_BASE_URI,
  },
  logLevel: "info",
});
