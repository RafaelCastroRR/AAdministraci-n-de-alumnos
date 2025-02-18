import { Schema, model } from "mongoose";

const CourseSchema = Schema({
    nameC: {
        type: String,
        required: [true, 'Name is required'],
    },
    description: {
        type: String,
        required: [true, 'Description is required']
    },
    level: {
        type: String,
        required: [true, 'The level is required']
    },
    status: {
        type: Boolean,
        default: true
    },
    keeper: [{
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    }]
},
    {
        timestamps: true,
        versionKey: false
    }
);

export default model('course', CourseSchema);