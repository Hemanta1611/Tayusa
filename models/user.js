const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    passwordHash: {
        type: String,
    },
    photoUrl: {
        type: String,
    },
    userType: {
        type: String,
        enum: ["user", "employee", "admin"],
        required: true,
        default: "user",
    },
    followers: [{
        type: Schema.Types.ObjectId,
        ref: "User",
    }],
    following: [{
        type: Schema.Types.ObjectId,
        ref: "User",
    }],
    interestedDomains: [String],
    likedContents: [{
        type: Schema.Types.ObjectId,
        ref: "Content",
    }],
    savedContents: [{
        type: Schema.Types.ObjectId,
        ref: "Content",
    }],
    savedShorts: [{
        type: Schema.Types.ObjectId,
        ref: "Short",
    }],
    savedVideos: [{
        type: Schema.Types.ObjectId,
        ref: "Video",
    }],
    channelName: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);
module.exports = User;
