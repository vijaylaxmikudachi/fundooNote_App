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
const user_model_1 = __importDefault(require("../models/user.model"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class UserService {
    constructor() {
        this.registerUser = (name, email, username, password, confirmPassword) => __awaiter(this, void 0, void 0, function* () {
            // Check if the username or email already exists
            const existingUser = yield user_model_1.default.findOne({ $or: [{ email: email }, { username: username }] });
            if (existingUser) {
                throw new Error('User with this email or username already exists');
            }
            //Here Adding Password Hashing , Before Saving Data In DB
            const salt = yield bcryptjs_1.default.genSalt(10);
            const hashPassword = yield bcryptjs_1.default.hash(password, salt);
            // Save the user with the hashed password
            const newUser = new user_model_1.default({
                name,
                email,
                username,
                password: hashPassword
            });
            return yield newUser.save();
        });
        // Define a function to log in a user
        this.loginUser = (email, username, password) => __awaiter(this, void 0, void 0, function* () {
            const user = yield user_model_1.default.findOne({ $or: [{ email: email }, { username: username }] });
            if (!user) {
                throw new Error('User not found');
            }
            // Compare the provided password with the hashed password in the database
            const isMatch = yield bcryptjs_1.default.compare(password, user.password);
            if (!isMatch) {
                throw new Error('Invalid credentials');
            }
            // Generate JWT Token 
            const token = jsonwebtoken_1.default.sign({ id: user._id, email: user.email, username: user.username }, // Payload data
            process.env.JWT_SECRET);
            return { token };
        });
    }
}
exports.default = UserService;
