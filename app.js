const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

// To use the built in body parser
app.use(express.json());

// To allow for cross origin resource sharing
// Needed to connect to frontend
app.use(cors());

// Port number to be used to access the backend
// Locally: localhost:5000
// const PORT = 5000 | process.env.PORT;

// Connect to MongoDB
const MONGOOSE_URI = "mongodb+srv://cmpe172:cmpe172@mockunidb.t7ssh.mongodb.net/<dbname>?retryWrites=true&w=majority"
mongoose.connect( MONGOOSE_URI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false});

// Successful Connection Message
mongoose.connection.on('connected', () => {
    console.log('Successfully connected to MongoDB')
});

// Unsuccessful Connection Message
mongoose.connection.on('error', console.error.bind(console, 'Connection error: '));

// ROUTES

// Book Routes
const bookRouter = require('./routes/books');
app.use('/books', bookRouter);

// Class Routes
const classRouter = require('./routes/classes');
app.use('/classes', classRouter);

// Student Routes
const studentRouter = require('./routes/students');
app.use('/students', studentRouter);

// Home Route
app.get('/', (req, res) => {
    res.send('You made it to the API');    
})

// Listen
app.listen(process.env.PORT, (req, res) => {
    console.log(`API started on port: ${process.env.PORT}`);
});