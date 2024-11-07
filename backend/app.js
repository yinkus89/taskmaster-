const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
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

const seedData = async () => {
    // Seed categories if not already seeded
    const categories = [
        { name: "Work", description: "Tasks related to work" },
        { name: "Personal", description: "Personal tasks" }
    ];

    const existingCategories = await Category.countDocuments();
    if (existingCategories === 0) {
        await Category.insertMany(categories);
        console.log("Categories Seeded!");
    }

    // Fetch all users from the database
    const users = await User.find();
    if (users.length === 0) {
        console.log("No users found, skipping task seeding.");
        return; // If there are no users in the database, skip task creation
    }

    // For each user, create 3 tasks
    const tasks = [];
    users.forEach(user => {
        for (let i = 0; i < 3; i++) {
            tasks.push(new Task({
                title: `Task ${i + 1} for ${user.username}`,
                description: `Description for task ${i + 1} of ${user.username}`,
                dueDate: new Date(Date.now() + Math.floor(Math.random() * 10) * 24 * 60 * 60 * 1000), // Random due date within 10 days
                status: ['completed', 'pending', 'in-progress'][Math.floor(Math.random() * 3)],
                userId: user._id, // Set the userId to the current user
            }));
        }
    });

    // Insert the tasks into the Task collection
    if (tasks.length > 0) {
        await Task.insertMany(tasks);
        console.log('Tasks Seeded!');
    } else {
        console.log('No tasks to seed.');
    }
};

if (process.env.SEED_DB === 'true') {
    seedData().catch(err => console.error(err));
}

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
