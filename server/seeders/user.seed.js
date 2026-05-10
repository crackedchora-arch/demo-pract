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
  { name: "Aditi", active: true },
  { name: "Ritesh", active: false },
  { name: "Shreya", active: true },
  { name: "Naman", active: false },
  { name: "Parth", active: true },
  { name: "Kavya", active: false },
  { name: "Laksh", active: true },
  { name: "Trisha", active: false },
  { name: "Harleen", active: true },
  { name: "Om", active: false },

  { name: "Ishaan", active: true },
  { name: "Ruhi", active: false },
  { name: "Ayush", active: true },
  { name: "Mahima", active: false },
  { name: "Rudra", active: true },
  { name: "Navya", active: false },
  { name: "Samar", active: true },
  { name: "Diya", active: false },
  { name: "Tushar", active: true },
  { name: "Naina", active: false },

  { name: "Yuvraj", active: true },
  { name: "Pallavi", active: false },
  { name: "Abeer", active: true },
  { name: "Sanjana", active: false },
  { name: "Raghav", active: true },
  { name: "Mahi", active: false },
  { name: "Harshit", active: true },
  { name: "Vaishnavi", active: false },
  { name: "Pranav", active: true },
  { name: "Siya", active: false },

  { name: "Aakash", active: true },
  { name: "Charvi", active: false },
  { name: "Kunal", active: true },
  { name: "Ira", active: false },
  { name: "Rishi", active: true },
  { name: "Pihu", active: false },
  { name: "Tejas", active: true },
  { name: "Khushi", active: false },
  { name: "Soham", active: true },
  { name: "Mitali", active: false },

  { name: "Niraj", active: true },
  { name: "Anvi", active: false },
  { name: "Darsh", active: true },
  { name: "Sara", active: false },
  { name: "Ayaan", active: true },
  { name: "Tara", active: false },
  { name: "Harshita", active: true },
  { name: "Nakul", active: false },
  { name: "Ved", active: true },
  { name: "Riddhi", active: false },

  { name: "Shaurya", active: true },
  { name: "Tanisha", active: false },
  { name: "Madhav", active: true },
  { name: "Esha", active: false },
  { name: "Ronit", active: true },
  { name: "Ishita", active: false },
  { name: "Arnav", active: true },
  { name: "Samaira", active: false },
  { name: "Devansh", active: true },
  { name: "Prisha", active: false },

  { name: "Kartik", active: true },
  { name: "Alina", active: false },
  { name: "Vihaan", active: true },
  { name: "Roshni", active: false },
  { name: "Atharv", active: true },
  { name: "Jhanvi", active: false },
  { name: "Siddharth", active: true },
  { name: "Mannat", active: false },
  { name: "Advik", active: true },
  { name: "Noor", active: false },

  { name: "Yashvi", active: true },
  { name: "Keshav", active: false },
  { name: "Rituraj", active: true },
  { name: "Anika", active: false },
  { name: "Param", active: true },
  { name: "Niharika", active: false },
  { name: "Viraj", active: true },
  { name: "Aarohi", active: false },
  { name: "Chirag", active: true },
  { name: "Vidhi", active: false },

  { name: "Hriday", active: true },
  { name: "Maira", active: false },
  { name: "Aarush", active: true },
  { name: "Saumya", active: false },
  { name: "Krish", active: true },
  { name: "Angel", active: false },
  { name: "Daksh", active: true },
  { name: "Rupal", active: false },
  { name: "Jay", active: true },
  { name: "Yamini", active: false },

  { name: "Nilesh", active: true },
  { name: "Bhumi", active: false },
  { name: "Arpit", active: true },
  { name: "Komal", active: false },
  { name: "Lakshay", active: true },
  { name: "Mehak", active: false },
  { name: "Ronav", active: true },
  { name: "Suhani", active: false },
  { name: "Manan", active: true },
  { name: "Apeksha", active: false },
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
