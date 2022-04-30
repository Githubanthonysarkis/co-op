const express = require('express');
const {errorHandler} = require('./middlewares/errorMiddleware');
require('colors');
require('dotenv').config();
const app = express();
const {protect} = require('./middlewares/authMiddleware')

// Starting the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server up and runnning on port ${PORT}`));

// Connecting to the database
require('./config/db')();

app.use(express.json());
app.use(express.urlencoded({extended: false}));

// Routes

app.use('/api/user', require('./routes/userRoutes'));
app.use('/api/groups', protect, require('./routes/groupRoutes'));
app.use(errorHandler);