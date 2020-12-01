const router = require('express').Router();
const Student = require('../models/student');
const Book = require('../models/book');
const Classes = require('../models/class');
const mongoose = require('mongoose');

// ROUTE:   /classes/
// DESC :   Get all classes
// REQ  :   GET
router.route('/').get((req, res) => {
    Classes.find({})
        .then( classes => res.json(classes));
});

// ROUTE:   /classes/
// DESC :   Delete all classes from the database
// REQ  :   DELETE
router.route('/').delete((req, res) => {
    Classes.deleteMany({})
        .then(res.json({msg: 'All classes deleted'}))
        .catch(err => res.send(err));
})

// ROUTE:   /classes/
// DESC :   Add a new class to database
// REQ  :   POST
router.route('/').post((req, res) => {
    const { classTitle, instructor, classID } = req.body;

    Classes.findOne({ classID })
        .then( classes => {

            // If the class is already in the database
            // 400 = Bad request
            if(classes) return res.status(400).json({msg: 'Class is already in database'});

            // Create New Class
            const newClass = new Classes({classTitle, instructor, classID})

            // Save newClass into DB
            newClass.save()
                .then(classe => {
                    res.json({msg: 'Successfully added class'})
                })
                .catch(err => res.status(400).json('Error: ' + err));
        })
})

// ROUTE:   /classes/:id
// DESC :   Get a specific class
// REQ  :   GET
router.route('/:id').get((req, res) => {
  const id = req.params.id;

  Classes.findById(id)
    .then(foundClass => res.json(foundClass))
    .catch(err => res.send(err));
});

// ROUTE:   /classes/:id
// DESC :   Update a class
// REQ  :   PUT
router.route('/:id').put((req, res) => {
  const id = req.params.id;
  const { classTitle, instructor, classID } = req.body;
  
  const update = {
     classTitle, instructor, classID
  }
  
  Classes.findByIdAndUpdate(id, update)
    .then(classes => res.json({status: 'ok'}))
    .catch(err => res.json(err));
  
});

// ROUTE:   /classes/:id/student
// DESC :   Update class object to add student to array
// REQ  :   PUT
router.route('/:id/student').put((req, res) => {

    const id = req.params.id;
    const studentID = req.body.studentID;
  
    Classes.findByIdAndUpdate(id)
      .then(classes => {
        classes.students.push(studentID);
        classes.save();
  
        Student.findByIdAndUpdate(studentID)
          .then(newStudent => {
            newStudent.classes.push(id);
            newStudent.save();
          })
      })
      .catch(err => console.log(err));

    // console.log(studentID);
});

// ROUTE:   /classes/:id/book
// DESC :   Update class object to add book to array
// REQ  :   PUT
router.route('/:id/book').put((req, res) => {

    const id = req.params.id;
    const bookID = req.body.bookID;
  
    Classes.findByIdAndUpdate(id)
      .then(classes => {
        classes.books.push(bookID);
        classes.save();
  
        Book.findByIdAndUpdate(bookID)
          .then(newBook => {
            newBook.classes.push(id);
            newBook.save()
          })
      })
      .catch(err => console.log(err));
});

// ROUTE:   /classes/:id
// DESC :   Delete a class from the database
// REQ  :   DELETE
router.route('/:id').delete((req, res) => {
    const id = req.params.id;

    Classes.findById(id, (err, classe) => {
      if(classe) {
        console.log('Found class');
        classe.students.map(selected => {
          Student.findByIdAndUpdate(
            selected,
            { $pull : {"classes": classe._id}}
          )
          .then(console.log('Removed class from student'))
        });
      } else {
        console.log(err);
      }
    });

    Classes.findByIdAndDelete(id)
      .then(classe => {
        res.send(`Class: ${classe.classTitle} ${classe.classID} has been deleted`);
      })
      .catch (err => console.log(err));
});

module.exports = router;