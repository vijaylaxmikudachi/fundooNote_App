"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = __importDefault(require("../controllers/user.controller"));
const user_validator_1 = __importDefault(require("../validators/user.validator"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
class UserRoutes {
    constructor() {
        this.UserController = new user_controller_1.default();
        this.router = express_1.default.Router();
        this.UserValidator = new user_validator_1.default();
        this.routes = () => {
            //route to create a new user
            this.router.post('/register', this.UserValidator.newUser, this.UserController.registerUser);
            //route to login
            this.router.post('/login', this.UserValidator.userlogin, this.UserController.loginUser);
            // Forget password route
            this.router.post('/forget-password', this.UserController.forgetPassword);
            // Reset password route
            this.router.post('/reset-password', auth_middleware_1.passwordResetAuth, this.UserController.resetPassword);
        };
        this.getRoutes = () => {
            return this.router;
        };
        this.routes();
    }
}
exports.default = UserRoutes;
