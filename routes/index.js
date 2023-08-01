const router = require("express").Router();

const clothingItem = require("./clothingItems");

const user = require("./users");

const NotFoundError = require("../errors/NotFoundError");

const { login, createUser } = require("../controllers/users");

const {
  validateUserBody,
  validateUserLogIn,
} = require("../middlewares/validation");

router.post("/signup", validateUserBody, createUser);
router.post("/signin", validateUserLogIn, login);

router.use("/users", user);
router.use("/items", clothingItem);

router.use((req, res, next) => {
  next(new NotFoundError("Requested resource not found."));
});

module.exports = router;
