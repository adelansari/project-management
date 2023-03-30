// Define options for Mongoose schemas
exports.schemaOptions = {
    // Include virtual properties when converting a document to JSON or an object
    toJSON: {
        virtuals: true,
    },
    toObject: {
        virtuals: true,
    },
    // Automatically add createdAt and updatedAt timestamps to documents
    timestamp: true,
};
