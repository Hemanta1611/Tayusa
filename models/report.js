const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reportSchema = new Schema({
    reporter: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    contentId: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    contentType: {
        type: String,
        enum: ["video", "short", "post", "comment"],
        required: true,
    },
    reason: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ["pending", "reviewed", "resolved"],
        default: "pending",
    },
    reviewedBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    reviewTime: {
        type: Date,
    },
});

const Report = mongoose.model("Report", reportSchema);
module.exports = Report;
