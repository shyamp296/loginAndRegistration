require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const error404 = require('./controllers/error.controller');
const cors = require('cors')

const port = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI;

const usersRouter = require('./routes/user.routes');

const app = express();

// view engine setup
app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(usersRouter);
app.use(error404.get404);

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log("Database Connected");
    app.listen(port, () => {
      console.log(`Server Is Running On http://localhost:${port}`)
    })
  })
  .catch(err => console.log(err));



