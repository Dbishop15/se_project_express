const router = require("express").Router();

const { getCurrentUser, updateProfile } = require("../controllers/users");
const { validateUpdateUserProfile } = require("../middlewares/validation");
const auth = require("../middlewares/auth");

router.get("/me", auth.handleAutError, getCurrentUser);
router.patch(
  "/me",
  auth.handleAutError,
  validateUpdateUserProfile,
  updateProfile
);

module.exports = router;
