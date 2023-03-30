const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { schemaOptions } = require("./modelOptions");

// Define the schema for a Section
const sectionSchema = new Schema(
    {
        board: {
            type: Schema.Types.ObjectId,
            ref: "Board",
            required: true,
        },
        title: {
            type: String,
            default: "",
        },
    },
    schemaOptions
);

// Create and export a Section model using the defined schema
module.exports = mongoose.model("Section", sectionSchema);
