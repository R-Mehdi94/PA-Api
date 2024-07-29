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
exports.AideProjet = void 0;
const typeorm_1 = require("typeorm");
const visiteur_1 = require("./visiteur");
const adherent_1 = require("./adherent");
let AideProjet = class AideProjet {
    constructor(id, nom, descriptionProjet, budget, deadline, visiteur, adherent) {
        this.id = id;
        this.titre = nom;
        this.descriptionProjet = descriptionProjet;
        this.budget = budget;
        this.deadline = deadline;
        this.visiteur = visiteur;
        this.adherent = adherent;
    }
};
exports.AideProjet = AideProjet;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], AideProjet.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], AideProjet.prototype, "titre", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], AideProjet.prototype, "descriptionProjet", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], AideProjet.prototype, "budget", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], AideProjet.prototype, "deadline", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => visiteur_1.Visiteur, visiteur => visiteur.aideProjets),
    __metadata("design:type", visiteur_1.Visiteur)
], AideProjet.prototype, "visiteur", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => adherent_1.Adherent, adherent => adherent.aideProjets),
    __metadata("design:type", adherent_1.Adherent)
], AideProjet.prototype, "adherent", void 0);
exports.AideProjet = AideProjet = __decorate([
    (0, typeorm_1.Entity)(),
    __metadata("design:paramtypes", [Number, String, String, Number, Date, visiteur_1.Visiteur, adherent_1.Adherent])
], AideProjet);
