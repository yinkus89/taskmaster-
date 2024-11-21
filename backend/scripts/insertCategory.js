const mongoose = require('mongoose');
const Category = require('../models/Category'); // Ensure this path is correct based on your project structure

// Sample Category Data
const categoriesData = [
  {
    name: "Work",
    description: "Tasks related to work and professional development.",
    priorityLevel: 1,
  },
  {
    name: "Personal",
    description: "Personal tasks such as errands, appointments, etc.",
    priorityLevel: 2,
  },
  {
    name: "Health",
    description: "Tasks related to maintaining health and fitness.",
    priorityLevel: 3,
  },
  {
    name: "Travel",
    description: "Travel-related tasks such as trip planning, bookings, etc.",
    priorityLevel: 2,
  },
  {
    name: "Education",
    description: "Learning and study tasks for personal or professional growth.",
    priorityLevel: 1,
  },
  {
    name: "Shopping",
    description: "Tasks related to buying groceries, clothes, etc.",
    priorityLevel: 4,
  },
  {
    name: "Errands",
    description: "Routine errands such as post office visits, bill payments, etc.",
    priorityLevel: 3,
  },
  {
    name: "Finance",
    description: "Tasks related to managing financials like budgeting, investments, etc.",
    priorityLevel: 2,
  },
  {
    name: "Family",
    description: "Tasks related to family and home management.",
    priorityLevel: 3,
  },
];

// Function to insert categories into the database
const insertCategories = async () => {
  try {
    // Connect to MongoDB (change the URI to match your database)
    await mongoose.connect('mongodb://localhost:27017/categories', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Remove existing categories to avoid duplicates
    await Category.deleteMany({});

    console.log('Deleted existing categories (if any)');

    // Insert the categories into the database
    const insertedCategories = await Category.insertMany(categoriesData);
    console.log('Categories inserted:', insertedCategories);

    // Close the database connection
    mongoose.connection.close();
  } catch (error) {
    console.error('Error inserting categories:', error);
  }
};

// Run the function to insert categories
insertCategories();
