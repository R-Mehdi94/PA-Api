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
exports.Cotisation = exports.typeCotisation = void 0;
const typeorm_1 = require("typeorm");
require("reflect-metadata");
const adherent_1 = require("./adherent");
const user_1 = require("./user");
var typeCotisation;
(function (typeCotisation) {
    typeCotisation["cadre"] = "cadre";
    typeCotisation["etudiant"] = "etudiant";
    typeCotisation["chefEntreprise"] = "chefEntreprise";
    typeCotisation["autre"] = "autre";
})(typeCotisation || (exports.typeCotisation = typeCotisation = {}));
let Cotisation = class Cotisation {
    constructor(id, type, Ajours, date, user, adherent) {
        this.id = id;
        this.type = type;
        this.Ajours = Ajours;
        this.date = date;
        this.user = user;
        this.adherent = adherent;
    }
};
exports.Cotisation = Cotisation;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Cotisation.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Cotisation.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], Cotisation.prototype, "Ajours", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, typeorm_1.CreateDateColumn)({ type: "datetime" }),
    __metadata("design:type", Date)
], Cotisation.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_1.User, user => user.cotisations),
    __metadata("design:type", user_1.User)
], Cotisation.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => adherent_1.Adherent, adherent => adherent.cotisations),
    __metadata("design:type", adherent_1.Adherent)
], Cotisation.prototype, "adherent", void 0);
exports.Cotisation = Cotisation = __decorate([
    (0, typeorm_1.Entity)(),
    __metadata("design:paramtypes", [Number, String, Boolean, Date, user_1.User, adherent_1.Adherent])
], Cotisation);
