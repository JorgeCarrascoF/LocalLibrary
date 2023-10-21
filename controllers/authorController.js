const Author = require("../models/author");
const Book = require("../models/book");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

// Display list of all Authors
exports.author_list = asyncHandler(async (req, res, next) => {
  const allAuthors = await Author.find().sort({ family_name: 1 }).exec();

  res.render("author_list", {
    title: "Author List",
    author_list: allAuthors,
  });
});

// Display detail page for a specific Author
exports.author_detail = asyncHandler(async (req, res, next) => {
  const [author, allBooksByAuthor] = await Promise.all([
    Author.findById(req.params.id).exec(),
    Book.find({ author: req.params.id }, "title summary").exec(),
  ]);

  if (author === null) {
    const err = new Error("Author not found");
    err.status = 404;
    return next(err);
  }
  res.render("author_detail", {
    title: "Author Detail",
    author: author,
    author_books: allBooksByAuthor,
  });
});

// Display Author create form on GET
exports.author_create_get = asyncHandler(async (req, res, next) => {
  res.render("author_form", { title: "Create author" });
});

// Handle AUthor delete on POST
exports.author_create_post = [
  // Validate and sanitize fields
  body("first_name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("First name must be specified")
    .isAlphanumeric() // NEVER USE ISALPHANUMERIC() TO VALIDATE NAMES
    .withMessage("First name has non-alphanumeric characters"),
  body("family_name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Family name must be specified")
    .isAlphanumeric()
    .withMessage("Family name has non-alphanumeric characters."),
  body("date_of_birth", "Invalida date of birth")
    .optional({ values: "falsy" })
    .isISO8601()
    .toDate(),
  body("date_of_death", "Invalida date of death")
    .optional({ values: "falsy" })
    .isISO8601()
    .toDate(),

  // Process request after validation and sanitization
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request
    const errors = validationResult(req);

    // Create Author object with escaped and trimmed data
    const author = new Author({
        first_name: req.body.first_name,
        family_name: req.body.family_name,
        date_of_birth: req.body.date_of_birth,
        date_of_death: req.body.date_of_death,
    })

    if(!errors.isEmpty()){
        // There are errors
        res.render('author_form', {
            title: 'Create author',
            author: author,
            errors: errors.any(),
        })
        return;
    } else {
        await author.save();
        res.redirect(author.url);
    }
  }),
];

// Display Author delete form on GET
exports.author_delete_get = asyncHandler(async (req, res, next) => {
    const [author, allBooksByAuthor] = await Promise.all([
        Author.findById(req.params.id).exec(),
        Book.find({author: req.params.id}, "title summary").exec()
    ])

    if(author === null){
        res.redirect('/catalog/authors')
    }

    res.render('author_delete', {
        title: 'Delete author',
        author: author,
        author_books: allBooksByAuthor
    })
});

// Handle author delete on POST
exports.author_delete_post = asyncHandler(async (req, res, next) => {
    // Ger details of author and all their books
    const [author, allBooksByAuthor] = await Promise.all([
        Author.findById(req.params.id).exec(),
        Book.find({author: req.params.id}, "title summary").exec()
    ])

    if(allBooksByAuthor.length > 0){
        // Author has books. Render in same was as for GET route
        res.render('author_delete', {
            title: 'Delete author',
            author: author,
            author_books: allBooksByAuthor,
        })
        return;
    } else {
        // Author has no books, delete object and redirect to the list of authors
        await Author.findByIdAndRemove(req.body.authorid);
        res.redirect('/catalog/authors');
    }
});

// Display Author update form on GET
exports.author_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Author update GET");
});

// Handle author update on POST
exports.author_update_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Author update POST");
});
