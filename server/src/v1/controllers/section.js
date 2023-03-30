const Section = require("../models/section");
const Task = require("../models/task");

// Create a new section for a board
exports.create = async (req, res) => {
    const { boardId } = req.params;
    try {
        // Create a new section with the given board id
        const section = await Section.create({ board: boardId });
        // Add an empty tasks array to the section object
        section._doc.tasks = [];
        // Return the created section with status code 201 (Created)
        res.status(201).json(section);
    } catch (err) {
        // Return an error with status code 500 (Internal Server Error)
        res.status(500).json(err);
    }
};

// Update a section
exports.update = async (req, res) => {
    const { sectionId } = req.params;
    try {
        // Update the section with the given id and return it with status code 200 (OK)
        const section = await Section.findByIdAndUpdate(sectionId, { $set: req.body });
        // Add an empty tasks array to the section object
        section._doc.tasks = [];
        res.status(200).json(section);
    } catch (err) {
        // Return an error with status code 500 (Internal Server Error)
        res.status(500).json(err);
    }
};

// Delete a section and its tasks
exports.delete = async (req, res) => {
    const { sectionId } = req.params;
    try {
        // Delete all tasks for the section
        await Task.deleteMany({ section: sectionId });
        // Delete the section by id
        await Section.deleteOne({ _id: sectionId });
        // Return a success message with status code 200 (OK)
        res.status(200).json("deleted");
    } catch (err) {
        // Return an error with status code 500 (Internal Server Error)
        res.status(500).json(err);
    }
};
