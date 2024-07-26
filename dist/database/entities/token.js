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
exports.Token = void 0;
const typeorm_1 = require("typeorm");
const user_1 = require("./user");
const dossier_1 = require("./dossier");
const adherent_1 = require("./adherent");
let Token = class Token {
    constructor(id, token, blobName, user, dossiers, adherent) {
        this.id = id;
        this.token = token;
        this.blobName = blobName;
        this.user = user;
        this.adherent = adherent;
        this.dossiers = dossiers;
    }
};
exports.Token = Token;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Token.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255 }),
    __metadata("design:type", String)
], Token.prototype, "token", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255 }),
    __metadata("design:type", String)
], Token.prototype, "blobName", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_1.User, user => user.tokens),
    __metadata("design:type", user_1.User)
], Token.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => adherent_1.Adherent, adherent => adherent.tokens),
    __metadata("design:type", adherent_1.Adherent)
], Token.prototype, "adherent", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => dossier_1.Dossier, dossier => dossier.token),
    __metadata("design:type", Array)
], Token.prototype, "dossiers", void 0);
exports.Token = Token = __decorate([
    (0, typeorm_1.Entity)(),
    __metadata("design:paramtypes", [Number, String, String, user_1.User, Array, adherent_1.Adherent])
], Token);
