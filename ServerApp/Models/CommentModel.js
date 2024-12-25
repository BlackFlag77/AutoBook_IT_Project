const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    postId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Post',
        required: true,
    },  
    content:{
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
    createdAt: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model(
    "CommentModel",   //file name
    CommentSchema     //function name
);
