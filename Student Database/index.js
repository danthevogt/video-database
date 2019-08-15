// JavaScript Document

//gives access to the express library
let express = require("express");

//creates an express application obkexct
let app = express();

//gives access to the path
//port communication
let path = require("path");

//we use this variable for our port community
app.set("port",process.env.PORT || 4000);

//extracting data from the request
let port = 4000;

//gives acess to the body-parser library used in the req extracting
//data from the request IOW the form
let bodyParser = require("body-parser");

//gives access to knex which provides SQL in out app
let knex = require("knex")({
    client: 'sqlite3',
    connection: {
        filename: "./YouTube.db"
	},
    useNullAsDefault: true
});

//allows us to use objects and arrays like JSON format
app.use(bodyParser.urlencoded({ extended: true}));

//allows css
app.use(express.static(__dirname + '/views'));

//this specifies how our EJS pages are converted to HTML
//and helps the browser so it can display it
app.set("view engine", "ejs");



//This gets the table from sqlite3 and adds it to the page
app.get("/", (req, res) => {
    knex.select('Category', 'URL', 'Description', 'Likes', 'VideoID').from('Spanish').orderBy('Likes', 'desc').then(List =>{
        res.render('index', {test: List});
      }).catch(err => {
        console.log(err);
        res.status(500).json({err});
    });
});

//Delete record
app.post("/Delete/:id", (req, res) => {
	knex('Spanish').where('VideoID', req.params.id).del().then(test => {
		res.redirect('/');
	}).catch(err => {
		console.log(err);
		res.status(500).json({err});
	});
});

//Add a Song
app.post('/addVideo', (req, res) => {
    console.log(req.body);
    //We use req because the res doesn't have the data, the request does
    knex('Spanish').insert(req.body).then(test => {
        res.redirect('/');
    });
});


//Edit Song
app.get('/EditVideo/:id', (req,res) => {
    knex('Spanish').where('VideoID',req.params.id).then(video => {
        res.render('EditVideo', {video: video});
});
});


app.post('/EditVideo/:id', (req, res) => {
    console.log(req.body.VideoID);
    knex('Spanish').where('VideoID',req.params.id).update({ Category: req.body.Category, URL: req.body.URL,
        Description: req.body.Description }).then(() => {
    res.redirect('/');
        });
    });


//Like record

var numberOfLikes = knex.select('Likes').from('Spanish');
	
	
app.post("/Like/:id", (req, res) => {
	knex('Spanish').where('VideoID', req.params.id).update({ Likes: req.body.Likes }).then(test => {
		res.redirect('/');
	}).catch(err => {
		console.log(err);
		res.status(500).json({err});
	});
});




//This is so the server does not die.
app.listen(port, function() {
    console.log("I am listening");
});