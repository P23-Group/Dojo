import mongoose from "mongoose";
const habitSchema = new mongoose.Schema({
    userId:{ type: String, required: true},
    name:{ type: String, required: true},
    category:{type: String, required: true},
    type: {
        type: String, 
        required:true,
        enum: {
            values: ['helpful', 'harmful'],
            message: '{VALUE} is not supported. Choose either "helpful" or "harmful".'
        }
    },
    trackingFormat: {
        type: String,
        required:true,
        enum: {
            values: ['counter', 'yes_no'],
            message: '{VALUE} is not supported. Choose either "counter" or "yes_no".'
        }
    },
    goalValue: {type: Number, required:true},
    goalUnit: {type: String, required:true},
    frequency: {type: [Number], required: true}
});
export default mongoose.model('Habit', habitSchema)