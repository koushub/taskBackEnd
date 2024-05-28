const mongoose = require("mongoose");

const connectionString = process.env.CONNECTION
mongoose.connect(connectionString);

//user schema
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minLength: 3,
        maxLength: 30
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    },
    username: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    }
});


// create model from schema
const User = mongoose.model("User", userSchema);

module.exports = {
    User
};