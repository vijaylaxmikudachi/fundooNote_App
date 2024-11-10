"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const user_route_1 = __importDefault(require("./user.route"));
const note_route_1 = __importDefault(require("./note.route")); // Import the note route
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const openai_json_1 = __importDefault(require("../openai.json"));
// Set up the Swagger documentation route
router.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(openai_json_1.default));
console.log('Swagger Docs available at /api-docs');
/**
 * Function contains Application routes
 *
 * @returns router
 */
const routes = () => {
    // Root route
    router.get('/', (req, res) => {
        res.json('Welcome to Fundoo Notes');
    });
    // User routes
    router.use('/users', new user_route_1.default().getRoutes());
    // Note routes
    router.use('/notes', new note_route_1.default().getRoutes()); // Add the note routes
    return router;
};
exports.default = routes;
