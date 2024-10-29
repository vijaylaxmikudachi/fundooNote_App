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
exports.resetPassword = exports.forgetPassword = void 0;
const user_model_1 = __importDefault(require("../models/user.model")); // Your user model
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const nodemailer_1 = __importDefault(require("nodemailer"));
// Forget Password Handler
const forgetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    try {
        const user = yield user_model_1.default.findOne({ email });
        if (!user)
            return res.status(404).json({ message: 'User not found' });
        const token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_RESET_SECRET, { expiresIn: '15m' });
        // Send reset password email
        const transporter = nodemailer_1.default.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD,
            },
        });
        const mailOptions = {
            from: process.env.EMAIL_USERNAME,
            to: user.email,
            subject: 'Password Reset',
            text: `To reset your password, click the link: ${process.env.CLIENT_URL}/reset-password/${token}`,
        };
        yield transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Password reset email sent' });
    }
    catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});
exports.forgetPassword = forgetPassword;
// Reset Password Handler
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.params;
    const { newPassword } = req.body;
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_RESET_SECRET);
        if (typeof decoded === 'string') {
            return res.status(400).json({ message: 'Invalid token format' });
        }
        const user = yield user_model_1.default.findById(decoded.id);
        if (!user)
            return res.status(404).json({ message: 'User not found' });
        const hashedPassword = yield bcryptjs_1.default.hash(newPassword, 10);
        user.password = hashedPassword;
        yield user.save();
        res.status(200).json({ message: 'Password has been reset successfully' });
    }
    catch (err) {
        res.status(400).json({ message: 'Invalid or expired token', error: err.message });
    }
});
exports.resetPassword = resetPassword;
