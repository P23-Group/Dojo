import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    // userId: {type: Number, required: true, unique: true},
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    hashPassword: {type: String, required: true},
    lvl: {type: Number, required: true},
    xp: {type: Number, required: true},
    streak: {type: Number, default: 0},
    longestStreak: {type: Number, default: 0},
    lastActiveDate: {type: String, default: null, match: [/^\d{4}-\d{2}-\d{2}$/, 'Set data in YYYY-MM-DD format']},  // type Date ??
},{timestamps: true})


export default mongoose.model('User', userSchema);