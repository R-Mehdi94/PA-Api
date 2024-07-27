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
exports.InscriptionHandler = void 0;
const database_1 = require("../../database/database");
const inscription_1 = require("../../database/entities/inscription");
const inscription_usecase_1 = require("../../domain/inscription-usecase");
const generate_validation_message_1 = require("../validators/generate-validation-message");
const inscription_validator_1 = require("../validators/inscription-validator");
const evenement_usecase_1 = require("../../domain/evenement-usecase");
const InscriptionHandler = (app) => {
    app.get("/inscriptions", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const validation = inscription_validator_1.listInscriptionValidation.validate(req.query);
        if (validation.error) {
            res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validation.error.details));
            return;
        }
        const listInscriptionRequest = validation.value;
        let limit = 20;
        if (listInscriptionRequest.limit) {
            limit = listInscriptionRequest.limit;
        }
        const page = (_a = listInscriptionRequest.page) !== null && _a !== void 0 ? _a : 1;
        try {
            const inscriptionUsecase = new inscription_usecase_1.InscriptionUsecase(database_1.AppDataSource);
            const listInscriptions = yield inscriptionUsecase.listInscriptions(Object.assign(Object.assign({}, listInscriptionRequest), { page, limit }));
            res.status(200).send(listInscriptions);
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
    app.post("/verifEmail", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(req.body);
        const validation = inscription_validator_1.verifEmail.validate(req.body);
        if (validation.error) {
            res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validation.error.details));
            return;
        }
        try {
            const inscriptionUsecase = new inscription_usecase_1.InscriptionUsecase(database_1.AppDataSource);
            const verifEmail = yield inscriptionUsecase.verifEmail(validation.value.emailVisiteur, validation.value.evenement);
            if (verifEmail[0]['count(*)'] > 0) {
                res.status(200).send({ response: "Email inscrit" });
                return;
            }
            res.status(201).send({ response: "Email non inscrit" });
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
    app.post("/inscriptions", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const validation = inscription_validator_1.createInscriptionValidation.validate(req.body);
        if (validation.error) {
            res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validation.error.details));
            return;
        }
        const inscriptionRequest = validation.value;
        const inscriptionUsecase = new inscription_usecase_1.InscriptionUsecase(database_1.AppDataSource);
        const nbPlace = yield inscriptionUsecase.nbPlace(+inscriptionRequest.evenement);
        if (nbPlace[0].nbPlace == 0) {
            res.status(400).send({ error: "Plus de place disponible" });
            return;
        }
        const inscriptionRepo = database_1.AppDataSource.getRepository(inscription_1.Inscription);
        try {
            const inscriptionCreated = yield inscriptionRepo.save(inscriptionRequest);
            const evenementUsecase = new evenement_usecase_1.EvenementUsecase(database_1.AppDataSource);
            yield evenementUsecase.nbPlaceMoinsUn(+inscriptionRequest.evenement);
            res.status(201).send(inscriptionCreated);
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
    app.delete("/inscriptions/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const validationResult = inscription_validator_1.inscriptionIdValidation.validate(req.params);
            if (validationResult.error) {
                res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validationResult.error.details));
                return;
            }
            const inscriptionId = validationResult.value;
            const inscriptionRepository = database_1.AppDataSource.getRepository(inscription_1.Inscription);
            const inscription = yield inscriptionRepository.findOneBy({ id: inscriptionId.id });
            if (inscription === null) {
                res.status(404).send({ "error": `Inscription ${inscriptionId.id} not found` });
                return;
            }
            yield inscriptionRepository.remove(inscription);
            res.status(200).send("Inscription supprimée avec succès");
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
    app.post("/deleteInscriptions", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const validationResult = inscription_validator_1.deleteInscriptionValidationRequest.validate(req.body);
            if (validationResult.error) {
                res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validationResult.error.details));
                return;
            }
            const emailVisiteur = validationResult.value.emailVisiteur;
            const evenement = validationResult.value.evenement;
            const inscriptionUsecase = new inscription_usecase_1.InscriptionUsecase(database_1.AppDataSource);
            const inscription = yield inscriptionUsecase.deleteInscription(emailVisiteur, evenement);
            if (inscription === null) {
                res.status(404).send({ "error": `Inscription ${emailVisiteur} not found` });
                return;
            }
            const evenementUsecase = new evenement_usecase_1.EvenementUsecase(database_1.AppDataSource);
            yield evenementUsecase.nbPlacePlusUn(evenement);
            res.status(200).send("Inscription supprimée avec succès");
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
    app.post("/deleteInscriptionAdherent", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const validationResult = inscription_validator_1.deleteInscriptionAdherent.validate(req.body);
            if (validationResult.error) {
                res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validationResult.error.details));
                return;
            }
            const adherent = validationResult.value.adherent;
            const evenement = validationResult.value.evenement;
            const inscriptionUsecase = new inscription_usecase_1.InscriptionUsecase(database_1.AppDataSource);
            const inscription = yield inscriptionUsecase.deleteInscriptionAdherent(adherent, evenement);
            if (inscription === null) {
                res.status(404).send({ "error": `Inscription not found` });
                return;
            }
            const evenementUsecase = new evenement_usecase_1.EvenementUsecase(database_1.AppDataSource);
            yield evenementUsecase.nbPlacePlusUn(evenement);
            res.status(200).send("Inscription supprimée avec succès");
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
    app.get("/inscriptions/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const validationResult = inscription_validator_1.inscriptionIdValidation.validate(req.params);
            if (validationResult.error) {
                res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validationResult.error.details));
                return;
            }
            const inscriptionId = validationResult.value;
            const inscriptionUsecase = new inscription_usecase_1.InscriptionUsecase(database_1.AppDataSource);
            const inscription = yield inscriptionUsecase.getOneInscription(inscriptionId.id);
            if (inscription === null) {
                res.status(404).send({ "error": `Inscription ${inscriptionId.id} not found` });
                return;
            }
            res.status(200).send(inscription);
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
    app.patch("/inscriptions/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const validation = inscription_validator_1.updateInscriptionValidation.validate(Object.assign(Object.assign({}, req.params), req.body));
        if (validation.error) {
            res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validation.error.details));
            return;
        }
        const updateInscriptionRequest = validation.value;
        try {
            const inscriptionUsecase = new inscription_usecase_1.InscriptionUsecase(database_1.AppDataSource);
            const validationResult = inscription_validator_1.inscriptionIdValidation.validate(req.params);
            if (validationResult.error) {
                res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validationResult.error.details));
                return;
            }
            const updatedInscription = yield inscriptionUsecase.updateInscription(updateInscriptionRequest.id, Object.assign({}, updateInscriptionRequest));
            if (updatedInscription === null) {
                res.status(404).send({ "error": `Inscription ${updateInscriptionRequest.id} not found` });
                return;
            }
            if (updatedInscription === "No update provided") {
                res.status(400).send({ "error": `No update provided` });
                return;
            }
            res.status(200).send(updatedInscription);
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
};
exports.InscriptionHandler = InscriptionHandler;
