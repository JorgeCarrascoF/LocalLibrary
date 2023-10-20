const Genre = require('../models/genre');
const Book = require('../models/book');
const asyncHandler = require('express-async-handler');

// Display list of all genres
exports.genre_list = asyncHandler(async (req, res, next) => {
    const allGenres = await Genre.find().sort({name: 1}).exec();
    res.render('genre_list', {title: 'All Genres', genre_list: allGenres})
})

// Display detail page for a specific genre
exports.genre_detail = asyncHandler(async (req, res, next) =>{
    const [genre, booksInGenre] = await Promise.all([
        Genre.findById(req.params.id).exec(),
        Book.find({genre: req.params.id}, "title summary").exec(),
    ])
    if(genre === null){ // Genre nor found
        const err = new Error('Genre not found');
        err.status = 404;
        return next(err);
    }



    res.render('genre_detail', {
        title: 'Genre Detail',
        genre: genre,
        genre_books: booksInGenre
    })
})

// Display genre create form on GET
exports.genre_create_get = asyncHandler(async (req, res, next)=>{
    res.send("NOT IMPLEMENTED: genre create GET")
})

// Handle genre delete on POST
exports.genre_create_post = asyncHandler(async (req, res, next)=>{
    res.send("NOT IMPLEMENTED: genre create POST")
})


// Display genre delete form on GET
exports.genre_delete_get = asyncHandler(async (req, res, next)=>{
    res.send("NOT IMPLEMENTED: genre delete GET")
})

// Handle genre delete on POST
exports.genre_delete_post = asyncHandler(async (req, res, next)=>{
    res.send("NOT IMPLEMENTED: genre delete POST")
})


// Display genre update form on GET
exports.genre_update_get = asyncHandler(async (req, res, next)=>{
    res.send("NOT IMPLEMENTED: genre update GET")
})

// Handle genre update on POST
exports.genre_update_post = asyncHandler(async (req, res, next)=>{
    res.send("NOT IMPLEMENTED: genre update POST")
})

