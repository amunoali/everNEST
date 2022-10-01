module.exports = {
  getIndex: (req, res) => {
    res.render("index.ejs");
  },
  getCreate: (req, res) => {
    res.render("blog-add.ejs");
  },
};
