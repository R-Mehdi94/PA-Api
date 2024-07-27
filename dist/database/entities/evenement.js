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
exports.Evenement = void 0;
const typeorm_1 = require("typeorm");
require("reflect-metadata");
const inscription_1 = require("./inscription");
const evenementUser_1 = require("./evenementUser"); // Importez la nouvelle entité
const evenementRessource_1 = require("./evenementRessource");
let Evenement = class Evenement {
    constructor(id, nom, date, description, lieu, inscriptions, evenementRessource, estReserve, nbPlace, evenementUsers) {
        this.id = id;
        this.nom = nom;
        this.date = date;
        this.description = description;
        this.lieu = lieu;
        this.estReserve = estReserve;
        this.nbPlace = nbPlace;
        this.inscriptions = inscriptions;
        this.evenementRessources = evenementRessource;
        this.evenementUsers = evenementUsers;
    }
};
exports.Evenement = Evenement;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Evenement.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Evenement.prototype, "nom", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: "datetime" }),
    __metadata("design:type", Date)
], Evenement.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Evenement.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Evenement.prototype, "lieu", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], Evenement.prototype, "estReserve", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Evenement.prototype, "nbPlace", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => evenementRessource_1.EvenementRessource, evenementRessource => evenementRessource.evenement),
    __metadata("design:type", Array)
], Evenement.prototype, "evenementRessources", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => inscription_1.Inscription, inscriptions => inscriptions.evenement),
    __metadata("design:type", Array)
], Evenement.prototype, "inscriptions", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => evenementUser_1.EvenementUser, evenementUser => evenementUser.evenement),
    __metadata("design:type", Array)
], Evenement.prototype, "evenementUsers", void 0);
exports.Evenement = Evenement = __decorate([
    (0, typeorm_1.Entity)(),
    __metadata("design:paramtypes", [Number, String, Date, String, String, Array, Array, Boolean, Number, Array])
], Evenement);
