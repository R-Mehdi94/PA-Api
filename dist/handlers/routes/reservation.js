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
exports.ReservationHandler = void 0;
const generate_validation_message_1 = require("../validators/generate-validation-message");
const database_1 = require("../../database/database");
const reservation_validation_1 = require("../validators/reservation-validation");
const reservation_usecase_1 = require("../../domain/reservation-usecase");
const reservation_1 = require("../../database/entities/reservation");
const user_1 = require("../../database/entities/user");
const ReservationHandler = (app) => {
    app.get("/reservations", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const validation = reservation_validation_1.listReservationValidation.validate(req.query);
        if (validation.error) {
            res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validation.error.details));
            return;
        }
        const listReservationRequest = validation.value;
        let limit = 20;
        if (listReservationRequest.limit) {
            limit = listReservationRequest.limit;
        }
        const page = (_a = listReservationRequest.page) !== null && _a !== void 0 ? _a : 1;
        try {
            const reservationUsecase = new reservation_usecase_1.ReservationUsecase(database_1.AppDataSource);
            const listReservations = yield reservationUsecase.listShowtime(Object.assign(Object.assign({}, listReservationRequest), { page, limit }));
            res.status(200).send(listReservations);
        }
        catch (error) {
            console.log(error);
        }
    }));
    app.post("/reservations", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const validation = reservation_validation_1.createReservationValidation.validate(req.body);
        if (validation.error) {
            res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validation.error.details));
            return;
        }
        const reservationRequest = validation.value;
        const userRepository = database_1.AppDataSource.getRepository(user_1.User);
        const user = yield userRepository.findOneBy({ id: req.body.user });
        if ((user === null || user === void 0 ? void 0 : user.role) !== "Administrateur" && (user === null || user === void 0 ? void 0 : user.role) !== "Utilisateur") {
            res.status(400).send({ error: "Administrateur ou Adherent requis" });
            return;
        }
        const reservationRepo = database_1.AppDataSource.getRepository(reservation_1.Reservation);
        try {
            const reservationCreated = yield reservationRepo.save(reservationRequest);
            res.status(201).send(reservationCreated);
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
    app.delete("/reservations/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const validationResult = reservation_validation_1.reservationIdValidation.validate(req.params);
            if (validationResult.error) {
                res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validationResult.error.details));
                return;
            }
            const reservationId = validationResult.value;
            const ReservationRepository = database_1.AppDataSource.getRepository(reservation_1.Reservation);
            const reservation = yield ReservationRepository.findOneBy({ id: reservationId.id });
            if (reservation === null) {
                res.status(404).send({ "error": `reservation ${reservationId.id} not found` });
                return;
            }
            yield ReservationRepository.remove(reservation);
            res.status(200).send("Reservation supprimé avec succès");
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
    app.get("/reservations/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const validationResult = reservation_validation_1.reservationIdValidation.validate(req.params);
            if (validationResult.error) {
                res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validationResult.error.details));
                return;
            }
            const reservationId = validationResult.value;
            const reservationUsecase = new reservation_usecase_1.ReservationUsecase(database_1.AppDataSource);
            const reservation = yield reservationUsecase.getOneReservation(reservationId.id);
            if (reservation === null) {
                res.status(404).send({ "error": `reservation ${reservationId.id} not found` });
                return;
            }
            res.status(200).send(reservation);
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
    app.patch("/reservations/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const validation = reservation_validation_1.updateReservationValidation.validate(Object.assign(Object.assign({}, req.params), req.body));
        if (validation.error) {
            res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validation.error.details));
            return;
        }
        const UpdateReservationRequest = validation.value;
        if (UpdateReservationRequest.user) {
            const userRepository = database_1.AppDataSource.getRepository(user_1.User);
            const user = yield userRepository.findOneBy({ id: req.body.user });
            if ((user === null || user === void 0 ? void 0 : user.role) !== "Administrateur" && (user === null || user === void 0 ? void 0 : user.role) !== "Utilisateur") {
                res.status(400).send({ error: "Administrateur ou Adherent requis" });
                return;
            }
        }
        try {
            const reservationUsecase = new reservation_usecase_1.ReservationUsecase(database_1.AppDataSource);
            const validationResult = reservation_validation_1.reservationIdValidation.validate(req.params);
            if (validationResult.error) {
                res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validationResult.error.details));
                return;
            }
            const updatedReservation = yield reservationUsecase.updateRessource(UpdateReservationRequest.id, Object.assign({}, UpdateReservationRequest));
            if (updatedReservation === null) {
                res.status(404).send({ "error": `ressource ${UpdateReservationRequest.id} not found ` });
                return;
            }
            if (updatedReservation === "No update provided") {
                res.status(400).send({ "error": `No update provided` });
                return;
            }
            res.status(200).send(updatedReservation);
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
};
exports.ReservationHandler = ReservationHandler;
