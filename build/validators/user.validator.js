"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("@hapi/joi"));
class UserValidator {
    constructor() {
        this.validateRegistration = (req, res, next) => {
            const schema = joi_1.default.object({
                name: joi_1.default.string().min(6).required(),
                email: joi_1.default.string().email().required(),
                username: joi_1.default.string().min(8).required(),
                password: joi_1.default.string().min(8).required()
            });
            const { error } = schema.validate(req.body);
            if (error) {
                next(error);
            }
            next();
        };
        this.validateLogin = (req, res, next) => {
            if (req.body.email) {
                var schema = joi_1.default.object({
                    email: joi_1.default.string().email().required(),
                    password: joi_1.default.string().required()
                });
            }
            else {
                var schema = joi_1.default.object({
                    username: joi_1.default.string().required(),
                    password: joi_1.default.string().required()
                });
            }
            const { error } = schema.validate(req.body);
            if (error) {
                next(error);
            }
            next();
        };
    }
}
exports.default = UserValidator;
