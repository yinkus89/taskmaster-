// app.js

const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const userRoutes = require('./routes/userRoutes');  // Import user routes
const Task = require('./models/Task');
const User = require('./models/User');
const Category = require('./models/Category');

dotenv.config();

const app = express();
app.use(morgan('dev'));
app.use(cors({
    origin: process.env.CLIENT_ORIGIN,
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });

// Use the user routes
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
