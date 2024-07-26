import express, { Request, Response } from 'express';
import { AppDataSource } from '../../../database/database';
import { User } from '../../../database/entities/user';
import { UserUsecase } from '../../../domain/user-usecase';
import { generateValidationErrorMessage } from '../../validators/generate-validation-message';
import { listUserValidation, createUserValidation, userIdValidation, updateUserValidation} from '../../validators/user-validator';
import { hash } from "bcrypt";


export const UserHandler = (app: express.Express) => {

    app.post("/usersEmail", async (req: Request, res: Response) => {


        try {
            const userUsecase = new UserUsecase(AppDataSource);
            const listUserEmail = await userUsecase.getUserEmail()

            res.status(200).send(listUserEmail);
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });

    app.get("/users/blobName/:id", async (req: Request, res: Response) => {
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
            const userId = validationResult.value;

            const user = await userUsecase.getOneUser(userId.id);
            if (user === null) {
                res.status(404).send({ "error": `User ${userId.id} not found` });
                return;
            }

            const listBlobName = [];

            for (const element of user.tokens) {
                if(element.blobName !== null){
                    listBlobName.push(element.blobName);
                }
            }

            res.status(200).send(listBlobName);
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });

    app.get("/users", async (req: Request, res: Response) => {
        const validation = listUserValidation.validate(req.query);

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details));
            return;
        }

        const listUserRequest = validation.value;
        let limit = 20;
        if (listUserRequest.limit) {
            limit = listUserRequest.limit;
        }
        const page = listUserRequest.page ?? 1;

        try {
            const userUsecase = new UserUsecase(AppDataSource);
            const listUsers = await userUsecase.listUsers({ ...listUserRequest, page, limit });
            res.status(200).send(listUsers);
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });

    app.post("/users", async (req: Request, res: Response) => {
        const validation = createUserValidation.validate(req.body);

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details));
            return;
        }
        const userRequest = validation.value;

        const userRepo = AppDataSource.getRepository(User);

        try {
            const userCreated = await userRepo.save(userRequest);
            res.status(201).send(userCreated);
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });

    app.delete("/users/:id", async (req: Request, res: Response) => {
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
            const userId = validationResult.value;

            const userRepository = AppDataSource.getRepository(User);
            const user = await userRepository.findOneBy({ id: userId.id });
            if (user === null) {
                res.status(404).send({ "error": `User ${userId.id} not found` });
                return;
            }

            await userRepository.remove(user);
            res.status(200).send("User supprimé avec succès");
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });

    app.get("/users/:id", async (req: Request, res: Response) => {
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
            const userId = validationResult.value;

            const user = await userUsecase.getOneUser(userId.id);
            if (user === null) {
                res.status(404).send({ "error": `User ${userId.id} not found` });
                return;
            }
            res.status(200).send(user);
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });

    app.patch("/users/:id", async (req: Request, res: Response) => {



        try {
            const validationResult = updateUserValidation.validate({ ...req.params, ...req.body });

            if (validationResult.error) {
                res.status(400).send(generateValidationErrorMessage(validationResult.error.details));
                return;
            }
    
            const userUsecase = new UserUsecase(AppDataSource);

            let user = await AppDataSource.getRepository(User).findOneBy({ id: validationResult.value.id });

            
            if(user?.role !== "Administrateur"){
                if(await userUsecase.verifUser(+req.params.id, req.body.token) === false){
                    res.status(400).send({ "error": `Bad user` });
                    return;
                } 
            }

            if(validationResult.value.motDePasse !== undefined){
                validationResult.value.motDePasse = await hash(validationResult.value.motDePasse, 10);
            }
            
            const updateUserRequest = validationResult.value;

            const updatedUser = await userUsecase.updateUser(
                updateUserRequest.id,
                { ...updateUserRequest }
            );



            if (updatedUser === null) {
                res.status(404).send({ "error": `User ${updateUserRequest.id} not found` });
                return;
            }

            if (updatedUser === "No update provided") {
                res.status(400).send({ "error": `No update provided` });
                return;
            }



            res.status(200).send(updatedUser);
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });

    app.patch("/visiteurs/:id" ,async (req: Request, res: Response) => {
        const validation = updateUserValidation.validate({ ...req.params, ...req.body });

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details));
            return;
        }



        const updateUserRequest = validation.value;

        try {
            if(updateUserRequest.role as string !== "visiteur"){
                res.status(400).send({ "error": `User ${updateUserRequest.id} n'est pas un visiteur` });
                return;
            }
            const userUsecase = new UserUsecase(AppDataSource);

            if(await userUsecase.verifUser(+req.params.id, req.body.token) === false){
                res.status(400).send({ "error": `Bad user` });
                return;
            } 

            const validationResult = userIdValidation.validate(req.params);

            if (validationResult.error) {
                res.status(400).send(generateValidationErrorMessage(validationResult.error.details));
                return;
            }

            const updatedUser = await userUsecase.updateUser(
                updateUserRequest.id,
                { ...updateUserRequest }
            );


            if (updatedUser === null) {
                res.status(404).send({ "error": `User ${updateUserRequest.id} not found` });
                return;
            }

            if (updatedUser === "No update provided") {
                res.status(400).send({ "error": `No update provided` });
                return;
            }



            res.status(200).send(updatedUser);
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });
};
