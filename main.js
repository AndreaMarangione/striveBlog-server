const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const PORT = process.env.PORT || 3030;
const authorsRoute = require('./routes/authors');
const blogPostRoute = require('./routes/blogPost');
const emailRoute = require('./routes/email');
const loginRoute = require('./routes/login');
const OAuthRoute = require('./routes/OAuth');
const homeRoute = require('./routes/home');
const app = express();
const googleStrategy = require('./middlewares/OAuthMiddleware');
const passport = require('passport');
const errorHandler = require('./middlewares/errorHandler');

mongoose.connect(process.env.DB_URL);
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Database connection error!'));
db.once('open', () => {
    console.log('Database connection done');
})

app.use(cors());
app.use(express.json());
passport.use('google', googleStrategy);
app.use('/', authorsRoute);
app.use('/', blogPostRoute);
app.use('/', emailRoute);
app.use('/', loginRoute);
app.use('/', OAuthRoute);
app.use('/', homeRoute);
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port${PORT}`));
