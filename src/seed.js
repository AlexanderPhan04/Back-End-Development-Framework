import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import bcrypt from "bcryptjs";

import User from "./models/User.js";
import Category from "./models/Category.js";
import Product from "./models/Product.js";
import Cart from "./models/Cart.js";
import Order from "./models/Order.js";
import Review from "./models/Review.js";

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB Connected");

        // Clear old data
        await User.deleteMany();
        await Category.deleteMany();
        await Product.deleteMany();
        await Cart.deleteMany();
        await Order.deleteMany();
        await Review.deleteMany();

        console.log("Old data removed");

        // Create admin
        const hashedPassword = await bcrypt.hash("123456", 10);

        const admin = await User.create({
            name: "Admin",
            email: "admin@gmail.com",
            password: hashedPassword,
            role: "admin"
        });

        console.log("Admin created");

        // Create categories
        const laptopCategory = await Category.create({
            name: "Laptop",
            description: "Laptop products"
        });

        const phoneCategory = await Category.create({
            name: "Phone",
            description: "Phone products"
        });

        console.log("Categories created");

        // Create products
        await Product.create([
            {
                name: "MacBook Pro M3",
                description: "Apple MacBook Pro",
                price: 39990000,
                stock: 10,
                category: laptopCategory._id,
                images: [
                    "https://example.com/macbook.jpg"
                ]
            },
            {
                name: "iPhone 15 Pro Max",
                description: "Apple flagship phone",
                price: 32990000,
                stock: 15,
                category: phoneCategory._id,
                images: [
                    "https://example.com/iphone.jpg"
                ]
            }
        ]);

        console.log("Products created");

        console.log("Seed completed");

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seedData();
