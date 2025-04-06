const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const shortSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    videoUrl: {
        type: String,
        required: true,
    },
    duration: {
        type: Number,
        required: true,
    },
    uploadTime: {
        type: Date,
        default: Date.now,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    likes: [{
        type: Schema.Types.ObjectId,
        ref: "User",
    }],
    views: {
        type: Number,
        default: 0,
    },
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

const Short = mongoose.model("Short", shortSchema);
module.exports = Short;
