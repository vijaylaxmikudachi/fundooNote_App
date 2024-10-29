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
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const user_service_1 = __importDefault(require("../services/user.service"));
const user_util_1 = require("../utils/user.util");
class UserController {
    constructor() {
        this.UserService = new user_service_1.default();
        // Register user
        this.registerUser = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.UserService.registerUser(req.body);
                res.status(http_status_codes_1.default.CREATED).json({
                    code: http_status_codes_1.default.CREATED,
                    data: data,
                    message: 'User registered successfully'
                });
            }
            catch (error) {
                next(error); // Pass the error to the next middleware
            }
        });
        // Log in user
        this.loginUser = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { token, user } = yield this.UserService.loginUser(req.body);
                res.status(http_status_codes_1.default.OK).json({
                    code: http_status_codes_1.default.OK,
                    data: { user, token }, // Return the user and token
                    message: 'Login successful'
                });
            }
            catch (error) {
                res.status(http_status_codes_1.default.UNAUTHORIZED).send(error.message);
            }
        });
        // Forget password
        this.forgetPassword = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                const token = yield this.UserService.forgetPassword(email);
                // Send token via email
                yield (0, user_util_1.sendEmail)(email, token);
                res.status(http_status_codes_1.default.OK).json({
                    code: http_status_codes_1.default.OK,
                    message: 'Reset token sent to email successfully',
                });
            }
            catch (error) {
                next(error);
            }
        });
        // Reset password
        this.resetPassword = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const token = (_a = req.header('Authorization')) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
                const { newPassword } = req.body;
                if (!token) {
                    return res.status(http_status_codes_1.default.UNAUTHORIZED).json({
                        code: http_status_codes_1.default.UNAUTHORIZED,
                        message: 'Authorization token is required'
                    });
                }
                const userId = res.locals.user; // Get the user ID from the JWT
                yield this.UserService.resetPassword(newPassword, userId);
                res.status(http_status_codes_1.default.OK).json({
                    code: http_status_codes_1.default.OK,
                    message: 'Password reset successfully',
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.default = UserController;
