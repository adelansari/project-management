const router = require("express").Router({ mergeParams: true });
const { param } = require("express-validator");
const tokenHandler = require("../handlers/tokenHandler");
const sectionController = require("../controllers/section");
const validation = require("../handlers/validation");

// Route for creating a new section
router.post(
    "/",
    // Validate the provided board ID using express-validator
    param("boardId").custom((value) => {
        if (!validation.isObjectId(value)) {
            return Promise.reject("invalid id");
        } else return Promise.resolve();
    }),
    validation.validate,
    tokenHandler.verifyToken,
    sectionController.create
);

// Route for updating a single section by its ID
router.put(
    "/:sectionId",
    // Validate the provided board and section IDs using express-validator
    param("boardId").custom((value) => {
        if (!validation.isObjectId(value)) {
            return Promise.reject("invalid board id");
        } else return Promise.resolve();
    }),
    param("sectionId").custom((value) => {
        if (!validation.isObjectId(value)) {
            return Promise.reject("invalid section id");
        } else return Promise.resolve();
    }),
    validation.validate,
    tokenHandler.verifyToken,
    sectionController.update
);

// Route for deleting a single section by its ID
router.delete(
    "/:sectionId",
    // Validate the provided board and section IDs using express-validator
    param("boardId").custom((value) => {
        if (!validation.isObjectId(value)) {
            return Promise.reject("invalid board id");
        } else return Promise.resolve();
    }),
    param("sectionId").custom((value) => {
        if (!validation.isObjectId(value)) {
            return Promise.reject("invalid section id");
        } else return Promise.resolve();
    }),
    validation.validate,
    tokenHandler.verifyToken,
    sectionController.delete
);

module.exports = router;
