import { Request, Response, NextFunction } from 'express';
import HttpStatus from 'http-status-codes';
import NoteService from '../services/note.service';
import redisClient from '../config/redisClient';


class NoteController {
  private noteService = new NoteService();

  // Controller to create a new note
  public createNote = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = res.locals.user;
      const newNote = await this.noteService.createNote(req.body, userId);
  
      // Invalidate the cache for all notes
      await redisClient.del(`notes:${userId}`);
  
        res.status(HttpStatus.CREATED).json({
        code: HttpStatus.CREATED,
        message: 'Note created successfully',
        data: newNote,
      });
    } catch (error) {
      next(error);
    }
  };
  

  // Controller to get all notes for a user
  public getAllNotes = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = res.locals.user;
  
      // Check for cached notes
      const cachedNotes = await redisClient.get(`notes:${userId}`);
      if (cachedNotes) {
        const notes = JSON.parse(cachedNotes);
  
        // If cached data is an empty array, proceed to fetch fresh data
        if (notes.length === 0) {
          console.log('Empty cache detected. Fetching fresh data...');
        } else {
            res.status(HttpStatus.OK).json({
            code: HttpStatus.OK,
            message: 'Notes fetched from cache',
            data: notes,
          });
        }
      }
  
      // Fetch notes from database
      const data = await this.noteService.getAllNotes(userId);
  
      // Cache only non-empty responses
      if (data.length > 0) {
        await redisClient.setEx(`notes:${userId}`, 3600, JSON.stringify(data)); // Cache for 1 hour
      }
  
      res.status(HttpStatus.OK).json({
        code: HttpStatus.OK,
        message: data.length > 0 ? 'Notes fetched successfully' : 'No notes found',
        data,
      });
    } catch (error) {
      next(error);
    }
  };
  
  

  // Controller to get a note by its ID
  public getNoteById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const noteId = req.params.id;
    const userId = res.locals.user; // Get the user ID from the JWT

    const data = await this.noteService.getNoteById(noteId, userId);
    if (!data) {
      res.status(HttpStatus.NOT_FOUND).json({
        code: HttpStatus.NOT_FOUND,
        message: 'Note not found'
      });
      return;
    }
    res.status(HttpStatus.OK).json({
      code: HttpStatus.OK,
      message: 'Note fetched successfully',
      data
    });
  } catch (error) {
    next(error);
  }
};


  // Controller to update a note
  public updateNote = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = res.locals.user;
      const noteId = req.params.id;

      const updateNote = await this.noteService.updateNote(noteId, req.body, userId);
      // Update individual note in cache
         await redisClient.setEx(`note:${userId}:${noteId}`, 3600, JSON.stringify(updateNote));
      // Invalidate all notes cache
         await redisClient.del(`notes:${userId}`);
        res.status(HttpStatus.OK).json({
        code: HttpStatus.OK,
        message: 'Note updated successfully',
        data:updateNote
      });
    } catch (error) {
      next(error);
    }
  };

  // Controller to delete a note permanently
  public deleteNoteForever = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const noteId = req.params.id;
      const userId = res.locals.user; // Get the user ID from the JWT
      const data = await this.noteService.deleteNoteForever(noteId, userId);
      // Invalidate cache
        await redisClient.del(`note:${userId}:${noteId}`);
        await redisClient.del(`notes:${userId}`);
        res.status(HttpStatus.OK).json({
        code: HttpStatus.OK,
        message: 'Note deleted permanently',
        data
      });
    } catch (error) {
      // Handle the specific error for notes not found in trash
      if (error.message === 'Note not found or it is not in trash. Cannot delete forever.') {
        res.status(HttpStatus.BAD_REQUEST).json({
          code: HttpStatus.BAD_REQUEST,
          message: error.message
        });
      }
      next(error);
    }
  };

  // Controller to toggle archive/unarchive a note
public ArchiveNote = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const noteId = req.params.id;
    const userId = res.locals.user;

    const data = await this.noteService.toggleArchiveNote(noteId, userId);
    const message = data.isArchive ? 'Note archived successfully' : 'Note unarchived successfully';

     // Clear cache
     await redisClient.del(`notes:${userId}`);
     await redisClient.del(`note:${userId}:${noteId}`);

    res.status(HttpStatus.OK).json({
      code: HttpStatus.OK,
      message,
      data
    });
  } catch (error) {
    next(error);
  }
};

// Controller to toggle trash/restore a note
public TrashNote = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const noteId = req.params.id;
    const userId = res.locals.user;

    const data = await this.noteService.toggleTrashNote(noteId, userId);

    const message = data.isTrash ? 'Note moved to trash successfully' : 'Note restored from trash successfully';
         // Clear cache
      await redisClient.del(`notes:${userId}`);
      await redisClient.del(`note:${userId}:${noteId}`);

      res.status(HttpStatus.OK).json({
      code: HttpStatus.OK,
      message,
      data
    });
  } catch (error) {
    // Specific error handling for archived notes that cannot be trashed
    if (error.message === 'Note is archived and cannot be trashed. Unarchive it first.') {
      res.status(HttpStatus.BAD_REQUEST).json({
        code: HttpStatus.BAD_REQUEST,
        message: error.message
      });
    } else {
      next(error);
    }
  }
};

}

export default NoteController;