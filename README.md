# UO-Compagnon : L'Assistant Intelligent uOttawa

UO-Compagnon est une plateforme numérique d'accompagnement conçue spécifiquement pour les étudiants internationaux de l’Université d'Ottawa.

Contrairement à un portail classique, **UO-Compagnon est un système contextuel** : il réduit la surcharge cognitive en filtrant et en délivrant l'information de manière chronologique, selon le cycle de vie réel de l’étudiant.

---

## Le Moteur d'Intelligence (Phase System)

L'application s'appuie sur un **Phase Engine** centralisé qui calcule en temps réel la position de l'étudiant dans son parcours universitaire.

### Les 4 Phases du Parcours :

1.  **Avant l'arrivée** : Préparation, visa, logement, budget.
2.  **Semaine d'accueil** : Arrivée à Ottawa, carte étudiante, uoZone, orientation.
3.  **Premier mois** : Intégration académique, tutorat, vie sociale.
4.  **Mi-session** : Réussite, GPA, examens, intégrité académique.

### Fonctionnement Intelligent :

- **Contenus Pertinents** : Chaque route API auto-détecte la phase de l'utilisateur (depuis son cookie de session) et filtre les ressources pour ne montrer que ce qui est utile _maintenant_ (avec historique de rattrapage).
- **Notifications Smart** : Le système génère des alertes dynamiques basées sur le timing (ex: _"Tes cours commencent dans 3 jours"_), synchronisées parfaitement et persistées localement entre les différentes vues (Dashboard & Inbox).

---

## Architecture Technique & Sécurité

Le projet utilise une architecture **MERN** (MongoDB, Express, React, Node.js) structurée en **3-tiers** de manière professionnelle, séparant netement les espaces utilisateurs :

- **Backend API** (`/backend`) : Logique métier, algorithme de phasing, et base de données.
- **Frontend Étudiant** (`/frontend-student`) : Portail d'accompagnement dédié.
- **Frontend Admin** (`/frontend-admin`) : Panneau de contrôle réservé au personnel uOttawa.

### Sécurité Renforcée (Production-Grade)

- **Authentification par Cookies HttpOnly** : Les tokens JWT ont été migrés des `localStorage` vulnérables du frontend vers des cookies sécurisés `HttpOnly` / `SameSite=Strict`. C'est le backend qui injecte et lit ce cookie pour pré-venir toute faille XSS.
- **CORS Sécurisé** : Le serveur accepte explicitement les credentials (`credentials: true`) des origines de nos deux frontends, rejetant toute requête externe.
- **Validation d'entreprise** : Règle Regex stricte sur le domaine `@uottawa.ca` pour les inscriptions académiques.
- **Protection API** : Middleware `helmet` actif, limitation de débit (`express-rate-limit`) sur login/register, et limite de taille JSON (`100kb`).
- **RBAC stricte** : Les routes de contenus en écriture (POST/PUT/DELETE) sont réservées aux admins. Les étudiants restent en lecture seule.
- **Isolation des notifications** : Un étudiant ne peut supprimer que ses notifications personnelles, jamais celles d'un autre utilisateur.
- **Audit dépendances backend** : Vérifié sans vulnérabilité connue via `npm audit --omit=dev`.

### Temps Réel & WebSockets (Socket.IO)

- **Bidirectionnel & Instantané** : Intégration d'un serveur natif HTTP Node.js couplé à `Socket.IO` permettant la communication immédiate (full-duplex) entre les étudiants et les administrateurs.
- **Système de "Rooms" Privées** : Dès la connexion, chaque étudiant rejoint automatiquement une *Room Socket* sécurisée par son ID (`user:<id>`), garantissant que les réponses sensibles (Directes) ne sont émises qu'au destinataire. Tous les administrateurs écoutent la "Room" globale `admins`.
- **Alertes Sonores & Visuelles** : Web Audio API embarquée dans le Frontend générant des sons de confirmation non-intrusifs à la réception d'une notification (combinant un pop-up "Toast" dynamique avec navigation interactive).
- **Auto-Synchronisation React** : Hooks personnalisés (`useSocket`) empêchant les "stale closures" (rafraîchissement direct des tableaux de bord Dashboard/Questions sans aucun rechargement de page Web ni polling intensif).

### Responsive Design (Mobile-First approach adaptatif)

- **Audit Multi-écrans** : Les deux plateformes frontends garantissent une interface fluide sur appareils mobiles (Tablettes & Smartphones).
- **Interface Admin Hybride** : Le panneau de gestion des questions s'adapte contextuellement (Tableau classique sur grand écran, et affichage en "Cartes tactiles empilées" sur très petits écrans).
- **Grilles Dynamiques** : Les dashboards (étudiant et admin) passent gracieusement d'un système multi-colonnes à une vue en flux de données unique (`1fr`) sous la barre des `768px`.

---

## Installation & Déploiement

### Déploiement Serveur (Docker)

L'application backend est dockerisée et orchestrable.
À la racine du projet, lancez MongoDB et le Backend en un clic :

```bash
docker-compose up --build -d
```

Cela démarrera le Backend sur le port `5001` et une instance MongoDB liée.

### Lancement en mode Développement (Local)

Configurez d'abord les variables backend :

```bash
cd backend
cp .env.example .env
```

Variables importantes : `JWT_SECRET`, `JWT_EXPIRES_IN`, `COOKIE_MAX_AGE_MS`, `CORS_ORIGINS`, `MONGO_URI`

Configurez ensuite les variables frontend :

