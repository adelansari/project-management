const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { schemaOptions } = require("./modelOptions");

// Define the schema for a Task
const taskSchema = new Schema(
    {
        section: {
            type: Schema.Types.ObjectId,
            ref: "Section",
            required: true,
        },
        title: {
            type: String,
            default: "",
        },
        content: {
            type: String,
            default: "",
        },
        position: {
            type: Number,
        },
    },
    schemaOptions
);

// Create and export a Task model using the defined schema
module.exports = mongoose.model("Task", taskSchema);
