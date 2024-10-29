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
const chai_1 = require("chai");
const supertest_1 = __importDefault(require("supertest"));
const mongoose_1 = __importDefault(require("mongoose"));
const index_1 = __importDefault(require("../../src/index"));
describe('Notes APIs Test', () => {
    let userToken; // Stores JWT for authenticated requests
    let createdNoteId; // Stores the ID of the created note
    before(() => __awaiter(void 0, void 0, void 0, function* () {
        const clearCollections = () => {
            for (const collection in mongoose_1.default.connection.collections) {
                mongoose_1.default.connection.collections[collection].deleteMany(() => { });
            }
        };
        const mongooseConnect = () => __awaiter(void 0, void 0, void 0, function* () {
            yield mongoose_1.default.connect(process.env.DATABASE_TEST);
            clearCollections();
        });
        if (mongoose_1.default.connection.readyState === 0) {
            yield mongooseConnect();
        }
        else {
            clearCollections();
        }
        const mockUser = {
            email: 'preethambstest@gmail.com',
            password: 'Preethambs',
            firstName: 'Preetham',
            lastName: 'B S',
        };
        yield (0, supertest_1.default)(index_1.default.getApp())
            .post('/api/v1/users/register')
            .send(mockUser);
        // Log in the user to get a token
        const loginResponse = yield (0, supertest_1.default)(index_1.default.getApp())
            .post('/api/v1/users/login')
            .send({ email: mockUser.email, password: mockUser.password });
        userToken = loginResponse.body.token; // Store the token for future requests
    }));
    after(() => __awaiter(void 0, void 0, void 0, function* () {
        // Disconnect from the database after tests
        yield mongoose_1.default.disconnect();
    }));
    describe('POST /api/v1/notes/create', () => {
        it('should create a new note successfully', (done) => {
            const mockNote = {
                title: 'Sample Note',
                description: 'This is a sample note.',
            };
            (0, supertest_1.default)(index_1.default.getApp())
                .post('/api/v1/notes/create')
                .set('Authorization', `Bearer ${userToken}`)
                .send(mockNote)
                .end((err, res) => {
                (0, chai_1.expect)(res.statusCode).to.equal(201);
                (0, chai_1.expect)(res.body.message).to.equal('Note created successfully');
                (0, chai_1.expect)(res.body.data).to.have.property('_id'); // Ensure an ID is returned
                createdNoteId = res.body.data._id; // Store the created note ID for further tests
                done();
            });
        });
    });
    describe('GET /api/v1/notes/', () => {
        it('should retrieve all notes for the user', (done) => {
            (0, supertest_1.default)(index_1.default.getApp())
                .get('/api/v1/notes/')
                .set('Authorization', `Bearer ${userToken}`)
                .end((err, res) => {
                (0, chai_1.expect)(res.statusCode).to.equal(200);
                (0, chai_1.expect)(res.body.data).to.be.an('array');
                done();
            });
        });
    });
    describe('GET /api/v1/notes/:id', () => {
        it('should retrieve a note by ID', (done) => {
            (0, supertest_1.default)(index_1.default.getApp())
                .get(`/api/v1/notes/${createdNoteId}`)
                .set('Authorization', `Bearer ${userToken}`)
                .end((err, res) => {
                (0, chai_1.expect)(res.statusCode).to.equal(200);
                (0, chai_1.expect)(res.body.data).to.have.property('_id', createdNoteId); // Ensure the correct note is returned
                done();
            });
        });
    });
    describe('PUT /api/v1/notes/update/:id', () => {
        it('should update a note successfully', (done) => {
            const updatedNote = {
                title: 'Updated Sample Note',
                description: 'This is an updated note.',
            };
            (0, supertest_1.default)(index_1.default.getApp())
                .put(`/api/v1/notes/update/${createdNoteId}`)
                .set('Authorization', `Bearer ${userToken}`)
                .send(updatedNote)
                .end((err, res) => {
                (0, chai_1.expect)(res.statusCode).to.be.equal(200);
                (0, chai_1.expect)(res.body.message).to.equal('Note updated successfully');
                (0, chai_1.expect)(res.body.data).to.have.property('title', updatedNote.title);
                done();
            });
        });
        it('should return an error for a non-existent note ID', (done) => {
            const nonExistentId = '60f7f2a4a2e2b32f1b6e2d50'; // Example of a non-existent ID
            const updatedNote = {
                title: 'Updated Sample Note',
                description: 'This is an updated note.',
            };
            (0, supertest_1.default)(index_1.default.getApp())
                .put(`/api/v1/notes/update/${nonExistentId}`)
                .set('Authorization', `Bearer ${userToken}`)
                .send(updatedNote)
                .end((err, res) => {
                (0, chai_1.expect)(res.statusCode).to.be.equal(400);
                (0, chai_1.expect)(res.body.message).to.include('Note not found');
                done();
            });
        });
    });
    describe('PUT /api/v1/notes/archive/:id', () => {
        it('should archive a note successfully', (done) => {
            (0, supertest_1.default)(index_1.default.getApp())
                .put(`/api/v1/notes/archive/${createdNoteId}`)
                .set('Authorization', `Bearer ${userToken}`)
                .end((err, res) => {
                (0, chai_1.expect)(res.statusCode).to.equal(200);
                (0, chai_1.expect)(res.body.message).to.equal('Note moved to the Archive successfully'); // Adjusted message
                done();
            });
        });
        it('should return an error for a non-existent note ID', (done) => {
            const nonExistentId = '60f7f2a4a2e2b32f1b6e2d50'; // Example of a non-existent ID
            (0, supertest_1.default)(index_1.default.getApp())
                .put(`/api/v1/notes/archive/${nonExistentId}`)
                .set('Authorization', `Bearer ${userToken}`)
                .end((err, res) => {
                (0, chai_1.expect)(res.statusCode).to.be.equal(400);
                (0, chai_1.expect)(res.body.message).to.include('Note not found');
                done();
            });
        });
    });
    describe('PUT /api/v1/notes/trash/:id', () => {
        it('should trash a note successfully', (done) => {
            (0, supertest_1.default)(index_1.default.getApp())
                .put(`/api/v1/notes/trash/${createdNoteId}`)
                .set('Authorization', `Bearer ${userToken}`)
                .end((err, res) => {
                (0, chai_1.expect)(res.statusCode).to.equal(200);
                (0, chai_1.expect)(res.body.message).to.equal('Note moved to the Trash successfully'); // Adjusted message
                done();
            });
        });
    });
    describe('DELETE /api/v1/notes/delete/:id', () => {
        it('should permanently delete a note successfully', (done) => {
            (0, supertest_1.default)(index_1.default.getApp())
                .delete(`/api/v1/notes/delete/${createdNoteId}`)
                .set('Authorization', `Bearer ${userToken}`)
                .end((err, res) => {
                (0, chai_1.expect)(res.statusCode).to.be.equal(200);
                (0, chai_1.expect)(res.body.message).to.equal('Deleted successfully');
                done();
            });
        });
        it('should return an error for a non-existent note ID', (done) => {
            const nonExistentId = '60f7f2a4a2e2b32f1b6e2d50'; // Example of a non-existent ID
            (0, supertest_1.default)(index_1.default.getApp())
                .delete(`/api/v1/notes/delete/${nonExistentId}`)
                .set('Authorization', `Bearer ${userToken}`)
                .end((err, res) => {
                (0, chai_1.expect)(res.statusCode).to.be.equal(400);
                (0, chai_1.expect)(res.body.message).to.include('Note not found');
                done();
            });
        });
    });
});
