const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    likes: {
        type: Number,
        default: 0 
    },
    dislikes: {
        type: Number,
        default: 0
    },
    mediaUrl : {
        type: String,
        required:false,
    },
    mediaType : {
        type: String,
        required:false,
    },
    // userId: {
    //     type: String,
    //     required: true,
    // },
    // createdAt: {
    //     type: Date,
    //     default: Date.now
    // },
}, { timestamps: true });

//text index on title and content
postSchema.index({ title: 'text', content: 'text' });

module.exports = mongoose.model(
    "PostModel",   //file name
    postSchema     //function name
);
