const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const TuteSchema = new Schema({
    title:{
        type:String,//data type
        required:true,//validate
    },

    content:{
        type:String,//data type
        required:true,
    },
    
    visualContent: { // New field for visual content file path
        type: String,
        required: false,
    },
    visualContentType: { // New field to indicate the type ('image' or 'video')
        type: String,
        enum: ['image', 'video'],
        required: false,
    },
    likes: { // New field for likes
        type: Number,
        default: 0,
    },
    comments: [ // New field for comments
        {
            user: { type: String, required: true },
            comment: { type: String, required: true },
            date: { type: Date, default: Date.now },
        }
    ],
    
   


});


module.exports = mongoose.model(
    "TuteModel" ,//file name
    TuteSchema //function name
)