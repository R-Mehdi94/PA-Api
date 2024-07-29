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
exports.Ressource = exports.TypeRessource = void 0;
const typeorm_1 = require("typeorm");
require("reflect-metadata");
const evenementUser_1 = require("./evenementUser");
const evenementRessource_1 = require("./evenementRessource");
const tache_1 = require("./tache");
var TypeRessource;
(function (TypeRessource) {
    TypeRessource["Vetement"] = "Vetement";
    TypeRessource["Argent"] = "Argent";
    TypeRessource["Alimentaire"] = "Alimentaire";
    TypeRessource["MaterielMaisonDivers"] = "Mat\u00E9riel maison divers";
    TypeRessource["Materiel"] = "Materiel";
    TypeRessource["Autre"] = "Autre";
})(TypeRessource || (exports.TypeRessource = TypeRessource = {}));
let Ressource = class Ressource {
    constructor(id, nom, type, emplacement, quantite, evenementRessources, evenementUsers, taches, sync_status) {
        this.id = id;
        this.nom = nom;
        this.type = type;
        this.quantite = quantite;
        this.emplacement = emplacement;
        this.evenementRessources = evenementRessources;
        this.evenementUsers = evenementUsers;
        this.taches = taches;
        this.sync_status = sync_status;
    }
};
exports.Ressource = Ressource;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Ressource.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Ressource.prototype, "nom", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "enum",
        enum: TypeRessource,
    }),
    __metadata("design:type", String)
], Ressource.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Ressource.prototype, "quantite", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Ressource.prototype, "sync_status", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Ressource.prototype, "emplacement", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => evenementRessource_1.EvenementRessource, evenementRessource => evenementRessource.ressource),
    __metadata("design:type", Array)
], Ressource.prototype, "evenementRessources", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => evenementUser_1.EvenementUser, evenementUser => evenementUser.user),
    __metadata("design:type", Array)
], Ressource.prototype, "evenementUsers", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => tache_1.Tache, tache => tache.ressource),
    __metadata("design:type", Array)
], Ressource.prototype, "taches", void 0);
exports.Ressource = Ressource = __decorate([
    (0, typeorm_1.Entity)(),
    __metadata("design:paramtypes", [Number, String, String, String, Number, Array, Array, Array, String])
], Ressource);
