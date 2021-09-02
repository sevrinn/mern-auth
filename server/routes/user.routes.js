const UserController = require("../controllers/user.controller");

module.exprots = (app) => {
  app.post("/api/register", UserController.register);
};
