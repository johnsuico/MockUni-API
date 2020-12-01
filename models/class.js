const mongoose = require('mongoose');
const studentSchema = require('./student').schema;
const bookSchema = require('./book').schema;

const classSchema = new mongoose.Schema({
    classTitle: String,
    instructor: String,
    classID: {
        type: Number,
        unique: true
    },
    // Only store the object ID into the array
    students: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'Student'
    }]
})

const Class = mongoose.model('Class', classSchema);

module.exports = Class;