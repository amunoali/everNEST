const cloudinary = require("../middleware/cloudinary");
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const Blog = require("../models/Blog");

module.exports = {
  getProfile: async (req, res) => {
    try {
      const posts = await Post.find({ user: req.user.id });
      res.render("profile.ejs", { posts: posts, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  getCreate: async (req, res) => {
    try {
      const blogs = await Blog.find({ user: req.user.id });
      res.render("blog-add.ejs", { blogs: blogs, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  getFeed: async (req, res) => {
    try {
      //! Changed sort order to desc because it makes more sense
      const posts = await Post.find().sort({ createdAt: "desc" }).lean();
      res.render("feed.ejs", { posts: posts, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },

  getFavorites: async (req, res) => {
    try {
      const posts = await Post.find({ user: req.user.id });
      res.render("favorites.ejs", { posts: posts, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  
  getPost: async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      const comments = await Comment.find({post: req.params.id}).sort({ createdAt: "asc" }).lean();
      res.render("post.ejs", { post: post, user: req.user, comments: comments });
    } catch (err) {
      console.log(err);
    }
  },
  createPost: async (req, res) => {
    try {
      // Upload image to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);

      await Post.create({
        title: req.body.title,
        image: result.secure_url,
        cloudinaryId: result.public_id,
        author: req.body.author,
        summary: req.body.summary,
        purchase: req.body.purchase,
        pdf: req.body.pdf,
        likes: 0,
        user: req.user.id,
      });
      console.log("Post has been added!");
      res.redirect("/profile");
    } catch (err) {
      console.log(err);
    }
  },
  likePost: async (req, res) => {
    try {
      await Post.findOneAndUpdate(
        { _id: req.params.id },
        {
          $inc: { likes: 1 },
        }
      );
      console.log("Likes +1");
      res.redirect(`/post/${req.params.id}`);
    } catch (err) {
      console.log(err);
    }
  },

  favoritePost: async (req, res)=>{
    var heart = false
    try{
      var post = await Post.findById({_id:req.params.id})
      heart = (post.favorite.includes(req.user.id))
    } catch(err){
    }
    //if already bookmarked we will remove user from likes array
    if(heart){
      try{
        await Post.findOneAndUpdate({_id:req.params.id},
          {
            $pull : {'favorite' : req.user.id}
          })
          
          console.log('Removed user from favorite array')
          res.redirect("/feed")
        }catch(err){
          console.log(err)
        }
      }
      //else add user to bookmarked array
      else{
        try{
          await Post.findOneAndUpdate({_id:req.params.id},
            {
              $addToSet : {'favorite' : req.user.id}
            })
            
            console.log('Added user to favorite array')
            res.redirect("/profile")
        }catch(err){
            console.log(err)
        }
      }
    },

  deletePost: async (req, res) => {
    try {
      // Find post by id
      let post = await Post.findById({ _id: req.params.id });
      // Delete image from cloudinary
      await cloudinary.uploader.destroy(post.cloudinaryId);
      // Delete post from db
      await Post.remove({ _id: req.params.id });
      console.log("Deleted Post");
      res.redirect("/profile");
    } catch (err) {
      res.redirect("/profile");
    }
  },
};
