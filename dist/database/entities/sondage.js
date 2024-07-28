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
exports.Sondage = exports.TypeSondage = void 0;
const typeorm_1 = require("typeorm");
const proposition_1 = require("./proposition");
var TypeSondage;
(function (TypeSondage) {
    TypeSondage["unTour"] = "UN_TOUR";
    TypeSondage["deuxTours"] = "DEUX_TOURS";
})(TypeSondage || (exports.TypeSondage = TypeSondage = {}));
let Sondage = class Sondage {
    constructor(id, nom, dateFin, dateDebut, description, type, propositions) {
        this.id = id;
        this.nom = nom;
        this.dateDebut = dateDebut;
        this.dateFin = dateFin;
        this.description = description;
        this.typeSondage = type;
        this.propositions = propositions;
    }
};
exports.Sondage = Sondage;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Sondage.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255 }),
    __metadata("design:type", String)
], Sondage.prototype, "nom", void 0);
__decorate([
    (0, typeorm_1.Column)('datetime'),
    __metadata("design:type", Date)
], Sondage.prototype, "dateDebut", void 0);
__decorate([
    (0, typeorm_1.Column)('datetime'),
    __metadata("design:type", Date)
], Sondage.prototype, "dateFin", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], Sondage.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Sondage.prototype, "typeSondage", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => proposition_1.Proposition, proposition => proposition.sondage),
    __metadata("design:type", Array)
], Sondage.prototype, "propositions", void 0);
exports.Sondage = Sondage = __decorate([
    (0, typeorm_1.Entity)(),
    __metadata("design:paramtypes", [Number, String, Date, Date, String, String, Array])
], Sondage);
