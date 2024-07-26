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
exports.Inscription = void 0;
const typeorm_1 = require("typeorm");
require("reflect-metadata");
const evenement_1 = require("./evenement");
const visiteur_1 = require("./visiteur");
const adherent_1 = require("./adherent");
let Inscription = class Inscription {
    constructor(id, visiteur, evenement, adherent) {
        this.id = id;
        this.visiteur = visiteur;
        this.adherent = adherent;
        this.evenement = evenement;
    }
};
exports.Inscription = Inscription;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Inscription.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => evenement_1.Evenement, evenement => evenement.inscriptions),
    __metadata("design:type", evenement_1.Evenement)
], Inscription.prototype, "evenement", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => visiteur_1.Visiteur, visiteur => visiteur.inscriptions),
    __metadata("design:type", visiteur_1.Visiteur)
], Inscription.prototype, "visiteur", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => adherent_1.Adherent, adherent => adherent.inscriptions),
    __metadata("design:type", adherent_1.Adherent)
], Inscription.prototype, "adherent", void 0);
exports.Inscription = Inscription = __decorate([
    (0, typeorm_1.Entity)(),
    __metadata("design:paramtypes", [Number, visiteur_1.Visiteur, evenement_1.Evenement, adherent_1.Adherent])
], Inscription);
