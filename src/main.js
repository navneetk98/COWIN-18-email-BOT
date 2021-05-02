var express = require('express');
var morgan = require('morgan');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 7000;
var hostname = 'localhost';
var app = express();
require('dotenv').config()
app.use(morgan('dev'));


app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(bodyParser.json());
  
  // Activate this if you need to access script access
  // from other hosts
  //
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Credentials', true);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, authorization");
    next();
  });

  const routes = require('./routes');
  routes(app);
  
  app.listen(PORT, () => console.log(`Your app listening on port ${PORT.toString()}!`));