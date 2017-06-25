var express = require('express');
var handlebars = require('express-handlebars');
var MongoClient = require('mongodb').MongoClient;
var bodyParser = require('body-parser');


var app = express();

app.use(bodyParser.urlencoded({extended: true}));


app.engine('handlebars', handlebars(
{
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

var db;

MongoClient.connect('mongodb://janina:janinapass3@ds163679.mlab.com:63679/items', function(err, database)
{
  if (err) return console.log(err);

  db = database;
  app.listen(process.env.PORT || 3000);
});

//Homepage (List of Cocktails)
app.get('/', function(req, res) 
{
  db.collection("cocktails").find({}).toArray(function(err, results)
  {
    res.render('home', {cocktail: results});
  });
});

//Individual Cocktail Page
app.get('/:id', function(req, res) 
{
  db.collection("cocktails").findOne({id: parseInt(req.params.id)}, function(err, result) 
  {
    console.log(result);
    if (err) console.log(err);
    res.render('cocktail', {cocktail: result});
  });
});

//Search
app.get('/search', function(req, res)
{
  res.render('search');
});

app.post('/search', function(req, res)
{
  var input = req.body.search.trim();

  db.cocktails.find({$text: {$search: input}});
});
