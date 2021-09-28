const express = require("express");

const User = require("./controllers/user");
const Product = require("./controllers/product");

const routes = express.Router();

routes.get("/users", User.index);
routes.post("/users/create", User.create);
routes.post("/users/login", User.auth);
routes.post("/users/redefinePassword", User.redefinePassword);
routes.get("/users/profile", User.profile);
routes.post("/users/edit", User.edit);
routes.delete("/users/delete", User.delete);

routes.get("/products", Product.index);
routes.post("/products/create", Product.create);
routes.post("/products/edit", Product.edit);
routes.delete("/products/delete", Product.delete);

module.exports = routes;