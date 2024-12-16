import { Request, Response, NextFunction } from 'express';
import HttpStatus from 'http-status-codes';
import redisClient from '../config/redisClient';

// Redis caching middleware
export const redisCacheMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = res.locals.user;
    const noteId = req.params.id;

    if (req.method === 'GET') {
      if (noteId) {
        // Handle individual note caching
        const cachedNote = await redisClient.get(`note:${userId}:${noteId}`);
        if (cachedNote) {
          res.status(HttpStatus.OK).json({
            code: HttpStatus.OK,
            data: JSON.parse(cachedNote),
            message: 'Note fetched from cache'
          });
        }
      } else {
        // Handle all notes caching
        const cachedNotes = await redisClient.get(`notes:${userId}`);
        if (cachedNotes) {
          const notes = JSON.parse(cachedNotes);
          if (notes.length > 0) {
            res.status(HttpStatus.OK).json({
              code: HttpStatus.OK,
              data: notes,
              message: 'Notes fetched from cache'
            });
          }
        }
      }
    }

    // Proceed to the next middleware or controller if no cache hit
    next();
  } catch (error) {
    console.error('Redis middleware error:', error);
    next(error);
  }
};
