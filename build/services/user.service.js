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
class UserService {
    constructor() {
        //get all users
        this.getAllUsers = () => __awaiter(this, void 0, void 0, function* () {
            const data = yield user_model_1.default.find();
            return data;
        });
        //create new user
        this.newUser = (body) => __awaiter(this, void 0, void 0, function* () {
            const data = yield user_model_1.default.create(body);
            return data;
        });
        //update a user
        this.updateUser = (_id, body) => __awaiter(this, void 0, void 0, function* () {
            const data = yield user_model_1.default.findByIdAndUpdate({
                _id
            }, body, {
                new: true
            });
            return data;
        });
        //delete a user
        this.deleteUser = (_id) => __awaiter(this, void 0, void 0, function* () {
            yield user_model_1.default.findByIdAndDelete(_id);
            return '';
        });
        //get a single user
        this.getUser = (_id) => __awaiter(this, void 0, void 0, function* () {
            const data = yield user_model_1.default.findById(_id);
            return data;
        });
    }
}
exports.default = UserService;
