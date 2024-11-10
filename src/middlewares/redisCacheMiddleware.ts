import { Request, Response, NextFunction } from 'express';
import HttpStatus from 'http-status-codes';
import NoteService from '../services/note.service';
import redisClient from '../config/redisClient';

const noteService = new NoteService();

// Redis caching middleware
export const redisCacheMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = res.locals.user;
    const noteId = req.params.id;

    // based on route
    if (req.method === 'GET') {
      // Fetch all notes or a specific note based on the presence of noteId
      if (noteId) {
        const cachedNote = await redisClient.get(`note:${userId}:${noteId}`);
        if (cachedNote) {
          res.status(HttpStatus.OK).json({
            code: HttpStatus.OK,
            data: JSON.parse(cachedNote),
            message: 'Note fetched from cache'
          });
          return;
        }
      } else {
        const cachedNotes = await redisClient.get(`notes:${userId}`);
        if (cachedNotes) {
          res.status(HttpStatus.OK).json({
            code: HttpStatus.OK,
            data: JSON.parse(cachedNotes),
            message: 'Notes fetched from cache'
          });
          return;
        }
      }
    }

    // Proceed to the next middleware or controller
    next();

    // After the controller response, cache the data for future requests
    if (req.method === 'GET' && !noteId) {
      const notes = await noteService.getAllNotes(userId);
      await redisClient.setEx(`notes:${userId}`, 3600, JSON.stringify(notes));
    } else if (req.method === 'GET' && noteId) {
      const note = await noteService.getNoteById(noteId, userId);
      await redisClient.setEx(`note:${userId}:${noteId}`, 3600, JSON.stringify(note));
    }
  } catch (error) {
    console.error('Redis middleware error:', error);
    next(error);
  }
};

// Cache invalidation and updates for create, update, delete operations
export const cacheUpdateMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = res.locals.user;
    const noteId = req.params.id;

    if (req.method === 'POST') {
      // Invalidate all notes cache
      await redisClient.del(`notes:${userId}`);
    } else if (req.method === 'PUT' || req.method === 'PATCH') {
      // Update cache for specific note
      const updatedNote = await noteService.updateNote(noteId, req.body, userId);
      await redisClient.setEx(`note:${userId}:${noteId}`, 3600, JSON.stringify(updatedNote));
    } else if (req.method === 'DELETE') {
      // Delete specific note from cache and all notes cache
      await redisClient.del(`note:${userId}:${noteId}`);
      await redisClient.del(`notes:${userId}`);
    }
    next();
  } catch (error) {
    console.error('Cache update error:', error);
    next(error);
  }
};
