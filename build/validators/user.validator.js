"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("@hapi/joi"));
class UserValidator {
    constructor() {
        //validation for register
        this.newUser = (req, res, next) => {
            const schema = joi_1.default.object({
                firstName: joi_1.default.string().min(2).max(30).required(),
                lastName: joi_1.default.string().min(2).max(30).required(),
                email: joi_1.default.string().email().required(),
                password: joi_1.default.string().min(6).required()
            });
            const { error } = schema.validate(req.body);
            if (error) {
                return next(error); // Pass the validation error to the next middleware
            }
            next(); // Proceed to the next middleware if validation is successful
        };
        //validation for login
        this.userlogin = (req, res, next) => {
            const schema = joi_1.default.object({
                email: joi_1.default.string().email().required(),
                password: joi_1.default.string().min(6).required()
            });
            const { error } = schema.validate(req.body);
            if (error) {
                return next(error); // Pass the validation error to the next middleware
            }
            next(); // Proceed to the next middleware if validation is successful
        };
        // Validate email for forget password
        this.emailValidator = (req, res, next) => {
            const schema = joi_1.default.object({
                email: joi_1.default.string().email().required(),
            });
            const { error } = schema.validate(req.body);
            if (error) {
                return res.status(400).json({
                    error: error.details[0].message,
                });
            }
            next();
        };
        // Validate reset password request (token and new password)
        this.resetPasswordValidator = (req, res, next) => {
            const schema = joi_1.default.object({
                token: joi_1.default.string().required(),
                newPassword: joi_1.default.string().min(6).required(),
            });
            const { error } = schema.validate(req.body);
            if (error) {
                return res.status(400).json({
                    error: error.details[0].message,
                });
            }
            next();
        };
    }
}
exports.default = UserValidator;
