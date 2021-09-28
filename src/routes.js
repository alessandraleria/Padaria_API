const express = require("express");

const User = require("./controllers/user");

const routes = express.Router();

routes.get("/users", User.index);
routes.post("/users/create", User.create);
routes.post("/users/login", User.auth);
routes.post("/users/redefinePassword", User.redefinePassword);
routes.get("/users/profile", User.profile);
routes.post("/users/edit", User.edit);

module.exports = routes;