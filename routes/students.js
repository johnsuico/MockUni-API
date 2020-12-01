const router = require('express').Router();
const Student = require('../models/student');
const Book = require('../models/book');
const Classes = require('../models/class');
const mongoose = require('mongoose');

// ROUTE:   /students/
// DESC :   Get all students
// REQ  :   GET
router.route('/').get((req, res) => {
    Student.find({})
        .then( student => res.json(student));
});

// ROUTE:   /students/
// DESC :   Delete all the students from the database
// REQ  :   DELETE
router.route('/').delete((req, res) => {
    Student.deleteMany({})
        .then(res.json({msg: 'All students deleted'}))
        .catch(err => res.send(err));
});

// ROUTE:   /students/
// DESC :   Add a new student to the database
// REQ  :   POST
router.route('/').post((req, res) => {
    const {firstName, lastName, SID} = req.body;

    Student.findOne({SID})
        .then( student => {

            // If the student is already in the database
            // 400 = Bad request
            if(student) return res.status(400).json({msg: 'Student is already in database'});

            // Create New Student
            const newStudent = new Student({firstName, lastName, SID})

            // Save newStudent into DB
            newStudent.save()
                .then(selectedStudent => {
                    res.json({msg: 'Successfully added student'})
                })
                .catch(err => res.status(400).json('Error: ' + err));
        })
});

// ROUTE:   /students/:id
// DESC :   Get a single student
// REQ  :   GET
router.route('/:id').get((req, res) => {
  const id = req.params.id;

  Student.findById(id)
    .then(student => res.json(student))
    .catch(err => res.send(err));
})

// ROUTE:   /students/:id
// DESC :   Update a student
// REQ  :   PUT
router.route('/:id').put((req, res) => {
  const id = req.params.id;
  const { firstName, lastName, SID } = req.body;

  const update = {
    firstName, lastName, SID
  }

  Student.findByIdAndUpdate(id, update)
    .then(student => res.json({status: 'ok'}))
    .catch(err => res.json(err));

});

// ROUTE:   /students/:id/class
// DESC :   Update student object to add class to array
// REQ  :   PUT
router.route('/:id/class').put((req, res) => {

  const id = req.params.id;
  const classID = req.body.classID;

  Student.findByIdAndUpdate(id)
    .then(student => {
      student.classes.push(classID);
      student.save();

      Classes.findByIdAndUpdate(classID)
        .then(newClass => {
          newClass.students.push(id);
          newClass.save();
        })
    })
    .catch(err => console.log(err));
});

// ROUTE:   /students/:id/book
// DESC :   Update student object to add book to array
// REQ  :   PUT
router.route('/:id/book').put((req, res) => {

  const id = req.params.id;
  const bookID = req.body.bookID;

  Student.findByIdAndUpdate(id)
    .then(student => {
      student.books.push(bookID);
      student.save();

      Book.findByIdAndUpdate(bookID)
        .then(newBook => {
          newBook.students.push(id);
          newBook.save()
        })
    })
    .catch(err => console.log(err));
});

// ROUTE:   /students/:id
// DESC :   Delete a student from the database
// REQ  :   DELETE
router.route('/:id').delete((req, res) => {
    const id = req.params.id;

    Student.findById(id, (err, student) => {
      if (student) {
        console.log('Found student');
        student.classes.map(selected => {
          Classes.findByIdAndUpdate(
            selected,
            { $pull : {"students": student._id}}
          )
          .then(console.log('Remove student from class'))
        });
        student.books.map(selected => {
          Book.findByIdAndUpdate(
            selected,
            { $pull: {"students": student._id}}
          )
          .then (console.log('Remove student from book'))
        });
      } else {
        console.log(err);
      }
    });

    Student.findByIdAndDelete(id)
      .then(student => {
        res.send(`Student: ${student.firstName} ${student.lastName} has been deleted`);
      })
      .catch (err => console.log(err));
});

module.exports = router;