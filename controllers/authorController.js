const Author = require('../models/author');
const asyncHandler = require('express-async-handler');

// Display list of all Authors
exports.author_list = asyncHandler(async (req, res, next) => {
    const allAuthors = await Author.find().sort({family_name: 1}).exec();

    res.render('author_list', {
        title: 'Author List',
        author_list: allAuthors
    })
})

// Display detail page for a specific Author
exports.author_detail = asyncHandler(async (req, res, next) =>{
    res.send(`NOT IMPLEMENTED: Author detail: ${req.params.id}`)
})


// Display Author create form on GET
exports.author_create_get = asyncHandler(async (req, res, next)=>{
    res.send("NOT IMPLEMENTED: Author create GET")
})

// Handle AUthor delete on POST
exports.author_create_post = asyncHandler(async (req, res, next)=>{
    res.send("NOT IMPLEMENTED: Author create POST")
})


// Display Author delete form on GET
exports.author_delete_get = asyncHandler(async (req, res, next)=>{
    res.send("NOT IMPLEMENTED: Author delete GET")
})

// Handle author delete on POST
exports.author_delete_post = asyncHandler(async (req, res, next)=>{
    res.send("NOT IMPLEMENTED: Author delete POST")
})


// Display Author update form on GET
exports.author_update_get = asyncHandler(async (req, res, next)=>{
    res.send("NOT IMPLEMENTED: Author update GET")
})

// Handle author update on POST
exports.author_update_post = asyncHandler(async (req, res, next)=>{
    res.send("NOT IMPLEMENTED: Author update POST")
})

