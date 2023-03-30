const router = require("express").Router({ mergeParams: true });
const { param, body } = require("express-validator");
const tokenHandler = require("../handlers/tokenHandler");
const validation = require("../handlers/validation");
const taskController = require("../controllers/task");

// Route for creating a new task
router.post(
    "/",
    // Validate the provided board and section IDs using express-validator
    param("boardId").custom((value) => {
        if (!validation.isObjectId(value)) {
            return Promise.reject("invalid board id");
        } else return Promise.resolve();
    }),
    body("sectionId").custom((value) => {
        if (!validation.isObjectId(value)) {
            return Promise.reject("invalid section id");
        } else return Promise.resolve();
    }),
    validation.validate,
    tokenHandler.verifyToken,
    taskController.create
);

// Route for updating the position of tasks
router.put(
    "/update-position",
    // Validate the provided board ID using express-validator
    param("boardId").custom((value) => {
        if (!validation.isObjectId(value)) {
            return Promise.reject("invalid board id");
        } else return Promise.resolve();
    }),
    validation.validate,
    tokenHandler.verifyToken,
    taskController.updatePosition
);

// Route for deleting a single task by its ID
router.delete(
    "/:taskId",
    // Validate the provided board and task IDs using express-validator
    param("boardId").custom((value) => {
        if (!validation.isObjectId(value)) {
            return Promise.reject("invalid board id");
        } else return Promise.resolve();
    }),
    param("taskId").custom((value) => {
        if (!validation.isObjectId(value)) {
            return Promise.reject("invalid task id");
        } else return Promise.resolve();
    }),
    validation.validate,
    tokenHandler.verifyToken,
    taskController.delete
);

// Route for updating a single task by its ID
router.put(
    "/:taskId",
    // Validate the provided board and task IDs using express-validator
    param("boardId").custom((value) => {
        if (!validation.isObjectId(value)) {
            return Promise.reject("invalid board id");
        } else return Promise.resolve();
    }),
    param("taskId").custom((value) => {
        if (!validation.isObjectId(value)) {
            return Promise.reject("invalid task id");
        } else return Promise.resolve();
    }),
    validation.validate,
    tokenHandler.verifyToken,
    taskController.update
);

module.exports = router;
