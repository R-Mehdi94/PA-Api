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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserHandler = void 0;
const database_1 = require("../../../database/database");
const user_1 = require("../../../database/entities/user");
const user_usecase_1 = require("../../../domain/user-usecase");
const generate_validation_message_1 = require("../../validators/generate-validation-message");
const user_validator_1 = require("../../validators/user-validator");
const bcrypt_1 = require("bcrypt");
const UserHandler = (app) => {
    app.post("/usersEmail", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const userUsecase = new user_usecase_1.UserUsecase(database_1.AppDataSource);
            const listUserEmail = yield userUsecase.getUserEmail();
            res.status(200).send(listUserEmail);
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
    app.get("/users/blobName/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
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
            const userId = validationResult.value;
            const user = yield userUsecase.getOneUser(userId.id);
            if (user === null) {
                res.status(404).send({ "error": `User ${userId.id} not found` });
                return;
            }
            const listBlobName = [];
            for (const element of user.tokens) {
                if (element.blobName !== null) {
                    listBlobName.push(element.blobName);
                }
            }
            res.status(200).send(listBlobName);
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
    app.get("/users", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const validation = user_validator_1.listUserValidation.validate(req.query);
        if (validation.error) {
            res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validation.error.details));
            return;
        }
        const listUserRequest = validation.value;
        let limit = 20;
        if (listUserRequest.limit) {
            limit = listUserRequest.limit;
        }
        const page = (_a = listUserRequest.page) !== null && _a !== void 0 ? _a : 1;
        try {
            const userUsecase = new user_usecase_1.UserUsecase(database_1.AppDataSource);
            const listUsers = yield userUsecase.listUsers(Object.assign(Object.assign({}, listUserRequest), { page, limit }));
            res.status(200).send(listUsers);
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
    app.post("/users", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const validation = user_validator_1.createUserValidation.validate(req.body);
        if (validation.error) {
            res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validation.error.details));
            return;
        }
        const userRequest = validation.value;
        const userRepo = database_1.AppDataSource.getRepository(user_1.User);
        try {
            const userCreated = yield userRepo.save(userRequest);
            res.status(201).send(userCreated);
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
    app.delete("/users/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
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
            const userId = validationResult.value;
            const userRepository = database_1.AppDataSource.getRepository(user_1.User);
            const user = yield userRepository.findOneBy({ id: userId.id });
            if (user === null) {
                res.status(404).send({ "error": `User ${userId.id} not found` });
                return;
            }
            yield userRepository.remove(user);
            res.status(200).send("User supprimé avec succès");
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
    app.get("/users/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
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
            const userId = validationResult.value;
            const user = yield userUsecase.getOneUser(userId.id);
            if (user === null) {
                res.status(404).send({ "error": `User ${userId.id} not found` });
                return;
            }
            res.status(200).send(user);
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
    app.patch("/users/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const validationResult = user_validator_1.updateUserValidation.validate(Object.assign(Object.assign({}, req.params), req.body));
            if (validationResult.error) {
                res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validationResult.error.details));
                return;
            }
            const userUsecase = new user_usecase_1.UserUsecase(database_1.AppDataSource);
            let user = yield database_1.AppDataSource.getRepository(user_1.User).findOneBy({ id: validationResult.value.id });
            if ((user === null || user === void 0 ? void 0 : user.role) !== "Administrateur") {
                if ((yield userUsecase.verifUser(+req.params.id, req.body.token)) === false) {
                    res.status(400).send({ "error": `Bad user` });
                    return;
                }
            }
            if (validationResult.value.motDePasse !== undefined) {
                validationResult.value.motDePasse = yield (0, bcrypt_1.hash)(validationResult.value.motDePasse, 10);
            }
            const updateUserRequest = validationResult.value;
            const updatedUser = yield userUsecase.updateUser(updateUserRequest.id, Object.assign({}, updateUserRequest));
            if (updatedUser === null) {
                res.status(404).send({ "error": `User ${updateUserRequest.id} not found` });
                return;
            }
            if (updatedUser === "No update provided") {
                res.status(400).send({ "error": `No update provided` });
                return;
            }
            res.status(200).send(updatedUser);
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
    app.patch("/visiteurs/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const validation = user_validator_1.updateUserValidation.validate(Object.assign(Object.assign({}, req.params), req.body));
        if (validation.error) {
            res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validation.error.details));
            return;
        }
        const updateUserRequest = validation.value;
        try {
            if (updateUserRequest.role !== "visiteur") {
                res.status(400).send({ "error": `User ${updateUserRequest.id} n'est pas un visiteur` });
                return;
            }
            const userUsecase = new user_usecase_1.UserUsecase(database_1.AppDataSource);
            if ((yield userUsecase.verifUser(+req.params.id, req.body.token)) === false) {
                res.status(400).send({ "error": `Bad user` });
                return;
            }
            const validationResult = user_validator_1.userIdValidation.validate(req.params);
            if (validationResult.error) {
                res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validationResult.error.details));
                return;
            }
            const updatedUser = yield userUsecase.updateUser(updateUserRequest.id, Object.assign({}, updateUserRequest));
            if (updatedUser === null) {
                res.status(404).send({ "error": `User ${updateUserRequest.id} not found` });
                return;
            }
            if (updatedUser === "No update provided") {
                res.status(400).send({ "error": `No update provided` });
                return;
            }
            res.status(200).send(updatedUser);
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
};
exports.UserHandler = UserHandler;
