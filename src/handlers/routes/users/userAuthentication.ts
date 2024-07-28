import express, { Request, Response } from "express"
import { AppDataSource } from "../../../database/database"
import { compare, hash } from "bcrypt";
import { createUserValidation, LoginUserValidation, userIdValidation } from "../../validators/user-validator"
import { generateValidationErrorMessage } from "../../validators/generate-validation-message";
import { User } from "../../../database/entities/user";
import { sign } from "jsonwebtoken";
import { Token } from "../../../database/entities/token";
import { UserUsecase } from "../../../domain/user-usecase";


export const UserHandlerAuthentication = (app: express.Express) => {
    app.post('/auth/signup', async (req: Request, res: Response) => {
        try {
            const validationResult = createUserValidation.validate(req.body)
            if (validationResult.error) {
                res.status(400).send(generateValidationErrorMessage(validationResult.error.details))
                return
            }

            const createUserRequest = validationResult.value;

            let hashedPassword;
            if(createUserRequest.motDePasse !== undefined){
                hashedPassword = await hash(createUserRequest.motDePasse, 10);
            }

            const userRepository = AppDataSource.getRepository(User);
            const user = await userRepository.save({
                nom: req.body.nom,
                prenom:req.body.prenom,
                email:req.body.email,
                motDePasse: hashedPassword,
                role: req.body.role,
                dateInscription: new Date(),
                estBenevole: req.body.estBenevole,
                numTel: req.body.numTel,
                profession: req.body.profession,
            });

            res.status(201).send({ id: user.id,nom: user.nom,prenom:user.prenom ,email: user.email, role: user.role });
            return
        } catch (error: unknown) {
            // Vérification de l'erreur de la base de données
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

    app.post('/auth/login', async (req: Request, res: Response) => {
        try {

            const validationResult = LoginUserValidation.validate(req.body)
            if (validationResult.error) {
                res.status(400).send(generateValidationErrorMessage(validationResult.error.details))
                return
            }
            const loginUserRequest = validationResult.value

            // valid user exist
            let user = await AppDataSource.getRepository(User).findOneBy({ email: loginUserRequest.email });

            if (!user) {
                res.status(400).send({ error: "username or password not valid" })
                return
            }

            console.log(loginUserRequest.motDePasse, user.motDePasse)

            const isValid = await compare(loginUserRequest.motDePasse, user.motDePasse);
            if (!isValid) {
                res.status(400).send({ error: "username or password not valid" })
                return
            }

            const userUsecase = new UserUsecase(AppDataSource);

            user = await userUsecase.getOneUser(user.id);

            if (user === null) {
                res.status(404).send({ "error": `user not found` })
                return
            }
            
            const secret = process.env.JWT_SECRET ?? "azerty"
            const token = sign({ userId: user.id, email: user.email }, secret, { expiresIn: '1d' });
            await AppDataSource.getRepository(Token).save({ token: token, user: user})
            

            user.estEnLigne = true;
            await userUsecase.updateUser(
                user.id,
                { ...user }
            );
            
            res.status(200).json({ token, user });
        } catch (error) {
            console.log(error)
            res.status(500).send({ "error": "internal error retry later" })
            return
        }
    })

    app.delete('/auth/logout/:id', async (req: Request, res: Response) => {
        try {
            const validationResult = userIdValidation.validate({ ...req.params, ...req.body });


            if (validationResult.error) {
                res.status(400).send(generateValidationErrorMessage(validationResult.error.details));
                return;
            }

            const userUsecase = new UserUsecase(AppDataSource);
            
            if(await userUsecase.verifUser(+req.params.id, req.body.token) === false){
                res.status(400).send({ "error": `Bad user` });
                return;
            } 

            const userId = validationResult.value

            const userRepository = AppDataSource.getRepository(User);
            const user = await userRepository.findOneBy({ id: userId.id })

            if (user === null) {
                res.status(404).send({ "error": `user ${userId.id} not found` })
                return
            }


            userUsecase.deleteToken(user.id)

            user.estEnLigne = false;
            await userUsecase.updateUser(
                user.id,
                { ...user }
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
