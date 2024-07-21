import express, { Request, Response } from 'express';
import { Token } from '../../database/entities/token';
import { AppDataSource } from '../../database/database';
import { authMiddlewareAdminstrateur, authMiddlewareAll } from '../middleware/auth-middleware';
import { User } from '../../database/entities/user';
import upload from '../middleware/upload';
import { azureBlobService } from '../validators/azureBlob-validator';
import { generateValidationErrorMessage } from '../validators/generate-validation-message';
import { userIdValidation } from '../validators/user-validator';
import { UserUsecase } from '../../domain/user-usecase';
import { AzureBlobServiceUsecase } from '../../domain/azureBlobService-usecase';


export const AzureBlobService = (app: express.Express) => {

    app.post("/getFiles/:id", authMiddlewareAll, async (req: Request, res: Response) => {
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

        const userId = validationResult.value.id;

        try {
            const azureUseCase = new AzureBlobServiceUsecase(AppDataSource);
            const blobName = await azureUseCase.getBlobName(userId);

            if (!blobName) {
                res.status(200).send({ "reponse": `Aucun fichier` });
                return
            }

            res.json({ blobName });
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal server error');
        }
    });

    app.post("/generate-sas-url/:id", authMiddlewareAll ,async (req: Request, res: Response) => {
        const validationResult = azureBlobService.validate({ ...req.params, ...req.body });

        if (validationResult.error) {
            res.status(400).send(generateValidationErrorMessage(validationResult.error.details));
            return;
        }

        const userUsecase = new UserUsecase(AppDataSource);

        if(await userUsecase.verifUser(+req.params.id, req.body.token) === false){
            res.status(400).send({ "error": `Bad user` });
            return;
        } 

        const userId = validationResult.value.id;
        const blobName = validationResult.value.blobName;
        const tokenRepo = AppDataSource.getRepository(Token);

        try {
            const token = await tokenRepo.findOne({
                where: [
                  { user: { id: +userId }, blobName: blobName },
                  { user: {id: undefined}, blobName: blobName }
                ]
              });            if (!token) {
            return res.status(404).send('No token found for the specified blob and user');
            }

            const validityInMinutes = 10; // 10 minutes
            const azureUseCase = new AzureBlobServiceUsecase(AppDataSource);
            const sasUrl = await azureUseCase.generateSasToken(blobName, validityInMinutes);

            res.json({ sasUrl });
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal server error');
        }
    });
    
    app.post("/upload-document/:id", authMiddlewareAll, upload.single('file'), async (req: Request, res: Response) => {
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

        const userId = validationResult.value.id;        
        const file = req.file;
        if (!file) {
            return res.status(400).send('No file uploaded');
        }

        console.log("User ID:", userId);
        const tokenRepo = AppDataSource.getRepository(Token);
        const userRepo = AppDataSource.getRepository(User);

        try {
            const user = await userRepo.findOne({ where: { id: +userId } });
            if (!user) {
                return res.status(404).send('User not found');
            }

            const blobName = `${file.originalname}`;
            const mimeType = file.mimetype;
            const azureUseCase = new AzureBlobServiceUsecase(AppDataSource);

            await azureUseCase.uploadBlob(blobName, file.buffer, mimeType);

            const newToken = tokenRepo.create({
                token: 'some-generated-token', 
                blobName: blobName,
                user: user
            });

            await tokenRepo.save(newToken);

            res.status(200).send('File uploaded and token saved');
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal server error');
        }
    });

    app.post("/delete-document/:id", authMiddlewareAll, async (req: Request, res: Response) => {
        const validationResult = azureBlobService.validate({ ...req.params, ...req.body });

        if (validationResult.error) {
            res.status(400).send(generateValidationErrorMessage(validationResult.error.details));
            return;
        }

        const userUsecase = new UserUsecase(AppDataSource);

        if(await userUsecase.verifUser(+req.params.id, req.body.token) === false){
            res.status(400).send({ "error": `Bad user` });
            return;
        } 

        const userId = validationResult.value.id;
        const blobName = validationResult.value.blobName;
        
        const tokenRepo = AppDataSource.getRepository(Token);
      
        try {
          const token = await tokenRepo.findOne({ where: { user: { id: +userId }, blobName } });
      
          if (!token) {
            return res.status(404).send('Blob not found or you do not have access');
          }
      
          await tokenRepo.remove(token);
          const azureUseCase = new AzureBlobServiceUsecase(AppDataSource);

          await azureUseCase.deleteBlob(blobName);
      
          res.status(200).send('Blob deleted successfully');
        } catch (error) {
          console.error(error);
          res.status(500).send('Internal server error');
        }
      });
      
}


