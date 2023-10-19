const mongoose = require('mongoose');

const Squema = mongoose.Schema;

const AuthorSquema = new Squema({
    first_name: {type: String, required: true, maxLength: 100},
    family_name: {type: String, required: true, maxLength: 100},
    date_of_birth: {type: Date},
    date_of_death: {type: Date},
})

// Virtual for author's full name
AuthorSquema.virtual('name').get(function(){
    let fullname = '';
    if(this.first_name && this.family_name){
        fullname = `${this.family_name}, ${this.first_name}`;
    }
    return fullname;
})

// Virtual for author's URL
AuthorSquema.virtual("url").get(function (){
    return `/catalog/author/${this.id}`;
})

module.exports = mongoose.model("Author", AuthorSquema);