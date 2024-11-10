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
describe('User APIs Test', () => {
    before((done) => {
        const clearCollections = () => {
            for (const collection in mongoose_1.default.connection.collections) {
                mongoose_1.default.connection.collections[collection].deleteOne(() => { });
            }
        };
        const mongooseConnect = () => __awaiter(void 0, void 0, void 0, function* () {
            yield mongoose_1.default.connect(process.env.DATABASE_TEST);
            clearCollections();
        });
        if (mongoose_1.default.connection.readyState === 0) {
            mongooseConnect();
        }
        else {
            clearCollections();
        }
        done();
    });
    const userData = {
        firstName: 'test',
        lastName: 'user',
        email: 'kudachivijaylaxmi29@gmail.com',
        password: 'test123',
    };
    const noteData = {
        title: 'Test Note',
        description: 'This is a test note.',
        color: 'blue',
        isArchive: false,
        isTrash: false,
    };
    const updatedNoteData = {
        title: 'Updated Test Note',
        description: 'This is an updated test note.',
        color: 'green',
        isArchive: true,
        isTrash: false,
    };
    let token; // For storing token generated during login
    let createdNoteId;
    describe('User Registration', () => {
        it('should register a new user successfully', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(index_1.default.getApp())
                .post('/api/v1/users/register')
                .send(userData);
            (0, chai_1.expect)(res.status).to.equal(201);
            (0, chai_1.expect)(res.body).to.have.property('message', 'User registered successfully');
        }));
    });
    describe('User Login', () => {
        it('should log in an existing user successfully', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(index_1.default.getApp())
                .post('/api/v1/users/login')
                .send({ email: userData.email, password: userData.password });
            console.log('Login Response:', res.body);
            (0, chai_1.expect)(res.status).to.equal(200);
            (0, chai_1.expect)(res.body.data).to.have.property('token'); // Check for the token presence
            token = res.body.data.token;
        }));
    });
    describe('Forgot Password', () => {
        it('should send a reset token to the user\'s email', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(index_1.default.getApp())
                .post('/api/v1/users/forget-password')
                .send({ email: userData.email });
            console.log(res.body);
            (0, chai_1.expect)(res.status).to.equal(200);
            (0, chai_1.expect)(res.body).to.have.property('message', 'Reset token sent to email successfully');
        }));
    });
    describe('Create Note', () => {
        it('should create a new note successfully', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(index_1.default.getApp())
                .post('/api/v1/notes/create')
                .set('Authorization', `Bearer ${token}`) // Set the Authorization header with the token
                .send(noteData);
            console.log(res.body);
            (0, chai_1.expect)(res.status).to.equal(201);
            (0, chai_1.expect)(res.body).to.have.property('message', 'Note created successfully'); // Adjust according to your API response
            createdNoteId = res.body.data._id; // Store the created note ID for further tests
        }));
    });
    describe('Get All Notes', () => {
        it('should return all notes of the user', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(index_1.default.getApp())
                .get('/api/v1/notes/')
                .set('Authorization', `Bearer ${token}`);
            (0, chai_1.expect)(res.status).to.equal(200);
            (0, chai_1.expect)(res.body.data).to.be.an('array');
        }));
    });
    describe('Get Note by ID', () => {
        it('should return a note by its ID', () => __awaiter(void 0, void 0, void 0, function* () {
            const noteId = createdNoteId; // Get the ID of the created note
            const res = yield (0, supertest_1.default)(index_1.default.getApp())
                .get(`/api/v1/notes/${noteId}`)
                .set('Authorization', `Bearer ${token}`);
            (0, chai_1.expect)(res.status).to.equal(200);
            (0, chai_1.expect)(res.body.data).to.have.property('_id', noteId);
        }));
    });
    describe('Update Note', () => {
        it('should update a note successfully', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(index_1.default.getApp())
                .put(`/api/v1/notes/update/${createdNoteId}`)
                .set('Authorization', `Bearer ${token}`)
                .send(updatedNoteData);
            (0, chai_1.expect)(res.status).to.equal(200);
            (0, chai_1.expect)(res.body).to.have.property('message', 'Note updated successfully'); // Adjust according to your API response
        }));
    });
    describe('Archive/Unarchive Note', () => {
        it('should archive a note successfully', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(index_1.default.getApp())
                .put(`/api/v1/notes/archive/${createdNoteId}`)
                .set('Authorization', `Bearer ${token}`);
            console.log(res.body);
            (0, chai_1.expect)(res.status).to.equal(200);
            (0, chai_1.expect)(res.body).to.have.property('message', 'Note unarchived successfully'); // Adjust according to your API response
        }));
    });
    describe('Trash/Restore Note', () => {
        it('should trash a note successfully', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(index_1.default.getApp())
                .put(`/api/v1/notes/trash/${createdNoteId}`)
                .set('Authorization', `Bearer ${token}`);
            (0, chai_1.expect)(res.status).to.equal(200);
            (0, chai_1.expect)(res.body).to.have.property('message', 'Note moved to trash successfully'); // Adjust according to your API response
        }));
        // it('should restore the trashed note successfully', async () => {
        //   const res = await request(app.getApp())
        //     .put(`/api/v1/notes/trash/${createdNoteId}`)
        //     .set('Authorization', `Bearer ${token}`);
        //   expect(res.status).to.equal(200);
        //   expect(res.body).to.have.property('message', 'Note restored successfully'); // Adjust according to your API response
        // });
    });
    describe('Delete Note Forever', () => {
        it('should delete a note permanently', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(index_1.default.getApp())
                .delete(`/api/v1/notes/delete/${createdNoteId}`)
                .set('Authorization', `Bearer ${token}`);
            (0, chai_1.expect)(res.status).to.equal(200);
            (0, chai_1.expect)(res.body).to.have.property('message', 'Note deleted permanently'); // Adjust according to your API response
        }));
    });
});
