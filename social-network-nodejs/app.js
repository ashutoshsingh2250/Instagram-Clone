const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require("cors");
const config = require('config');
const mongoose = require('mongoose');


const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const postsRouter = require('./routes/posts');
const testAPIRouter = require('./routes/testAPI');

const app = express();

//  mongodb atlas: Username- ashutosh, Password- Ashu123
const db_username = config.get('socialNetwork.dbConfig.dbUsername');
const db_name = config.get('socialNetwork.dbConfig.dbName');
const db_password = config.get('socialNetwork.dbConfig.dbPassword');

mongoose.connect(`mongodb+srv://${db_username}:${db_password}@cluster0.vt3ok.mongodb.net/${db_name}?retryWrites=true&w=majority`,  { useNewUrlParser: true,  useUnifiedTopology: true });
mongoose.connection.on('connected', ()=> {
  console.log('Successfully connected to MongoDB...');
  const port = process.env.PORT || 9000;
  app.listen(port, ()=> console.log(`Listening to port ${port}...`));
});
mongoose.connection.on('error', (err)=> {
  console.error(`Error in connecting to MongoDB: ${err} ...`);
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/posts', postsRouter);
app.use('/testAPI', testAPIRouter);

app.get('/favicon.ico', (req, res) => res.status(204));

module.exports = app;
