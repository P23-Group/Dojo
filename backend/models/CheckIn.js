import mongoose from "mongoose";
const checkInSchema = new mongoose.Schema({
    habitId:{ type: mongoose.Schema.Types.ObjectId, ref: "Habit", required: true, index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    date:{
        type: String,
        required: true,
        match: [/^\d{4}-\d{2}-\d{2}$/, 'Set data in YYYY-MM-DD format']
    },
    value:{type: Number, required: true},
    completed:{type: Boolean, required: true}
})
checkInSchema.index({ habitId: 1, date: 1 }, { unique: true });
export default mongoose.model('CheckIn', checkInSchema)