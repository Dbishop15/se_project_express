const router = require("express").Router();

const clothingItem = require("./clothingItems");

const user = require("./users");

const { NOTFOUND_ERROR } = require("../utils/errors");

const { login, createUser } = require("../controllers/users");

const auth = require("../middlewares/auth");

router.post("/signup", createUser);
router.post("/signin", login);
router.use("/users", auth.handleAutError, user);
router.use("/items", clothingItem);

router.use((req, res) => {
  res
    .status(NOTFOUND_ERROR.error)
    .send({ message: "Resource request not found" });
});

module.exports = router;
