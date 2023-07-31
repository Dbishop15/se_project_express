const router = require("express").Router();

const auth = require("../middlewares/auth");

const {
  createItem,
  getItems,
  updateItem,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");

const {
  validateItemBody,
  validateItemId,
} = require("../middlewares/validation");

router.post("/", auth.handleAutError, validateItemBody, createItem);
router.get("/", getItems);
router.put("/:itemId", validateItemId, updateItem);
router.delete("/:itemId", auth.handleAutError, validateItemId, deleteItem);
router.put("/:itemId/likes", auth.handleAutError, validateItemId, likeItem);
router.delete(
  "/:itemId/likes",
  auth.handleAutError,
  validateItemId,
  dislikeItem
);

module.exports = router;
