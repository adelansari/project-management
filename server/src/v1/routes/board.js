const router = require("express").Router();
const { param } = require("express-validator");
const validation = require("../handlers/validation");
const tokenHandler = require("../handlers/tokenHandler");
const boardController = require("../controllers/board");

// Route for creating a new board
router.post("/", tokenHandler.verifyToken, boardController.create);

// Route for getting all boards
router.get("/", tokenHandler.verifyToken, boardController.getAll);

// Route for updating the position of boards
router.put("/", tokenHandler.verifyToken, boardController.updatePosition);

// Route for getting all favourite boards
router.get("/favourites", tokenHandler.verifyToken, boardController.getFavourites);

// Route for updating the position of favourite boards
router.put("/favourites", tokenHandler.verifyToken, boardController.updateFavouritePosition);

// Route for getting a single board by its ID
router.get(
    "/:boardId",
    // Validate the provided board ID using express-validator
    param("boardId").custom((value) => {
        if (!validation.isObjectId(value)) {
            return Promise.reject("invalid id");
        } else return Promise.resolve();
    }),
    validation.validate,
    tokenHandler.verifyToken,
    boardController.getOne
);

// Route for updating a single board by its ID
router.put(
    "/:boardId",
    // Validate the provided board ID using express-validator
    param("boardId").custom((value) => {
        if (!validation.isObjectId(value)) {
            return Promise.reject("invalid id");
        } else return Promise.resolve();
    }),
    validation.validate,
    tokenHandler.verifyToken,
    boardController.update
);

// Route for deleting a single board by its ID
router.delete(
    "/:boardId",
    // Validate the provided board ID using express-validator
    param("boardId").custom((value) => {
        if (!validation.isObjectId(value)) {
            return Promise.reject("invalid id");
        } else return Promise.resolve();
    }),
    validation.validate,
    tokenHandler.verifyToken,
    boardController.delete
);

module.exports = router;
