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
const note_model_1 = __importDefault(require("../models/note.model"));
class NoteService {
    constructor() {
        // Service to create a new note
        this.createNote = (body, userId) => __awaiter(this, void 0, void 0, function* () {
            const noteData = Object.assign(Object.assign({}, body), { createdBy: userId });
            const note = yield note_model_1.default.create(noteData);
            return note;
        });
        // Service to get all notes for a user
        this.getAllNotes = (userId) => __awaiter(this, void 0, void 0, function* () {
            const notes = yield note_model_1.default.find({ createdBy: userId });
            return notes;
        });
        // Service to get a note by its ID
        this.getNoteById = (noteId, userId) => __awaiter(this, void 0, void 0, function* () {
            const note = yield note_model_1.default.findOne({ _id: noteId, createdBy: userId });
            return note;
        });
        // Service to update a note
        this.updateNote = (noteId, body, userId) => __awaiter(this, void 0, void 0, function* () {
            const note = yield note_model_1.default.findOneAndUpdate({ _id: noteId, createdBy: userId }, body, { new: true });
            return note;
        });
        // Service to toggle archive/unarchive
        this.toggleArchiveNote = (noteId, userId) => __awaiter(this, void 0, void 0, function* () {
            const note = yield note_model_1.default.findOne({ _id: noteId, createdBy: userId });
            if (!note) {
                throw new Error('Note not found');
            }
            note.isArchive = !note.isArchive;
            yield note.save();
            return note;
        });
        // Service to toggle trash/restore
        this.toggleTrashNote = (noteId, userId) => __awaiter(this, void 0, void 0, function* () {
            const note = yield note_model_1.default.findOne({ _id: noteId, createdBy: userId });
            if (!note) {
                throw new Error('Note not found');
            }
            // Prevent moving to trash if the note is archived
            if (note.isArchive) {
                throw new Error('Note is archived and cannot be trashed. Unarchive it first.');
            }
            note.isTrash = !note.isTrash;
            yield note.save();
            return note;
        });
        // Service to delete a note permanently
        this.deleteNoteForever = (noteId, userId) => __awaiter(this, void 0, void 0, function* () {
            // Check if the note exists and is in trash
            const note = yield note_model_1.default.findOne({ _id: noteId, createdBy: userId, isTrash: true });
            if (!note) {
                throw new Error('Note not found or it is not in trash. Cannot delete forever.');
            }
            // Delete the note permanently
            yield note_model_1.default.deleteOne({ _id: noteId, createdBy: userId });
            return note; // Optionally return the deleted note information
        });
    }
}
exports.default = NoteService;
