const router = require("express").Router();
const { getCurrentUser, updateProfile } = require("../controllers/users");
const auth = require("../middlewares/auth");

router.get("/me", auth.handleAutError, getCurrentUser);
router.patch("/me", auth.handleAutError, updateProfile);

module.exports = router;
