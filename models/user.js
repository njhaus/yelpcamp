import mongoose from 'mongoose';
import passport from 'passport';
import passportLocal from "passport-local";
import passportLocalMongoose from 'passport-local-mongoose'

const userSchema = new mongoose.Schema ({
    username: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 20,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 30, 
        match: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        unique: true,
    },
    admin: {
        type: Boolean,
        required: true,
        default: false
    },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
})

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', userSchema);

export default User;
