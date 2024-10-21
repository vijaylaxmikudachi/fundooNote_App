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
            //route to get all users
            this.router.get('', this.UserController.getAllUsers);
            //route to create a new user
            this.router.post('', this.UserValidator.newUser, this.UserController.newUser);
            //route to get a single user
            this.router.get('/:_id', auth_middleware_1.userAuth, this.UserController.getUser);
            //route to update a single user
            this.router.put('/:_id', this.UserController.updateUser);
            //route to delete a single user
            this.router.delete('/:_id', this.UserController.deleteUser);
        };
        this.getRoutes = () => {
            return this.router;
        };
        this.routes();
    }
}
exports.default = UserRoutes;
