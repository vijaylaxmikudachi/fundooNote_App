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
class UserService {
    constructor() {
        // Create new user
        this.registerUser = (body) => __awaiter(this, void 0, void 0, function* () {
            // Check if user already exists
            const existingUser = yield user_model_1.default.findOne({ email: body.email });
            if (existingUser) {
                throw new Error('User already exists'); // Logic moved here
            }
            // Hash the password
            const hashedPassword = yield bcryptjs_1.default.hash(body.password, 10);
            body.password = hashedPassword; // Store the hashed password
            // Create a new user
            const data = yield user_model_1.default.create(body);
            return data;
        });
        // Log in user
        this.loginUser = (body) => __awaiter(this, void 0, void 0, function* () {
            const { email, password } = body;
            // Check if user exists
            const user = yield user_model_1.default.findOne({ email });
            if (!user) {
                console.log("hello");
                throw new Error('Invalid email or password');
            }
            // Compare the provided password with the hashed password
            const isMatch = yield bcryptjs_1.default.compare(password, user.password);
            if (!isMatch) {
                throw new Error('Invalid email or password');
            }
            // Generate JWT
            const token = jsonwebtoken_1.default.sign({ user: { _id: user._id, email: user.email } }, process.env.JWT_SECRET);
            return { token, user }; // Return the token and user object if login is successful
        });
        // Forget password service
        this.forgetPassword = (email) => __awaiter(this, void 0, void 0, function* () {
            const user = yield user_model_1.default.findOne({ email });
            if (!user) {
                throw new Error('User not found');
            }
            const token = jsonwebtoken_1.default.sign({ user: { _id: user._id } }, process.env.JWT_SECRET1);
            return token;
        });
        // Reset password service
        this.resetPassword = (newPassword, userId) => __awaiter(this, void 0, void 0, function* () {
            const user = yield user_model_1.default.findById(userId);
            if (!user) {
                throw new Error('Invalid or expired token');
            }
            const hashedPassword = yield bcryptjs_1.default.hash(newPassword, 10);
            user.password = hashedPassword;
            yield user.save();
        });
    }
}
exports.default = UserService;
