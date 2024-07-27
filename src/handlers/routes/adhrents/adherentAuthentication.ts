import express, { Request, Response } from "express"
import { AppDataSource } from "../../../database/database"
import { generateValidationErrorMessage } from "../../validators/generate-validation-message";
import { sign } from "jsonwebtoken";
import { Token } from "../../../database/entities/token";
import { adherentIdValidation, createAdherentValidation, LoginValidationValidation } from "../../validators/adherent-validator";
import { Adherent } from "../../../database/entities/adherent";
import { AdherentUsecase } from "../../../domain/adherent-usecase";
import { compare, hash } from "bcrypt";


export const AdherentHandlerAuthentication = (app: express.Express) => {
    app.post('/auth/signupAdherent', async (req: Request, res: Response) => {
        try {
            const validationResult = createAdherentValidation.validate(req.body)
            if (validationResult.error) {
                res.status(400).send(generateValidationErrorMessage(validationResult.error.details))
                return
            }

            const createAdherentRequest = validationResult.value;

            let hashedPassword;
            if(createAdherentRequest.motDePasse !== undefined){
                hashedPassword = await hash(createAdherentRequest.motDePasse, 10);
            }

            const adherentRepository = AppDataSource.getRepository(Adherent);
            const adherent = await adherentRepository.save({
                nom: req.body.nom,
                prenom:req.body.prenom,
                email:req.body.email,
                motDePasse: hashedPassword,
                age: req.body.age,
                adresse: req.body.adresse,
                profession : req.body.profession,
                parrainId: req.body.parrainId || null,
                estBanie: false,
                dateInscription: new Date(),
                estBenevole: req.body.estBenevole,
                numTel: req.body.numTel,
            });

            res.status(201).send({ id: adherent.id,nom: adherent.nom,prenom:adherent.prenom ,email: adherent.email});
            return
        } catch (error: unknown) {
            const mysqlError = error as any;
            if (error instanceof Error) {
                
            if (mysqlError.code === 'ER_DUP_ENTRY') {
                res.status(400).send({ error: "L'adresse email est déjà utilisée." });
                } else {
                    // Log de l'erreur pour le débogage
                    console.error('Erreur interne du serveur:', error);
    
                    // Envoi de la réponse d'erreur générique
                    res.status(500).send({ error: "Erreur interne du serveur. Réessayez plus tard." });
                }
            } else {
                // En cas d'erreur inconnue non instance de Error
                console.error('Erreur inconnue:', error);
                res.status(500).send({ error: "Erreur inconnue. Réessayez plus tard." });
            }
            return
        }
    })

    app.post('/auth/loginAdherent', async (req: Request, res: Response) => {
        try {

            const validationResult = LoginValidationValidation.validate(req.body)
            if (validationResult.error) {
                res.status(400).send(generateValidationErrorMessage(validationResult.error.details))
                return
            }
            const loginAdherentRequest = validationResult.value

            // valid user exist
            let adherent = await AppDataSource.getRepository(Adherent).findOneBy({ email: loginAdherentRequest.email });

            if (!adherent) {
                res.status(400).send({ error: "username or password not valid" })
                return
            }


            console.log(loginAdherentRequest.motDePasse)
            console.log(adherent.motDePasse)

            const isValid = await compare(loginAdherentRequest.motDePasse, adherent.motDePasse);
            if (!isValid) {
                res.status(400).send({ error: "username or password not valid" })
                return
            }

            const adherentUsecase = new AdherentUsecase(AppDataSource);

            adherent = await adherentUsecase.getOneAdherent(adherent.id);

            if (adherent === null) {
                res.status(404).send({ "error": `Adherent not found` })
                return
            }
            
            const secret = process.env.JWT_SECRET ?? "azerty"
            const token = sign({ adherentId: adherent.id, email: adherent.email }, secret, { expiresIn: '1d' });
            await AppDataSource.getRepository(Token).save({ token: token, adherent: adherent})
            

            await adherentUsecase.updateAdherent(
                adherent.id,
                { ...adherent }
            );
            
            res.status(200).json({ token, adherent });
        } catch (error) {
            console.log(error)
            res.status(500).send({ "error": "internal error retry later" })
            return
        }
    })

    app.delete('/auth/logoutAdherent/:id', async (req: Request, res: Response) => {
        try {
            const validationResult = adherentIdValidation.validate({ ...req.params, ...req.body });


            if (validationResult.error) {
                res.status(400).send(generateValidationErrorMessage(validationResult.error.details));
                return;
            }

            const adherentUsecase = new AdherentUsecase(AppDataSource);
            
            if(await adherentUsecase.verifAdherentToken(+req.params.id, req.body.token) === false){
                res.status(400).send({ "error": `Bad Adherent` });
                return;
            } 

            const adherentId = validationResult.value

            const adherentRepository = AppDataSource.getRepository(Adherent);
            const adherent = await adherentRepository.findOneBy({ id: adherentId.id })

            if (adherent === null) {
                res.status(404).send({ "error": `Adherent ${adherentId.id} not found` })
                return
            }


            adherentUsecase.deleteToken(adherent.id)

            await adherentUsecase.updateAdherent(
                adherent.id,
                { ...adherent }
            );
            
            
            res.status(201).send({ "message": "logout success" });
            return
        } catch (error) {
            console.log(error)
            res.status(500).send({ "error": "internal error retry later" })
            return
        }
    })  

}
