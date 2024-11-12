// test/taskRoutes.test.js
const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../app'); // Import your app
const User = require('../models/User');
const Task = require('../models/Task'); // Import your Task model

// Setup MongoDB connection for testing
beforeAll(async () => {
  await mongoose.connect('mongodb://localhost:27017/test', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("MongoDB connected for testing!");
});

// Create a valid user for authentication
const createValidUser = async () => {
  const user = new User({
    username: 'testuser',
    email: 'testuser@example.com',
    password: 'ValidPass1!', // Must meet password validation rules
  });

  await user.save();
  return user;
};

let user;

// In your test setup
beforeAll(async () => {
  await mongoose.connect('mongodb://localhost:27017/test', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("MongoDB connected for testing!");
});

// Clean up the database after tests
afterAll(async () => {
  await mongoose.connection.db.dropDatabase(); // Drop the test database
  await mongoose.connection.close(); // Close the connection
  console.log("MongoDB connection closed after tests");
});

// Test suite for task routes
describe("Task Routes", () => {
  
  // Test for creating a new task
  it("POST /tasks should create a new task and return the task object", async () => {
    const res = await request(app)
      .post('/tasks')
      .set('Authorization', `Bearer ${user.generateAuthToken()}`) // Ensure the user is authenticated
      .send({ name: 'Test Task', description: 'Test Description' });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('name', 'Test Task');
    expect(res.body).toHaveProperty('description', 'Test Description');
  });

  // Test for retrieving all tasks
  it("GET /tasks should retrieve all tasks for the authenticated user", async () => {
    const res = await request(app)
      .get('/tasks')
      .set('Authorization', `Bearer ${user.generateAuthToken()}`); // Ensure the user is authenticated

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true); // The response should be an array of tasks
  });

  // Test for updating a task
  it("PUT /tasks/:id should update a task and return the updated task", async () => {
    const newTask = new Task({
      name: 'Old Task',
      description: 'Old Description',
      user: user._id,
    });
    await newTask.save();

    const updatedData = { name: 'Updated Task', description: 'Updated Description' };
    const res = await request(app)
      .put(`/tasks/${newTask._id}`)
      .set('Authorization', `Bearer ${user.generateAuthToken()}`)
      .send(updatedData);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('name', 'Updated Task');
    expect(res.body).toHaveProperty('description', 'Updated Description');
  });

  // Test for getting a task by ID (404 if not found)
  it("GET /tasks/:id should return 404 if task not found", async () => {
    const invalidTaskId = new mongoose.Types.ObjectId(); // Generate a random invalid ObjectId
    const res = await request(app)
      .get(`/tasks/${invalidTaskId}`)
      .set('Authorization', `Bearer ${user.generateAuthToken()}`);

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('message', 'Task not found');
  });

  // Test for deleting a task
  it("DELETE /tasks/:id should delete a task and return a success message", async () => {
    const task = new Task({
      name: 'Task to be deleted',
      description: 'To be deleted',
      user: user._id,
    });
    await task.save();

    const res = await request(app)
      .delete(`/tasks/${task._id}`)
      .set('Authorization', `Bearer ${user.generateAuthToken()}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message', 'Task deleted successfully');
  });
});
