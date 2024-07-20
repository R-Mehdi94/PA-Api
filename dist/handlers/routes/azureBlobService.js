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
exports.AzureBlobService = void 0;
const token_1 = require("../../database/entities/token");
const database_1 = require("../../database/database");
const auth_middleware_1 = require("../middleware/auth-middleware");
const user_1 = require("../../database/entities/user");
const upload_1 = __importDefault(require("../middleware/upload"));
const azureBlob_validator_1 = require("../validators/azureBlob-validator");
const generate_validation_message_1 = require("../validators/generate-validation-message");
const user_validator_1 = require("../validators/user-validator");
const user_usecase_1 = require("../../domain/user-usecase");
const azureBlobService_usecase_1 = require("../../domain/azureBlobService-usecase");
const AzureBlobService = (app) => {
    app.post("/getFiles/:id", auth_middleware_1.authMiddlewareAll, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const validationResult = user_validator_1.userIdValidation.validate(Object.assign(Object.assign({}, req.params), req.body));
        if (validationResult.error) {
            res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validationResult.error.details));
            return;
        }
        const userUsecase = new user_usecase_1.UserUsecase(database_1.AppDataSource);
        if ((yield userUsecase.verifUser(+req.params.id, req.body.token)) === false) {
            res.status(400).send({ "error": `Bad user` });
            return;
        }
        const userId = validationResult.value.id;
        try {
            const azureUseCase = new azureBlobService_usecase_1.AzureBlobServiceUsecase(database_1.AppDataSource);
            const blobName = yield azureUseCase.getBlobName(userId);
            if (!blobName) {
                res.status(200).send({ "reponse": `Aucun fichier` });
                return;
            }
            res.json({ blobName });
        }
        catch (error) {
            console.error(error);
            res.status(500).send('Internal server error');
        }
    }));
    app.post("/generate-sas-url/:id", auth_middleware_1.authMiddlewareAll, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const validationResult = azureBlob_validator_1.azureBlobService.validate(Object.assign(Object.assign({}, req.params), req.body));
        if (validationResult.error) {
            res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validationResult.error.details));
            return;
        }
        const userUsecase = new user_usecase_1.UserUsecase(database_1.AppDataSource);
        if ((yield userUsecase.verifUser(+req.params.id, req.body.token)) === false) {
            res.status(400).send({ "error": `Bad user` });
            return;
        }
        const userId = validationResult.value.id;
        const blobName = validationResult.value.blobName;
        const tokenRepo = database_1.AppDataSource.getRepository(token_1.Token);
        try {
            const token = yield tokenRepo.findOne({
                where: [
                    { user: { id: +userId }, blobName: blobName },
                    { user: { id: undefined }, blobName: blobName }
                ]
            });
            if (!token) {
                return res.status(404).send('No token found for the specified blob and user');
            }
            const validityInMinutes = 10; // 10 minutes
            const azureUseCase = new azureBlobService_usecase_1.AzureBlobServiceUsecase(database_1.AppDataSource);
            const sasUrl = yield azureUseCase.generateSasToken(blobName, validityInMinutes);
            res.json({ sasUrl });
        }
        catch (error) {
            console.error(error);
            res.status(500).send('Internal server error');
        }
    }));
    app.post("/upload-document/:id", auth_middleware_1.authMiddlewareAll, upload_1.default.single('file'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const validationResult = user_validator_1.userIdValidation.validate(Object.assign(Object.assign({}, req.params), req.body));
        if (validationResult.error) {
            res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validationResult.error.details));
            return;
        }
        const userUsecase = new user_usecase_1.UserUsecase(database_1.AppDataSource);
        if ((yield userUsecase.verifUser(+req.params.id, req.body.token)) === false) {
            res.status(400).send({ "error": `Bad user` });
            return;
        }
        const userId = validationResult.value.id;
        const file = req.file;
        if (!file) {
            return res.status(400).send('No file uploaded');
        }
        console.log("User ID:", userId);
        const tokenRepo = database_1.AppDataSource.getRepository(token_1.Token);
        const userRepo = database_1.AppDataSource.getRepository(user_1.User);
        try {
            const user = yield userRepo.findOne({ where: { id: +userId } });
            if (!user) {
                return res.status(404).send('User not found');
            }
            const blobName = `${file.originalname}`;
            const mimeType = file.mimetype;
            const azureUseCase = new azureBlobService_usecase_1.AzureBlobServiceUsecase(database_1.AppDataSource);
            yield azureUseCase.uploadBlob(blobName, file.buffer, mimeType);
            const newToken = tokenRepo.create({
                token: 'some-generated-token',
                blobName: blobName,
                user: user
            });
            yield tokenRepo.save(newToken);
            res.status(200).send('File uploaded and token saved');
        }
        catch (error) {
            console.error(error);
            res.status(500).send('Internal server error');
        }
    }));
    app.delete("/delete-document/:id", auth_middleware_1.authMiddlewareAll, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const validationResult = azureBlob_validator_1.azureBlobService.validate(Object.assign(Object.assign({}, req.params), req.body));
        if (validationResult.error) {
            res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validationResult.error.details));
            return;
        }
        const userUsecase = new user_usecase_1.UserUsecase(database_1.AppDataSource);
        if ((yield userUsecase.verifUser(+req.params.id, req.body.token)) === false) {
            res.status(400).send({ "error": `Bad user` });
            return;
        }
        const userId = validationResult.value.id;
        const blobName = validationResult.value.blobName;
        const tokenRepo = database_1.AppDataSource.getRepository(token_1.Token);
        try {
            const token = yield tokenRepo.findOne({ where: { user: { id: +userId }, blobName } });
            if (!token) {
                return res.status(404).send('Blob not found or you do not have access');
            }
            yield tokenRepo.remove(token);
            const azureUseCase = new azureBlobService_usecase_1.AzureBlobServiceUsecase(database_1.AppDataSource);
            yield azureUseCase.deleteBlob(blobName);
            res.status(200).send('Blob deleted successfully');
        }
        catch (error) {
            console.error(error);
            res.status(500).send('Internal server error');
        }
    }));
};
exports.AzureBlobService = AzureBlobService;
