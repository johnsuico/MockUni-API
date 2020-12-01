const mongoose = require('mongoose');
const studentSchema = require('./student').schema;

const bookSchema = new mongoose.Schema({
    title: String,
    author: String,
    ISBN: Number,
    // Only store the object ID into the array
    classes: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'Class'
    }],
    students: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'Student'
    }]
})

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;