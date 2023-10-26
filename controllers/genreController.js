const Genre = require("../models/genre");
const Book = require("../models/book");

const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

// Display list of all genres
exports.genre_list = asyncHandler(async (req, res, next) => {
  const allGenres = await Genre.find().sort({ name: 1 }).exec();
  res.render("genre_list", { title: "All Genres", genre_list: allGenres });
});

// Display detail page for a specific genre
exports.genre_detail = asyncHandler(async (req, res, next) => {
  const [genre, booksInGenre] = await Promise.all([
    Genre.findById(req.params.id).exec(),
    Book.find({ genre: req.params.id }, "title summary").exec(),
  ]);
  if (genre === null) {
    // Genre nor found
    const err = new Error("Genre not found");
    err.status = 404;
    return next(err);
  }

  res.render("genre_detail", {
    title: "Genre Detail",
    genre: genre,
    genre_books: booksInGenre,
  });
});

// Display genre create form on GET
exports.genre_create_get = asyncHandler(async (req, res, next) => {
  res.render("genre_form", { title: "Create Genre" });
});

// Handle genre delete on POST
exports.genre_create_post = [
  //validate and sanitize the name field
  body("name", "Genre name must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(), // To remove dangerous html characters

  // Process request after validation and sanitization
  asyncHandler(async (req, res, next) => {
    // Extract validation errors from a request
    const errors = validationResult(req);

    //Create a genre object with escaped and trimmed data.
    const genre = new Genre({ name: req.body.name });

    if (!errors.isEmpty()) {
      // There are error. Render the form again with sanitized values/error messages
      res.render("genre_form", {
        title: "Create genre",
        genre: genre,
        error: errors.array(),
      });
      return;
    } else {
      // Data from form is valid
      // Check if Genre with same name already exists
      const genreExists = await Genre.findOne({ name: req.body.name })
        .collation({ locale: "en", strength: 2 }) // to avoid duplicate like "fantasy Fantasy FaNtASy" and accents
        .exec();
      if (genreExists) {
        res.redirect(genreExists.url);
      } else {
        await genre.save();
        //new Genre saved. Redirect to genre detail page
        res.redirect(genre.url);
      }
    }
  }),
];

// Display genre delete form on GET
exports.genre_delete_get = asyncHandler(async (req, res, next) => {

  // Get details of genre and books related
  const [genre, allBooksOfGenre] = await Promise.all([
    Genre.findById(req.params.id).exec(),
    Book.find({genre: req.params.id}, 'title summary').exec()
  ])

  if(genre === null){
    res.redirect('/catalog/genres');
  }

  res.render('genre_delete', {
    title: 'Delete genre',
    genre: genre,
    genre_books: allBooksOfGenre,
  })
});

// Handle genre delete on POST
exports.genre_delete_post = asyncHandler(async (req, res, next) => {
  const [genre, allBooksOfGenre] = await Promise.all([
    Genre.findById(req.params.id).exec(),
    Book.find({genre: req.params.id}, 'title summary').exec()
  ])

  if(allBooksOfGenre.length > 0){
    res.render('genre_delete', {
      title: 'Delete genre',
      genre: genre,
      genre_books: allBooksOfGenre
    })
    return;
  } else {
    await Genre.findByIdAndRemove(req.body.genreid);
    res.redirect('/catalog/genres');
  }

});

// Display genre update form on GET
exports.genre_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: genre update GET");
});

// Handle genre update on POST
exports.genre_update_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: genre update POST");
});
