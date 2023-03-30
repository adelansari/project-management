const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { schemaOptions } = require("./modelOptions");

// Define the schema for a Board
const boardSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        icon: {
            type: String,
            default: "⚠",
        },
        title: {
            type: String,
            default: "ProjectName",
        },
        description: {
            type: String,
            default: `ProjectDescription`,
        },
        position: {
            type: Number,
        },
        favourite: {
            type: Boolean,
            default: false,
        },
        favouritePosition: {
            type: Number,
            default: 0,
        },
    },
    schemaOptions
);

// Create and export a Board model using the defined schema
module.exports = mongoose.model("Board", boardSchema);
