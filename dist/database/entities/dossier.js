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
exports.Dossier = void 0;
const typeorm_1 = require("typeorm");
const token_1 = require("./token");
const user_1 = require("./user");
let Dossier = class Dossier {
    constructor(id, nom, nomUtilisateur, type, token, dossier, enfants, user) {
        this.id = id;
        this.nom = nom;
        this.nomUtilisateur = nomUtilisateur;
        this.type = type;
        this.token = token;
        this.dossier = dossier;
        this.enfants = enfants;
        this.user = user;
    }
};
exports.Dossier = Dossier;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Dossier.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Dossier.prototype, "nom", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Dossier.prototype, "nomUtilisateur", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Dossier.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => token_1.Token, token => token.dossiers),
    __metadata("design:type", token_1.Token)
], Dossier.prototype, "token", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Dossier, dossier => dossier.enfants),
    __metadata("design:type", Object)
], Dossier.prototype, "dossier", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Dossier, dossier => dossier.dossier),
    __metadata("design:type", Array)
], Dossier.prototype, "enfants", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => token_1.Token, user => user.dossiers),
    __metadata("design:type", user_1.User)
], Dossier.prototype, "user", void 0);
exports.Dossier = Dossier = __decorate([
    (0, typeorm_1.Entity)(),
    __metadata("design:paramtypes", [Number, String, String, String, token_1.Token, Dossier, Array, user_1.User])
], Dossier);
