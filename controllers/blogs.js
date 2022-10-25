const cloudinary = require("../middleware/cloudinary");
const Blog = require("../models/Blog");

module.exports = {

  getBlog: async (req, res) => {
    try {
      //! Changed sort order to desc because it makes more sense
      const blogs = await Blog.find().sort({ createdAt: "desc" }).lean();

      res.render("blog-feed.ejs", { blogs: blogs, user: req.user.id });
    } catch (err) {
      console.log(err);
    }
  },
  getSingleBlog: async (req, res) => {
    try {
      const blog = await Blog.findById(req.params.id);
  
      res.render("blog.ejs", { blog: blog, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  createBlog: async (req, res) => {
    try {
      // Upload image to cloudinary
      const Blogresult = await cloudinary.uploader.upload(req.file.path);
     
      await Blog.create({
        title: req.body.title,
        image: Blogresult.secure_url,
        cloudinaryId: Blogresult.public_id,
        author: req.body.author,
        message: req.body.message,
        date: req.body.date,
        user: req.user.id,
      });
      console.log("Blog has been added!");
      res.redirect("/blog");
    } catch (err) {
      console.log(err);
    }
  },
 
 
  deleteBlog: async (req, res) => {
    try {
      // Find post by id
      let post = await Blog.findById({ _id: req.params.id});
      // Delete image from cloudinary
      await cloudinary.uploader.destroy(post.image);
      // Delete post from db
      await Blog.remove({ _id: req.params.id });
      console.log("Deleted Post");
      res.redirect("/blog");
    } catch (err) {
      console.log(err)
    }
  },
};
