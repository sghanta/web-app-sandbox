// Imports
const express = require("express");
const session = require("express-session");
const mustacheExpress = require("mustache-express");
const { ExpressOIDC } = require("@okta/oidc-middleware");
const path = require("path");
const config = require("./config.json");
const templateDir = path.join(__dirname, "views");

// ExpressOIDC object with Okta config
const oidc = new ExpressOIDC({
  issuer: config.oidc.issuer,
  client_id: config.oidc.clientId,
  client_secret: config.oidc.clientSecret,
  appBaseUrl: config.oidc.appBaseUrl,
  scope: config.oidc.scope,
  testing: config.oidc.testing,
});

//Basic setup
const app = express();
app.use(
  session({
    secret: "this-should-be-very-random",
    resave: true,
    saveUninitialized: false,
  })
);

// Hide full secret for display in server-config
const displayConfig = Object.assign({}, config.oidc, {
  clientSecret: "****" + config.oidc.clientSecret.substr(config.oidc.clientSecret.length - 4, 4),
});
app.locals.oidcConfig = displayConfig;

// Mustance page templates in ./views
app.engine("mustache", mustacheExpress());
app.set("view engine", "mustache");
app.set("views", templateDir);

// Use ExpressOIDC to handle routing
app.use(oidc.router);

app.get("/", (req, res) => {
  const template = "home";
  const userinfo = req.userContext && req.userContext.userinfo;
  res.render(template, {
    isLoggedIn: !!userinfo,
    userinfo: userinfo,
  });
});

// oidc.ensureAuthenticated() prevents a user from accessing the profile page if not logged in
app.get("/profile", oidc.ensureAuthenticated(), (req, res) => {
  const userinfo = req.userContext && req.userContext.userinfo;
  const attributes = Object.entries(userinfo);
  res.render("profile", {
    isLoggedIn: !!userinfo,
    userinfo: userinfo,
    attributes,
  });
});

oidc.on("ready", () => {
  app.listen(config.port, () => console.log(`App started on port ${config.port}`));
});

oidc.on("error", (err) => {
  console.error("OIDC ERROR: ", err);
});
