const router = require("express").Router();

const {
  createItem,
  getItems,
  updateItem,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");

//CRUD

//Create
router.post("/", createItem);

//Read
router.get("/", getItems);

//Update
router.put("/:itemId", updateItem);

//Delete
router.delete("/:itemId", deleteItem);

//Like
router.put("/:itemId", likeItem);

//Dislike
router.delete("/:itemId", dislikeItem);

module.exports = router;
