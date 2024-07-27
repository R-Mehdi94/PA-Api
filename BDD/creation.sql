DROP DATABASE IF EXISTS ECAF;
CREATE DATABASE ECAF;

USE ECAF;

CREATE TABLE user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    motDePasse VARCHAR(255),
    profession VARCHAR(255),
    numTel VARCHAR(10),
    role ENUM('Administrateur', 'Utilisateur') NOT NULL,
    dateInscription TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estBenevole BOOLEAN DEFAULT FALSE,
    estEnLigne BOOLEAN DEFAULT FALSE
);

CREATE TABLE visiteur (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    age INT,
    numTel VARCHAR(10),
    profession VARCHAR(255),
    dateInscription TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (email)
);

CREATE TABLE adherent (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    motDePasse VARCHAR(255),
    age INT,
    numTel VARCHAR(10),
    adresse VARCHAR(255),
    profession VARCHAR(255),
    estBenevole BOOLEAN DEFAULT FALSE,
    dateInscription TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    parrainId INT,
    estBanie BOOLEAN DEFAULT FALSE,
    UNIQUE (email),
    FOREIGN KEY (parrainId) REFERENCES user(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE cotisation (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT,
    adherentId INT,
    type ENUM('cadre','etudiant','chefEntreprise','autre'),
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Ajours BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (userId) REFERENCES user(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (adherentId) REFERENCES adherent(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE fonctionnalite (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom TEXT NOT NULL,
    description TEXT
);

CREATE TABLE droit (
    id int AUTO_INCREMENT,
    userId INT,
    fonctionnaliteId INT,
    FOREIGN KEY (userId) REFERENCES user(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (fonctionnaliteId) REFERENCES fonctionnalite(id) ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY (id, userId, fonctionnaliteId)
);


CREATE TABLE ressource (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    type ENUM('Vetement', 'Argent', 'Alimentaire','Jouet','Matériel maison divers','Materiel','Autre') NOT NULL,
    quantite INT DEFAULT 1,
    emplacement VARCHAR(255) DEFAULT NULL
);

CREATE TABLE tache (
    id INT AUTO_INCREMENT PRIMARY KEY,
    description TEXT NOT NULL,
    dateDebut DATE NOT NULL,
    dateFin DATE NOT NULL,
    statut ENUM('En cours', 'Fini') NOT NULL,
    responsableId INT,
    ressourceId INT,
    FOREIGN KEY (responsableId) REFERENCES user(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (ressourceId) REFERENCES ressource(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE evenement (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    date DATETIME NOT NULL,
    description TEXT NOT NULL,
    lieu VARCHAR(255) NOT NULL,
    nbPlace INT,
    estReserve BOOLEAN DEFAULT FALSE
);

CREATE TABLE evenement_user(
    id INT AUTO_INCREMENT,                               
    userId INT,
    evenementId INT,
    PRIMARY KEY (id, userId, evenementId),
    FOREIGN KEY (userId) REFERENCES user(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (evenementId) REFERENCES evenement(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE evenement_ressource (
    id INT AUTO_INCREMENT,                               
    ressourceId INT,
    evenementId INT,
    PRIMARY KEY (id,ressourceId, evenementId), 
    FOREIGN KEY (ressourceId) REFERENCES ressource(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (evenementId) REFERENCES evenement(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE inscription (
    id INT AUTO_INCREMENT,
    visiteurId INT,
    adherentId INT,
    evenementId INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (visiteurId) REFERENCES visiteur(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (adherentId) REFERENCES adherent(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (evenementId) REFERENCES evenement(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE sondage (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    date DATETIME NOT NULL,
    description TEXT,
    type VARCHAR(50)
);

CREATE TABLE ag (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    date DATETIME NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL,
    quorum INT NOT NULL
);

CREATE TABLE participation_ag (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    agId INT NOT NULL,
    FOREIGN KEY (userId) REFERENCES user(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (agId) REFERENCES ag(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE proposition (
    id INT AUTO_INCREMENT PRIMARY KEY,
    question TEXT NOT NULL,
    type ENUM('checkbox', 'radio', 'text') NOT NULL,
    choix TEXT NOT NULL,
    agId INT,
    sondageId INT,
    FOREIGN KEY (agId) REFERENCES ag(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (sondageId) REFERENCES sondage(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE vote (
    id INT AUTO_INCREMENT PRIMARY KEY,
    propositionId INT NOT NULL,
    userId INT NOT NULL,
    choix VARCHAR(255) NOT NULL,
    FOREIGN KEY (propositionId) REFERENCES proposition(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (userId) REFERENCES user(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE transaction (
    id INT AUTO_INCREMENT,
    montant FLOAT NOT NULL,
    type ENUM('Don', 'Cotisation', 'Inscription') NOT NULL,
    dateTransaction TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    visiteurId INT,
    adherentId INT,
    methodePaiement VARCHAR(255),
    PRIMARY KEY (id),
    FOREIGN KEY (visiteurId) REFERENCES visiteur(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (adherentId) REFERENCES adherent(id) ON DELETE CASCADE ON UPDATE CASCADE
);



/*CREATE TABLE reservation (
   id INT AUTO_INCREMENT PRIMARY KEY,
    dateDebut DATETIME NOT NULL,
    dateFin DATETIME NOT NULL,
    description TEXT NOT NULL,
    ressourceId INT NOT NULL,
    userId INT NOT NULL,
    FOREIGN KEY (ressourceId) REFERENCES ressource(id) ON DELETE CASCADE ON UPDATE CASCADE, 
    FOREIGN KEY (userId) REFERENCES user(id) ON DELETE CASCADE ON UPDATE CASCADE
);*/

CREATE TABLE token (
    id INT AUTO_INCREMENT PRIMARY KEY,
    token VARCHAR(255) NOT NULL,
    blobName VARCHAR(255),
    userId INT REFERENCES user(id) ON DELETE CASCADE ON UPDATE CASCADE,
    adherentId INT REFERENCES adherent(id) ON DELETE CASCADE ON UPDATE CASCADE

);

CREATE TABLE dossier (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    tokenId INT REFERENCES token(id) ON DELETE CASCADE ON UPDATE CASCADE,
    dossierId INT REFERENCES dossier(id) ON DELETE CASCADE ON UPDATE CASCADE,
    userId INT REFERENCES user(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE demande(
    id INT AUTO_INCREMENT,
    type ENUM('Projet','Evénement','Parrainage','Autre'),
    dateDemande TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    statut ENUM('En attente','Acceptée','Refusée') DEFAULT 'En attente',
    emailVisiteur VARCHAR(255) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE autre_demande (
    id INT AUTO_INCREMENT PRIMARY KEY,
    demandeId INT,
    titre VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    FOREIGN KEY (demandeId) REFERENCES demande(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE evenement_demande (
    id INT AUTO_INCREMENT PRIMARY KEY,
    demandeId INT,
    titre VARCHAR(255) NOT NULL,
    date DATETIME NOT NULL,
    description TEXT NOT NULL,
    lieu VARCHAR(255) NOT NULL,
    FOREIGN KEY (demandeId) REFERENCES demande(id) ON DELETE CASCADE ON UPDATE CASCADE
);


CREATE TABLE aide_projet_demande (
    id INT AUTO_INCREMENT PRIMARY KEY,
    demandeId INT,
    titre VARCHAR(255),
    descriptionProjet TEXT,
    budget FLOAT DEFAULT 0.0,
    deadline DATETIME,
    FOREIGN KEY (demandeId) REFERENCES demande(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE parrainage_demande (
    id INT AUTO_INCREMENT PRIMARY KEY,
    parrainId INT,
    demandeId INT,
    detailsParrainage TEXT,
    FOREIGN KEY (parrainId) REFERENCES user(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (demandeId) REFERENCES demande(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE aide_projet(
    id INT AUTO_INCREMENT PRIMARY KEY,
    titre VARCHAR(255),
    descriptionProjet TEXT,
    budget FLOAT DEFAULT 0.0,
    deadline DATETIME
);