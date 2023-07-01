const router = require("express").Router();

const clothingItem = require("./clothingItems");

const user = require("./users");

const { NOTFOUND_ERROR } = require("../utils/errors");

router.use("/items", clothingItem);
router.use("/users", user);

router.use((req, res) => {
  res
    .status(NOTFOUND_ERROR.error)
    .send({ message: "Resource request not found" });
});

module.exports = router;