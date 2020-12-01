const router = require('express').Router();
const Book = require('../models/book');
const Student = require('../models/student');

// ROUTE:   /books/
// DESC :   Get all books
// REQ  :   GET
router.route('/').get((req, res) => {
    Book.find({})
        .then( book => res.json(book));
});

// ROUTE:   /books/
// DESC :   Delete all books from the database
// REQ  :   DELETE
router.route('/').delete((req, res) => {
    Book.deleteMany({})
        .then(res.json({msg: 'All books deleted'}))
        .catch(err => res.send(err));
})

// ROUTE:   /books/
// DESC :   Add a new book to database
// REQ  :   POST
router.route('/').post((req, res) => {
    const { title, author, ISBN } = req.body;

    Book.findOne({ ISBN })
        .then( book => {

            // If the book is already in the database
            // 400 = Bad request
            if(book) return res.status(400).json({msg: 'Book is already in database'});

            // Create New Book
            const newBook = new Book({title, author, ISBN})

            // Save newBook into DB
            newBook.save()
                .then(book => {
                    res.json({msg: 'Successfully added book'})
                })
                .catch(err => res.status(400).json('Error: ' + err));
        })
})

// ROUTE:   /books/:id
// DESC :   Get a book from the database
// REQ  :   GET
router.route('/:id').get((req, res) => {
  const id = req.params.id;
  
  Book.findById(id)
      .then(book => res.json(book));
});

// ROUTE:   /books/:id
// DESC :   Update a book
// REQ  :   PUT
router.route('/:id').put((req, res) => {
  const id = req.params.id;
  const { title, author, ISBN } = req.body;
  
  const update = {
     title, author, ISBN
  }
  
  Book.findByIdAndUpdate(id, update)
    .then(book => res.json({status: 'ok'}))
    .catch(err => res.json(err));
  
});

// ROUTE:   /books/:id
// DESC :   Delete a book from the database
// REQ  :   DELETE
router.route('/:id').delete((req, res) => {
    const id = req.params.id;
    
    Book.findByIdAndDelete(id)
        .then(res.send(`Book: ${id} has been deleted`))
        .catch(err => res.send(err));
});

// ROUTE:   /books/:id/student
// DESC :   Update class object to add student to array
// REQ  :   PUT
router.route('/:id/student').put((req, res) => {

  const id = req.params.id;
  const studentID = req.body.studentID;

  Book.findByIdAndUpdate(id)
    .then(books => {
      books.students.push(studentID);
      books.save();

      Student.findByIdAndUpdate(studentID)
        .then(newStudent => {
          newStudent.classes.push(id);
          newStudent.save();
        })
    })
    .catch(err => console.log(err));

  // console.log(studentID);
});

// ROUTE:   /books/:id
// DESC :   Delete a class from the database
// REQ  :   DELETE
router.route('/:id').delete((req, res) => {
  const id = req.params.id;

  Book.findById(id, (err, books) => {
    if(books) {
      console.log('Found class');
      books.students.map(selected => {
        Student.findByIdAndUpdate(
          selected,
          { $pull : {"books": books._id}}
        )
        .then(console.log('Removed book from student'))
      });
    } else {
      console.log(err);
    }
  });

  Book.findByIdAndDelete(id)
    .then(books => {
      res.send(`Class: ${books.title} ${books.ISBN} has been deleted`);
    })
    .catch (err => console.log(err));
});

module.exports = router;