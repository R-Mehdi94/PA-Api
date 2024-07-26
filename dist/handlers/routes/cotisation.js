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
exports.CotisationHandler = void 0;
const database_1 = require("../../database/database");
const cotisation_1 = require("../../database/entities/cotisation");
const cotisation_usecase_1 = require("../../domain/cotisation-usecase");
const cotisation_validator_1 = require("../validators/cotisation-validator");
const generate_validation_message_1 = require("../validators/generate-validation-message");
const CotisationHandler = (app) => {
    app.get("/cotisations", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const validation = cotisation_validator_1.listCotisationValidation.validate(req.query);
        if (validation.error) {
            res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validation.error.details));
            return;
        }
        const listCotisationRequest = validation.value;
        let limit = 20;
        if (listCotisationRequest.limit) {
            limit = listCotisationRequest.limit;
        }
        const page = (_a = listCotisationRequest.page) !== null && _a !== void 0 ? _a : 1;
        try {
            const cotisationUsecase = new cotisation_usecase_1.CotisationUsecase(database_1.AppDataSource);
            const listCotisations = yield cotisationUsecase.listCotisations(Object.assign(Object.assign({}, listCotisationRequest), { page, limit }));
            res.status(200).send(listCotisations);
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
    app.post("/cotisations", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const validation = cotisation_validator_1.createCotisationValidation.validate(req.body);
        if (validation.error) {
            res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validation.error.details));
            return;
        }
        const cotisationRequest = validation.value;
        const cotisationRepo = database_1.AppDataSource.getRepository(cotisation_1.Cotisation);
        try {
            const cotisationCreated = yield cotisationRepo.save(cotisationRequest);
            res.status(201).send(cotisationCreated);
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
    app.delete("/cotisations/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const validationResult = cotisation_validator_1.cotisationIdValidation.validate(req.params);
            if (validationResult.error) {
                res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validationResult.error.details));
                return;
            }
            const cotisationId = validationResult.value;
            const cotisationRepository = database_1.AppDataSource.getRepository(cotisation_1.Cotisation);
            const cotisation = yield cotisationRepository.findOneBy({ id: cotisationId.id });
            if (cotisation === null) {
                res.status(404).send({ "error": `Cotisation ${cotisationId.id} not found` });
                return;
            }
            yield cotisationRepository.remove(cotisation);
            res.status(200).send("Cotisation supprimée avec succès");
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
    app.get("/cotisations/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const validationResult = cotisation_validator_1.cotisationIdValidation.validate(req.params);
            if (validationResult.error) {
                res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validationResult.error.details));
                return;
            }
            const cotisationId = validationResult.value;
            const cotisationUsecase = new cotisation_usecase_1.CotisationUsecase(database_1.AppDataSource);
            const cotisation = yield cotisationUsecase.getOneCotisation(cotisationId.id);
            if (cotisation === null) {
                res.status(404).send({ "error": `Cotisation ${cotisationId.id} not found` });
                return;
            }
            res.status(200).send(cotisation);
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
    app.patch("/cotisations/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const validation = cotisation_validator_1.updateCotisationValidation.validate(Object.assign(Object.assign({}, req.params), req.body));
        if (validation.error) {
            res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validation.error.details));
            return;
        }
        const updateCotisationRequest = validation.value;
        try {
            const cotisationUsecase = new cotisation_usecase_1.CotisationUsecase(database_1.AppDataSource);
            const validationResult = cotisation_validator_1.cotisationIdValidation.validate(req.params);
            if (validationResult.error) {
                res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validationResult.error.details));
                return;
            }
            const updatedCotisation = yield cotisationUsecase.updateCotisation(updateCotisationRequest.id, Object.assign({}, updateCotisationRequest));
            if (updatedCotisation === null) {
                res.status(404).send({ "error": `Cotisation ${updateCotisationRequest.id} not found` });
                return;
            }
            if (updatedCotisation === "No update provided") {
                res.status(400).send({ "error": `No update provided` });
                return;
            }
            res.status(200).send(updatedCotisation);
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
};
exports.CotisationHandler = CotisationHandler;
