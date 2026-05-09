import mongoose from "mongoose";
import dotenv from "dotenv"
import User from "../src/modules/user/user.model.js"
dotenv.config()


const users = [
  { name: "Harsh", active: true },
  { name: "Rahul", active: false },
  { name: "Aman", active: true },
  { name: "Priya", active: false },
  { name: "Neha", active: true },
  { name: "Rohan", active: false },
  { name: "Ankit", active: true },
  { name: "Simran", active: false },
  { name: "Karan", active: true },
  { name: "Pooja", active: false },

  { name: "Aditya", active: true },
  { name: "Sneha", active: false },
  { name: "Vikas", active: true },
  { name: "Nidhi", active: false },
  { name: "Arjun", active: true },
  { name: "Meera", active: false },
  { name: "Yash", active: true },
  { name: "Divya", active: false },
  { name: "Ritika", active: true },
  { name: "Kabir", active: false },

  { name: "Aryan", active: true },
  { name: "Sakshi", active: false },
  { name: "Manav", active: true },
  { name: "Isha", active: false },
  { name: "Dev", active: true },
  { name: "Tanya", active: false },
  { name: "Varun", active: true },
  { name: "Aisha", active: false },
  { name: "Krishna", active: true },
  { name: "Riya", active: false },

  { name: "Mohit", active: true },
  { name: "Payal", active: false },
  { name: "Nikhil", active: true },
  { name: "Kriti", active: false },
  { name: "Shivam", active: true },
  { name: "Ananya", active: false },
  { name: "Rajat", active: true },
  { name: "Muskan", active: false },
  { name: "Sarthak", active: true },
  { name: "Tanvi", active: false },

  { name: "Deepak", active: true },
  { name: "Jiya", active: false },
  { name: "Ujjwal", active: true },
  { name: "Palak", active: false },
  { name: "Ravina", active: true },
  { name: "Hemant", active: false },
  { name: "Lavanya", active: true },
  { name: "Gaurav", active: false },
  { name: "Bhavya", active: true },
  { name: "Kush", active: false },

  { name: "Sanya", active: true },
  { name: "Dhruv", active: false },
  { name: "Reyansh", active: true },
  { name: "Avni", active: false },
  { name: "Aarav", active: true },
  { name: "Myra", active: false },
  { name: "Vivaan", active: true },
  { name: "Kiara", active: false },
];

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await User.deleteMany();

    for (const user of users) {
      await User.create(user);
    }

    console.log("Users seeded successfully");

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedUsers();
