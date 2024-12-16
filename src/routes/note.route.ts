import express, { IRouter } from 'express';
import NoteController from '../controllers/note.controller';
import { userAuth } from '../middlewares/auth.middleware';
import NoteValidator from '../validators/note.validator';
import { redisCacheMiddleware } from '../middlewares/redisCacheMiddleware';

class NoteRoutes {
  private router = express.Router();
  private noteController = new NoteController();
  private noteValidator = new NoteValidator();

  constructor() {
    this.routes();
  }

  private routes = (): void => {
    // Route to create a new note with cache update
    this.router.post(
      '',
      userAuth,
      this.noteValidator.validateNote,
      this.noteController.createNote
    );

    // Route to get all Notes of a user, with caching
    this.router.get(
      '/',
      userAuth,
      redisCacheMiddleware,
      this.noteController.getAllNotes
    );

    // Route to get a note by its ID, with caching
    this.router.get(
      '/:id',
      userAuth,
      redisCacheMiddleware,
      this.noteController.getNoteById
    );

    // Route to update a note with cache update
    this.router.put(
      '/:id',
      userAuth,
      this.noteValidator.validateNote,
      this.noteController.updateNote
    );

    // Route to permanently delete a note, with cache update
    this.router.delete(
      '/:id/',
      userAuth,
      this.noteController.deleteNoteForever
    );

    // Route to toggle archive/unarchive, with cache update
    this.router.put('/:id/archive', userAuth, this.noteController.ArchiveNote);

    // Route to toggle trash/restore, with cache update
    this.router.put('/:id/trash', userAuth, this.noteController.TrashNote);
  };

  public getRoutes = (): IRouter => {
    return this.router;
  };
}

export default NoteRoutes;
