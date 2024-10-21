import mongoose from 'mongoose';
import Logger from './logger';

import dotenv from 'dotenv';

class Database {
  private DATABASE: string;
  private logger;

  constructor() {
    // Replace database value in the .env file with your database config url
    this.DATABASE =
      process.env.NODE_ENV === 'test'
        ? process.env.DATABASE_TEST
        : process.env.DATABASE;

    this.logger = Logger.logger;
  }

  public initializeDatabase = async (): Promise<void> => {
    try {
      await mongoose.connect(this.DATABASE);
      this.logger.info('Connected to the database.');
    } catch (error) {
      this.logger.error('Could not connect to the database.', error);
    }
  };
}



export default Database;
