"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("@hapi/joi"));
class NoteValidator {
    constructor() {
        // Validation for creating a new note
        this.newNote = (req, res, next) => {
            const schema = joi_1.default.object({
                title: joi_1.default.string().min(3).max(100).required(),
                description: joi_1.default.string().max(500).optional(),
                color: joi_1.default.string().optional(),
                isArchive: joi_1.default.boolean().optional(),
                isTrash: joi_1.default.boolean().optional(),
                createdBy: joi_1.default.string().required() // Make sure to validate the user ID properly
            });
            const { error } = schema.validate(req.body);
            if (error) {
                return next(error); // Pass the validation error to the next middleware
            }
            next(); // Proceed to the next middleware if validation is successful
        };
        // Validation for updating a note
        this.updateNote = (req, res, next) => {
            const schema = joi_1.default.object({
                title: joi_1.default.string().min(3).max(100).optional(),
                description: joi_1.default.string().max(500).optional(),
                color: joi_1.default.string().optional(),
                isArchive: joi_1.default.boolean().optional(),
                isTrash: joi_1.default.boolean().optional(),
                createdBy: joi_1.default.string().optional() // Make sure this is optional for updates
            });
            const { error } = schema.validate(req.body);
            if (error) {
                return next(error); // Pass the validation error to the next middleware
            }
            next(); // Proceed to the next middleware if validation is successful
        };
        // Validation for creating and updating a note
        this.validateNote = (req, res, next) => {
            const schema = joi_1.default.object({
                title: joi_1.default.string().min(1).required(),
                description: joi_1.default.string().optional(),
                color: joi_1.default.string().optional(),
                isArchive: joi_1.default.boolean().optional(),
                isTrash: joi_1.default.boolean().optional(),
                createdBy: joi_1.default.string().optional() // Assuming createdBy is an ObjectId as a string
            });
            const { error } = schema.validate(req.body);
            if (error) {
                return next(error); // Pass the validation error to the next middleware
            }
            next(); // Proceed to the next middleware if validation is successful
        };
    }
}
exports.default = NoteValidator;
