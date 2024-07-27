"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Adherent = void 0;
const typeorm_1 = require("typeorm");
require("reflect-metadata");
const user_1 = require("./user");
const inscription_1 = require("./inscription");
const cotisation_1 = require("./cotisation");
const token_1 = require("./token");
const transaction_1 = require("./transaction");
let Adherent = class Adherent {
    constructor(id, motDePasse, estBanie, nom, prenom, email, age, numTel, adresse, profession, dateInscription, estBenevole, parrain, inscriptions, cotisations, tokens, transactions) {
        this.id = id;
        this.motDePasse = motDePasse;
        this.estBanie = estBanie;
        this.nom = nom;
        this.prenom = prenom;
        this.email = email;
        this.age = age;
        this.numTel = numTel;
        this.adresse = adresse;
        this.profession = profession;
        this.dateInscription = dateInscription;
        this.estBenevole = estBenevole;
        this.parrain = parrain;
        this.inscriptions = inscriptions;
        this.cotisations = cotisations;
        this.tokens = tokens;
        this.transactions = transactions;
    }
};
exports.Adherent = Adherent;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Adherent.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], Adherent.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Adherent.prototype, "motDePasse", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Adherent.prototype, "nom", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Adherent.prototype, "prenom", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Adherent.prototype, "age", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Adherent.prototype, "numTel", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Adherent.prototype, "adresse", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Adherent.prototype, "profession", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], Adherent.prototype, "estBanie", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, typeorm_1.CreateDateColumn)({ type: "datetime" }),
    __metadata("design:type", Date)
], Adherent.prototype, "dateInscription", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], Adherent.prototype, "estBenevole", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_1.User, user => user.parraine),
    __metadata("design:type", user_1.User)
], Adherent.prototype, "parrain", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => inscription_1.Inscription, inscriptions => inscriptions.adherent),
    __metadata("design:type", Array)
], Adherent.prototype, "inscriptions", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => cotisation_1.Cotisation, cotisations => cotisations.adherent),
    __metadata("design:type", Array)
], Adherent.prototype, "cotisations", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => token_1.Token, token => token.adherent),
    __metadata("design:type", Array)
], Adherent.prototype, "tokens", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => transaction_1.Transaction, transactions => transactions.adherent),
    __metadata("design:type", Array)
], Adherent.prototype, "transactions", void 0);
exports.Adherent = Adherent = __decorate([
    (0, typeorm_1.Entity)(),
    __metadata("design:paramtypes", [Number, String, Boolean, String, String, String, Number, String, String, String, Date, Boolean, user_1.User, Array, Array, Array, Array])
], Adherent);
