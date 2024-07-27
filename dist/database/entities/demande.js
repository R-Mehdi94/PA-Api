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
exports.Demande = exports.StatutDemande = exports.TypeDemande = void 0;
const typeorm_1 = require("typeorm");
const evenementDemande_1 = require("./evenementDemande");
const aideProjetDemande_1 = require("./aideProjetDemande");
const parrainageDemande_1 = require("./parrainageDemande");
const visiteur_1 = require("./visiteur");
const autreDemande_1 = require("./autreDemande");
const adherent_1 = require("./adherent");
var TypeDemande;
(function (TypeDemande) {
    TypeDemande["Projet"] = "Projet";
    TypeDemande["Evenement"] = "Ev\u00E9nement";
    TypeDemande["Parrainage"] = "Parrainage";
    TypeDemande["Autre"] = "Autre";
})(TypeDemande || (exports.TypeDemande = TypeDemande = {}));
var StatutDemande;
(function (StatutDemande) {
    StatutDemande["EnAttente"] = "En attente";
    StatutDemande["Acceptee"] = "Accept\u00E9e";
    StatutDemande["Refusee"] = "Refus\u00E9e";
})(StatutDemande || (exports.StatutDemande = StatutDemande = {}));
let Demande = class Demande {
    constructor(id, type, dateDemande, statut, evenementDemandes, aideProjetDemandes, parrainageDemandes, autreDemandes, adherent, visiteur) {
        this.id = id;
        this.type = type;
        this.dateDemande = dateDemande;
        this.statut = statut;
        this.autreDemandes = autreDemandes;
        this.evenementDemandes = evenementDemandes;
        this.aideProjetDemandes = aideProjetDemandes;
        this.parrainageDemandes = parrainageDemandes;
        this.adherent = adherent;
        this.visiteur = visiteur;
    }
};
exports.Demande = Demande;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Demande.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Demande.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], Demande.prototype, "dateDemande", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Demande.prototype, "statut", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => adherent_1.Adherent, adherent => adherent.demandes),
    __metadata("design:type", adherent_1.Adherent)
], Demande.prototype, "adherent", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => visiteur_1.Visiteur, visiteur => visiteur.demandes),
    __metadata("design:type", visiteur_1.Visiteur)
], Demande.prototype, "visiteur", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => autreDemande_1.AutreDemande, autreDemande => autreDemande.demande),
    __metadata("design:type", Array)
], Demande.prototype, "autreDemandes", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => evenementDemande_1.EvenementDemande, evenementDemande => evenementDemande.demande),
    __metadata("design:type", Array)
], Demande.prototype, "evenementDemandes", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => aideProjetDemande_1.AideProjetDemande, aideProjetDemande => aideProjetDemande.demande),
    __metadata("design:type", Array)
], Demande.prototype, "aideProjetDemandes", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => parrainageDemande_1.ParrainageDemande, parrainageDemande => parrainageDemande.demande),
    __metadata("design:type", Array)
], Demande.prototype, "parrainageDemandes", void 0);
exports.Demande = Demande = __decorate([
    (0, typeorm_1.Entity)(),
    __metadata("design:paramtypes", [Number, String, Date, String, Array, Array, Array, Array, adherent_1.Adherent, visiteur_1.Visiteur])
], Demande);