```bash
# frontend-student/.env
VITE_ADMIN_PORTAL_URL=http://localhost:5174

# frontend-admin/.env
VITE_STUDENT_PORTAL_URL=http://localhost:5173/welcome
```

Resume rapide (copier/coller) :

```bash
cd backend && cp .env.example .env
cd ../frontend-student && cp .env.example .env
cd ../frontend-admin && cp .env.example .env
```

Pour lancer l'ensemble du projet avec Hot-Reload, ouvrez **3 terminaux** :

```bash
# Terminal 1 : Backend  (http://localhost:5001)
cd backend && npm start

# Terminal 2 : Frontend Étudiant (http://localhost:5173)
cd frontend-student && npm run dev

# Terminal 3 : Frontend Admin (http://localhost:5174)
cd frontend-admin && npm run dev
```

### Comptes de Test (Seed Data)

Pour initialiser la base avec des données de test (contenus et comptes), exécutez dans le `backend/` :
`node seed.js`

| Rôle                | Email              | Mot de passe  |
| ------------------- | ------------------ | ------------- |
| **Étudiant (Test)** | `amara@uottawa.ca` | `password123` |
| **Admin (Test)**    | `admin@uottawa.ca` | `admin123`    |

Pour créer un administrateur sur mesure de façon sécurisée (sans route publique) :

```bash
node backend/scripts/create-admin.js <email> <password> "<Nom_Complet>"
```

### Passage en Production (Checklist)

1. **Configurer les environnements**
   - Backend : `NODE_ENV=production`, `JWT_SECRET` fort, `MONGO_URI` managé, `CORS_ORIGINS` limité aux domaines réels.
   - Frontends : définir `VITE_ADMIN_PORTAL_URL` et `VITE_STUDENT_PORTAL_URL` selon vos URLs publiques.
2. **Build des frontends**
   - `cd frontend-student && npm ci && npm run build`
   - `cd frontend-admin && npm ci && npm run build`
3. **Lancer le backend en service**
   - `cd backend && npm ci && npm start` (ou via PM2/systemd selon votre infra).
4. **Mettre un reverse proxy (Nginx/Caddy)**
   - Terminaison TLS (HTTPS), routage `/api` vers backend, et cache statique pour `dist/`.
5. **Valider la sécurité avant go-live**
   - Vérifier CORS, cookies `Secure` en production, et refaire `npm audit --omit=dev`.

### Scalabilité (Etat actuel et recommandations)

- **Ce qui est déjà prêt** : architecture séparée backend + 2 frontends, RBAC route-level, rate limiting auth, CORS configurable, cookie auth sécurisée.
- **Pour monter en charge** :
  - Ajouter Redis pour cache et sessions techniques.
  - Ajouter/valider les index MongoDB sur les champs les plus filtrés (step, user, status, dates).
  - Activer monitoring + alerting (latence API, erreurs 5xx, charge DB).
  - Placer le backend derrière un process manager et, à terme, un autoscaling horizontal.

---

## Frontend Administrateur

Le portail (`/frontend-admin`) est dédié au personnel de uOttawa pour piloter la plateforme en temps réel, analyser les statistiques et répondre aux étudiants.

### Fonctionnalités

- **Dashboard** : Vue globale sur les métriques (étudiants inscrits, nouveaux utilisateurs de la journée, récapitulatif des questions posées).
- **Content Management** : Hub complet (CRUD) intuitif pour créer, éditer et classifier les fiches d'information associées aux phases des étudiants et leur assigner une priorité (`High/Medium/Low`).
- **Questions Management** : Interface de support permettant de répondre aux interrogations (Qu'elles soient "Directes" ou "Anonymes" par choix de l'étudiant). Lorsqu'une réponse est soumise, l'étudiant reçoit immédiatement une Notification web.
- **Interface Moderne** : Design system épuré propre à l'administration, incluant Dark Mode persistant et gestion de session via cookies de la même manière que pour l'étudiant.

---

## Frontend Étudiant

L'application étudiante (`/frontend-student`) propose une UI/UX dynamique, esthétique et rassurante ("Garnet & Glass").

### Fonctionnalités Clés

- **Welcome Page Refontee** : Landing moderne avec acces direct a la connexion et a l'inscription. Le bouton "See demo" a ete retire car aucune demo n'est exposee dans l'application.
- **Dashboard Contextuel** : Barre de progression (Stepper graphique 0-100%), mise en avant des "Contenus Prioritaires" selon la phase actuelle détectée, et alertes urgentes (ex: Rappel d'intégrité académique à la mi-session).
- **Hub d'Information** : Librairie de la totalité des fiches administratives/académiques indexées.
- **Support & Interaction (Q&A)** : FAQ, et module interactif "Poser une question" avec option d'anonymat pour préserver la confiance des nouveaux arrivants. Historique des échanges avec la scolarité.
- **Centre de Notifications** : Notifications d'informations pures (Créées manuellement par l'admin) mixées avec des alertes Smart chronologiques. Badge de suivi non-lu/lu dynamique sur le panneau latéral.
- **Options de Confort** : Application bilingue (FR/EN) à la volée via React Context API (sans rechargement) et Dark mode paramétrable par l'étudiant.
- **Permissions renforcees** : Les etudiants ont un acces en lecture sur les contenus; les operations d'ecriture (CRUD) sont reservees aux administrateurs. Un etudiant peut supprimer uniquement ses notifications personnelles.

---

_Projet développé pour faciliter l'intégration numérique et culturelle des étudiants internationaux à l'Université d'Ottawa._
