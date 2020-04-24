const express = require('express');
const { join } = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan-debug');
const { json, urlencoded } = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');
const router = require('./routes');
var user=require('./routes/userController');
let user_data = {
  user_email: 'admin@starkflow.co',
  user_type: 'admin',
  user_password: 'admin@123'
}
// console.log('checckkkkkkkkkkkkkkkkkkkkkk', user.check_user_exits({user_email: user_data.user_email, user_password: user_data.user_password}));

// if (!user.check_user_exits(user_data.user_email)) {
  user.add_admin(user_data);
// }

const createError = require('http-errors');
const mongoose = require('mongoose');
const config = require('./config/database');
const mongodb = require('mongodb');
const uri = config.database;
const cors = require('cors');

// const config = require('./config/database');
// mongoose.connect(config.database);

      mongoose.connect(config.database, { useNewUrlParser: true ,useUnifiedTopology: true, useCreateIndex: true});
      var db = mongoose.connection;
      db.on('error', console.error.bind(console, 'connection error:'));
      db.once('open', function callback() {
        console.log('db connection open');
        
      });
    
// client.connect((err) => {
//     if (!err) {
//         console.log('connection created');
//     }
//     const newDB = client.db("admin-payment");
//     newDB.createCollection("InvoiceList"); // This line i s important. Unless you create collection you can not see your database in mongodb .

// })

const app = express();
app.locals.moment = require('moment');
const staticRoot = join(__dirname, 'public');

// view engine setup
app.set('views', join(__dirname, 'views'));
app.set('view engine', 'pug');

//Middleware for CORS
app.use(cors());

app.use(favicon(join(staticRoot, 'images', 'favicon.png')));
app.use(logger('braintree_example:app', 'dev'));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(
  session({
    // this string is not an appropriate value for a production environment
    // read the express-session documentation for details
    secret: '---',
    saveUninitialized: true,
    resave: true
  })
);
app.use(express.static('public'));
app.use(flash());

app.use('/', router);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

// app.listen('listening', function () {
//   // server ready to accept connections here
//   router.init_admin();
// });

module.exports = app;
