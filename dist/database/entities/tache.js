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
exports.Tache = exports.StatutTache = void 0;
const typeorm_1 = require("typeorm");
require("reflect-metadata");
const user_1 = require("./user");
const ressource_1 = require("./ressource");
var StatutTache;
(function (StatutTache) {
    StatutTache["Fini"] = "Fini";
    StatutTache["EnCours"] = "En cours";
})(StatutTache || (exports.StatutTache = StatutTache = {}));
let Tache = class Tache {
    constructor(id, description, dateDebut, dateFin, statut, responsable, ressource) {
        this.id = id;
        this.description = description;
        this.dateDebut = dateDebut;
        this.dateFin = dateFin;
        this.statut = statut;
        this.responsable = responsable;
        this.ressource = ressource;
    }
};
exports.Tache = Tache;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Tache.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Tache.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], Tache.prototype, "dateDebut", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], Tache.prototype, "dateFin", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "enum",
        enum: StatutTache,
    }),
    __metadata("design:type", String)
], Tache.prototype, "statut", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_1.User, user => user.taches),
    __metadata("design:type", user_1.User)
], Tache.prototype, "responsable", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => ressource_1.Ressource, ressource => ressource.taches),
    __metadata("design:type", ressource_1.Ressource)
], Tache.prototype, "ressource", void 0);
exports.Tache = Tache = __decorate([
    (0, typeorm_1.Entity)(),
    __metadata("design:paramtypes", [Number, String, Date, Date, String, user_1.User, ressource_1.Ressource])
], Tache);
