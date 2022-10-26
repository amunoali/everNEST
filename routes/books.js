const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const booksController = require("../controllers/books");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

//Post Routes - simplified for now
router.get("/:id", ensureAuth, booksController.getBook);

// router.get("/favoriteBook", ensureAuth, booksController.getQuotes);

router.post("/createBook", upload.single("file"), booksController.createBook);

router.put("/likeBook/:id", booksController.likeBook);

router.put("/favoriteBook/:id", booksController.favoriteBook);

router.delete("/deleteBook/:id", booksController.deleteBook);

module.exports = router;
