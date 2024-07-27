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
exports.AdherentHandlerAuthentication = void 0;
const database_1 = require("../../../database/database");
const bcrypt_1 = require("bcrypt");
const generate_validation_message_1 = require("../../validators/generate-validation-message");
const jsonwebtoken_1 = require("jsonwebtoken");
const token_1 = require("../../../database/entities/token");
const adherent_validator_1 = require("../../validators/adherent-validator");
const adherent_1 = require("../../../database/entities/adherent");
const adherent_usecase_1 = require("../../../domain/adherent-usecase");
const AdherentHandlerAuthentication = (app) => {
    app.post('/auth/signupAdherent', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const validationResult = adherent_validator_1.createAdherentValidation.validate(req.body);
            if (validationResult.error) {
                res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validationResult.error.details));
                return;
            }
            const createAdherentRequest = validationResult.value;
            let hashedPassword;
            if (createAdherentRequest.motDePasse !== undefined) {
                hashedPassword = yield (0, bcrypt_1.hash)(createAdherentRequest.motDePasse, 10);
            }
            const adherentRepository = database_1.AppDataSource.getRepository(adherent_1.Adherent);
            const adherent = yield adherentRepository.save({
                nom: req.body.nom,
                prenom: req.body.prenom,
                email: req.body.email,
                motDePasse: hashedPassword,
                age: req.body.age,
                adresse: req.body.adresse,
                profession: req.body.profession,
                parrainId: req.body.parrainId || null,
                estBanie: false,
                dateInscription: new Date(),
                estBenevole: req.body.estBenevole,
                numTel: req.body.numTel,
            });
            res.status(201).send({ id: adherent.id, nom: adherent.nom, prenom: adherent.prenom, email: adherent.email });
            return;
        }
        catch (error) {
            const mysqlError = error;
            if (error instanceof Error) {
                if (mysqlError.code === 'ER_DUP_ENTRY') {
                    res.status(400).send({ error: "L'adresse email est déjà utilisée." });
                }
                else {
                    // Log de l'erreur pour le débogage
                    console.error('Erreur interne du serveur:', error);
                    // Envoi de la réponse d'erreur générique
                    res.status(500).send({ error: "Erreur interne du serveur. Réessayez plus tard." });
                }
            }
            else {
                // En cas d'erreur inconnue non instance de Error
                console.error('Erreur inconnue:', error);
                res.status(500).send({ error: "Erreur inconnue. Réessayez plus tard." });
            }
            return;
        }
    }));
    app.post('/auth/loginAdherent', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            const validationResult = adherent_validator_1.LoginValidationValidation.validate(req.body);
            if (validationResult.error) {
                res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validationResult.error.details));
                return;
            }
            const loginAdherentRequest = validationResult.value;
            // valid user exist
            let adherent = yield database_1.AppDataSource.getRepository(adherent_1.Adherent).findOneBy({ email: loginAdherentRequest.email });
            if (!adherent) {
                res.status(400).send({ error: "username or password not valid" });
                return;
            }
            const isValid = yield (0, bcrypt_1.compare)(loginAdherentRequest.motDePasse, adherent.motDePasse);
            if (!isValid) {
                res.status(400).send({ error: "username or password not valid" });
                return;
            }
            const adherentUsecase = new adherent_usecase_1.AdherentUsecase(database_1.AppDataSource);
            adherent = yield adherentUsecase.getOneAdherent(adherent.id);
            if (adherent === null) {
                res.status(404).send({ "error": `Adherent not found` });
                return;
            }
            const secret = (_a = process.env.JWT_SECRET) !== null && _a !== void 0 ? _a : "azerty";
            const token = (0, jsonwebtoken_1.sign)({ adherentId: adherent.id, email: adherent.email }, secret, { expiresIn: '1d' });
            yield database_1.AppDataSource.getRepository(token_1.Token).save({ token: token, adherent: adherent });
            yield adherentUsecase.updateAdherent(adherent.id, Object.assign({}, adherent));
            res.status(200).json({ token, adherent });
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ "error": "internal error retry later" });
            return;
        }
    }));
    app.delete('/auth/logoutAdherent/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
            adherentUsecase.deleteToken(adherent.id);
            yield adherentUsecase.updateAdherent(adherent.id, Object.assign({}, adherent));
            res.status(201).send({ "message": "logout success" });
            return;
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ "error": "internal error retry later" });
            return;
        }
    }));
};
exports.AdherentHandlerAuthentication = AdherentHandlerAuthentication;
