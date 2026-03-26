# UO-Compagnon

Le projet UO-Compagnon est une plateforme numérique d'accompagnement conçue spécifiquement pour les étudiants internationaux de l’université d'Ottawa. L'objectif principal est de réduire la surcharge cognitive en filtrant et en délivrant l'information de manière chronologique, selon le cycle de vie reel de l’étudiant.

## Presentation du Concept

L'application s'articule autour d'un moteur d’étapes intelligent qui calcule automatiquement la phase actuelle de l’étudiant (Avant l’arrivée, Semaine d'accueil, Premier mois, Mi-session) en se basant sur sa date d’arrivée au Canada et la date de debut de ses cours.

## Fonctionnalités Principales

### Pour l’étudiant

- Tableau de bord contextuel affichant les priorités du moment.
- Indicateur de progression visuel base sur les jalons du parcours.
- Hub de contenus académiques et de bien-être catégorisés par etape.
- Gestion proactive des notifications et alertes administratives.
- Accès rapide aux ressources d'urgence et de santé mentale.

### Pour l'Administration

- Interface de gestion permettant l'ajout et la modification des contenus.
- Contrôle des étapes temporelles et des priorités d'affichage.
- Suivi global de la distribution des ressources informatives.

## Architecture Technique

Le projet utilise la pile MERN (MongoDB, Express, React, Node.js) avec une architecture logicielle en 3-tiers (Models, Services, Controllers) pour garantir la maintenance et l'évolutivité du code.

- Frontend : React.js avec Vite, Vanilla CSS pour le style, Lucide pour les icônes.
- Backend : Node.js avec Express, Mongoose pour la modélisation des donnees.
- Sécurité : Authentification via JSON Web Tokens (JWT) et hachage des mots de passe avec Bcrypt.

## Structure du Depot

uo-compagnon/
├── backend/ # Code source du serveur API
├── frontend-student/ # Interface utilisateur pour les étudiants
├── frontend-admin/ # Interface utilisateur pour les administrateurs
└── README.md # Documentation du projet

## Installation et Configuration

### Prérequis

- Node.js (version 16 ou supérieure)
- MongoDB installe localement ou un cluster distant

### Configuration du Backend

1. Acceder au dossier : cd backend
2. Installer les dépendances : npm install
3. Créer un fichier .env avec les variables suivantes :
   PORT=5001
   MONGODB_URI=mongodb://127.0.0.1:27017/uo_compagnon
   JWT_SECRET=votre_cle_secrete_jwt

### Lancement des Applications

- Lancer le serveur : cd backend && npm start
- Lancer le client étudiant : cd frontend-student && npm run dev
- Lancer le client admin : cd frontend-admin && npm run dev

## Logique de Calcul des Étapes

Le backend determine l'etape de l'utilisateur selon les règles suivantes :

- Avant l'arrivée : Date actuelle < Date d'arrivée.
- Semaine d'accueil : Date d'arrivée <= Date actuelle < Date de début des cours.
- Premier mois : Date de début des cours <= Date actuelle < Date de début des cours + 30 jours.
- Mi-session : Date actuelle >= Date de début des cours + 30 jours.

---

Projet développé pour l'integration numérique des étudiants internationaux à l'Université d'Ottawa.
