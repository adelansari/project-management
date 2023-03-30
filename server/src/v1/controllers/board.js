const Board = require("../models/board");
const Section = require("../models/section");
const Task = require("../models/task");

// Create a new board
exports.create = async (req, res) => {
    try {
        // Count the number of existing boards
        const boardsCount = await Board.find().count();
        // Create a new board with the user's id and position
        const board = await Board.create({
            user: req.user._id,
            position: boardsCount > 0 ? boardsCount : 0,
        });
        // Return the created board with status code 201 (Created)
        res.status(201).json(board);
    } catch (err) {
        // Return an error with status code 500 (Internal Server Error)
        res.status(500).json(err);
    }
};

// Get all boards for a user
exports.getAll = async (req, res) => {
    try {
        // Find all boards for the user and sort them by position in descending order
        const boards = await Board.find({ user: req.user._id }).sort("-position");
        // Return the found boards with status code 200 (OK)
        res.status(200).json(boards);
    } catch (err) {
        // Return an error with status code 500 (Internal Server Error)
        res.status(500).json(err);
    }
};

// Update the position of multiple boards
exports.updatePosition = async (req, res) => {
    const { boards } = req.body;
    try {
        // Loop through the reversed array of boards
        for (const key in boards.reverse()) {
            const board = boards[key];
            // Update the position of each board
            await Board.findByIdAndUpdate(board.id, { $set: { position: key } });
        }
        // Return a success message with status code 200 (OK)
        res.status(200).json("updated");
    } catch (err) {
        // Return an error with status code 500 (Internal Server Error)
        res.status(500).json(err);
    }
};

// Get a single board with its sections and tasks
exports.getOne = async (req, res) => {
    const { boardId } = req.params;
    try {
        // Find the board for the user with the given id
        const board = await Board.findOne({ user: req.user._id, _id: boardId });
        // If the board is not found, return a not found message with status code 404 (Not Found)
        if (!board) return res.status(404).json("Board not found");
        // Find all sections for the board
        const sections = await Section.find({ board: boardId });
        for (const section of sections) {
            // Find all tasks for each section and populate the section field
            const tasks = await Task.find({ section: section.id }).populate("section").sort("-position");
            // Add the tasks to the section object
            section._doc.tasks = tasks;
        }
        // Add the sections to the board object
        board._doc.sections = sections;
        // Return the found board with its sections and tasks with status code 200 (OK)
        res.status(200).json(board);
    } catch (err) {
        // Return an error with status code 500 (Internal Server Error)
        res.status(500).json(err);
    }
};

// Update a board
exports.update = async (req, res) => {
    const { boardId } = req.params;
    const { title, description, favourite } = req.body;

    try {
        // If the title is an empty string, set it to 'Untitled'
        if (title === "") req.body.title = "Untitled";
        // If the description is an empty string, set it to 'Add description here'
        if (description === "") req.body.description = "Add description here";
        // Find the current board by id
        const currentBoard = await Board.findById(boardId);
        // If the board is not found, return a not found message with status code 404 (Not Found)
        if (!currentBoard) return res.status(404).json("Board not found");

        // If the favourite field is defined and different from the current value
        if (favourite !== undefined && currentBoard.favourite !== favourite) {
            // Find all favourite boards for the user except for the current one and sort them by favourite position
            const favourites = await Board.find({
                user: currentBoard.user,
                favourite: true,
                _id: { $ne: boardId },
            }).sort("favouritePosition");
            // If the board is being set as a favourite
            if (favourite) {
                // Set its favourite position to the number of existing favourites or 0 if there are none
                req.body.favouritePosition = favourites.length > 0 ? favourites.length : 0;
            } else {
                // If the board is being removed from favourites, update the favourite position of all other favourite boards
                for (const key in favourites) {
                    const element = favourites[key];
                    await Board.findByIdAndUpdate(element.id, { $set: { favouritePosition: key } });
                }
            }
        }

        // Update the board with the given id and return it with status code 200 (OK)
        const board = await Board.findByIdAndUpdate(boardId, { $set: req.body });
        res.status(200).json(board);
    } catch (err) {
        // Return an error with status code 500 (Internal Server Error)
        res.status(500).json(err);
    }
};

// Get all favourite boards for a user
exports.getFavourites = async (req, res) => {
    try {
        // Find all favourite boards for the user and sort them by favourite position in descending order
        const favourites = await Board.find({
            user: req.user._id,
            favourite: true,
        }).sort("-favouritePosition");
        // Return the found favourite boards with status code 200 (OK)
        res.status(200).json(favourites);
    } catch (err) {
        // Return an error with status code 500 (Internal Server Error)
        res.status(500).json(err);
    }
};

// Update the favourite position of multiple boards
exports.updateFavouritePosition = async (req, res) => {
    const { boards } = req.body;
    try {
        // Loop through the reversed array of boards
        for (const key in boards.reverse()) {
            const board = boards[key];
            // Update the favourite position of each board
            await Board.findByIdAndUpdate(board.id, { $set: { favouritePosition: key } });
        }
        // Return a success message with status code 200 (OK)
        res.status(200).json("updated");
    } catch (err) {
        // Return an error with status code 500 (Internal Server Error)
        res.status(500).json(err);
    }
};

// Delete a board and its sections and tasks
exports.delete = async (req, res) => {
    const { boardId } = req.params;
    try {
        // Find all sections for the board
        const sections = await Section.find({ board: boardId });
        for (const section of sections) {
            // Delete all tasks for each section
            await Task.deleteMany({ section: section.id });
        }
        // Delete all sections for the board
        await Section.deleteMany({ board: boardId });

        // Find the current board by id
        const currentBoard = await Board.findById(boardId);

        // If the current board is a favourite
        if (currentBoard.favourite) {
            // Find all other favourite boards for the user and sort them by favourite position
            const favourites = await Board.find({
                user: currentBoard.user,
                favourite: true,
                _id: { $ne: boardId },
            }).sort("favouritePosition");

            // Update the favourite position of all other favourite boards
            for (const key in favourites) {
                const element = favourites[key];
                await Board.findByIdAndUpdate(element.id, { $set: { favouritePosition: key } });
            }
        }

        // Delete the current board by id
        await Board.deleteOne({ _id: boardId });

        // Find all remaining boards and sort them by position
        const boards = await Board.find().sort("position");
        // Update the position of all remaining boards
        for (const key in boards) {
            const board = boards[key];
            await Board.findByIdAndUpdate(board.id, { $set: { position: key } });
        }

        // Return a success message with status code 200 (OK)
        res.status(200).json("deleted");
    } catch (err) {
        // Return an error with status code 500 (Internal Server Error)
        res.status(500).json(err);
    }
};
