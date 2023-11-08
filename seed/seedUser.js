import mongoose from "mongoose";

import User from "../models/user.js";

// Connect mongoose
async function main() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/campgroundsDB');
        console.log('Connection successful');
    } catch (err) {
        console.err(err);
    }
    // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}
main();

const newUser = {
    username: 'admin',
    password: 'admin',
    admin: true,
    reviews: [],
}

async function seedUser() {
    try {
        await User.create(newUser)
            .then(res => console.log(res));
        console.log('seeded');
    } catch (err) {
        console.log(err);
    }
}
seedUser();