const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    content: {
        type: String,
        required: true,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    parentId: {
        type: Schema.Types.ObjectId,
        ref: "Comment",
        default: null,
    },
    contentId: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    reacts: [{
        userId: { type: Schema.Types.ObjectId, ref: "User" },
        emoji: String,
    }],
    replies: [{
        type: Schema.Types.ObjectId,
        ref: "Comment",
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;
