import { expect } from 'chai';
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../src/index';
import dotenv from 'dotenv';
dotenv.config();

describe('User APIs Test', () => {
  before((done) => {
    const clearCollections = () => {
      for (const collection in mongoose.connection.collections) {
        mongoose.connection.collections[collection].deleteOne(() => {});
      }
    };

    const mongooseConnect = async () => {
      await mongoose.connect(process.env.DATABASE_TEST);
      clearCollections();
    };

    if (mongoose.connection.readyState === 0) {
      mongooseConnect();
    } else {
      clearCollections();
    }

    done();
  });

  const userData = {
    firstName: 'test',
    lastName: 'user',
    email: 'kudachivijaylaxmi29@gmail.com',
    password: 'test123'
  };

  const noteData = {
    title: 'Test Note',
    description: 'This is a test note.',
    color: 'blue',
    isArchive: false,
    isTrash: false
  };

  const updatedNoteData = {
    title: 'Updated Test Note',
    description: 'This is an updated test note.',
    color: 'green',
    isArchive: true,
    isTrash: false
  };

  let token: string;
  let createdNoteId: string;

  describe('User Registration', () => {
    it('should register a new user successfully', async () => {
      const res = await request(app.getApp())
        .post('/api/v1/user')
        .send(userData);

      expect(res.status).to.equal(201);
      expect(res.body).to.have.property(
        'message',
        'User registered successfully'
      );
    });
  });

  describe('User Login', () => {
    it('should log in an existing user successfully', async () => {
      const res = await request(app.getApp())
        .post('/api/v1/user/login')
        .send({ email: userData.email, password: userData.password });
      console.log('Login Response:', res.body);

      expect(res.status).to.equal(200);
      expect(res.body.data).to.have.property('token');
      token = res.body.data.token;
    });
  });

  describe('Forgot Password', () => {
    it(`"should send a reset token to the user\'s email"`, async function () {
      this.timeout(10000); // Increase timeout to 10 seconds

      const res = await request(app.getApp())
        .post('/api/v1/user/forget-password')
        .send({ email: userData.email });

      console.log(res.body);
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property(
        'message',
        'Reset token sent to email successfully'
      );
    });
  });

  describe('Create Note', () => {
    it('should create a new note successfully', async () => {
      const res = await request(app.getApp())
        .post('/api/v1/note')
        .set('Authorization', `Bearer ${token}`)
        .send(noteData);
      console.log(res.body);
      expect(res.status).to.equal(201);
      expect(res.body).to.have.property('message', 'Note created successfully');
      createdNoteId = res.body.data._id;
    });
  });

  describe('Get All Notes', () => {
    it('should return all notes of the user', async () => {
      const res = await request(app.getApp())
        .get('/api/v1/note/')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).to.equal(200);
      expect(res.body.data).to.be.an('array');
    });
  });

  describe('Get Note by ID', () => {
    it('should return a note by its ID', async () => {
      const noteId = createdNoteId; // Get the ID of the created note

      const res = await request(app.getApp())
        .get(`/api/v1/note/${noteId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).to.equal(200);
      expect(res.body.data).to.have.property('_id', noteId);
    });
  });

  describe('Update Note', () => {
    it('should update a note successfully', async () => {
      const res = await request(app.getApp())
        .put(`/api/v1/note/${createdNoteId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updatedNoteData);

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('message', 'Note updated successfully');
    });
  });

  describe('Archive/Unarchive Note', () => {
    it('should archive a note successfully', async () => {
      const res = await request(app.getApp())
        .put(`/api/v1/note/${createdNoteId}/archive`)
        .set('Authorization', `Bearer ${token}`);
      console.log(res.body);
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property(
        'message',
        'Note unarchived successfully'
      );
    });
  });

  describe('Trash/Restore Note', () => {
    it('should trash a note successfully', async () => {
      const res = await request(app.getApp())
        .put(`/api/v1/note/${createdNoteId}/trash`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property(
        'message',
        'Note moved to trash successfully'
      );
    });
  });

  describe('Delete Note Forever', () => {
    it('should delete a note permanently', async () => {
      const res = await request(app.getApp())
        .delete(`/api/v1/note/${createdNoteId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('message', 'Note deleted permanently');
    });
  });
});
