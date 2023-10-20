const mongoose = require('mongoose');
const{DateTime} = require('luxon');

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
    return `/catalog/author/${this._id}`;
})

AuthorSquema.virtual('birthdate').get(function (){
    return this.date_of_birth ? DateTime.fromJSDate(this.date_of_birth).toLocaleString(DateTime.DATE_MED) : '';
})

AuthorSquema.virtual('deathdate').get(function (){
    return this.date_of_death ? DateTime.fromJSDate(this.date_of_death).toLocaleString(DateTime.DATE_MED) : '';
})

module.exports = mongoose.model("Author", AuthorSquema);