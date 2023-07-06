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

router.post("/", auth.handleAutError, createItem);
router.get("/", getItems);
router.put("/:itemId", updateItem);
router.delete("/:itemId", auth.handleAutError, deleteItem);
router.put("/:itemId/likes", auth.handleAutError, likeItem);
router.delete("/:itemId/likes", auth.handleAutError, dislikeItem);

module.exports = router;
