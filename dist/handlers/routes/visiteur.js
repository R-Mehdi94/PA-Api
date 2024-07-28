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
exports.VisiteurHandler = void 0;
const database_1 = require("../../database/database");
const visiteur_1 = require("../../database/entities/visiteur");
const visiteur_usecase_1 = require("../../domain/visiteur-usecase");
const generate_validation_message_1 = require("../validators/generate-validation-message");
const visiteur_validator_1 = require("../validators/visiteur-validator");
const VisiteurHandler = (app) => {
    app.get("/visiteurs", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const validation = visiteur_validator_1.listVisiteurValidation.validate(req.query);
        if (validation.error) {
            res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validation.error.details));
            return;
        }
        const listVisiteurRequest = validation.value;
        let limit = 20;
        if (listVisiteurRequest.limit) {
            limit = listVisiteurRequest.limit;
        }
        const page = (_a = listVisiteurRequest.page) !== null && _a !== void 0 ? _a : 1;
        try {
            const visiteurUsecase = new visiteur_usecase_1.VisiteurUsecase(database_1.AppDataSource);
            const listVisiteurs = yield visiteurUsecase.listVisiteurs(Object.assign(Object.assign({}, listVisiteurRequest), { page, limit }));
            res.status(200).send(listVisiteurs);
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
    app.post("/visiteurs", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const validation = visiteur_validator_1.createVisiteurValidation.validate(req.body);
        if (validation.error) {
            res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validation.error.details));
            return;
        }
        const visiteurRequest = validation.value;
        const visiteurRepo = database_1.AppDataSource.getRepository(visiteur_1.Visiteur);
        try {
            const visiteurCreated = yield visiteurRepo.save(visiteurRequest);
            res.status(201).send(visiteurCreated);
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
    app.delete("/visiteurs/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const validationResult = visiteur_validator_1.visiteurIdValidation.validate(req.params);
            if (validationResult.error) {
                res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validationResult.error.details));
                return;
            }
            const visiteurId = validationResult.value;
            const visiteurRepository = database_1.AppDataSource.getRepository(visiteur_1.Visiteur);
            const visiteur = yield visiteurRepository.findOneBy({ id: visiteurId.id });
            if (visiteur === null) {
                res.status(404).send({ "error": `Visiteur ${visiteurId.id} not found` });
                return;
            }
            yield visiteurRepository.remove(visiteur);
            res.status(200).send("Visiteur supprimé avec succès");
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
    app.get("/visiteurs/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const validationResult = visiteur_validator_1.visiteurIdValidation.validate(req.params);
            if (validationResult.error) {
                res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validationResult.error.details));
                return;
            }
            const visiteurId = validationResult.value;
            const visiteurUsecase = new visiteur_usecase_1.VisiteurUsecase(database_1.AppDataSource);
            const visiteur = yield visiteurUsecase.getOneVisiteur(visiteurId.id);
            if (visiteur === null) {
                res.status(404).send({ "error": `Visiteur ${visiteurId.id} not found` });
                return;
            }
            res.status(200).send(visiteur);
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
    app.patch("/visiteurs/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const validation = visiteur_validator_1.updateVisiteurValidation.validate(Object.assign(Object.assign({}, req.params), req.body));
        if (validation.error) {
            res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validation.error.details));
            return;
        }
        const updateVisiteurRequest = validation.value;
        try {
            const visiteurUsecase = new visiteur_usecase_1.VisiteurUsecase(database_1.AppDataSource);
            const validationResult = visiteur_validator_1.visiteurIdValidation.validate(req.params);
            if (validationResult.error) {
                res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validationResult.error.details));
                return;
            }
            const updatedVisiteur = yield visiteurUsecase.updateVisiteur(updateVisiteurRequest.id, Object.assign({}, updateVisiteurRequest));
            if (updatedVisiteur === null) {
                res.status(404).send({ "error": `Visiteur ${updateVisiteurRequest.id} not found` });
                return;
            }
            if (updatedVisiteur === "No update provided") {
                res.status(400).send({ "error": `No update provided` });
                return;
            }
            res.status(200).send(updatedVisiteur);
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
    app.post("/verifVisiteur", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const validation = visiteur_validator_1.verifVisiteur.validate(req.body);
        if (validation.error) {
            res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validation.error.details));
            return;
        }
        try {
            const visiteurUsecase = new visiteur_usecase_1.VisiteurUsecase(database_1.AppDataSource);
            const verifVisiteur = yield visiteurUsecase.verifVisiteur(validation.value.email);
            if (verifVisiteur[0]['count(*)'] > 0) {
                res.status(200).send({ response: "Visiteur existant" });
                return;
            }
            res.status(201).send({ response: "Visiteur non existant" });
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
};
exports.VisiteurHandler = VisiteurHandler;
