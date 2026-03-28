#  UO-Compagnon : L'Assistant Intelligent uOttawa

UO-Compagnon est une plateforme numérique d'accompagnement conçue spécifiquement pour les étudiants internationaux de l’Université d'Ottawa. 

Contrairement à un portail classique, **UO-Compagnon est un système contextuel** : il réduit la surcharge cognitive en filtrant et en délivrant l'information de manière chronologique, selon le cycle de vie réel de l’étudiant.

---

##  Le Moteur d'Intelligence (Phase System)

L'application s'appuie sur un **Phase Engine** centralisé qui calcule en temps réel la position de l'étudiant dans son parcours universitaire.

### Les 4 Phases du Parcours :
1.  **Avant l'arrivée** : Préparation, visa, logement, budget.
2.  **Semaine d'accueil** : Arrivée à Ottawa, carte étudiante, uoZone, orientation.
3.  **Premier mois** : Intégration académique, tutorat, vie sociale.
4.  **Mi-session** : Réussite, GPA, examens, intégrité académique.

### Fonctionnement Intelligent :
*   **Contenus Pertinents** : Chaque route API auto-détecte la phase de l'utilisateur via son token JWT et filtre les ressources pour ne montrer que ce qui est utile *maintenant* (avec historique de rattrapage).
*   **Notifications Smart** : Le système génère des alertes dynamiques basées sur le timing (ex: *"Tes cours commencent dans 3 jours"*) fusionnées avec les notifications administratives de la base de données.
*   **Progression Dynamique** : Un calcul précis en pourcentage (0-100%) suit l'évolution de l'étudiant tout au long du trimestre.

---

##  Architecture Technique

Le projet utilise une architecture **MERN** (MongoDB, Express, React, Node.js) structurée en **3-tiers** pour une séparation nette des responsabilités :
*   **Models** : Schémas Mongoose validés (dont validation `@uottawa.ca`).
*   **Services** : Toute la logique métier et l'intelligence (PhaseService, DashboardService).
*   **Controllers** : Gestion des requêtes et réponses API.
*   **Middlewares** : Sécurité JWT et gestion des rôles (Student vs Admin).

---

##  Installation et Démarrage rapide

### 1. Configuration du Backend
1.  `cd backend`
2.  `npm install`
3.  Crée un fichier `.env` :
    ```env
    PORT=5001
    MONGODB_URI=mongodb://127.0.0.1:27017/uo_compagnon
    JWT_SECRET=votre_cle_secrete_jwt
    ```
4.  **Initialiser la base intelligente** :
    ```bash
    node seed.js
    ```

### 2. Comptes de Test (Seed Data)
| Rôle | Email | Mot de passe |
|---|---|---|
| **Étudiant** | `amara@uottawa.ca` | `password123` |
| **Admin** | `admin@uottawa.ca` | `admin123` |

---

##  Documentation API

###  Authentification & Utilisateurs
| Méthode | Route | Description |
|---|---|---|
| `POST` | `/api/users/register` | Inscription d'un nouvel étudiant (validation @uottawa.ca). |
| `POST` | `/api/users/login` | Connexion et génération du token JWT. |
| `GET` | `/api/users/profile` | Récupère les infos du profil connecté (JWT requis). |

###  Endpoints Intelligents (Student Context)
| Méthode | Route | Description |
|---|---|---|
| `GET` | `/api/dashboard` | **Endpoint central** : phase, progression, notifications et actions recommandé. |
| `GET` | `/api/contents/relevant` | Liste de contenus auto-filtrée par phase et triée par priorité. |
| `GET` | `/api/notifications/smart` | Mix de notifications dynamiques (calculées) et persistantes (DB). |

###  Gestion des Contenus (CRUD)
| Méthode | Route | Description |
|---|---|---|
| `GET` | `/api/contents` | Récupère tous les contenus (filtre optionnel `?step=`). |
| `POST` | `/api/contents` | Création d'un contenu (**Admin requis**). |
| `PUT` | `/api/contents/:id` | Modification d'un contenu (**Admin requis**). |
| `DELETE` | `/api/contents/:id` | Suppression d'un contenu (**Admin requis**). |

###  Notifications
| Méthode | Route | Description |
|---|---|---|
| `GET` | `/api/notifications` | Récupère les notifications persistantes. |
| `PUT` | `/api/notifications/mark-read` | Marque toutes les notifications comme lues pour le user. |
| `PUT` | `/api/notifications/mark-read/:id` | Marque une notification spécifique comme lue. |

###  Administration & Stats
| Méthode | Route | Description |
|---|---|---|
| `GET` | `/api/dashboard/admin` | Statistiques globales, graphiques de distribution et users récents (**Admin requis**). |

---

##  Développement

*   **Backend** : Node.js / Express / Mongoose
*   **Sécurité** : JWT (stockage localStorage), Bcryptjs
*   **Validation** : Regex stricte sur le domaine @uottawa.ca

---
*Projet développé pour l'intégration numérique des étudiants internationaux à l'Université d'Ottawa.*
