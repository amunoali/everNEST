const cloudinary = require("../middleware/cloudinary");
const Book = require("../models/Book");
const Comment = require("../models/Comment");
const Blog = require("../models/Blog");
const Favorite = require("../models/Favorite");

module.exports = {
  getProfile: async (req, res) => {
    try {
      const books = await Book.find({ user: req.user.id });
      res.render("profile.ejs", { books: books, user: req.user });
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
      const books = await Book.find().sort({ createdAt: "desc" }).lean();
      res.render("feed.ejs", { books: books, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },

  getFavorites: async (req, res) => {
    try {
      const books = await Book.find({ user: req.user.id });
      res.render("favorites.ejs", { books: books, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },

  // getQuotes: async (req, res) => {
  //   try {
  //     const quotes = await fetch('https://type.fit/api/quotes', 
  //     {
  //       method: 'GET',
  //       headers: {
  //         'Motivational-Quotes' : 'type.fit'
  //       }
  //     }
  //     )
  //     console.log(quotes)
  //   } catch (err) {
  //     console.log(err);
  //   }
  // },


  
  getBook: async (req, res) => {
    try {
      const books = await Book.findById(req.params.id);
      const comment = await Comment.find({book: req.params.id}).sort({ createdAt: "asc" }).lean();
      res.render("book.ejs", { books: books, user: req.user, comment: comment });
    } catch (err) {
      console.log(err);
    }
  },
  createBook: async (req, res) => {
    try {
      // Upload image to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);

      await Book.create({
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
      console.log("Book has been added!");
      res.redirect("/profile");
    } catch (err) {
      console.log(err);
    }
  },
  likeBook: async (req, res) => {
    try {
      await Book.findOneAndUpdate(
        { _id: req.params.id },
        {
          $inc: { likes: 1 },
        }
      );
      console.log("Likes +1");
      res.redirect(`/book/${req.params.id}`);
    } catch (err) {
      console.log(err);
    }
  },

  favoriteBook: async (req, res)=>{
    var favored = false
    try{
      var books = await Book.findById({_id:req.params.id})
      favored = (books.favorite.includes(req.user.id))
    } catch(err){
      console.log(err)
    }

    //if already bookmarked we will remove user from likes array
    if(favored){
      try{
        await Book.findOneAndUpdate({_id:req.params.id},
          {
            $pull : {'favorite' : req.user.id}
          })
          
          console.log('Removed  from favorites ')
          res.redirect("/feed")
        }catch(err){
          console.log(err)
        }
      }
      //else add user to bookmarked array
      else{
        try{
          await Book.findOneAndUpdate({_id:req.params.id},
            {
              $addToSet : {'favorite' : req.user.id}
            })
            
            console.log('Added  to favorites ')
            res.redirect(`back`)
        }catch(err){
            console.log(err)
        }
      }
    },

  deleteBook: async (req, res) => {
    try {
      // Find post by id
      let book = await Book.findById({ _id: req.params.id });
      // Delete image from cloudinary
      await cloudinary.uploader.destroy(book.cloudinaryId);
      // Delete post from db
      await Book.remove({ _id: req.params.id });
      console.log("Deleted Post");
      res.redirect("/profile");
    } catch (err) {
      res.redirect("/profile");
    }
  },
};
