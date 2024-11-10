"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const note_service_1 = __importDefault(require("../services/note.service"));
class NoteController {
    constructor() {
        this.noteService = new note_service_1.default();
        // Controller to create a new note
        this.createNote = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = res.locals.user; // Get the user ID from the JWT
                console.log(userId);
                const data = yield this.noteService.createNote(req.body, userId);
                res.status(http_status_codes_1.default.CREATED).json({
                    code: http_status_codes_1.default.CREATED,
                    data,
                    message: 'Note created successfully'
                });
            }
            catch (error) {
                next(error);
            }
        });
        // Controller to get all notes for a user
        this.getAllNotes = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = res.locals.user;
                const data = yield this.noteService.getAllNotes(userId);
                console.log(data.length);
                if (data.length === 0) { // Check if the notes array is empty
                    console.log(0);
                    res.status(http_status_codes_1.default.NOT_FOUND).json({
                        code: http_status_codes_1.default.NOT_FOUND,
                        message: 'No notes present for the user'
                    });
                }
                res.status(http_status_codes_1.default.OK).json({
                    code: http_status_codes_1.default.OK,
                    data,
                    message: 'Notes fetched successfully'
                });
            }
            catch (error) {
                next(error);
            }
        });
        // Controller to get a note by its ID
        this.getNoteById = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const noteId = req.params.id;
                const userId = res.locals.user; // Get the user ID from the JWT
                const data = yield this.noteService.getNoteById(noteId, userId);
                if (!data) {
                    res.status(http_status_codes_1.default.NOT_FOUND).json({
                        code: http_status_codes_1.default.NOT_FOUND,
                        message: 'Note not found'
                    });
                    return;
                }
                res.status(http_status_codes_1.default.OK).json({
                    code: http_status_codes_1.default.OK,
                    data,
                    message: 'Note fetched successfully'
                });
            }
            catch (error) {
                next(error);
            }
        });
        // Controller to update a note
        this.updateNote = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = res.locals.user;
                const noteId = req.params.id;
                console.log(req.params.id);
                const data = yield this.noteService.updateNote(noteId, req.body, userId);
                res.status(http_status_codes_1.default.OK).json({
                    code: http_status_codes_1.default.OK,
                    message: 'Note updated successfully'
                });
            }
            catch (error) {
                next(error);
            }
        });
        // Controller to toggle archive/unarchive a note
        this.ArchiveNote = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const noteId = req.params.id;
                const userId = res.locals.user;
                const data = yield this.noteService.toggleArchiveNote(noteId, userId);
                const message = data.isArchive ? 'Note archived successfully' : 'Note unarchived successfully';
                res.status(http_status_codes_1.default.OK).json({
                    code: http_status_codes_1.default.OK,
                    //data,
                    message
                });
            }
            catch (error) {
                next(error);
            }
        });
        // Controller to toggle trash/restore a note
        this.TrashNote = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const noteId = req.params.id;
                const userId = res.locals.user;
                const data = yield this.noteService.toggleTrashNote(noteId, userId);
                const message = data.isTrash ? 'Note moved to trash successfully' : 'Note restored from trash successfully';
                res.status(http_status_codes_1.default.OK).json({
                    code: http_status_codes_1.default.OK,
                    //data,
                    message
                });
            }
            catch (error) {
                // Specific error handling for archived notes that cannot be trashed
                if (error.message === 'Note is archived and cannot be trashed. Unarchive it first.') {
                    res.status(http_status_codes_1.default.BAD_REQUEST).json({
                        code: http_status_codes_1.default.BAD_REQUEST,
                        message: error.message
                    });
                }
                else {
                    next(error); // For other errors
                }
            }
        });
        // Controller to delete a note permanently
        this.deleteNoteForever = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const noteId = req.params.id;
                const userId = res.locals.user; // Get the user ID from the JWT
                const data = yield this.noteService.deleteNoteForever(noteId, userId);
                res.status(http_status_codes_1.default.OK).json({
                    code: http_status_codes_1.default.OK,
                    data,
                    message: 'Note deleted permanently'
                });
            }
            catch (error) {
                // Handle the specific error for notes not found in trash
                if (error.message === 'Note not found or it is not in trash. Cannot delete forever.') {
                    res.status(http_status_codes_1.default.BAD_REQUEST).json({
                        code: http_status_codes_1.default.BAD_REQUEST,
                        message: error.message
                    });
                }
                next(error); // For other errors
            }
        });
    }
}
exports.default = NoteController;
