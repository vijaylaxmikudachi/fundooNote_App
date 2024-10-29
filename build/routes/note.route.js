"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const note_controller_1 = __importDefault(require("../controllers/note.controller"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const note_validator_1 = __importDefault(require("../validators/note.validator"));
class NoteRoutes {
    constructor() {
        this.router = express_1.default.Router();
        this.noteController = new note_controller_1.default();
        this.noteValidator = new note_validator_1.default();
        this.routes = () => {
            // Route to create a new note
            this.router.post('/create', auth_middleware_1.userAuth, this.noteValidator.validateNote, this.noteController.createNote);
            // Route to get all Notes of a user
            this.router.get('/', auth_middleware_1.userAuth, this.noteController.getAllNotes);
            // Route to get a note by its ID
            this.router.get('/:id', auth_middleware_1.userAuth, this.noteController.getNoteById);
            // Route to update a note
            this.router.put('/update/:id', auth_middleware_1.userAuth, this.noteValidator.validateNote, this.noteController.updateNote);
            // Route to toggle archive/unarchive
            this.router.put('/archive/:id', auth_middleware_1.userAuth, this.noteController.ArchiveNote);
            // Route to toggle trash/restore
            this.router.put('/trash/:id', auth_middleware_1.userAuth, this.noteController.TrashNote);
            // Route to permanently delete a note
            this.router.delete('/delete/:id', auth_middleware_1.userAuth, this.noteController.deleteNoteForever);
        };
        this.getRoutes = () => {
            return this.router;
        };
        this.routes();
    }
}
exports.default = NoteRoutes;
