const Task = require("../models/task");
const Section = require("../models/section");

// Create a new task for a section
exports.create = async (req, res) => {
    const { sectionId } = req.body;
    try {
        // Find the section by id
        const section = await Section.findById(sectionId);
        // Count the number of existing tasks for the section
        const tasksCount = await Task.find({ section: sectionId }).count();
        // Create a new task with the given section id and position
        const task = await Task.create({
            section: sectionId,
            position: tasksCount > 0 ? tasksCount : 0,
        });
        // Add the section object to the task object
        task._doc.section = section;
        // Return the created task with status code 201 (Created)
        res.status(201).json(task);
    } catch (err) {
        // Return an error with status code 500 (Internal Server Error)
        res.status(500).json(err);
    }
};

// Update a task
exports.update = async (req, res) => {
    const { taskId } = req.params;
    try {
        // Update the task with the given id and return it with status code 200 (OK)
        const task = await Task.findByIdAndUpdate(taskId, { $set: req.body });
        res.status(200).json(task);
    } catch (err) {
        // Return an error with status code 500 (Internal Server Error)
        res.status(500).json(err);
    }
};

// Delete a task and update the position of remaining tasks
exports.delete = async (req, res) => {
    const { taskId } = req.params;
    try {
        // Find the current task by id
        const currentTask = await Task.findById(taskId);
        // Delete the current task by id
        await Task.deleteOne({ _id: taskId });
        // Find all remaining tasks for the section and sort them by position
        const tasks = await Task.find({ section: currentTask.section }).sort("position");
        // Update the position of all remaining tasks
        for (const key in tasks) {
            await Task.findByIdAndUpdate(tasks[key].id, { $set: { position: key } });
        }
        // Return a success message with status code 200 (OK)
        res.status(200).json("deleted");
    } catch (err) {
        // Return an error with status code 500 (Internal Server Error)
        res.status(500).json(err);
    }
};

// Update the position of multiple tasks within or between sections
exports.updatePosition = async (req, res) => {
    const { resourceList, destinationList, resourceSectionId, destinationSectionId } = req.body;
    const resourceListReverse = resourceList.reverse();
    const destinationListReverse = destinationList.reverse();
    try {
        if (resourceSectionId !== destinationSectionId) {
            for (const key in resourceListReverse) {
                await Task.findByIdAndUpdate(resourceListReverse[key].id, {
                    $set: {
                        section: resourceSectionId,
                        position: key,
                    },
                });
            }
        }
        for (const key in destinationListReverse) {
            await Task.findByIdAndUpdate(destinationListReverse[key].id, {
                $set: {
                    section: destinationSectionId,
                    position: key,
                },
            });
        }
        res.status(200).json("updated");
    } catch (err) {
        res.status(500).json(err);
    }
};
