import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    // userId: {type: Number, required: true, unique: true},
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    hashPassword: {type: String, required: true},
    lvl: {type: Number, required: true},
    xp: {type: Number, required: true},
},{timestamps: true})


export default mongoose.model('User', userSchema);