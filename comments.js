// Create web server
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const path = require('path');
const fs = require('fs');

// Create the application/x-www-form-urlencoded parser
const urlencodedParser = bodyParser.urlencoded({ extended: false })

// Set up the view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Set up the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Set up the body parser
app.use(bodyParser.urlencoded({ extended: false }));

// Set up the database connection
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/comments', { useNewUrlParser: true });

// Set up the schema
const commentSchema = new mongoose.Schema({
    name: String,
    comment: String
});

// Set up the model
const Comment = mongoose.model('Comment', commentSchema);

// Get the home page
app.get('/', function(req, res) {
    // Get the comments from the database
    Comment.find(function(err, comments) {
        if (err) {
            console.log(err);
        } else {
            // Render the page
            res.render('index', { comments: comments });
        }
    });
});

// Get the comment page
app.get('/comment', function(req, res) {
    // Render the page
    res.render('comment');
});

// Post the comment page
app.post('/comment', urlencodedParser, function(req, res) {
    // Create a new comment
    const comment = new Comment(req.body);

    // Save the comment
    comment.save(function(err, comment) {
        if (err) {
            console.log(err);
        } else {
            // Redirect to the home page
            res.redirect('/');
        }
    });
});

// Start the server
app.listen(port, () => console.log(`Listening on port ${port}`));