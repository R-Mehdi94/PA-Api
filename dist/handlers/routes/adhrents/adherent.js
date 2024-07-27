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
exports.AdherentHandler = void 0;
const database_1 = require("../../../database/database");
const adherent_1 = require("../../../database/entities/adherent");
const adherent_usecase_1 = require("../../../domain/adherent-usecase");
const adherent_validator_1 = require("../../validators/adherent-validator");
const generate_validation_message_1 = require("../../validators/generate-validation-message");
const auth_middleware_1 = require("../../middleware/auth-middleware");
const user_1 = require("../../../database/entities/user");
const user_usecase_1 = require("../../../domain/user-usecase");
const bcrypt_1 = require("bcrypt");
const AdherentHandler = (app) => {
    app.get("/adherents", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const validation = adherent_validator_1.listAdherentValidation.validate(req.query);
        if (validation.error) {
            res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validation.error.details));
            return;
        }
        const listAdherentRequest = validation.value;
        let limit = 20;
        if (listAdherentRequest.limit) {
            limit = listAdherentRequest.limit;
        }
        const page = (_a = listAdherentRequest.page) !== null && _a !== void 0 ? _a : 1;
        try {
            const adherentUsecase = new adherent_usecase_1.AdherentUsecase(database_1.AppDataSource);
            const listAdherents = yield adherentUsecase.listAdherents(Object.assign(Object.assign({}, listAdherentRequest), { page, limit }));
            res.status(200).send(listAdherents);
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
    app.post("/adherents", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const validation = adherent_validator_1.createAdherentValidation.validate(req.body);
        if (validation.error) {
            res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validation.error.details));
            return;
        }
        const adherentRequest = validation.value;
        const adherentRepo = database_1.AppDataSource.getRepository(adherent_1.Adherent);
        const adherentUsecase = new adherent_usecase_1.AdherentUsecase(database_1.AppDataSource);
        const emailExists = yield adherentUsecase.verifEmailAdherent(adherentRequest.email);
        if (emailExists[0].verif > 0) {
            res.status(209).send({ "error": `Adherent ${adherentRequest.email} already exists` });
            return;
        }
        try {
            const adherentCreated = yield adherentRepo.save(adherentRequest);
            res.status(201).send(adherentCreated);
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
    app.delete("/adherents/:id", auth_middleware_1.authMiddlewareAdherent, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const validationResult = adherent_validator_1.adherentIdValidation.validate(Object.assign(Object.assign({}, req.params), req.body));
            if (validationResult.error) {
                res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validationResult.error.details));
                return;
            }
            const adherentUsecase = new adherent_usecase_1.AdherentUsecase(database_1.AppDataSource);
            if ((yield adherentUsecase.verifAdherentToken(+req.params.id, req.body.token)) === false) {
                res.status(400).send({ "error": `Bad Adherent` });
                return;
            }
            const adherentId = validationResult.value;
            const adherentRepository = database_1.AppDataSource.getRepository(adherent_1.Adherent);
            const adherent = yield adherentRepository.findOneBy({ id: adherentId.id });
            if (adherent === null) {
                res.status(404).send({ "error": `Adherent ${adherentId.id} not found` });
                return;
            }
            yield adherentRepository.remove(adherent);
            res.status(200).send("Adherent supprimé avec succès");
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
    app.get("/adherents/:id", auth_middleware_1.authMiddlewareAdherent, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const validationResult = adherent_validator_1.adherentIdValidation.validate(Object.assign(Object.assign({}, req.params), req.body));
            if (validationResult.error) {
                res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validationResult.error.details));
                return;
            }
            const adherentUsecase = new adherent_usecase_1.AdherentUsecase(database_1.AppDataSource);
            if ((yield adherentUsecase.verifAdherentToken(+req.params.id, req.body.token)) === false) {
                res.status(400).send({ "error": `Bad Adherent` });
                return;
            }
            const adherentId = validationResult.value;
            const adherent = yield adherentUsecase.getOneAdherent(adherentId.id);
            if (adherent === null) {
                res.status(404).send({ "error": `Adherent ${adherentId.id} not found` });
                return;
            }
            res.status(200).send(adherent);
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
    app.patch("/adherents/:id", auth_middleware_1.authMiddlewareAdherent, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const validationResult = adherent_validator_1.updateAdherentValidation.validate(Object.assign(Object.assign({}, req.params), req.body));
            if (validationResult.error) {
                res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validationResult.error.details));
                return;
            }
            const adherentUsecase = new adherent_usecase_1.AdherentUsecase(database_1.AppDataSource);
            const userUsecase = new user_usecase_1.UserUsecase(database_1.AppDataSource);
            if (validationResult.value.idAdmin !== undefined) {
                let user = yield database_1.AppDataSource.getRepository(user_1.User).findOneBy({ id: validationResult.value.idAdmin });
                if ((user === null || user === void 0 ? void 0 : user.role) !== "Administrateur") {
                    if ((yield userUsecase.verifUser(+req.params.idAdmin, req.body.token)) === false) {
                        res.status(400).send({ "error": `Bad user` });
                        return;
                    }
                }
            }
            else {
                if ((yield adherentUsecase.verifAdherentToken(+req.params.id, req.body.token)) === false) {
                    res.status(400).send({ "error": `Bad user` });
                    return;
                }
            }
            if (validationResult.value.motDePasse !== undefined) {
                validationResult.value.motDePasse = yield (0, bcrypt_1.hash)(validationResult.value.motDePasse, 10);
            }
            const updateAdherentRequest = validationResult.value;
            const updateAdherent = yield adherentUsecase.updateAdherent(updateAdherentRequest.id, Object.assign({}, updateAdherentRequest));
            if (updateAdherent === null) {
                res.status(404).send({ "error": `Adherent ${updateAdherentRequest.id} not found` });
                return;
            }
            if (updateAdherent === "No update provided") {
                res.status(400).send({ "error": `No update provided` });
                return;
            }
            res.status(200).send(updateAdherent);
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
    app.post("/verifVisiteur", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(req.body);
        const validation = adherent_validator_1.verifAdherent.validate(req.body);
        if (validation.error) {
            res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validation.error.details));
            return;
        }
        try {
            const adherentUsecase = new adherent_usecase_1.AdherentUsecase(database_1.AppDataSource);
            const verifAdherent = yield adherentUsecase.verifAdherent(validation.value.email, validation.value.numTel);
            if (verifAdherent[0]['count(*)'] > 0) {
                res.status(200).send({ response: "Adherent existant" });
                return;
            }
            res.status(201).send({ response: "Adherent non existant" });
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
    app.post("/visiteursEmail", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const adherentUsecase = new adherent_usecase_1.AdherentUsecase(database_1.AppDataSource);
            const listAdherentEmail = yield adherentUsecase.getAdherentEmail();
            res.status(200).send(listAdherentEmail);
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
};
exports.AdherentHandler = AdherentHandler;
