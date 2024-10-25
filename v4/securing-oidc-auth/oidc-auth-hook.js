/**
 * OIDC hook for securing an Unleash server
 *
 * The implementation assumes the following environment variables:
 *
 *  - AUTH_APP_ID
 *  - AUTH_APP_SECRET
 *  - AUTH_HOST
 */
require("dotenv").config();
const OpenIDConnectStrategy = require("passport-openidconnect");
const passport = require("passport");

const { AuthenticationRequired } = require("unleash-server");

const appId = process.env.AUTH_APP_ID;
const appSecret = process.env.AUTH_APP_SECRET;
const endpoint = process.env.AUTH_HOST;
const contextPath = process.env.CONTEXT_PATH || "";

function enableOidcOauth(app, config, services) {
  const { baseUriPath } = config.server;
  const { userService } = services;

  passport.use(
    "oidc",
    new OpenIDConnectStrategy(
      {
        issuer: `${endpoint}/oidc`,
        authorizationURL: `${endpoint}/oidc/auth`,
        tokenURL: `${endpoint}/oidc/token`,
        userInfoURL: `${endpoint}/oidc/me`,
        callbackURL: `${contextPath}/api/auth/callback`,
        clientID: appId,
        clientSecret: appSecret,
        scope: ["profile", "offline_access", "email"],
      },
      async (_issuer, profile, callback) => {
        const user = await userService.loginUserWithoutPassword(
          profile?.emails?.[0]?.value,
          true,
        );
        callback(null, user);
      },
    ),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser((user, done) => done(null, user));
  passport.deserializeUser((user, done) => done(null, user));

  app.get("/api/admin/login", passport.authenticate("oidc"));

  app.get("/api/auth/callback", passport.authenticate("oidc"), (_req, res) => {
    res.redirect(`${contextPath}/`);
  });

  app.use("/api", (req, res, next) => {
    if (req.user) {
      return next();
    }
    // Instruct unleash-frontend to pop-up auth dialog
    return res
      .status(401)
      .json(
        new AuthenticationRequired({
          path: `${contextPath}/api/admin/login`,
          type: "custom",
          message: `You have to identify yourself in order to use Unleash. 
                        Click the button and follow the instructions.`,
        }),
      )
      .end();
  });
}

module.exports = enableOidcOauth;
