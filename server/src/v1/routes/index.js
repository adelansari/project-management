var router = require("express").Router();

// Mount the auth routes at /auth
router.use("/auth", require("./auth"));

// Mount the board routes at /boards
router.use("/boards", require("./board"));

// Mount the section routes at /boards/:boardId/sections
router.use("/boards/:boardId/sections", require("./section"));

// Mount the task routes at /boards/:boardId/tasks
router.use("/boards/:boardId/tasks", require("./task"));

module.exports = router;
