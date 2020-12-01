const mongoose = require('mongoose');
const classSchema = require('./class').schema;
const bookScheama = require('./book').schema;

const studentSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    SID: Number,
    // Only store the object ID into the array
    classes: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'Class'
    }],
    books: [{
      type: mongoose.Schema.Types.ObjectId, ref: 'Book'
    }]
})

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;