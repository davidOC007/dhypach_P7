module.exports = (app) => {
  const users = require("../controllers/user");
  const auth = require("../middleware/auth");
  const max = require("../middleware/limit")
  const multer = require("../middleware/multer-config");

  const router = require("express").Router();

  router.post("/", users.signup);
  router.post("/login", max.limiter, users.login);
  router.get("/:id", auth, users.getOneUser);
  router.put("/:id", auth, multer, users.modifyUser);
  router.delete("/:id", auth, users.deleteUser);

  app.use("/api/users", router);
};
