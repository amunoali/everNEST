const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const blogController = require("../controllers/blogs");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

//Blog Routes - simplified for now
router.get("/", ensureAuth, blogController.getBlog);
router.get("/:id", ensureAuth, blogController.getSingleBlog);

router.post("/createBlog", upload.single("file"), blogController.createBlog);

router.delete("/deleteBlog/:id", blogController.deleteBlog);

module.exports = router;
