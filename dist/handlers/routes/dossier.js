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
exports.DossierHandler = void 0;
const database_1 = require("../../database/database");
const dossier_1 = require("../../database/entities/dossier");
const dossier_usecase_1 = require("../../domain/dossier-usecase");
const dossier_validator_1 = require("../validators/dossier-validator");
const generate_validation_message_1 = require("../validators/generate-validation-message");
const auth_middleware_1 = require("../middleware/auth-middleware");
const user_usecase_1 = require("../../domain/user-usecase");
const user_validator_1 = require("../validators/user-validator");
const DossierHandler = (app) => {
    app.post("/idToken/:id", auth_middleware_1.authMiddlewareAll, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const validationResult = user_validator_1.getIdToken.validate(Object.assign(Object.assign({}, req.params), req.body));
        if (validationResult.error) {
            res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validationResult.error.details));
            return;
        }
        const userUsecase = new user_usecase_1.UserUsecase(database_1.AppDataSource);
        if ((yield userUsecase.verifUser(+req.params.id, req.body.token)) === false) {
            res.status(400).send({ "error": `Bad user` });
            return;
        }
        const nom = validationResult.value.name;
        try {
            const dossierUsecase = new dossier_usecase_1.DossierUsecase(database_1.AppDataSource);
            const idToken = yield dossierUsecase.getIdToken(nom);
            if (!idToken) {
                res.status(200).send({ "reponse": `Aucun fichier` });
                return;
            }
            res.json({ idToken });
        }
        catch (error) {
            console.error(error);
            res.status(500).send('Internal server error');
        }
    }));
    app.post("/racine/:id", auth_middleware_1.authMiddlewareAll, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
            const dossierUsecase = new dossier_usecase_1.DossierUsecase(database_1.AppDataSource);
            const racine = yield dossierUsecase.getRacine(userId);
            if (!racine) {
                res.status(200).send({ "reponse": `Aucun fichier ou dossier` });
                return;
            }
            res.json({ racine });
        }
        catch (error) {
            console.error(error);
            res.status(500).send('Internal server error');
        }
    }));
    app.post("/arboDossier/:id", auth_middleware_1.authMiddlewareAll, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const validationResult = dossier_validator_1.dossierUserIdValidation.validate(Object.assign(Object.assign({}, req.params), req.body));
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
        const dossierId = validationResult.value.dossierId;
        try {
            const dossierUsecase = new dossier_usecase_1.DossierUsecase(database_1.AppDataSource);
            const arboDossier = yield dossierUsecase.getArboDossier(userId, dossierId);
            if (!arboDossier) {
                res.status(200).send({ "reponse": `Aucun fichier ou dossier` });
                return;
            }
            res.json({ arboDossier });
        }
        catch (error) {
            console.error(error);
            res.status(500).send('Internal server error');
        }
    }));
    app.post("/dossierParent/:id", auth_middleware_1.authMiddlewareAll, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const validationResult = dossier_validator_1.dossierUserIdValidation.validate(Object.assign(Object.assign({}, req.params), req.body));
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
        const dossierId = validationResult.value.dossierId;
        try {
            const dossierUsecase = new dossier_usecase_1.DossierUsecase(database_1.AppDataSource);
            const dossierParent = yield dossierUsecase.getDossierParent(userId, dossierId);
            if (!dossierParent) {
                res.status(200).send({ "reponse": `Aucun fichier ou dossier` });
                return;
            }
            res.json({ dossierParent });
        }
        catch (error) {
            console.error(error);
            res.status(500).send('Internal server error');
        }
    }));
    app.get("/dossiers", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const validation = dossier_validator_1.listDossierValidation.validate(req.query);
        if (validation.error) {
            res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validation.error.details));
            return;
        }
        const listDossierRequest = validation.value;
        let limit = 20;
        if (listDossierRequest.limit) {
            limit = listDossierRequest.limit;
        }
        const page = (_a = listDossierRequest.page) !== null && _a !== void 0 ? _a : 1;
        try {
            const dossierUsecase = new dossier_usecase_1.DossierUsecase(database_1.AppDataSource);
            const listDossiers = yield dossierUsecase.listDossiers(Object.assign(Object.assign({}, listDossierRequest), { page, limit }));
            res.status(200).send(listDossiers);
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
    app.post("/dossiers", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const validation = dossier_validator_1.createDossierValidation.validate(req.body);
        if (validation.error) {
            res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validation.error.details));
            return;
        }
        const dossierRequest = validation.value;
        const dossierRepo = database_1.AppDataSource.getRepository(dossier_1.Dossier);
        try {
            const dossierCreated = yield dossierRepo.save(dossierRequest);
            res.status(201).send(dossierCreated);
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
    app.delete("/dossiers/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const validationResult = dossier_validator_1.dossierIdValidation.validate(req.params);
            if (validationResult.error) {
                res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validationResult.error.details));
                return;
            }
            const dossierId = validationResult.value;
            const dossierRepository = database_1.AppDataSource.getRepository(dossier_1.Dossier);
            const dossier = yield dossierRepository.findOneBy({ id: dossierId.id });
            if (dossier === null) {
                res.status(404).send({ "error": `Dossier ${dossierId.id} not found` });
                return;
            }
            yield dossierRepository.remove(dossier);
            res.status(200).send("Dossier supprimé avec succès");
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
    app.get("/dossiers/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const validationResult = dossier_validator_1.dossierIdValidation.validate(req.params);
            if (validationResult.error) {
                res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validationResult.error.details));
                return;
            }
            const dossierId = validationResult.value;
            const dossierUsecase = new dossier_usecase_1.DossierUsecase(database_1.AppDataSource);
            const dossier = yield dossierUsecase.getOneDossier(dossierId.id);
            if (dossier === null) {
                res.status(404).send({ "error": `Dossier ${dossierId.id} not found` });
                return;
            }
            res.status(200).send(dossier);
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
    app.patch("/dossiers/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const validation = dossier_validator_1.updateDossierValidation.validate(Object.assign(Object.assign({}, req.params), req.body));
        if (validation.error) {
            res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validation.error.details));
            return;
        }
        const updateDossierRequest = validation.value;
        try {
            const dossierUsecase = new dossier_usecase_1.DossierUsecase(database_1.AppDataSource);
            const validationResult = dossier_validator_1.dossierIdValidation.validate(req.params);
            if (validationResult.error) {
                res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validationResult.error.details));
                return;
            }
            const updatedDossier = yield dossierUsecase.updateDossier(updateDossierRequest.id, Object.assign({}, updateDossierRequest));
            if (updatedDossier === null) {
                res.status(404).send({ "error": `Dossier ${updateDossierRequest.id} not found` });
                return;
            }
            if (updatedDossier === "No update provided") {
                res.status(400).send({ "error": `No update provided` });
                return;
            }
            res.status(200).send(updatedDossier);
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
};
exports.DossierHandler = DossierHandler;
