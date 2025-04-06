const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    uploadTime: {
        type: Date,
        default: Date.now,
    },
    likes: [{
        type: Schema.Types.ObjectId,
        ref: "User",
    }],
    savedBy: [{
        type: Schema.Types.ObjectId,
        ref: "User",
    }],
    reports: [{
        reporterId: { type: Schema.Types.ObjectId, ref: "User" },
        reason: String,
        reportedAt: { type: Date, default: Date.now },
    }],
    comments: [{
        type: Schema.Types.ObjectId,
        ref: "Comment",
    }],
});

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
