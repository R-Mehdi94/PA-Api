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
exports.TacheHandler = void 0;
const generate_validation_message_1 = require("../validators/generate-validation-message");
const database_1 = require("../../database/database");
const user_1 = require("../../database/entities/user");
const tache_validator_1 = require("../validators/tache-validator");
const tache_usecase_1 = require("../../domain/tache-usecase");
const tache_1 = require("../../database/entities/tache");
const TacheHandler = (app) => {
    app.get("/taches", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const validation = tache_validator_1.listTacheValidation.validate(req.query);
        if (validation.error) {
            res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validation.error.details));
            return;
        }
        const listTacheRequest = validation.value;
        let limit = 20;
        if (listTacheRequest.limit) {
            limit = listTacheRequest.limit;
        }
        const page = (_a = listTacheRequest.page) !== null && _a !== void 0 ? _a : 1;
        try {
            const tacheUsecase = new tache_usecase_1.TacheUsecase(database_1.AppDataSource);
            const listTaches = yield tacheUsecase.listTaches(Object.assign(Object.assign({}, listTacheRequest), { page, limit }));
            res.status(200).send(listTaches);
        }
        catch (error) {
            console.log(error);
        }
    }));
    app.post("/taches", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const validation = tache_validator_1.createTacheValidation.validate(req.body);
        if (validation.error) {
            res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validation.error.details));
            return;
        }
        const tacheRequest = validation.value;
        const userRepository = database_1.AppDataSource.getRepository(user_1.User);
        const user = yield userRepository.findOneBy({ id: req.body.responsable });
        if ((user === null || user === void 0 ? void 0 : user.role) !== "Administrateur" && (user === null || user === void 0 ? void 0 : user.role) !== "Adherent") {
            res.status(400).send({ error: "Administrateur ou Adherent requis" });
            return;
        }
        const tacheRepo = database_1.AppDataSource.getRepository(tache_1.Tache);
        try {
            const tacheCreated = yield tacheRepo.save(tacheRequest);
            res.status(201).send(tacheCreated);
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
    app.delete("/taches/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const validationResult = tache_validator_1.tacheIdValidation.validate(req.params);
            if (validationResult.error) {
                res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validationResult.error.details));
                return;
            }
            const tacheId = validationResult.value;
            const tacheRepository = database_1.AppDataSource.getRepository(tache_1.Tache);
            const tache = yield tacheRepository.findOneBy({ id: tacheId.id });
            if (tache === null) {
                res.status(404).send({ "error": `tache ${tacheId.id} not found` });
                return;
            }
            yield tacheRepository.remove(tache);
            res.status(200).send("Tache supprimé avec succès");
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
    app.get("/taches/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const validationResult = tache_validator_1.tacheIdValidation.validate(req.params);
            if (validationResult.error) {
                res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validationResult.error.details));
                return;
            }
            const tacheId = validationResult.value;
            const tacheUsecase = new tache_usecase_1.TacheUsecase(database_1.AppDataSource);
            const tache = yield tacheUsecase.getOneTache(tacheId.id);
            if (tache === null) {
                res.status(404).send({ "error": `tache ${tacheId.id} not found` });
                return;
            }
            res.status(200).send(tache);
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
    app.patch("/taches/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const validation = tache_validator_1.updateTacheValidation.validate(Object.assign(Object.assign({}, req.params), req.body));
        if (validation.error) {
            res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validation.error.details));
            return;
        }
        const UpdateTacheRequest = validation.value;
        if (UpdateTacheRequest.responsable) {
            const userRepository = database_1.AppDataSource.getRepository(user_1.User);
            const user = yield userRepository.findOneBy({ id: req.body.responsable });
            if ((user === null || user === void 0 ? void 0 : user.role) !== "Administrateur" && (user === null || user === void 0 ? void 0 : user.role) !== "Adherent") {
                res.status(400).send({ error: "Administrateur ou Adherent requis" });
                return;
            }
        }
        try {
            const tacheUsecase = new tache_usecase_1.TacheUsecase(database_1.AppDataSource);
            const validationResult = tache_validator_1.tacheIdValidation.validate(req.params);
            if (validationResult.error) {
                res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validationResult.error.details));
                return;
            }
            const updatedTache = yield tacheUsecase.updateTache(UpdateTacheRequest.id, Object.assign({}, UpdateTacheRequest));
            if (updatedTache === null) {
                res.status(404).send({ "error": `tache ${UpdateTacheRequest.id} not found ` });
                return;
            }
            if (updatedTache === "No update provided") {
                res.status(400).send({ "error": `No update provided` });
                return;
            }
            res.status(200).send(updatedTache);
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
};
exports.TacheHandler = TacheHandler;
