const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const faker = require('faker');
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
    const categories = [
        { name: "Work", description: "Tasks related to work" },
        { name: "Personal", description: "Personal tasks" }
    ];
    await Category.insertMany(categories);
    console.log("Categories Seeded!");

    const users = [];
    for (let i = 0; i < 10; i++) {
        users.push(new User({
            username: faker.internet.userName(),
            email: faker.internet.email(),
            password: faker.internet.password()
        }));
    }
    await User.insertMany(users);
    console.log('Fake Users Seeded!');

    const tasks = [];
    for (let i = 0; i < 20; i++) {
        tasks.push(new Task({
            title: faker.lorem.sentence(),
            description: faker.lorem.paragraph(),
            dueDate: faker.date.future(),
            status: faker.helpers.randomize(['completed', 'pending', 'in-progress'])
        }));
    }
    await Task.insertMany(tasks);
    console.log('Fake Tasks Seeded!');
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
