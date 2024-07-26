import express, { Request, Response } from "express";
import { invalidPathHandler } from "../errors/invalid-path-handler";
import { UserHandlerAuthentication } from "./users/userAuthentication";
import { UserHandler } from "./users/user";
import { RessourceHandler } from "./ressource";
import { ReservationHandler } from "./reservation";
import { TacheHandler } from "./tache";
import { TransactionHandler } from "./transaction";
import { ParrainageDemandeHandler } from "./parrainageDemande";
import { DemandeHandler } from "./demande";
import { AideProjetDemandeHandler } from "./aideProjetDemande";
import { EvenementHandler } from "./evenement";
import { EvenementDemandeHandler } from "./evenementDemande";
import { AzureBlobService } from "./azureBlobService";
import { FileVersion } from "./fileVersion";
import { InscriptionHandler } from "./inscription";
import { VisiteurHandler } from "./visiteur";
import { SondageHandler } from "./sondage";
import { AgHandler } from "./ag";
import { PropositionHandler } from "./proposition";
import { ParticipationAGHandler } from "./participationAG";
import { VoteHandler } from "./vote";
import { DossierHandler } from "./dossier";
import { AideProjetHandler } from "./aideProjet";
import { AutreDemandeHandler } from "./autreDemande";
import { EvenementUserHandler } from "./evenementUser";
import { EvenementRessourceHandler } from "./evenementRessource";
import { AdherentHandler } from "./adhrents/adherent";
import { CotisationHandler } from "./cotisation";
import { AdherentHandlerAuthentication } from "./adhrents/adherentAuthentication";


export const initRoutes = (app: express.Express) => {

    app.get("/health", (req: Request, res: Response) => {
        res.send({ "message": "OP LE S" })
    })


    UserHandlerAuthentication(app)
    UserHandler(app)
    RessourceHandler(app)
    ReservationHandler(app)
    TacheHandler(app)
    TransactionHandler(app)
    ParrainageDemandeHandler(app)
    DemandeHandler(app)
    AideProjetDemandeHandler(app)
    EvenementHandler(app)
    EvenementDemandeHandler(app)
    AzureBlobService(app)
    FileVersion(app)
    InscriptionHandler(app)
    VisiteurHandler(app)
    SondageHandler(app)
    AgHandler(app)
    PropositionHandler(app)
    ParticipationAGHandler(app)
    VoteHandler(app)
    DossierHandler(app)
    AideProjetHandler(app)
    AutreDemandeHandler(app)
    EvenementUserHandler(app)
    EvenementRessourceHandler(app)
    AdherentHandlerAuthentication(app)
    AdherentHandler(app)
    CotisationHandler(app)

    app.use(invalidPathHandler);
}
