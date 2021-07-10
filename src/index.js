const express = require('express');
const path = require('path');
const engine = require('ejs-mate');
const morgan = require('morgan');
const passport = require('passport');
const session = require('express-session');
const fileupload = require('express-fileupload');

// initializations
const app = express(); 
require('./database');
require('./passport/local-auth');

// settings
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('cloud-files', path.join(__dirname, 'cloud-files'));

// middlewars
app.use(express.urlencoded({extended: true}));
app.use(morgan('dev'));
app.use(session({
    secret: 'mysecretsesionkey',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
    app.locals.user = req.user;
    // console.log(app.locals);
    next();
});
app.use(fileupload());

// routes
app.use('/', require('./routes/index.routes'));
app.use('/', require('./routes/user.routes'));

// listening
app.listen(app.get('port'), () => {
    console.log('Server listening on port: ', app.get('port'));
});