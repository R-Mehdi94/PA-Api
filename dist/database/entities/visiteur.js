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
exports.Visiteur = void 0;
const typeorm_1 = require("typeorm");
require("reflect-metadata");
const user_1 = require("./user");
const inscription_1 = require("./inscription");
let Visiteur = class Visiteur {
    constructor(id, nom, prenom, email, age, numTel, adresse, profession, dateInscription, estBenevole, parrain, inscriptions, cotisations) {
        this.id = id;
        this.nom = nom;
        this.prenom = prenom;
        this.email = email;
        this.age = age;
        this.numTel = numTel;
        this.profession = profession;
        this.dateInscription = dateInscription;
        this.inscriptions = inscriptions;
    }
};
exports.Visiteur = Visiteur;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Visiteur.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], Visiteur.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Visiteur.prototype, "nom", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Visiteur.prototype, "prenom", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Visiteur.prototype, "age", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Visiteur.prototype, "numTel", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Visiteur.prototype, "profession", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, typeorm_1.CreateDateColumn)({ type: "datetime" }),
    __metadata("design:type", Date)
], Visiteur.prototype, "dateInscription", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => inscription_1.Inscription, inscriptions => inscriptions.visiteur),
    __metadata("design:type", Array)
], Visiteur.prototype, "inscriptions", void 0);
exports.Visiteur = Visiteur = __decorate([
    (0, typeorm_1.Entity)(),
    __metadata("design:paramtypes", [Number, String, String, String, Number, String, String, String, Date, Boolean, user_1.User, Array, Array])
], Visiteur);
