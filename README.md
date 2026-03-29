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

##  Developpement

*   **Backend** : Node.js / Express / Mongoose
*   **Frontend** : React 19 / Vite 8 / Vanilla CSS
*   **Securite** : JWT (stockage localStorage), Bcryptjs
*   **Validation** : Regex stricte sur le domaine @uottawa.ca
*   **i18n** : Systeme bilingue FR/EN avec fichiers JSON
*   **Theming** : Dark mode / Light mode avec persistance localStorage

---

##  Frontend Student

### Installation
```bash
cd frontend-student
npm install
npm run dev    # Demarre sur http://localhost:5173
```

### Architecture
```
src/
  services/api.js              # Wrapper API avec injection JWT
  context/AuthContext.jsx       # Gestion authentification
  context/LangContext.jsx       # Systeme i18n FR/EN
  context/ThemeContext.jsx      # Dark mode / Light mode
  components/layout/Sidebar.jsx # Navigation laterale
  components/layout/Layout.jsx  # Layout principal (sidebar + contenu)
  i18n/fr.json                  # Traductions francaises
  i18n/en.json                  # Traductions anglaises
  index.css                     # Design System "Garnet & Glass"
```

### Design System "Garnet & Glass"
| Token | Hex | Usage |
|---|---|---|
| Primary | `#D0103A` | Boutons, accents, stepper |
| Secondary | `#424242` | Textes, sidebar |
| Tertiary | `#007574` | Badges, liens |
| Neutral | `#F5F5F5` | Fonds de page |

Le proxy Vite redirige automatiquement `/api` vers le backend (port 5001).

---

##  Lancement complet

Pour lancer l'ensemble du projet, ouvrir **3 terminaux** :

```bash
# Terminal 1 : Backend
cd backend && npm start

# Terminal 2 : Frontend Student
cd frontend-student && npm run dev

# Terminal 3 : Frontend Admin (a venir)
cd frontend-admin && npm run dev
```

---
*Projet developpe pour l'integration numerique des etudiants internationaux a l'Universite d'Ottawa.*

